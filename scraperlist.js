document.addEventListener("DOMContentLoaded", async () => {
  const feedUrl = new URL("index.yml", window.location.href).href;
  const feedUrlEl = document.getElementById("feed-url");
  if (feedUrlEl) feedUrlEl.textContent = feedUrl;

  const container = document.getElementById("scraper-list");

  try {
    const response = await fetch("index.yml");
    if (!response.ok) throw new Error("Failed to load index.yml");
    
    const yamlText = await response.text();
    const scrapers = jsyaml.load(yamlText);

    if (!scrapers || scrapers.length === 0) {
      container.innerHTML = "<p>No scrapers found in index.</p>";
      return;
    }

    container.innerHTML = scrapers.map(item => `
      <div class="scraper-card">
        <div class="scraper-title">
          <h3>${item.name || item.id}</h3>
          <span class="badge">v${item.version || '1.0'}</span>
        </div>
        <div class="meta">
          <strong>ID:</strong> <code>${item.id}</code> | 
          <strong>Updated:</strong> ${item.date || 'N/A'}
        </div>
        ${item.requires ? `<div class="meta"><strong>Requires:</strong> ${item.requires.join(', ')}</div>` : ''}
      </div>
    `).join('');

  } catch (err) {
    container.innerHTML = `<p style="color: red;">Error loading scraper index: ${err.message}</p>`;
  }
});