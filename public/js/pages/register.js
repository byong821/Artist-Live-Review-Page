export function renderRegisterPage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="register-container">
      <h1>Create Account</h1>
      <form id="register-form" class="auth-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" required>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required minlength="6">
        </div>
        
        <button type="submit" class="btn-primary">Register</button>
        <div id="error-message" class="error-message"></div>
      </form>
      
      <p class="auth-link">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  `;

  const form = document.getElementById('register-form');
  const errorMessage = document.getElementById('error-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';

    const formData = {
      username: document.getElementById('username').value.trim(),
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value,
    };

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      errorMessage.textContent = 'All fields are required';
      return;
    }

    if (formData.password.length < 6) {
      errorMessage.textContent = 'Password must be at least 6 characters';
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = '/';
      } else {
        errorMessage.textContent = data.error || 'Registration failed';
      }
    } catch (error) {
      errorMessage.textContent = 'Network error. Please try again.';
    }
  });
}

export function renderRegisterPage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="register-container">
      <h1>Create Account</h1>
      <form id="register-form" class="auth-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" required>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required minlength="6">
        </div>
        
        <button type="submit" class="btn-primary">Register</button>
        <div id="error-message" class="error-message"></div>
      </form>
      
      <p class="auth-link">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  `;

  const form = document.getElementById('register-form');
  const errorMessage = document.getElementById('error-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';

    const formData = {
      username: document.getElementById('username').value.trim(),
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value,
    };

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      errorMessage.textContent = 'All fields are required';
      return;
    }

    if (formData.password.length < 6) {
      errorMessage.textContent = 'Password must be at least 6 characters';
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = '/';
      } else {
        errorMessage.textContent = data.error || 'Registration failed';
      }
    } catch (error) {
      errorMessage.textContent = 'Network error. Please try again.';
    }
  });
}
