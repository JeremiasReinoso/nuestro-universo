// book.js - Libro de recuerdos
(async () => {
  const container = document.getElementById('book-container');
  const pagesContainer = document.getElementById('book-pages');
  if (!container || !pagesContainer) return;

  try {
    const memories = await loadJSON('memories.json');
    
    if (memories.length === 0) {
      pagesContainer.innerHTML = '<p style="color:var(--white-30);font-size:.9rem;text-align:center;padding:40px">No hay recuerdos registrados aún.</p>';
      return;
    }

    pagesContainer.innerHTML = memories.map((m, i) => `
      <div class="book-page" style="transition-delay:${i * 0.15}s">
        <div class="book-page-header">
          <div class="book-page-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <span class="book-page-date">${formatDate(m.date)}</span>
        </div>
        <h3 class="book-page-title">${m.title}</h3>
        <p class="book-page-content">${m.content}</p>
      </div>
    `).join('');

    // Animar páginas al hacer scroll
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.book-page').forEach(page => observer.observe(page));

  } catch (e) {
    pagesContainer.innerHTML = '<p style="color:var(--white-30);font-size:.9rem">No se pudo cargar el libro de recuerdos.</p>';
  }

  function formatDate(str) {
    if (!str) return '';
    const [y, m, d] = str.split('-');
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${d ? d + ' ' : ''}${months[parseInt(m,10)-1]} ${y}`;
  }
})();