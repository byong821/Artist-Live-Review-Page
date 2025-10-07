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
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

await connectDB();

// Auth middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Register user
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const db = getDB();
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if user exists
    const existingUser = await db.collection('users').findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await db.collection('users').insertOne({
      username,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date()
    });
    
    // Set session
    req.session.userId = result.insertedId.toString();
    req.session.username = username;
    req.session.role = 'user';
    
    res.json({ 
      success: true, 
      user: { 
        id: result.insertedId.toString(),
        username, 
        email, 
        role: 'user' 
      } 
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
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Set session
    req.session.userId = user._id.toString();
    req.session.username = user.username;
    req.session.role = user.role;
    
    res.json({ 
      success: true, 
      user: { 
        id: user._id.toString(),
        username: user.username, 
        email: user.email, 
        role: user.role 
      } 
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
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  res.json({
    id: req.session.userId,
    username: req.session.username,
    role: req.session.role
  });
});

// Export requireAuth middleware for use in other routes
export { requireAuth };

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
