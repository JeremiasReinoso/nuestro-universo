// promises.js
(async () => {
  const list = document.getElementById('promises-list');
  if (!list) return;

  try {
    const promises = await loadJSON('promises.json');
    list.innerHTML = promises.map((p, i) => `
      <div class="promise-item" style="transition-delay:${i * 0.08}s">
        <div class="promise-icon"></div>
        <div>
          ${p.revealed
            ? `<p class="promise-text">${p.text}</p>`
            : `<p class="promise-text" style="color:var(--white-30)">Promesa por revelar</p>
               <p class="promise-locked">Disponible el ${formatDate(p.date)}</p>`
          }
        </div>
      </div>
    `).join('');
  } catch (e) {
    list.innerHTML = '<p style="color:var(--white-30);font-size:.85rem">No se pudieron cargar las promesas.</p>';
  }

  function formatDate(str) {
    if (!str) return '';
    const d = new Date(str + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
})();
