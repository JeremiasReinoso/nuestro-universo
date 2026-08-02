class Gallery {
  constructor() {
    this.galleryElement = document.getElementById('gallery')
    this.lightbox = document.getElementById('lightbox')
    this.lightboxImg = document.getElementById('lightbox-img')
    this.lightboxCaption = document.querySelector('.lightbox-caption')
    this.galleryData = []
    
    this.init()
  }

  async init() {
    const data = await DataLoader.loadJSON('data/gallery.json')
    if (data && data.length > 0) {
      this.galleryData = data
      this.render()
    } else {
      this.galleryElement.innerHTML = '<div class="loading">No hay imágenes disponibles</div>'
    }
  }

  render() {
    if (!this.galleryElement) return
    
    this.galleryElement.innerHTML = this.galleryData.map(item => `
      <div class="polaroid" data-index="${item.id}" onclick="gallery.openLightbox(${item.id})">
        <img src="${item.src}" alt="${item.title}">
        <div class="polaroid-caption">${item.caption}</div>
      </div>
    `).join('')
  }

  openLightbox(index) {
    const item = this.galleryData[index - 1] || this.galleryData[0]
    if (!item) return
    
    this.lightbox.classList.add('active')
    this.lightboxImg.src = item.src
    this.lightboxCaption.textContent = item.title
    document.body.style.overflow = 'hidden'
  }

  closeLightbox() {
    this.lightbox.classList.remove('active')
    document.body.style.overflow = ''
  }
}

const gallery = new Gallery()
window.gallery = gallery

document.querySelectorAll('.lightbox .close, .lightbox').forEach(el => {
  if (el.classList.contains('lightbox')) {
    el.addEventListener('click', (e) => {
      if (e.target === el || e.target.classList.contains('close')) {
        gallery.closeLightbox()
      }
    })
  } else {
    el.addEventListener('click', () => gallery.closeLightbox())
  }
})