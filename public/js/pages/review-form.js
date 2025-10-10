// public/js/pages/review-page.js
export async function renderReviewForm() {
  const app = document.getElementById('app');
  loadStyle('/styles/review-form.css');

  // Check login first
  //const user = await getCurrentUser();
  //if (!user) {
  //window.location.hash = '#/login';
  //return;
  //}

  // TEMPORARY BYPASS (for testing only)
  const user = { username: 'TestUser' };

  // No artist info fetch needed anymore
  app.innerHTML = `
    <div class="review-page-container">
      <header class="header">
        <div class="container header-content">
          <div class="logo">🎤 LiveLy</div>
          <nav class="navbar">
            <ul>
              <li><a href="#/">Home</a></li>
              <li><a href="#/browse">Browse Artists</a></li>
              <li><a href="#/review" class="active">Leave a Review</a></li>
              <li><a href="#/login">Login</a></li>
              <li><a href="#/register">Register</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main class="review-page">
        <div class="review-card">
          <h1>Leave a Review</h1>

          <form id="reviewForm">
            <div class="form-group">
              <label for="artistName">Artist Name</label>
              <input type="text" id="artistName" placeholder="Enter artist name" required />
            </div>

            <div class="form-group">
              <label for="rating">Rating (1–5)</label>
              <select id="rating" required>
                <option value="">Select</option>
                <option value="1">⭐ 1</option>
                <option value="2">⭐ 2</option>
                <option value="3">⭐ 3</option>
                <option value="4">⭐ 4</option>
                <option value="5">⭐ 5</option>
              </select>
            </div>

            <div class="form-group">
              <label for="venue">Venue</label>
              <input type="text" id="venue" placeholder="Venue name" required />
            </div>

            <div class="form-group">
              <label for="date">Date of Performance</label>
              <input type="date" id="date" required />
            </div>

            <div class="form-group">
              <label for="comment">Comment</label>
              <textarea id="comment" placeholder="Share your experience..." required></textarea>
            </div>

            <button type="submit" class="btn">Submit Review</button>
          </form>

          <p class="message" id="formMessage"></p>
        </div>
      </main>

      <footer class="footer">
        <p>© 2025 LiveLy | Built by Eric Fu & Brandan Yong</p>
      </footer>
    </div>
  `;

  // Form behavior
  const form = document.getElementById('reviewForm');
  const message = document.getElementById('formMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      artistName: document.getElementById('artistName').value.trim(),
      rating: document.getElementById('rating').value,
      comment: document.getElementById('comment').value.trim(),
      venue: document.getElementById('venue').value.trim(),
      date: document.getElementById('date').value,
    };

    if (Object.values(data).some((v) => !v)) {
      message.textContent = 'Please fill out all fields.';
      message.className = 'message error';
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        message.textContent = '✅ Review submitted successfully!';
        message.className = 'message success';
        form.reset();

        setTimeout(() => {
          window.location.hash = '#/browse';
        }, 1500);
      } else {
        message.textContent = result.error || 'Something went wrong.';
        message.className = 'message error';
      }
    } catch (err) {
      console.error(err);
      message.textContent = '⚠️ Failed to submit review.';
      message.className = 'message error';
    }
  });
}

/* ===== Helpers ===== */

function loadStyle(href) {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}
