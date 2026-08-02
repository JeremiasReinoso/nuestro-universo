class Letters {
  constructor() {
    this.lettersElement = document.getElementById('letters')
    this.lettersData = []
    this.revealedCount = 0
    
    this.init()
  }

  async init() {
    const savedCount = Utils.getStorage('revealedLetters')
    if (savedCount) this.revealedCount = savedCount

    const data = await DataLoader.loadJSON('data/letters.json')
    if (data && data.length > 0) {
      this.lettersData = data
      this.render()
    } else {
      this.lettersElement.innerHTML = '<div class="loading">Cargando cartas...</div>'
    }
  }

  render() {
    if (!this.lettersElement) return
    
    const revealButton = `
      <button class="reveal-btn" id="reveal-all-btn">Revelar todas mis cartas</button>
    `
    
    const lettersList = this.lettersData.map((letter, index) => `
      <div class="letter-envelope" style="--delay: ${index * 0.1}s">
        <div class="letter-content">
          <h3 class="letter-title">${letter.subject}</h3>
          <p class="letter-date">${letter.date}</p>
          <div class="letter-body ${this.revealedCount > index ? 'revealed' : ''}">
            <p class="letter-sender">De: ${letter.sender}</p>
            <p class="letter-text">${letter.content.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
        <div class="letter-flap"></div>
      </div>
    `).join('')
    
    this.lettersElement.innerHTML = `<div class="letters-container">${revealButton}${lettersList}</div>`
    
    document.getElementById('reveal-all-btn').addEventListener('click', () => this.revealAll())
  }

  revealAll() {
    if (!this.lettersData) return
    this.revealedCount = this.lettersData.length
    Utils.setStorage('revealedLetters', this.revealedCount)
    this.render()
  }
}

const letters = new Letters()
window.letters = letters