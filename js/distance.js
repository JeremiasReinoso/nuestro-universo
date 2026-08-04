// distance.js — Mapa geográfico real + línea animada + estrellas
(function () {
  'use strict';

  const GEO = {
    lonMin: -92, lonMax: -55,
    latMin: -56, latMax: 22
  };

  function project(lon, lat, W, H) {
    const pad = 0.06;
    const x = pad * W + ((lon - GEO.lonMin) / (GEO.lonMax - GEO.lonMin)) * W * (1 - pad * 2);
    const latRad = lat * Math.PI / 180;
    const latMinRad = GEO.latMin * Math.PI / 180;
    const latMaxRad = GEO.latMax * Math.PI / 180;
    const mercY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const mercMin = Math.log(Math.tan(Math.PI / 4 + latMinRad / 2));
    const mercMax = Math.log(Math.tan(Math.PI / 4 + latMaxRad / 2));
    const y = pad * H + (1 - (mercY - mercMin) / (mercMax - mercMin)) * H * (1 - pad * 2);
    return { x, y };
  }

  const ARGENTINA = [
    [-73.6,-37.6],[-71.9,-30.1],[-69.7,-17.7],[-69.5,-17.5],[-68.2,-16.5],
    [-65.1,-22.1],[-62.6,-22.0],[-60.0,-22.0],[-58.2,-20.2],[-57.8,-18.0],
    [-57.5,-18.2],[-55.0,-26.0],[-53.6,-33.2],[-53.4,-34.0],[-58.4,-34.9],
    [-62.3,-38.7],[-62.3,-43.3],[-65.1,-42.1],[-66.5,-43.0],[-65.5,-45.0],
    [-66.5,-46.5],[-67.5,-46.5],[-67.5,-52.0],[-68.6,-54.9],[-66.5,-55.9],
    [-64.5,-55.0],[-66.5,-53.0],[-68.5,-52.5],[-68.5,-50.0],[-72.5,-50.5],
    [-75.7,-49.5],[-75.5,-47.0],[-72.5,-42.5],[-72.5,-40.5],[-71.5,-38.0],
    [-71.5,-30.0],[-70.0,-18.4],[-69.5,-17.5]
  ];

  const CHILE = [
    [-69.5,-17.5],[-70.0,-18.4],[-71.5,-30.0],[-71.5,-38.0],[-72.5,-40.5],
    [-72.5,-42.5],[-75.5,-47.0],[-75.7,-49.5],[-72.5,-50.5],[-68.5,-50.0],
    [-68.5,-52.5],[-66.5,-53.0],[-64.5,-55.0],[-66.5,-55.9],[-68.6,-54.9],
    [-67.5,-52.0],[-67.5,-46.5],[-66.5,-46.5],[-65.5,-45.0],[-66.5,-43.0],
    [-65.1,-42.1],[-62.3,-43.3],[-62.3,-38.7],[-58.4,-34.9]
  ];

  const BRASIL = [
    [-34.8,-8.0],[-35.5,-5.5],[-37.0,-4.8],[-41.8,-2.9],[-44.5,-2.5],
    [-48.5,-1.5],[-50.0,-0.1],[-51.0,4.2],[-59.9,1.3],[-60.0,5.2],
    [-61.0,8.0],[-63.0,8.0],[-67.3,6.3],[-70.0,6.9],[-72.9,2.2],
    [-73.2,-4.2],[-70.5,-9.5],[-72.4,-10.0],[-75.6,-14.0],[-75.3,-16.4],
    [-69.5,-17.5],[-65.1,-22.1],[-62.6,-22.0],[-60.0,-22.0],[-58.2,-20.2],
    [-57.5,-18.2],[-55.0,-26.0],[-53.6,-33.2],[-53.4,-34.0],[-50.0,-29.0],
    [-48.5,-26.2],[-44.5,-23.0],[-41.8,-21.0],[-40.0,-19.0],[-38.5,-13.0],
    [-37.0,-11.0],[-35.5,-9.0],[-34.8,-8.0]
  ];

  const BOLIVIA = [
    [-69.5,-17.5],[-68.2,-16.5],[-65.1,-22.1],[-62.6,-22.0],[-60.0,-22.0],
    [-57.8,-18.0],[-57.5,-18.2],[-60.0,-16.0],[-60.5,-13.5],[-64.5,-12.0],
    [-68.9,-12.5],[-69.5,-17.5]
  ];

  const PERU = [
    [-75.6,-14.0],[-72.4,-10.0],[-70.5,-9.5],[-73.2,-4.2],[-72.9,2.2],
    [-70.0,6.9],[-75.3,-0.2],[-80.3,-3.4],[-81.3,-6.1],[-80.9,-8.1],
    [-75.6,-14.0]
  ];

  const COLOMBIA = [
    [-67.3,6.3],[-70.0,6.9],[-72.9,2.2],[-75.3,-0.2],[-80.3,-3.4],
    [-77.4,0.4],[-77.0,8.5],[-76.1,9.5],[-75.6,10.4],[-72.4,11.1],
    [-71.3,11.8],[-71.9,11.7],[-72.5,10.5],[-73.0,9.0],[-74.0,8.0],
    [-76.0,8.5],[-77.0,8.5],[-77.4,0.4],[-80.3,-3.4]
  ];

  const VENEZUELA = [
    [-61.0,8.0],[-63.0,8.0],[-67.3,6.3],[-73.0,9.0],[-72.5,10.5],
    [-71.9,11.7],[-71.3,11.8],[-70.3,11.6],[-68.0,11.5],[-65.0,10.6],
    [-63.0,10.0],[-61.0,8.0]
  ];

  const ECUADOR = [
    [-80.3,-3.4],[-75.3,-0.2],[-75.6,-0.2],[-76.0,0.5],[-77.0,0.5],
    [-78.5,1.5],[-80.0,0.5],[-80.3,-3.4]
  ];

  const PARAGUAY = [
    [-57.5,-18.2],[-58.2,-20.2],[-60.0,-22.0],[-62.6,-22.0],[-60.0,-16.0],
    [-57.5,-18.2]
  ];

  const URUGUAY = [
    [-53.4,-34.0],[-53.6,-33.2],[-55.0,-26.0],[-57.5,-18.2],[-58.2,-20.2],
    [-60.0,-22.0],[-58.4,-34.9],[-53.4,-34.0]
  ];

  const GUIANAS = [
    [-60.0,5.2],[-59.9,1.3],[-57.0,6.0],[-57.5,6.0],[-54.0,4.0],
    [-52.0,4.2],[-51.0,4.2],[-50.0,-0.1],[-52.0,3.0],[-54.0,4.0],
    [-57.5,6.0],[-60.0,8.0],[-61.0,8.0],[-60.0,5.2]
  ];

  const CENTROAMERICA = [
    [-77.0,8.5],[-76.1,9.5],[-75.6,10.4],[-83.7,9.6],[-84.0,10.5],
    [-85.7,11.0],[-87.7,13.0],[-89.2,14.0],[-90.1,15.7],[-91.7,17.8],
    [-90.5,18.5],[-88.3,18.5],[-88.0,16.0],[-89.2,15.9],[-89.2,14.0],
    [-87.7,13.0],[-85.7,11.0],[-84.0,10.5],[-83.7,9.6],[-77.0,8.5]
  ];

  const MEXICO_SUR = [
    [-91.7,17.8],[-90.1,15.7],[-89.2,14.0],[-89.2,15.9],[-88.0,16.0],
    [-88.3,18.5],[-90.5,18.5],[-91.7,17.8]
  ];

  const CUBA = [
    [-84.9,22.0],[-82.0,23.2],[-80.0,23.0],[-75.0,20.0],[-74.5,20.0],
    [-77.0,20.0],[-80.0,22.0],[-82.0,23.2],[-84.9,22.0]
  ];

  const HISPANIOLA = [
    [-74.5,18.0],[-73.5,18.5],[-72.0,19.9],[-71.7,19.7],[-71.0,19.8],
    [-69.0,19.0],[-68.3,18.5],[-68.6,18.2],[-69.9,18.4],[-71.7,18.6],
    [-72.0,18.2],[-73.5,18.0],[-74.5,18.0]
  ];

  const PUERTO_RICO = [
    [-67.3,18.5],[-65.6,18.5],[-65.6,17.9],[-67.3,17.9],[-67.3,18.5]
  ];

  const COUNTRIES = [
    { path: ARGENTINA,    fill: 'rgba(255,60,120,0.12)', stroke: 'rgba(255,60,120,0.55)', width: 1.2 },
    { path: CHILE,        fill: 'rgba(100,160,255,0.06)', stroke: 'rgba(150,180,255,0.3)',  width: 0.8 },
    { path: BRASIL,       fill: 'rgba(100,200,100,0.05)', stroke: 'rgba(150,220,150,0.25)', width: 0.8 },
    { path: BOLIVIA,      fill: 'rgba(255,200,50,0.04)',  stroke: 'rgba(200,180,100,0.2)',  width: 0.7 },
    { path: PERU,         fill: 'rgba(100,160,255,0.04)', stroke: 'rgba(150,180,255,0.2)',  width: 0.7 },
    { path: COLOMBIA,     fill: 'rgba(100,200,100,0.04)', stroke: 'rgba(150,220,150,0.2)',  width: 0.7 },
    { path: VENEZUELA,    fill: 'rgba(255,200,50,0.04)',  stroke: 'rgba(200,180,100,0.2)',  width: 0.7 },
    { path: ECUADOR,      fill: 'rgba(100,160,255,0.04)', stroke: 'rgba(150,180,255,0.2)',  width: 0.7 },
    { path: PARAGUAY,     fill: 'rgba(200,100,255,0.04)', stroke: 'rgba(180,130,255,0.2)',  width: 0.7 },
    { path: URUGUAY,      fill: 'rgba(100,200,200,0.04)', stroke: 'rgba(130,200,200,0.2)',  width: 0.7 },
    { path: GUIANAS,      fill: 'rgba(100,200,100,0.04)', stroke: 'rgba(150,220,150,0.2)',  width: 0.7 },
    { path: CENTROAMERICA,fill: 'rgba(100,160,255,0.04)', stroke: 'rgba(150,180,255,0.2)',  width: 0.7 },
    { path: MEXICO_SUR,   fill: 'rgba(100,160,255,0.04)', stroke: 'rgba(150,180,255,0.15)', width: 0.6 },
    { path: CUBA,         fill: 'rgba(100,200,200,0.06)', stroke: 'rgba(130,200,200,0.3)',  width: 0.8 },
    { path: HISPANIOLA,   fill: 'rgba(0,200,255,0.1)',    stroke: 'rgba(0,200,255,0.55)',   width: 1.2 },
    { path: PUERTO_RICO,  fill: 'rgba(100,200,200,0.06)', stroke: 'rgba(130,200,200,0.25)', width: 0.7 },
  ];

  const ORIGIN = { lon: -71.5, lat: -42.1, label: 'El Hoyo' };
  const DEST   = { lon: -69.9, lat: 18.5, label: 'Santo Domingo' };

  function initMap() {
    const svgContainer = document.getElementById('dist-svg-map');
    if (!svgContainer) return;

    const dpr = window.devicePixelRatio || 1;
    let W, H, originPx, destPx, cpPx;
    let animFrame = 0;

    const particles = Array.from({ length: 6 }, (_, i) => ({
      t: i / 6,
      speed: 0.0018 + Math.random() * 0.001,
      size: 1.5 + Math.random() * 1.5,
      alpha: 0.6 + Math.random() * 0.4
    }));

    function resize() {
      const rect = svgContainer.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      computePoints();
      renderSVG();
    }

    function computePoints() {
      originPx = project(ORIGIN.lon, ORIGIN.lat, W, H);
      destPx = project(DEST.lon, DEST.lat, W, H);
      cpPx = {
        x: (originPx.x + destPx.x) / 2 + (destPx.x - originPx.x) * 0.15,
        y: (originPx.y + destPx.y) / 2 - Math.abs(destPx.y - originPx.y) * 0.25
      };
    }

    function drawCountry(coords, fill, stroke, lineWidth) {
      if (coords.length < 2) return '';
      const points = coords.map(c => project(c[0], c[1], W, H)).join(' L ');
      return `<path d="M${points} Z" fill="${fill}" stroke="${stroke}" stroke-width="${lineWidth}"/>`;
    }

    function renderSVG() {
      let countryPaths = '';
      COUNTRIES.forEach(c => {
        countryPaths += drawCountry(c.path, c.fill, c.stroke, c.width);
      });

      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" class="stop-pink"/>
              <stop offset="50%" class="stop-violet"/>
              <stop offset="100%" class="stop-celeste"/>
            </linearGradient>
            <linearGradient id="glow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ff3c78"/>
              <stop offset="100%" stop-color="#00c8ff"/>
            </linearGradient>
          </defs>
          ${countryPaths}
          <path class="line-glow" d="M${originPx.x} ${originPx.y} Q${cpPx.x} ${cpPx.y} ${destPx.x} ${destPx.y}"/>
          <path class="line-main" d="M${originPx.x} ${originPx.y} Q${cpPx.x} ${cpPx.y} ${destPx.x} ${destPx.y}"/>
          <circle class="dot-origin" cx="${originPx.x}" cy="${originPx.y}" r="5"/>
          <circle class="dot-dest" cx="${destPx.x}" cy="${destPx.y}" r="5"/>
          <polygon class="dest-glow" points="${destPx.x},${destPx.y} ${destPx.x + 8},${destPx.y + 15} ${destPx.x + 15},${destPx.y} ${destPx.x + 8},${destPx.y - 15}"/>
        </svg>
      `;
      svgContainer.innerHTML = svgContent;
    }

    function drawFrame() {
      animFrame++;
      particles.forEach(p => {
        p.t += p.speed;
        if (p.t > 1) p.t -= 1;
      });
      requestAnimationFrame(drawFrame);
    }

    resize();
    window.addEventListener('resize', resize);
    drawFrame();
  }

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
      stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        base: Math.random() * 0.25 + 0.05,
        speed: Math.random() * 0.8 + 0.4,
        phase: Math.random() * Math.PI * 2
      }));
    }

    let t = 0;
    function drawStars() {
      ctx.clearRect(0, 0, W, H);
      t += 0.012;
      stars.forEach(s => {
        const alpha = s.base + Math.sin(t * s.speed + s.phase) * s.base * 0.6;
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
    initStars();
    initMap();
    updateClocks();
    setInterval(updateClocks, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();