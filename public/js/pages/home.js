// public/js/pages/home.js
export function renderPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <header class="header">
      <div class="container header-content">
        <div class="logo">🎤 LiveLy</div>
        <nav class="navbar">
          <ul>
            <li><a href="#/" class="active">Home</a></li>
            <li><a href="#/browse">Browse Artists</a></li>
            <li><a href="#/login">Login</a></li>
            <li><a href="#/register">Register</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- 🎶 Vinyl + Needle -->
    <img src="/img/vinyl.png" alt="Spinning vinyl record" class="vinyl-img" />
    <img src="/img/needle.png" alt="Record Player Needle" class="needle-img" />

    <main class="home container">
      <section class="welcome-section">
        <h1>Welcome to LiveLy</h1>
        <p>Discover and review live performances from your favorite artists around the world.</p>
        <a href="#/browse" class="btn explore-btn">Start Exploring</a>
      </section>
    </main>

    <footer class="footer">
      <p>© 2025 LiveLy | Built by Eric Fu & Brandan Yong</p>
    </footer>
  `;
}
