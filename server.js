import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { connectDB, getDB } from './db/connection.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);

// Connect to MongoDB
await connectDB();

/* ===============================
   AUTH MIDDLEWARE
================================= */
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

/* ===============================
   AUTH ROUTES
================================= */

// Register user
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const db = getDB();

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await db
      .collection('users')
      .findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection('users').insertOne({
      username,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
    });

    req.session.userId = result.insertedId.toString();
    req.session.username = username;
    req.session.role = 'user';

    res.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        username,
        email,
        role: 'user',
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDB();

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.collection('users').findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: 'Invalid credentials' });

    req.session.userId = user._id.toString();
    req.session.username = user.username;
    req.session.role = user.role;

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout user
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

// Get current user
app.get('/api/me', (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ error: 'Not authenticated' });

  res.json({
    id: req.session.userId,
    username: req.session.username,
    role: req.session.role,
  });
});

/* ===============================
   ARTIST + REVIEWS API
================================= */

// Get all artists
app.get('/api/artists', async (req, res) => {
  try {
    const db = getDB();
    const artists = await db.collection('artists').find().toArray();

    // Get all reviews to calculate average ratings
    const reviews = await db.collection('reviews').find().toArray();
    const ratingMap = reviews.reduce((acc, r) => {
      acc[r.artistId] = acc[r.artistId] || [];
      acc[r.artistId].push(r.rating);
      return acc;
    }, {});

    const artistsWithRatings = artists.map((a) => ({
      ...a,
      avgRating: ratingMap[a._id]
        ? ratingMap[a._id].reduce((x, y) => x + y, 0) / ratingMap[a._id].length
        : null,
    }));

    res.json(artistsWithRatings);
  } catch (err) {
    console.error('Error fetching artists:', err);
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
});

// Get a single artist
app.get('/api/artists/:id', async (req, res) => {
  try {
    const db = getDB();
    const { ObjectId } = await import('mongodb');
    const artist = await db
      .collection('artists')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    res.json(artist);
  } catch (err) {
    console.error('Error fetching artist:', err);
    res.status(500).json({ error: 'Failed to fetch artist' });
  }
});

// Get reviews for a specific artist
app.get('/api/artists/:id/reviews', async (req, res) => {
  try {
    const db = getDB();
    const reviews = await db
      .collection('reviews')
      .find({ artistId: req.params.id })
      .toArray();
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

/* ===============================
   SPA FALLBACK
================================= */

// Serve index.html for non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile('index.html', { root: 'public' });
});

/* ===============================
   START SERVER
================================= */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { requireAuth };

/* ===============================
   ARTIST SEARCH API
================================= */
app.get('/api/search', async (req, res) => {
  try {
    const db = getDB();
    const { q } = req.query; // search term

    if (!q || q.trim() === '') {
      // return all artists if query is empty
      const allArtists = await db.collection('artists').find().toArray();
      return res.json(allArtists);
    }

    // case-insensitive search on name or genre
    const artists = await db
      .collection('artists')
      .find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { genre: { $regex: q, $options: 'i' } },
        ],
      })
      .toArray();

    res.json(artists);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

/* ===============================
   CREATE NEW REVIEW
================================= */
app.post('/api/reviews', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const { artistId, rating, comment, venue, date } = req.body;

    if (!artistId || !rating || !comment || !venue || !date) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const review = {
      artistId,
      user: req.session.username,
      rating: Number(rating),
      comment,
      venue,
      date: new Date(date),
      createdAt: new Date(),
    };

    await db.collection('reviews').insertOne(review);

    res.json({ success: true, message: 'Review submitted successfully!' });
  } catch (err) {
    console.error('Error posting review:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});
