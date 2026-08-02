// photos.js - Fotografías con dedicatorias
(async () => {
  const grid = document.getElementById('photos-grid');
  if (!grid) return;

  try {
    const photos = await loadJSON('photos.json');
    
    if (photos.length === 0) {
      grid.innerHTML = '<p style="color:var(--white-30);font-size:.9rem">No hay fotografías registradas aún.</p>';
      return;
    }

    grid.innerHTML = photos.map(p => `
      <div class="photo-item" data-src="${p.src}" data-title="${p.title || ''}" data-dedication="${p.dedication || ''}">
        ${isPlaceholder(p.src)
          ? `<div class="gallery-placeholder">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                 <rect x="3" y="3" width="18" height="18" rx="2"/>
                 <circle cx="8.5" cy="8.5" r="1.5"/>
                 <path d="M21 15l-5-5L5 21"/>
               </svg>
               <span>Foto próximamente</span>
             </div>`
          : `<img src="${p.src}" alt="${p.title || ''}" loading="lazy" />`
        }
        <div class="photo-caption">
          <h4 class="photo-title">${p.title || 'Sin título'}</h4>
          <p class="photo-dedication">${p.dedication || 'Dedicatoria pendiente'}</p>
        </div>
      </div>
    `).join('');

    // Lightbox para fotos
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbCaption = document.getElementById('lightbox-caption');
    const lbClose = document.getElementById('lightbox-close');

    grid.querySelectorAll('.photo-item').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.dataset.src;
        if (isPlaceholder(src)) return;
        
        lbImg.src = src;
        lbImg.alt = item.dataset.title;
        lbCaption.innerHTML = `<strong>${item.dataset.title}</strong><br>${item.dataset.dedication}`;
        lightbox.classList.add('active');
      });
    });

    lbClose.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('active'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.classList.remove('active'); });

  } catch (e) {
    grid.innerHTML = '<p style="color:var(--white-30);font-size:.9rem">No se pudo cargar la galería de fotografías.</p>';
  }

  function isPlaceholder(src) { return !src || src.includes('placeholder'); }
})();