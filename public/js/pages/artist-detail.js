// public/js/pages/artist-detail.js

export async function renderArtistDetail(artistId) {
  const app = document.getElementById('app');

  await ensureStyleLoaded('/styles/artist-detail.css');

  // ===== BASE STRUCTURE =====
  app.innerHTML = `
    <header class="header">
      <div class="container header-content">
        <div class="logo">🎤 LiveLy</div>
        <nav class="navbar">
          <ul>
            <li><a href="#/">Home</a></li>
            <li><a href="#/browse">Browse Artists</a></li>
            <li><a href="#/login">Login</a></li>
            <li><a href="#/register">Register</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <main class="artist-detail container">
      <h2>Loading artist...</h2>
    </main>

    <footer class="footer">
      <p>© 2025 LiveLy | Built by Eric Fu & Brandan Yong</p>
    </footer>
  `;

  try {
    // Fetch artist info + reviews
    const [artistRes, reviewRes] = await Promise.all([
      fetch(`/api/artists/${artistId}`),
      fetch(`/api/artists/${artistId}/reviews`),
    ]);

    if (!artistRes.ok || !reviewRes.ok) throw new Error('API Error');
    const artist = await artistRes.json();
    const reviews = await reviewRes.json();

    const main = document.querySelector('main');
    main.innerHTML = `
      <section class="artist-info">
        <img 
          src="${artist.image || '/img/default-artist.jpg'}" 
          alt="${artist.name}" 
          onerror="this.src='/img/default-artist.jpg'"
        >
        <div class="artist-meta">
          <h1>${artist.name}</h1>
          <p><strong>Genre:</strong> ${artist.genre || 'Unknown'}</p>
          <p><strong>⭐ ${calcAverage(reviews)} / 5</strong></p>
        </div>
      </section>

      <section class="reviews-section">
        <h2>Fan Reviews</h2>
        <div class="reviews-container">
          ${
            reviews.length
              ? reviews
                  .map(
                    (r) => `
                    <div class="review-card">
                      <div class="review-header">
                        <strong>${r.user || 'Anonymous'}</strong>
                        <span>⭐ ${r.rating}</span>
                      </div>
                      <p>${r.comment}</p>
                      <small>${new Date(r.date).toLocaleDateString()}</small>
                    </div>`
                  )
                  .join('')
              : `<p>No reviews yet.</p>`
          }
        </div>
      </section>

      <div class="btn-wrapper">
        <button class="btn" id="backBtn">← Back to Browse</button>
      </div>
    `;

    document.getElementById('backBtn').addEventListener('click', () => {
      window.location.hash = '#/browse';
    });
  } catch (err) {
    console.error(err);
    const main = document.querySelector('main');
    main.innerHTML = `
      <h2>Error loading artist details.</h2>
      <p>Please try again later.</p>
      <button class="btn" onclick="window.location.hash='#/browse'">← Back</button>
    `;
  }
}

/* ===== Helpers ===== */

function ensureStyleLoaded(href) {
  return new Promise((resolve) => {
    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) return resolve();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    document.head.appendChild(link);
  });
}

function calcAverage(reviews) {
  if (!reviews.length) return 0;
  const avg = reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length;
  return avg.toFixed(1);
}
