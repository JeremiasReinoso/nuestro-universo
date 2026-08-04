(function () {
  'use strict';

  let currentChapter = 1;
  let content = {};
  let messageIndex = 0;
  let messageHistory = JSON.parse(localStorage.getItem('missHistory') || '[]');

  async function loadContent() {
    try {
      const response = await fetch('data/content.json');
      content = await response.json();
    } catch (e) {
      console.error('Error loading content:', e);
    }
  }

  function showChapter(chapter) {
    document.querySelectorAll('.chapter').forEach(c => c.classList.remove('visible'));
    document.getElementById(`chapter${chapter}`).classList.add('visible');
    currentChapter = chapter;
    animateChapter(chapter);
  }

  function animateChapter(chapter) {
    const elements = {
      1: ['.welcome-title'],
      2: ['.letter-body', '.closing', '.signature'],
      3: ['.photo-frame'],
      4: ['.letter-alt-text'],
      5: ['.music-note', '.song-quote', '.song-title', '.song-artist', '.play-btn'],
      6: ['.photo-frame'],
      7: ['.section-title', '.item'],
      8: ['.section-title', '.dream-item'],
      9: ['.section-title', '.btn-miss', '.miss-card'],
      10: ['.final-heart', '.final-quote', '.final-page']
    };

    const els = elements[chapter] || [];
    els.forEach((sel, i) => {
      const el = document.querySelector(sel);
      if (el) {
        setTimeout(() => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, 50);
        }, i * 100);
      }
    });
  }

  function typeWriter(text, container, speed = 30) {
    return new Promise(resolve => {
      container.innerHTML = '';
      let i = 0;
      function type() {
        if (i < text.length) {
          container.innerHTML += text.charAt(i);
          i++;
          setTimeout(type, text[i] === '\n' ? 10 : speed);
        } else {
          resolve();
        }
      }
      type();
    });
  }

  async function renderChapter2() {
    const letterBody = document.querySelector('.letter-body');
    if (letterBody && content?.letter1?.body) {
      await typeWriter(content.letter1.body, letterBody);
    }
  }

  function renderPhotos() {
    if (content?.photos) {
      const photo1 = document.getElementById('photo1');
      const caption1 = document.getElementById('caption1');
      const quote1 = document.getElementById('quote1');
      
      if (photo1 && content.photos[0]) {
        photo1.src = content.photos[0].src;
      }
      if (caption1 && quote1 && content.photos[0]) {
        caption1.textContent = content.photos[0].caption;
        quote1.textContent = content.photos[0].quote;
      }
    }

    if (content?.photos?.[1]) {
      const photo2 = document.getElementById('photo2');
      const caption2 = document.getElementById('caption2');
      const quote2 = document.getElementById('quote2');
      
      if (photo2) photo2.src = content.photos[1].src;
      if (caption2 && quote2) {
        caption2.textContent = content.photos[1].caption;
        quote2.textContent = content.photos[1].quote;
      }
    }
  }

  async function renderChapter4() {
    const letterText = document.querySelector('.letter-alt-text');
    if (letterText && content?.letters?.[0]?.content) {
      await typeWriter(content.letters[0].content, letterText, 25);
    }
  }

  function renderSong() {
    if (content?.song) {
      document.querySelector('.song-title').textContent = content.song.title;
      document.querySelector('.song-artist').textContent = content.song.artist;
      document.getElementById('music-player').src = content.song.url;
    }
  }

  function renderSmallThings() {
    if (!content?.small_things) return;
    const container = document.querySelector('.items-container');
    container.innerHTML = '';
    
    content.small_things.forEach((item, i) => {
      const p = document.createElement('p');
      p.className = 'item';
      p.textContent = item;
      p.style.opacity = '0';
      p.style.transform = 'translateY(20px)';
      container.appendChild(p);
      
      setTimeout(() => {
        p.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        p.style.opacity = '1';
        p.style.transform = 'translateY(0)';
      }, i * 120);
    });
  }

  function renderDreams() {
    if (!content?.dreams) return;
    const container = document.querySelector('.dreams-container');
    container.innerHTML = '';
    
    content.dreams.forEach((dream, i) => {
      const p = document.createElement('p');
      p.className = 'dream-item';
      p.textContent = dream;
      p.style.opacity = '0';
      p.style.transform = 'translateY(20px)';
      container.appendChild(p);
      
      setTimeout(() => {
        p.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        p.style.opacity = '1';
        p.style.transform = 'translateY(0)';
      }, i * 120);
    });
  }

  async function setupScrollNav() {
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
                if (i + 1 === 2) renderChapter2();
                if (i + 1 === 3 || i + 1 === 6) renderPhotos();
                if (i + 1 === 4) renderChapter4();
                if (i + 1 === 5) renderSong();
                if (i + 1 === 7) renderSmallThings();
                if (i + 1 === 8) renderDreams();
                if (i + 1 === 9) renderMiss();
              }
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll);
  }

  function renderMiss() {
    const btn = document.getElementById('btn-miss');
    const card = document.getElementById('miss-card');
    const text = document.getElementById('miss-text');
    
    btn.addEventListener('click', () => {
      card.classList.remove('hidden');
      
      let availableMessages = content.messages.filter((_, i) => !messageHistory.includes(i));
      
      if (availableMessages.length === 0) {
        messageHistory = [];
        localStorage.setItem('missHistory', JSON.stringify(messageHistory));
        availableMessages = content.messages;
      }
      
      const randomIndex = Math.floor(Math.random() * availableMessages.length);
      const message = availableMessages[randomIndex];
      
      messageHistory.push(content.messages.indexOf(message));
      localStorage.setItem('missHistory', JSON.stringify(messageHistory));
      
      text.textContent = message;
    });
  }

  function setupPlayer() {
    const player = document.getElementById('floating-player');
    const playBtn = document.getElementById('play-btn');
    const audio = document.getElementById('music-player');
    
    playBtn.addEventListener('click', () => {
      if (audio.src && audio.src.includes('example.com')) return;
      audio.play().catch(e => console.log('Playback prevented:', e));
    });

    audio.addEventListener('timeupdate', () => {
      if (!audio.src || audio.src.includes('example.com')) return;
      const current = Math.floor(audio.currentTime);
      const duration = Math.floor(audio.duration) || 0;
      const mins = Math.floor(current / 60).toString().padStart(2, '0');
      const secs = (current % 60).toString().padStart(2, '0');
      const durMins = Math.floor(duration / 60).toString().padStart(2, '0');
      const durSecs = (duration % 60).toString().padStart(2, '0');
      document.getElementById('player-time').textContent = `${mins}:${secs} / ${durMins}:${durSecs}`;
    });
  }

  function hideIntro() {
    const intro = document.getElementById('intro');
    intro.classList.add('hidden');
  }

  function handleEnter() {
    hideIntro();
    loadContent().then(() => {
      showChapter(1);
      renderChapter2();
      renderPhotos();
      renderSong();
      renderSmallThings();
      renderDreams();
      renderMiss();
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
      setTimeout(setupScrollNav, 600);
      setTimeout(setupPlayer, 1000);
    });
  }

  document.getElementById('enter-btn').addEventListener('click', handleEnter);
  document.getElementById('intro').addEventListener('click', handleEnter);
  document.getElementById('intro').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleEnter();
  });

  document.addEventListener('DOMContentLoaded', () => {
    loadContent().then(() => {
      renderSmallThings();
      renderDreams();
      renderMiss();
    });
  });
})();