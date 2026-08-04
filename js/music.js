(function() {
  'use strict';

  function initMusic() {
    const playBtn = document.getElementById('play-btn');
    const audio = document.getElementById('music-player');
    const floatingPlayer = document.getElementById('floating-player');
    const timeEl = document.getElementById('player-time');

    if (floatingPlayer) {
      floatingPlayer.classList.add('floating-player-visible');
    }

    if (playBtn && audio) {
      playBtn.addEventListener('click', function() {
        if (audio.src && audio.src !== 'https://example.com/music.mp3') {
          if (audio.paused) {
            audio.play().catch(function(e) {
              console.log('Playback prevented:', e);
            });
          } else {
            audio.pause();
          }
        }
      });

      audio.addEventListener('loadedmetadata', function() {
        updateTime();
      });

      audio.addEventListener('timeupdate', updateTime);
    }

    function updateTime() {
      if (!audio || !audio.src || !timeEl) return;
      if (audio.src.includes('example.com')) return;
      
      var current = Math.floor(audio.currentTime);
      var duration = Math.floor(audio.duration) || 0;
      var mins = String(Math.floor(current / 60)).padStart(2, '0');
      var secs = String(current % 60).padStart(2, '0');
      var durMins = String(Math.floor(duration / 60)).padStart(2, '0');
      var durSecs = String(duration % 60).padStart(2, '0');
      
      timeEl.textContent = mins + ':' + secs + ' / ' + durMins + ':' + durSecs;
    }
  }

  document.addEventListener('DOMContentLoaded', initMusic);
})();