// capsula.js - Cápsula del tiempo
(async () => {
  const container = document.getElementById('capsula-container');
  if (!container) return;

  try {
    const letters = await loadJSON('capsula.json');
    
    if (letters.length === 0) {
      container.innerHTML = '<p style="color:var(--white-30);font-size:.9rem">No hay cartas en la cápsula aún.</p>';
      return;
    }

    container.innerHTML = letters.map((l, i) => `
      <div class="capsula-card" style="transition-delay:${i * 0.08}s" data-id="${l.id}">
        <div class="capsula-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
        <h3 class="capsula-title">${l.title}</h3>
        <p class="capsula-desc">${l.description}</p>
        <div class="capsula-status">
          ${l.unlocked 
            ? '🔓 Desbloqueada' 
            : '🔒 Bloqueada hasta ' + formatDate(l.unlockDate)}
        </div>
      </div>
    `).join('');

  } catch (e) {
    container.innerHTML = '<p style="color:var(--white-30);font-size:.9rem">No se pudo cargar la cápsula del tiempo.</p>';
  }

  function formatDate(str) {
    if (!str) return '';
    const [y, m, d] = str.split('-');
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${d ? d + ' ' : ''}${months[parseInt(m,10)-1]} ${y}`;
  }
})();