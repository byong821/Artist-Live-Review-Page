// main.js — SPA router using hash-based navigation

import { renderPage } from './pages/home.js';
import { renderRegisterPage } from './pages/register.js';
import { renderLoginPage } from './pages/login.js';
import { renderBrowsePage } from './pages/browse.js';
import { renderArtistDetail } from './pages/artist-detail.js';

function router() {
  const app = document.getElementById('app');
  const hash = window.location.hash || '#/';

  app.innerHTML = ''; // clear content before rendering

  if (hash === '#/' || hash === '#/home') {
    renderPage();
  } else if (hash === '#/register') {
    renderRegisterPage();
  } else if (hash === '#/login') {
    renderLoginPage();
  } else if (hash === '#/browse') {
    renderBrowsePage();
  } else if (hash.startsWith('#/artist/')) {
    const artistId = hash.split('/')[2];
    renderArtistDetail(artistId);
  } else {
    app.innerHTML = '<h2>404 - Page Not Found</h2>';
  }
}

// Run router on load and hash changes
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
