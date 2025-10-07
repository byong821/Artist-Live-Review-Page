export function renderPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <h1>Welcome</h1>
    <form id="sampleForm">
      <input type="text" name="field" required>
      <button type="submit">Submit</button>
    </form>
  `;
}
