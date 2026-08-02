// reasons.js
(async () => {
  const grid = document.getElementById('reasons-grid');
  if (!grid) return;

  try {
    const reasons = await loadJSON('reasons.json');
    grid.innerHTML = reasons.map((r, i) => `
      <div class="reason-card" style="transition-delay:${i * 0.07}s">
        <p class="reason-number">${String(i + 1).padStart(2, '0')}</p>
        <p class="reason-text">${r.text}</p>
      </div>
    `).join('');
  } catch (e) {
    grid.innerHTML = '<p style="color:var(--white-30);font-size:.85rem">No se pudieron cargar las razones.</p>';
  }
})();
