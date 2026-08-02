class MusicPlayer {
  constructor() {
    this.audio = document.getElementById('background-music')
    this.musicBtn = document.getElementById('music-toggle')
    this.isPlaying = false
    this.volume = 0.5
    
    this.init()
  }

  async init() {
    const savedVolume = Utils.getStorage('musicVolume')
    if (savedVolume) {
      this.volume = savedVolume
      if (this.audio) {
        this.audio.volume = this.volume
      }
    }

    if (this.musicBtn) {
      this.musicBtn.addEventListener('click', () => this.toggle())
    }
  }

  toggle() {
    if (!this.audio) return
    
    if (this.isPlaying) {
      this.audio.pause()
      this.musicBtn.textContent = '🔊'
    } else {
      this.audio.play()
      this.musicBtn.textContent = '🔈'
    }
    this.isPlaying = !this.isPlaying
  }

  setVolume(volume) {
    this.volume = volume
    Utils.setStorage('musicVolume', volume)
    if (this.audio) {
      this.audio.volume = volume
    }
  }

  updateButton() {
    if (this.musicBtn) {
      this.musicBtn.textContent = this.isPlaying ? '🔈' : '🔊'
    }
  }
}

const musicPlayer = new MusicPlayer()
window.musicPlayer = musicPlayer