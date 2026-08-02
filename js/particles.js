class ParticleBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.ctx = this.canvas.getContext('2d')
    this.particles = []
    this.animationId = null
    this.mouse = { x: 0, y: 0 }
    
    this.init()
  }

  init() {
    this.resize()
    this.createParticles(150)
    this.bindEvents()
    this.animate()
  }

  resize() {
    if (!this.canvas) return
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  createParticles(count) {
    this.particles = []
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        twinkle: Math.random() * 0.02
      })
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize()
      this.createParticles(150)
    })
    
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
    })
  }

  animate() {
    if (!this.canvas) return
    
    this.animationId = requestAnimationFrame(() => this.animate())
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    this.ctx.fillStyle = '#ffffff'
    this.ctx.strokeStyle = 'rgba(231, 76, 60, 0.3)'
    
    this.particles.forEach(particle => {
      particle.x += particle.speedX
      particle.y += particle.speedY
      particle.opacity += particle.twinkle
      if (particle.opacity > 0.8 || particle.opacity < 0.2) {
        particle.twinkle = -particle.twinkle
      }
      
      const dx = this.mouse.x - particle.x
      const dy = this.mouse.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 100) {
        const force = (100 - distance) / 100
        particle.x -= dx * force * 0.01
        particle.y -= dy * force * 0.01
      }
      
      this.ctx.globalAlpha = particle.opacity
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fill()
      
      if (distance < 80 && particle.size < 2) {
        this.ctx.beginPath()
        this.ctx.moveTo(particle.x, particle.y)
        this.ctx.lineTo(this.mouse.x, this.mouse.y)
        this.ctx.stroke()
      }
    })
    
    this.ctx.globalAlpha = 1
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (document.getElementById('particle-canvas')) {
      window.particleBackground = new ParticleBackground('particle-canvas')
    }
  }, 100)
})