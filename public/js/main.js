import { renderPage } from './pages/home.js';
import { renderRegisterPage } from './pages/register.js';
import { renderLoginPage } from './pages/login.js';

function router() {
  const path = window.location.pathname;
  
  switch(path) {
    case '/register':
      renderRegisterPage();
      break;
    case '/login':
      renderLoginPage();
      break;
    case '/':
    default:
      renderPage();
      break;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  router();
});

window.addEventListener('popstate', () => {
  router();
});

// Handle navigation
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' && e.target.href.startsWith(window.location.origin)) {
    e.preventDefault();
    window.history.pushState({}, '', e.target.href);
    router();
  }
});
