class DataLoader {
  constructor() {
    this.cache = new Map()
  }

  async loadJSON(path) {
    if (this.cache.has(path)) {
      return this.cache.get(path)
    }

    try {
      const response = await fetch(path)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      this.cache.set(path, data)
      return data
    } catch (error) {
      console.error(`Error loading ${path}:`, error)
      return null
    }
  }

  async loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  clearCache() {
    this.cache.clear()
  }
}

window.DataLoader = new DataLoader()