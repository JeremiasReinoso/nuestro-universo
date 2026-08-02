class Timeline {
  constructor() {
    this.timelineElement = document.getElementById('timeline')
    this.timelineData = []
    
    this.init()
  }

  async init() {
    const data = await DataLoader.loadJSON('data/timeline.json')
    if (data && data.length > 0) {
      this.timelineData = data
      this.render()
    } else {
      this.timelineElement.innerHTML = '<div class="loading">Cargando línea de tiempo...</div>'
    }
  }

  render() {
    if (!this.timelineElement) return
    
    const timelineItems = this.timelineData.map(item => `
      <div class="timeline-item" data-date="${item.date}">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <span class="timeline-date">${item.date}</span>
        </div>
      </div>
    `).join('')
    
    this.timelineElement.innerHTML = `<div class="timeline-line"></div>${timelineItems}`
  }
}

const timeline = new Timeline()
window.timeline = timeline