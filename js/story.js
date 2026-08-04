(function () {
  'use strict';

  let currentChapter = 1;
  let messages = [];
  let messageHistory = JSON.parse(localStorage.getItem('missHistory') || '[]');
  let audioContext = null;

  const letterContents = {
    letter1: {
      greeting: "Querida,",
      body: "Cada latido me recuerda a vos. No es solo una sensación, es una conexión que trasciende la distancia. Esta página no es una simple web, es un espacio hecho con las manos, con el corazón, pensando en vos cada vez que la abro.\n\nTodo lo que compartimos tiene un sabor único. Ese café en la esquina de San Martín, la forma en que nos miraste mientras probaba el espresso. Me dijiste que el amor es como el café: necesita tiempo, paciencia y un toque correcto para ser perfecto.\n\nAún me imagino ese sabor, esa calidez en cada sorbo. Cada detalle de vos me recuerda por qué valgo la pena."
    },
    letter2: {
      greeting: "Amor,",
      body: "Si pudieras ver las fotos que te guardé de nuestro viaje a la costa. El atardecer en Mar del Plata que nos quedamos mirando hasta que el sol se escondía por completo. El silencio que no necesitaba palabras fue el mejor regalo.\n\nEse día supe que algo grande nos estaba creciendo entre nosotros. No fue un momento de palabras grandiosas, sino de miradas y comprensión."
    },
    letter3: {
      greeting: "Querida,",
      body: "Me gusta cuando me escribís apenas te despertás. El primer mensaje del día es siempre mi parte favorita. Me gusta escuchar tu voz de madrugada, esa voz que dice 'hola' sin necesidad de más palabras.\n\nMe gusta imaginar el día que podamos abrazarnos por primera vez. Cada día que pasa, el deseo de un abrazo físico crece, pero también la certeza de que estamos construyendo algo especial."
    }
  };

  function loadContent() {
    return Promise.resolve();
  }

  function showChapter(chapter) {
    document.querySelectorAll('.chapter').forEach(c => c.classList.remove('visible'));
    const target = document.getElementById(`chapter${chapter}`);
    if (target) {
      target.classList.add('visible');
    }
    currentChapter = chapter;
    if (chapter >= 2) {
      initEnvelopes();
    }
  }

  function initEnvelopes() {
    const envelopes = document.querySelectorAll('.envelope');
    envelopes.forEach(envelope => {
      const seal = envelope.querySelector('.seal');
      const overlay = envelope.querySelector('.envelope-overlay');
      
      if (seal && overlay) {
        seal.addEventListener('click', function(e) {
          e.stopPropagation();
          breakSeal(seal);
        });
        
        envelope.addEventListener('click', function() {
          if (envelope.classList.contains('open')) {
            closeEnvelope(envelope);
          } else {
            openEnvelope(envelope);
          }
        });
        
        overlay.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      }
    });
  }

  function breakSeal(seal) {
    seal.style.transform = 'scale(1.2) rotate(5deg)';
    seal.style.filter = 'drop-shadow(0 0 8px #ff3c78)';
    seal.classList.add('cracked');
    
    if (audioContext) {
      playSound();
    }
    
    setTimeout(() => {
      seal.style.transform = 'scale(1.1) rotate(-3deg)';
    }, 200);
  }

  function openEnvelope(envelope) {
    envelope.classList.add('open');
    
    setTimeout(() => {
      const letter = envelope.querySelector('.letter');
      if (letter) {
        letter.classList.add('open');
      }
      
      const saveBtn = envelope.querySelector('.save-btn');
      if (saveBtn) {
        saveBtn.style.opacity = '1';
      }
    }, 600);
  }

  function closeEnvelope(envelope) {
    const letter = envelope.querySelector('.letter');
    if (letter) {
      letter.classList.remove('open');
    }
    envelope.classList.remove('open');
    
    const saveBtn = envelope.querySelector('.save-btn');
    if (saveBtn) {
      saveBtn.style.opacity = '0';
    }
  }

  function getLetterContent(letterKey) {
    const content = letterContents[letterKey] || { greeting: '', body: '' };
    return content;
  }

  function applyContentToLetter(envelope, letterKey) {
    const content = getLetterContent(letterKey);
    const letter = envelope.querySelector('.letter');
    
    if (letter) {
      const greetingEl = letter.querySelector('.letter-body p:first-child');
      const bodyEl = letter.querySelector('.letter-body p:first-child + p');
      
      if (greetingEl) greetingEl.textContent = content.greeting;
      if (bodyEl) bodyEl.textContent = content.body;
    }
  }

  function setupScrollNav() {
    let ticking = false;
    
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const chapters = document.querySelectorAll('.chapter');
          chapters.forEach((chapter, i) => {
            const rect = chapter.getBoundingClientRect();
            if (rect.top < 100 && rect.bottom > 100) {
              if (currentChapter !== i + 1) {
                showChapter(i + 1);
              }
            }
          });
          
          setTimeout(() => {
            const envelope2 = document.getElementById('envelope2');
            if (currentChapter === 2 && envelope2) {
              applyContentToLetter(envelope2, 'letter2');
            }
            const envelope3 = document.getElementById('envelope3');
            if (currentChapter === 3 && envelope3) {
              applyContentToLetter(envelope3, 'letter3');
            }
          }, 300);
          
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll);
  }

  function setupPlayer() {
    const player = document.getElementById('floating-player');
    const playBtn = document.getElementById('play-btn');
    
    if (player) {
      player.style.opacity = '0';
      player.style.transform = 'translateY(20px)';
      player.style.animation = 'fadeInUp 0.6s ease 0.5s forwards';
    }
  }

  function hideIntro() {
    const intro = document.getElementById('intro');
    intro.classList.add('hidden');
  }

  function handleEnter() {
    hideIntro();
    loadContent().then(() => {
      showChapter(1);
      setTimeout(setupScrollNav, 300);
      setTimeout(setupPlayer, 1000);
    });
  }

  function createSoundBuffer() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playSound() {
    if (!audioContext) {
      createSoundBuffer();
      if (!audioContext) return;
    }
    
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  document.getElementById('enter-btn').addEventListener('click', handleEnter);
  document.getElementById('intro').addEventListener('click', handleEnter);
  document.getElementById('intro').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleEnter();
  });

  document.addEventListener('DOMContentLoaded', () => {
    hideIntro();
    loadContent().then(() => {
      applyContentToLetter(document.getElementById('envelope1'), 'letter1');
      
      const saveBtn1 = document.getElementById('envelope1')?.querySelector('.save-btn');
      if (saveBtn1) {
        saveBtn1.innerHTML = '<svg class="heart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 19.04 2 15.76 2 11.5 2 7.42 5.15 4 9 4c3.66 0 6.6 4.01 6.6 9.5 0 3.66-2.96 7.02-6.6 7.82v.02c0 .48.16.93.39 1.34l-.48 1.18h12.2l-.48-1.18C19.04 20.93 19 21.35 19 21.35z"/></svg>Guardar la carta ❤️';
        saveBtn1.addEventListener('click', function(e) {
          e.stopPropagation();
          const envelope = this.closest('.envelope');
          if (envelope) {
            closeEnvelope(envelope);
          }
        });
      }
    });
  });
})();