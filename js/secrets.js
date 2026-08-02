class SecretsManager {
  constructor() {
    this.keys = {
      REVEALED_LETTERS: 'revealedLetters',
      MUSIC_VOLUME: 'musicVolume',
      VISITED_SECTIONS: 'visitedSections',
      UNLOCKED_CONTENT: 'unlockedContent'
    }
    
    this.init()
  }

  init() {
    this.trackScroll()
  }

  set(key, value) {
    Utils.setStorage(this.keys[key], value)
  }

  get(key) {
    return Utils.getStorage(this.keys[key])
  }

  increment(key) {
    const current = this.get(key) || 0
    const newValue = current + 1
    this.set(key, newValue)
    return newValue
  }

  has(key) {
    return this.get(key) !== null
  }

  trackScroll() {
    const visited = this.get('VISITED_SECTIONS') || []
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          if (!visited.includes(sectionId)) {
            visited.push(sectionId)
            this.set('VISITED_SECTIONS', visited)
          }
        }
      })
    }, {
      threshold: 0.5
    })

    document.querySelectorAll('.section').forEach(section => {
      observer.observe(section)
    })
  }

  unlockContent(key) {
    const unlocked = this.get('UNLOCKED_CONTENT') || []
    if (!unlocked.includes(key)) {
      unlocked.push(key)
      this.set('UNLOCKED_CONTENT', unlocked)
      return true
    }
    return false
  }

  isUnlocked(key) {
    const unlocked = this.get('UNLOCKED_CONTENT') || []
    return unlocked.includes(key)
  }
}

const secretsManager = new SecretsManager()
window.secretsManager = secretsManager