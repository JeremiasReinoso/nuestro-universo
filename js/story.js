(function () {
  'use strict';

  let currentChapter = 0;

  function initIntro() {
    const intro = document.getElementById('intro');
    const enterBtn = document.getElementById('enter-btn');
    
    function hideIntroAndStart() {
      if (intro) {
        intro.classList.add('hidden');
      }
      setTimeout(() => {
        const firstChapter = document.querySelector('.chapter');
        if (firstChapter) {
          firstChapter.classList.add('visible');
          currentChapter = 1;
        }
      }, 100);
    }
    
    if (enterBtn) {
      enterBtn.addEventListener('click', hideIntroAndStart);
    }
    if (intro) {
      intro.addEventListener('click', hideIntroAndStart);
      intro.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          hideIntroAndStart();
        }
      });
    }
  }

  function initIntersectionObserver() {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const chapter = entry.target;
          const chapterNum = parseInt(chapter.id.replace('chapter', ''));
          
          if (chapterNum > currentChapter) {
            currentChapter = chapterNum;
          }
          
          const envelopes = chapter.querySelectorAll('.envelope');
          envelopes.forEach(function(envelope) {
            if (!envelope.classList.contains('open')) {
              envelope.classList.add('open');
            }
          });
        }
      });
    }, {
      root: null,
      threshold: 0.1
    });

    const chapters = document.querySelectorAll('.chapter');
    chapters.forEach(function(chapter) {
      observer.observe(chapter);
    });
  }

  function initSeals() {
    const seals = document.querySelectorAll('.envelope-seal');
    seals.forEach(function(seal) {
      seal.addEventListener('click', function(e) {
        const envelope = this.closest('.envelope');
        if (envelope && !envelope.classList.contains('open')) {
          envelope.classList.add('open');
        }
      });
    });
  }

  function initSaveButtons() {
    const saveBtns = document.querySelectorAll('.save-btn');
    saveBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const envelope = this.closest('.envelope');
        if (envelope) {
          envelope.classList.remove('open');
        }
      });
    });
  }

  function initFloatingPlayer() {
    const player = document.getElementById('floating-player');
    const timeEl = document.getElementById('player-time');
    
    if (player) {
      player.style.opacity = '1';
      player.style.transform = 'translateY(0)';
    }
    
    function updateTime() {
      if (!player || !timeEl) return;
      
      const now = new Date();
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      timeEl.textContent = mins + ':' + secs + ' / --:--';
    }
    
    setInterval(updateTime, 1000);
    updateTime();
  }

  function init() {
    initIntro();
    initSeals();
    initSaveButtons();
    initFloatingPlayer();
    
    if ('IntersectionObserver' in window) {
      initIntersectionObserver();
    } else {
      const chapters = document.querySelectorAll('.chapter');
      chapters.forEach(function(chapter) {
        chapter.classList.add('visible');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();