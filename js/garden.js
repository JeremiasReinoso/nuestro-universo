// garden.js
(async () => {
  const field = document.getElementById('garden-field');
  const tooltip = document.getElementById('flower-tooltip');
  if (!field) return;

  try {
    const flowers = await loadJSON('flowers.json');
    flowers.forEach(f => {
      const el = document.createElement('div');
      el.className = 'flower';
      el.style.left = `${f.position.x}%`;
      el.style.top  = `${f.position.y}%`;
      el.style.color = f.color;
      el.innerHTML = flowerSVG(f.color);
      el.setAttribute('aria-label', f.name);

      el.addEventListener('mouseenter', e => showTooltip(e, f));
      el.addEventListener('mousemove',  e => moveTooltip(e));
      el.addEventListener('mouseleave', hideTooltip);

      field.appendChild(el);
    });
  } catch (e) {
    field.innerHTML = '<p style="color:var(--white-30);font-size:.85rem;padding:24px">No se pudo cargar el jardín.</p>';
  }

  function showTooltip(e, f) {
    tooltip.innerHTML = `<strong>${f.name}</strong>${f.message}`;
    tooltip.classList.remove('hidden');
    moveTooltip(e);
  }
  function moveTooltip(e) {
    tooltip.style.left = `${e.clientX + 14}px`;
    tooltip.style.top  = `${e.clientY - 10}px`;
  }
  function hideTooltip() { tooltip.classList.add('hidden'); }

  function flowerSVG(color) {
    return `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
      <g fill="${color}" opacity="0.9">
        <ellipse cx="18" cy="10" rx="4" ry="7"/>
        <ellipse cx="18" cy="26" rx="4" ry="7"/>
        <ellipse cx="10" cy="18" rx="7" ry="4"/>
        <ellipse cx="26" cy="18" rx="7" ry="4"/>
        <ellipse cx="12" cy="12" rx="3.5" ry="6" transform="rotate(-45 12 12)"/>
        <ellipse cx="24" cy="12" rx="3.5" ry="6" transform="rotate(45 24 12)"/>
        <ellipse cx="12" cy="24" rx="3.5" ry="6" transform="rotate(45 12 24)"/>
        <ellipse cx="24" cy="24" rx="3.5" ry="6" transform="rotate(-45 24 24)"/>
      </g>
      <circle cx="18" cy="18" r="5" fill="#fff" opacity="0.95"/>
    </svg>`;
  }
})();
