(function() {
  'use strict';

  let currentChapter = 0;
  let hasStarted = false;

  function handleIntro() {
    const intro = document.getElementById('intro');
    const enterBtn = document.getElementById('enter-btn');
    
    function startExperience() {
      if (hasStarted) return;
      hasStarted = true;
      
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
      enterBtn.addEventListener('click', startExperience);
    }
    if (intro) {
      intro.addEventListener('click', startExperience);
      intro.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startExperience();
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', handleIntro);
})();