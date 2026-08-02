// letters.js
(async () => {
  const list = document.getElementById('letters-list');
  const modal = document.getElementById('letter-modal');
  const backdrop = modal?.querySelector('.modal-backdrop');
  const closeBtn = modal?.querySelector('.modal-close');
  if (!list) return;

  try {
    const letters = await loadJSON('letters.json');
    list.innerHTML = letters.map(l => `
      <div class="letter-item" data-id="${l.id}">
        <div class="letter-meta">
          <span class="letter-subject">${l.subject}</span>
          <span class="letter-sender">${l.sender} · ${formatDate(l.date)}</span>
        </div>
        <span class="letter-arrow">→</span>
      </div>
    `).join('');

    list.querySelectorAll('.letter-item').forEach(item => {
      item.addEventListener('click', () => {
        const letter = letters.find(l => l.id === parseInt(item.dataset.id));
        if (!letter) return;
        document.getElementById('modal-sender').textContent = letter.sender;
        document.getElementById('modal-subject').textContent = letter.subject;
        document.getElementById('modal-date').textContent = formatDate(letter.date);
        document.getElementById('modal-content').textContent = letter.content;
        modal.classList.remove('hidden');
      });
    });
  } catch (e) {
    list.innerHTML = '<p style="color:var(--white-30);font-size:.85rem">No se pudieron cargar las cartas.</p>';
  }

  function closeModal() { modal.classList.add('hidden'); }
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function formatDate(str) {
    if (!str) return '';
    const d = new Date(str + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
})();
