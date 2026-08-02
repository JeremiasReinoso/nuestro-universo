// messages.js
(async () => {
  const textEl = document.getElementById('daily-text');
  const dateEl = document.getElementById('daily-date');
  if (!textEl) return;

  try {
    const messages = await loadJSON('dailyMessages.json');
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Busca mensaje del día exacto, si no rota por índice
    const match = messages.find(m => m.date === todayStr);
    const msg = match || messages[today.getDate() % messages.length];

    textEl.textContent = msg.message;
    dateEl.textContent = today.toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch (e) {
    textEl.textContent = 'Siempre serás mi universo.';
  }
})();
