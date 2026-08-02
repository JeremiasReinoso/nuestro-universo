class IntroScene {
  constructor() {
    this.introScreen = document.getElementById('intro-screen')
    this.heartSvg = document.getElementById('heart-svg')
    this.title = document.getElementById('intro-title')
    this.enterBtn = document.getElementById('enter-btn')
    this.mainContent = document.getElementById('main-content')
    this.isAnimating = false

    this.init()
  }

  init() {
    this.enterBtn.addEventListener('click', () => this.startTransition())
    this.playIntroAnimation()
  }

  playIntroAnimation() {
    const tl = gsap.timeline()

    tl.to({}, { duration: 1, ease: 'none' })

    this.heartSvg.style.opacity = '1'
    this.heartSvg.style.transform = 'scale(0.5)'
    gsap.to(this.heartSvg, {
      duration: 0.8,
      scale: 1,
      ease: 'back.out(1.7)',
      opacity: 1
    })

    gsap.to('.heart-path', {
      duration: 2,
      attr: {
        strokeDasharray: 200,
        strokeDashoffset: 0
      },
      ease: 'power2.inOut'
    })

    this.animateHeartBeat()
  }

  animateHeartBeat() {
    gsap.to(this.heartSvg, {
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      scale: 1.05
    })

    gsap.to('.heart-path', {
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      attr: {
        strokeWidth: 3.5
      }
    })

    gsap.fromTo('.glow', {
      opacity: 0,
      scale: 0
    }, {
      opacity: 0.3,
      scale: 5,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  async startTransition() {
    if (this.isAnimating) return
    this.isAnimating = true

    this.enterBtn.style.display = 'none'

    const particles = []
    const particleCount = 150
    const heartBounds = this.heartSvg.getBoundingClientRect()
    const centerX = heartBounds.left + heartBounds.width / 2
    const centerY = heartBounds.top + heartBounds.height / 2

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 60
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance
      particles.push({ x, y, angle, speed: 0.5 + Math.random() * 1.5 })
    }

    this.title.style.opacity = '0'
    this.title.style.transform = 'translateY(20px)'

    await gsap.to(this.heartSvg, {
      duration: 0.5,
      opacity: 0,
      scale: 0.8,
      ease: 'power2.in'
    })

    const particleDiv = document.createElement('div')
    particleDiv.className = 'particle-explosion'
    particleDiv.innerHTML = ''
    this.introScreen.appendChild(particleDiv)

    for (const p of particles) {
      const div = document.createElement('div')
      div.className = 'explosion-particle'
      div.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        width: ${4 + Math.random() * 4}px;
        height: ${4 + Math.random() * 4}px;
        background: radial-gradient(circle, #ff00ff 0%, #ff0080 70%, transparent 100%);
        border-radius: 50%;
        opacity: 1;
        filter: blur(1px);
        box-shadow: 0 0 15px #ff00ff;
      `
      particleDiv.appendChild(div)

      gsap.to(div, {
        duration: 2 + Math.random() * 2,
        x: p.x * 80,
        y: p.y * 80 - 100,
        opacity: 0,
        scale: 0.3,
        ease: 'power2.out'
      })
    }

    gsap.to(this.introScreen, {
      duration: 2,
      opacity: 0,
      ease: 'power2.inOut',
      onComplete: () => {
        this.introScreen.style.display = 'none'
        this.mainContent.style.display = 'block'
        document.body.style.background = 'radial-gradient(circle at 50% 50%, #0a0a1a 0%, #08081a 40%, #000000 100%)'
        this.startCanvas()
      }
    })
  }

  startCanvas() {
    if (document.getElementById('particle-canvas')) {
      setTimeout(() => {
        if (window.particleBackground) {
          window.particleBackground.init()
        }
      }, 500)
    }
  }
}

let introScene

document.addEventListener('DOMContentLoaded', () => {
  const canvasContainer = document.getElementById('particle-canvas')
  if (canvasContainer) {
    canvasContainer.style.display = 'none'
  }

  gsap.registerPlugin(ScrollTrigger)

  introScene = new IntroScene()
  window.introScene = introScene
})

window.startIntro = function() {
  if (!introScene) {
    introScene = new IntroScene()
    window.introScene = introScene
  }
}