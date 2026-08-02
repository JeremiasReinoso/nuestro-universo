// dreams.js - Próximos sueños
(async () => {
  const grid = document.getElementById('dreams-grid');
  if (!grid) return;

  try {
    const dreams = await loadJSON('dreams.json');
    
    if (dreams.length === 0) {
      grid.innerHTML = '<p style="color:var(--white-30);font-size:.9rem">No hay sueños registrados aún.</p>';
      return;
    }

    grid.innerHTML = dreams.map((d, i) => `
      <div class="dream-card" style="transition-delay:${i * 0.08}s">
        <div class="dream-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <h3 class="dream-title">${d.title}</h3>
        <p class="dream-desc">${d.description}</p>
      </div>
    `).join('');

  } catch (e) {
    grid.innerHTML = '<p style="color:var(--white-30);font-size:.9rem">No se pudo cargar la lista de sueños.</p>';
  }
})();