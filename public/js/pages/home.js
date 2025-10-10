export function renderPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <header class="header">
      <div class="container header-content">
        <div class="logo">🎤 LiveLy</div>
        <nav class="navbar">
          <ul>
            <li><a href="#/">Home</a></li>
            <li><a href="#/login">Login</a></li>
            <li><a href="#/register" class="active">Register</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <section class="hero">
      <div class="container hero-content">
        <div class="welcome">
          <h1>Welcome to LiveLy</h1>
          <p>Discover how your favorite artists perform live. Read and share reviews from fans around the world.</p>
        </div>
      </div>
    </section>

    <footer class="footer">
      <p class="alt">
      Already have an account? <a href="#/login">Log in</a>
      </p>
    </footer>
  `;
}
