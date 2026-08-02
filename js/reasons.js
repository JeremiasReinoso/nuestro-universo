class Reasons {
  constructor() {
    this.reasonsElement = document.getElementById('reasons')
    this.reasonsData = []
    
    this.init()
  }

  async init() {
    const data = await DataLoader.loadJSON('data/reasons.json')
    if (data && data.length > 0) {
      this.reasonsData = data
      this.render()
    } else {
      this.reasonsElement.innerHTML = '<div class="loading">Cargando razones...</div>'
    }
  }

  render() {
    if (!this.reasonsElement) return
    
    this.reasonsElement.innerHTML = this.reasonsData.map(reason => `
      <div class="flip-card" onclick="reasons.toggleCard(this)">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="card-icon">❤️</div>
            <h3>Razón ${reason.id}</h3>
          </div>
          <div class="flip-card-back">
            <p class="reason-text">${reason.text}</p>
            <span class="reason-author">— ${reason.author}</span>
          </div>
        </div>
      </div>
    `).join('')
  }

  toggleCard(cardElement) {
    const flipCardInner = cardElement.querySelector('.flip-card-inner')
    if (flipCardInner) {
      flipCardInner.classList.toggle('flipped')
    }
  }
}

const reasons = new Reasons()
window.reasons = reasons