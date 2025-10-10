// public/js/pages/browse.js

export async function renderBrowsePage() {
  const app = document.getElementById('app');
  loadStyle('/styles/browse.css');

  app.innerHTML = `
    <header class="header">
      <div class="container header-content">
        <div class="logo">🎤 LiveLy</div>
        <nav class="navbar">
          <ul>
            <li><a href="#/">Home</a></li>
            <li><a href="#/browse" class="active">Browse Artists</a></li>
            <li><a href="#/review">Leave a Review</a></li>
            <li><a href="#/login">Login</a></li>
            <li><a href="#/register">Register</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <main class="browse container">
      <h1>Browse Artists</h1>
      <div class="search-bar">
        <input 
          type="text" 
          id="searchInput" 
          placeholder="Search by name or genre..." 
        />
      </div>
      <div id="artistsList" class="artists-grid">Loading...</div>
    </main>

    <footer class="footer">
      <p>© 2025 LiveLy | Built by Eric Fu & Brandan Yong</p>
    </footer>
  `;

  const searchInput = document.getElementById('searchInput');
  const artistsList = document.getElementById('artistsList');

  // Initial load
  fetchArtists();

  // Debounced search listener
  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchArtists(searchInput.value.trim());
    }, 300);
  });

  async function fetchArtists(query = '') {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const artists = await res.json();

      if (!artists.length) {
        artistsList.innerHTML = `<p>No artists found.</p>`;
        return;
      }

      artistsList.innerHTML = artists
        .map(
          (a) => `
          <div class="artist-card" data-id="${a._id}">
            <img src="${a.image || '/img/default-artist.jpg'}" alt="${a.name}">
            <h3>${a.name}</h3>
            <p>${a.genre || 'Unknown Genre'}</p>
          </div>`
        )
        .join('');

      // Add click listeners to cards
      document.querySelectorAll('.artist-card').forEach((card) => {
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-id');
          window.location.hash = `#/artist/${id}`;
        });
      });
    } catch (err) {
      console.error(err);
      artistsList.innerHTML = `<p>Error loading artists.</p>`;
    }
  }
}

/* ===== Helper ===== */
function loadStyle(href) {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}
