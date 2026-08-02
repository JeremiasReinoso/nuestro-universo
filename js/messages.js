class DailyMessage {
  constructor() {
    this.messageElement = document.getElementById('daily-message')
    this.messagesData = []
    
    this.init()
  }

  async init() {
    const data = await DataLoader.loadJSON('data/dailyMessages.json')
    if (data && data.length > 0) {
      this.messagesData = data
      this.render()
    } else {
      this.messageElement.innerHTML = '<div class="loading">Cargando mensaje del día...</div>'
    }
  }

  render() {
    if (!this.messageElement || this.messagesData.length === 0) return
    
    const today = new Date()
    const dayIndex = today.getDate() % this.messagesData.length
    const message = this.messagesData[dayIndex]
    
    this.messageElement.innerHTML = `
      <div class="message-card fade-in">
        <div class="message-icon">💌</div>
        <blockquote class="message-text">${message.message}</blockquote>
        <footer class="message-date">${message.date}</footer>
      </div>
    `
  }
}

const dailyMessage = new DailyMessage()
window.dailyMessage = dailyMessage