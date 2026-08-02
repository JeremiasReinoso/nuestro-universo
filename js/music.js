// music.js - Reproductor de música personalizado
(async () => {
  const audio = document.getElementById('audio-player');
  const playerCover = document.getElementById('player-cover');
  const playerCoverImg = document.getElementById('player-cover-img');
  const playerCoverPlaceholder = document.getElementById('player-cover-placeholder');
  const playerTitle = document.getElementById('player-title');
  const playerArtist = document.getElementById('player-artist');
  const playerCurrent = document.getElementById('player-current');
  const playerDuration = document.getElementById('player-duration');
  const playerFill = document.getElementById('player-fill');
  const playerThumb = document.getElementById('player-thumb');
  const playerProgress = document.getElementById('player-progress');
  const playerPlay = document.getElementById('player-play');
  const playerPrev = document.getElementById('player-prev');
  const playerNext = document.getElementById('player-next');
  const playerVolume = document.getElementById('player-volume');
  const playerQueueToggle = document.getElementById('player-queue-toggle');
  const playerQueue = document.getElementById('player-queue');

  if (!audio) return;

  let currentTrackIndex = 0;
  let isPlaying = false;
  let tracks = [];

  // Cargar canciones
  try {
    tracks = await loadJSON('songs.json');
    renderQueue();
    loadTrack(currentTrackIndex);
  } catch (e) {
    console.error('Error loading songs:', e);
  }

  // Renderizar lista de reproducción
  function renderQueue() {
    playerQueue.innerHTML = tracks.map((track, index) => `
      <div class="queue-item ${index === currentTrackIndex ? 'active' : ''}" data-index="${index}">
        <span class="queue-title">${track.title}</span>
        <span class="queue-artist">${track.artist}</span>
      </div>
    `).join('');

    playerQueue.querySelectorAll('.queue-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        loadTrack(index);
        play();
      });
    });
  }

  // Cargar pista actual
  function loadTrack(index) {
    if (index < 0 || index >= tracks.length) return;
    
    currentTrackIndex = index;
    const track = tracks[index];
    
    audio.src = track.src;
    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist;
    
    // Actualizar portada
    if (track.cover) {
      playerCoverImg.src = track.cover;
      playerCoverImg.classList.remove('hidden');
      playerCoverPlaceholder.classList.add('hidden');
    } else {
      playerCoverImg.classList.add('hidden');
      playerCoverPlaceholder.classList.remove('hidden');
    }

    // Actualizar lista de reproducción
    playerQueue.querySelectorAll('.queue-item').forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });

    // Preload
    audio.load();
  }

  // Reproducir
  function play() {
    if (tracks.length === 0) return;
    
    audio.play().then(() => {
      isPlaying = true;
      updatePlayIcon();
    }).catch(e => {
      console.error('Playback error:', e);
    });
  }

  // Pausar
  function pause() {
    audio.pause();
    isPlaying = false;
    updatePlayIcon();
  }

  // Alternar play/pause
  function togglePlay() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  // Actualizar icono de play/pause
  function updatePlayIcon() {
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    
    if (isPlaying) {
      iconPlay.classList.add('hidden');
      iconPause.classList.remove('hidden');
    } else {
      iconPlay.classList.remove('hidden');
      iconPause.classList.add('hidden');
    }
  }

  // Siguiente pista
  function nextTrack() {
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= tracks.length) {
      nextIndex = 0;
    }
    loadTrack(nextIndex);
    play();
  }

  // Pista anterior
  function prevTrack() {
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) {
      prevIndex = tracks.length - 1;
    }
    loadTrack(prevIndex);
    play();
  }

  // Actualizar progreso
  function updateProgress() {
    const { currentTime, duration } = audio;
    if (!duration) return;

    const percent = (currentTime / duration) * 100;
    playerFill.style.width = `${percent}%`;
    playerThumb.style.left = `calc(${percent}% - 6px)`;

    playerCurrent.textContent = formatTime(currentTime);
    playerDuration.textContent = formatTime(duration);
  }

  // Formatear tiempo
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Event listeners
  playerPlay.addEventListener('click', togglePlay);
  playerNext.addEventListener('click', nextTrack);
  playerPrev.addEventListener('click', prevTrack);
  playerVolume.addEventListener('input', (e) => {
    audio.volume = e.target.value;
  });
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('ended', nextTrack);
  audio.addEventListener('loadedmetadata', () => {
    playerDuration.textContent = formatTime(audio.duration);
  });

  // Control de progreso
  playerProgress.addEventListener('click', (e) => {
    const rect = playerProgress.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    audio.currentTime = percent * audio.duration;
  });

  // Toggle lista de reproducción
  playerQueueToggle.addEventListener('click', () => {
    const isExpanded = playerQueueToggle.getAttribute('aria-expanded') === 'true';
    playerQueueToggle.setAttribute('aria-expanded', !isExpanded);
    playerQueue.classList.toggle('hidden');
  });
})();