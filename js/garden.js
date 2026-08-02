class Garden {
  constructor() {
    this.gardenElement = document.getElementById('garden')
    this.flowersData = []
    
    this.init()
  }

  async init() {
    const data = await DataLoader.loadJSON('data/flowers.json')
    if (data && data.length > 0) {
      this.flowersData = data
      this.render()
    } else {
      this.gardenElement.innerHTML = '<div class="loading">Cargando flores...</div>'
    }
  }

  render() {
    if (!this.gardenElement) return
    
    this.flowersElement.innerHTML = this.flowersData.map(flower => `
      <div class="flower" style="
        background: ${flower.color};
        left: ${flower.position.x}%;
        top: ${flower.position.y}%;
      " onclick="garden.showMessage('${flower.message}')">
        <div class="flower-message">${flower.message}</div>
      </div>
    `).join('')
  }

  showMessage(message) {
    const toast = document.createElement('div')
    toast.className = 'flower-toast'
    toast.innerHTML = `
      <p>${message}</p>
      <button onclick="this.parentElement.remove()">✕</button>
    `
    document.body.appendChild(toast)
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove()
      }
    }, 5000)
  }
}

const garden = new Garden()
window.garden = garden