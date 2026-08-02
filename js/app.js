document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav')
  const menuToggle = document.getElementById('menu-toggle')
  const scrollTop = document.getElementById('scroll-top')
  const progressFill = document.getElementById('progress-fill')

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active')
    })
    
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active')
      })
    })
  }

  window.addEventListener('scroll', () => {
    if (scrollTop) {
      if (window.scrollY > 500) {
        scrollTop.classList.add('visible')
      } else {
        scrollTop.classList.remove('visible')
      }
    }
    
    if (progressFill) {
      const scrollTopValue = window.scrollY
      const docHeight = document.body.scrollHeight - window.innerHeight
      const scrolled = (scrollTopValue / docHeight) * 100
      progressFill.style.width = scrolled + '%'
    }
  })

  if (scrollTop) {
    scrollTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in')
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '-50px 0px'
  })

  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section)
  })

  const smoothedElements = document.querySelectorAll('[data-smooth-scroll]')
  smoothedElements.forEach(el => {
    el.style.cursor = 'pointer'
    el.addEventListener('click', (e) => {
      e.preventDefault()
      const targetId = el.getAttribute('data-smooth-scroll')
      const target = document.getElementById(targetId)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    })
  })
})