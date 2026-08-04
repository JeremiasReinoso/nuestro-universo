// distance.js — Mundos simbólicos + línea de conexión + estrellas
(function () {
  'use strict';

  function initStars() {
    const canvas = document.getElementById('dist-stars-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let W, H, stars;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      buildStars();
    }

    function buildStars() {
      stars = Array.from({ length: 60 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        base: Math.random() * 0.15 + 0.03,
        speed: Math.random() * 0.6 + 0.2,
        phase: Math.random() * Math.PI * 2
      }));
    }

    let t = 0;
    function drawStars() {
      ctx.clearRect(0, 0, W, H);
      t += 0.012;
      stars.forEach(s => {
        const alpha = s.base + Math.sin(t * s.speed + s.phase) * s.base * 0.5;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(drawStars);
    }

    resize();
    window.addEventListener('resize', resize);
    drawStars();
  }

  function renderConnection() {
    const worldArg = document.querySelector('.dist-world--argentina');
    const worldDom = document.querySelector('.dist-world--dominicana');
    const connection = document.getElementById('dist-connection');

    if (!worldArg || !worldDom || !connection) return;

    const worldArgRect = worldArg.getBoundingClientRect();
    const worldDomRect = worldDom.getBoundingClientRect();
    const connectionRect = connection.getBoundingClientRect();

    const argCx = worldArgRect.left + worldArgRect.width / 2;
    const argCy = worldArgRect.top + worldArgRect.height / 2;
    const domCx = worldDomRect.left + worldDomRect.width / 2;
    const domCy = worldDomRect.top + worldDomRect.height / 2;

    const midX = (argCx + domCx) / 2;
    const midY = Math.min(argCy, domCy) - 80;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = connection.querySelector('svg');
    if (!svg) return;

    const defs = document.createElementNS(svgNS, 'defs');

    const lineGradient = document.createElementNS(svgNS, 'linearGradient');
    lineGradient.id = 'connectionGradient';
    lineGradient.setAttribute('x1', '0%');
    lineGradient.setAttribute('y1', '0%');
    lineGradient.setAttribute('x2', '100%');
    lineGradient.setAttribute('y2', '100%');

    const stopPink = document.createElementNS(svgNS, 'stop');
    stopPink.setAttribute('offset', '0%');
    stopPink.setAttribute('class', 'stop-pink');

    const stopViolet = document.createElementNS(svgNS, 'stop');
    stopViolet.setAttribute('offset', '50%');
    stopViolet.setAttribute('class', 'stop-violet');

    const stopCeleste = document.createElementNS(svgNS, 'stop');
    stopCeleste.setAttribute('offset', '100%');
    stopCeleste.setAttribute('class', 'stop-celeste');

    lineGradient.appendChild(stopPink);
    lineGradient.appendChild(stopViolet);
    lineGradient.appendChild(stopCeleste);

    const pulseGradient = document.createElementNS(svgNS, 'linearGradient');
    pulseGradient.id = 'pulseGradient';
    pulseGradient.setAttribute('x1', '0%');
    pulseGradient.setAttribute('y1', '0%');
    pulseGradient.setAttribute('x2', '100%');
    pulseGradient.setAttribute('y2', '100%');

    const pulseStop1 = document.createElementNS(svgNS, 'stop');
    pulseStop1.setAttribute('offset', '0%');
    pulseStop1.setAttribute('stop-color', '#ff3c78');

    const pulseStop2 = document.createElementNS(svgNS, 'stop');
    pulseStop2.setAttribute('offset', '100%');
    pulseStop2.setAttribute('stop-color', '#00c8ff');

    pulseGradient.appendChild(pulseStop1);
    pulseGradient.appendChild(pulseStop2);

    defs.appendChild(lineGradient);
    defs.appendChild(pulseGradient);

    svg.innerHTML = '';
    svg.appendChild(defs);

    const line = document.createElementNS(svgNS, 'path');
    line.className = 'connection-line';
    line.setAttribute('d', `M${argCx} ${argCy} Q${midX} ${midY} ${domCx} ${domCy}`);
    line.setAttribute('stroke-linecap', 'round');

    const pulsePoint = document.createElementNS(svgNS, 'circle');
    pulsePoint.className = 'pulse-point';
    pulsePoint.setAttribute('cx', argCx);
    pulsePoint.setAttribute('cy', argCy);
    pulsePoint.setAttribute('r', '4');
    pulsePoint.style.fill = '#ff3c78';
    pulsePoint.style.filter = 'drop-shadow(0 0 6px #ff3c78)';
    pulsePoint.style.opacity = '0.8';

    svg.appendChild(line);
    svg.appendChild(pulsePoint);

    let progress = 0;
    function animatePulse() {
      progress += 0.007;
      if (progress > 1) progress = 0;

      const pathLength = line.getTotalLength();
      const pos = progress * pathLength;
      const point = line.getPointAtLength(pos);

      pulsePoint.setAttribute('cx', point.x);
      pulsePoint.setAttribute('cy', point.y);
      pulsePoint.style.opacity = '0.8';

      requestAnimationFrame(animatePulse);
    }

    animatePulse();
  }

  function createWorldSVG(worldEl, isArgentina) {
    const svg = worldEl.querySelector('.dist-world-svg');
    if (!svg) return;

    const color = isArgentina ? '#00b4ff' : '#8a2be2';
    const fill = isArgentina ? 'rgba(0,180,255,0.12)' : 'rgba(138,43,226,0.12)';

    svg.innerHTML = `
      <circle class="world-base" cx="50" cy="50" r="35" fill="none" stroke="${color}" stroke-width="2"/>
      <circle class="world-inner" cx="50" cy="50" r="25" fill="${fill}" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
      <path d="M50 30 L58 48 L88 48 L62 62 L70 90 L50 76 L30 90 L38 62 L12 48 L42 48 Z" fill="rgba(255,255,255,0.1)"/>
    `;
  }

  function updateClocks() {
    const now = new Date();
    const fmt = tz => {
      const d = new Date(now.toLocaleString('en-US', { timeZone: tz }));
      return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    };
    const arEl = document.getElementById('time-ar');
    const doEl = document.getElementById('time-do');
    if (arEl) arEl.textContent = fmt('America/Argentina/Buenos_Aires');
    if (doEl) doEl.textContent = fmt('America/Santo_Domingo');
  }

  function init() {
    const worldArg = document.querySelector('.dist-world--argentina');
    const worldDom = document.querySelector('.dist-world--dominicana');

    if (worldArg) createWorldSVG(worldArg, true);
    if (worldDom) createWorldSVG(worldDom, false);

    initStars();
    updateClocks();
    setInterval(updateClocks, 30000);

    requestAnimationFrame(() => {
      renderConnection();
      window.addEventListener('resize', renderConnection);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();