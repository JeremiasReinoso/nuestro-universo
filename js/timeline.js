// timeline.js
(async () => {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  try {
    const events = await loadJSON('timeline.json');
    container.innerHTML = events.map(ev => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <p class="timeline-date">${formatDate(ev.date)}</p>
          <h3 class="timeline-title">${ev.title}</h3>
          <p class="timeline-desc">${ev.description}</p>
        </div>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = '<p style="color:var(--white-30);font-size:.85rem">No se pudo cargar la historia.</p>';
  }

  function formatDate(str) {
    if (!str) return '';
    const [y, m, d] = str.split('-');
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${d ? d + ' ' : ''}${months[parseInt(m,10)-1]} ${y}`;
  }
})();
