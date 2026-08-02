// clocks.js - Relojes de Argentina y República Dominicana
function updateClocks() {
  const now = new Date();
  
  // Hora en Argentina (UTC-3)
  const arTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
  const arHour = String(arTime.getHours()).padStart(2, '0');
  const arMinute = String(arTime.getMinutes()).padStart(2, '0');
  
  // Hora en República Dominicana (UTC-4)
  const doTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Santo_Domingo' }));
  const doHour = String(doTime.getHours()).padStart(2, '0');
  const doMinute = String(doTime.getMinutes()).padStart(2, '0');
  
  const arEl = document.getElementById('clock-ar');
  const doEl = document.getElementById('clock-do');
  
  if (arEl) arEl.textContent = `${arHour}:${arMinute}`;
  if (doEl) doEl.textContent = `${doHour}:${doMinute}`;
}

// Actualizar cada minuto
updateClocks();
setInterval(updateClocks, 60000);