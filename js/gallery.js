// gallery.js
(async () => {
  const grid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbClose = document.getElementById('lightbox-close');
  if (!grid) return;

  const PLACEHOLDER_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <path d="M21 15l-5-5L5 21"/>
  </svg>`;

  try {
    const photos = await loadJSON('gallery.json');
    grid.innerHTML = photos.map(p => `
      <div class="gallery-item" data-src="${p.src}" data-caption="${p.caption || ''}" data-title="${p.title || ''}">
        ${isPlaceholder(p.src)
          ? `<div class="gallery-placeholder">${PLACEHOLDER_ICON}<span>Foto próximamente</span></div>`
          : `<img src="${p.src}" alt="${p.title || ''}" loading="lazy" />`
        }
        <div class="gallery-caption">${p.caption || p.title || ''}</div>
      </div>
    `).join('');

    grid.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.dataset.src;
        if (isPlaceholder(src)) return;
        lbImg.src = src;
        lbImg.alt = item.dataset.title;
        lbCaption.textContent = item.dataset.caption;
        lightbox.classList.remove('hidden');
      });
    });
  } catch (e) {
    grid.innerHTML = '<p style="color:var(--white-30);font-size:.85rem">No se pudo cargar la galería.</p>';
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  function closeLightbox() { lightbox.classList.add('hidden'); lbImg.src = ''; }
  function isPlaceholder(src) { return !src || src.includes('placeholder'); }
})();
