// miss.js - Botón "Te extraño"
(async () => {
  const btnMiss = document.getElementById('btn-miss');
  const missCard = document.getElementById('miss-card');
  const missText = document.getElementById('miss-text');
  const btnMissAnother = document.getElementById('btn-miss-another');

  if (!btnMiss || !missCard || !missText) return;

  let messages = [];
  let shownIndices = [];
  let currentIndex = -1;

  // Cargar mensajes
  try {
    messages = await loadJSON('missMessages.json');
  } catch (e) {
    messages = [
      { text: "Te extraño más de lo que palabras pueden expresar." },
      { text: "Cada día sin ti es un día más para extrañarte." },
      { text: "Mis pensamientos están llenos de ti." },
      { text: "Siento tu ausencia en cada latido." },
      { text: "Te extraño y te amo más que nunca." }
    ];
  }

  // Mostrar mensaje
  function showRandomMessage() {
    if (messages.length === 0) return;

    // Si ya mostramos todos los mensajes, reiniciar
    if (shownIndices.length === messages.length) {
      shownIndices = [];
    }

    // Encontrar un índice que no haya sido mostrado
    let availableIndices = messages
      .map((_, i) => i)
      .filter(i => !shownIndices.includes(i));

    if (availableIndices.length === 0) {
      availableIndices = messages.map((_, i) => i);
      shownIndices = [];
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    currentIndex = randomIndex;
    shownIndices.push(randomIndex);

    missText.textContent = messages[randomIndex].text;
    missCard.classList.remove('hidden');
  }

  // Event listeners
  btnMiss.addEventListener('click', showRandomMessage);
  btnMissAnother.addEventListener('click', showRandomMessage);
})();