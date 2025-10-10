// public/js/main.js

import { renderPage } from './pages/home.js';
import { renderRegisterPage } from './pages/register.js';
import { renderLoginPage } from './pages/login.js';
import { renderBrowsePage } from './pages/browse.js';
import { renderArtistDetail } from './pages/artist-detail.js';

async function router() {
  const hash = window.location.hash || '#/';
  const app = document.getElementById('app');
  app.innerHTML = ''; // clear before render

  // Give browser a brief layout pause before rendering new content
  await new Promise((r) => setTimeout(r, 25));

  switch (true) {
    case hash === '#/' || hash === '#/home':
      renderPage();
      break;
    case hash === '#/register':
      renderRegisterPage();
      break;
    case hash === '#/login':
      renderLoginPage();
      break;
    case hash === '#/browse':
      renderBrowsePage();
      break;
    case hash.startsWith('#/artist/'):
      const artistId = hash.split('/')[2];
      await renderArtistDetail(artistId); // 👈 wait for CSS and layout
      break;
    default:
      app.innerHTML = '<h2>404 - Page Not Found</h2>';
  }
}

window.addEventListener('DOMContentLoaded', () => router());
window.addEventListener('hashchange', router);
