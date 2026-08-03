// distance.js - Mapa y horas para la sección "La distancia que nos une"

function initDistanceMap() {
  const canvas = document.getElementById('distance-map-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    drawMap();
  }
  
  function drawMap() {
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    
    ctx.clearRect(0, 0, width, height);
    
    // Fondo
    ctx.fillStyle = 'rgba(10, 15, 26, 0)';
    ctx.fillRect(0, 0, width, height);
    
    // Centro del canvas
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;
    
    // Contorno de Sudamérica (simplificado)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 2]);
    
    // Forma simplificada de Sudamérica
    const sa = {
      points: [
        { x: centerX - radius * 0.4, y: centerY + radius * 0.3 },
        { x: centerX + radius * 0.25, y: centerY + radius * 0.35 },
        { x: centerX + radius * 0.55, y: centerY + radius * 0.15 },
        { x: centerX + radius * 0.6, y: centerY - radius * 0.1 },
        { x: centerX + radius * 0.45, y: centerY - radius * 0.25 },
        { x: centerX + radius * 0.3, y: centerY - radius * 0.3 },
        { x: centerX, y: centerY - radius * 0.35 },
        { x: centerX - radius * 0.2, y: centerY - radius * 0.25 },
        { x: centerX - radius * 0.35, y: centerY - radius * 0.15 },
        { x: centerX - radius * 0.4, y: centerY + radius * 0.1 },
      ]
    };
    
    ctx.moveTo(sa.points[0].x, sa.points[0].y);
    for (let i = 1; i < sa.points.length; i++) {
      ctx.lineTo(sa.points[i].x, sa.points[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    
    // Contorno de República Dominicana (simplificado - posición superior derecha)
    ctx.beginPath();
    
    const rd = {
      points: [
        { x: centerX + radius * 0.6, y: centerY - radius * 0.45 },
        { x: centerX + radius * 0.25, y: centerY - radius * 0.55 },
        { x: centerX - radius * 0.15, y: centerY - radius * 0.5 },
        { x: centerX, y: centerY - radius * 0.3 },
      ]
    };
    
    ctx.moveTo(rd.points[0].x, rd.points[0].y);
    for (let i = 1; i < rd.points.length; i++) {
      ctx.lineTo(rd.points[i].x, rd.points[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    
    // Línea curva punteada entre Argentina y República Dominicana
    ctx.beginPath();
    ctx.setLineDash([8, 4, 2, 4]);
    ctx.strokeStyle = 'rgba(255, 60, 120, 0.6)';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(255, 60, 120, 0.5)';
    
    // Punto de partida (Argentina - posición inferior izquierda)
    const startPoint = { x: centerX - radius * 0.55, y: centerY + radius * 0.25 };
    
    // Punto de llegada (República Dominicana - posición superior derecha)
    const endPoint = { x: centerX + radius * 0.35, y: centerY - radius * 0.4 };
    
    // Control point para la curva
    const controlPoint = { x: centerX + radius * 0.1, y: centerY - radius * 0.1 };
    
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
    ctx.stroke();
    
    // Puntos de partida y llegada
    const pulseTime = Date.now() * 0.002;
    
    // Punto Argentina
    const pulseArgentina = Math.sin(pulseTime * 0.5) * 2;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 6 + pulseArgentina, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 60, 120, 0.8)';
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(255, 60, 120, 0.7)';
    ctx.fill();
    
    // Punto República Dominicana
    const pulseRD = Math.sin(pulseTime * 0.5 + Math.PI) * 2;
    ctx.beginPath();
    ctx.arc(endPoint.x, endPoint.y, 6 + pulseRD, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
    ctx.fill();
    
    // Reset lineDash para otras cosas
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
  }
  
  // Animación sutil de parpadeo
  let width, height;
  
  function animate() {
    width = canvas.width / dpr;
    height = canvas.height / dpr;
    const opacity = 0.5 + Math.sin(Date.now() * 0.001) * 0.2;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.1})`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(animate);
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  drawMap();
  requestAnimationFrame(animate);
}

// Actualizar horas en las tarjetas de distancia
function updateDistanceClocks() {
  const now = new Date();
  
  // Hora en Argentina (UTC-3)
  const arTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
  const arHour = String(arTime.getHours()).padStart(2, '0');
  const arMinute = String(arTime.getMinutes()).padStart(2, '0');
  
  // Hora en República Dominicana (UTC-4)
  const doTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Santo_Domingo' }));
  const doHour = String(doTime.getHours()).padStart(2, '0');
  const doMinute = String(doTime.getMinutes()).padStart(2, '0');
  
  const arEl = document.getElementById('time-ar');
  const doEl = document.getElementById('time-do');
  
  if (arEl) arEl.textContent = `${arHour}:${arMinute}`;
  if (doEl) doEl.textContent = `${doHour}:${doMinute}`;
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('distance-map-canvas')) {
      initDistanceMap();
      updateDistanceClocks();
      setInterval(updateDistanceClocks, 60000);
    }
    initStars();
  });
} else {
  if (document.getElementById('distance-map-canvas')) {
    initDistanceMap();
    updateDistanceClocks();
    setInterval(updateDistanceClocks, 60000);
  }
  initStars();
}

// Función para crear estrellas animadas
function initStars() {
  const container = document.getElementById('stars-distance');
  if (!container) return;
  
  const starCount = 60;
  const starColors = ['#ffffff', '#e6e6e6', '#ccccff', '#ffccff', '#cccccc'];
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    const size = Math.random() * 2.5 + 0.5;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const opacity = Math.random() * 0.3 + 0.05;
    const delay = Math.random() * 3;
    const duration = Math.random() * 2 + 1;
    
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.opacity = opacity;
    star.style.background = starColors[Math.floor(Math.random() * starColors.length)];
    star.style.filter = `drop-shadow(0 0 ${size}px ${starColors[Math.floor(Math.random() * starColors.length)]})`;
    star.style.animationDelay = `${delay}s`;
    star.style.animationDuration = `${duration}s`;
    
    container.appendChild(star);
  }
}