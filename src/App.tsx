import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { HiMusicNote, HiHeart, HiStar } from 'react-icons/hi'
import { AiOutlineStar } from 'react-icons/ai'

const DATA_PATH = '/assets/data/'

interface Letter {
  id: number
  title: string
  date: string
  content: string
  sender: string
  revealed: boolean
}

interface Song {
  id: number
  title: string
  src: string
  artist: string
  duration: number
}

interface Config {
  title: string
  description: string
  author: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  musicVolume: number
  revealSecrets: boolean
}

function useData<T>(filename: string): T | null {
  const [data, setData] = useState<T | null>(null)

  useEffect(() => {
    fetch(DATA_PATH + filename)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(`Error loading ${filename}:`, err))
  }, [filename])

  return data
}

interface SectionProps {
  id: string
  title: string
  children: React.ReactNode
}

const Section: React.FC<SectionProps> = ({ id, title, children }) => (
  <section
    id={id}
    className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
  >
    <motion.div
      className="max-w-4xl mx-auto text-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">
        {title}
      </h2>
      {children}
    </motion.div>
  </section>
)

const HeartParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    for (let i = 0; i < 20; i++) {
      const heart = document.createElement('div')
      heart.className = 'w-4 h-4 text-red-400 animate-pulse'
      heart.style.animationDelay = `${Math.random() * 2}s`
      heart.style.animationDuration = `${1 + Math.random() * 2}s`
      container.appendChild(heart)
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />
}

const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const songs = useData<Song[]>('songs.json')
  const currentSong = songs?.[0]

  if (!currentSong) return null

  useEffect(() => {
    const savedVolume = localStorage.getItem('musicVolume')
    if (savedVolume && savedVolume) {
      const vol = parseFloat(savedVolume)
      setVolume(vol)
      if (audioRef.current) {
        audioRef.current.volume = vol
      }
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    setVolume(vol)
    localStorage.setItem('musicVolume', vol.toString())
    if (audioRef.current) {
      audioRef.current.volume = vol
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-black/50 backdrop-blur-sm rounded-full p-4 flex items-center gap-4">
      <HiMusicNote className="text-2xl text-red-400" />
      <span className="hidden sm:block text-sm text-white/80">
        {currentSong.title}
      </span>
      <div className="flex items-center gap-2">
        <HiMusicNote
          className={`text-xl cursor-pointer transition-colors ${
            isPlaying ? 'text-green-400' : 'text-red-400'
          }`}
          onClick={togglePlay}
        />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-20"
        />
      </div>
      <audio ref={audioRef} src={currentSong.src} loop />
    </div>
  )
}

const LettersReveal: React.FC = () => {
  const [revealedCount, setRevealedCount] = useState(0)
  const letters = useData<Letter[]>('letters.json')

  useEffect(() => {
    const savedCount = localStorage.getItem('revealedLetters')
    if (savedCount && letters) {
      setRevealedCount(parseInt(savedCount))
    }
  }, [letters])

  const revealAll = () => {
    if (!letters) return
    const newCount = letters.length
    setRevealedCount(newCount)
    localStorage.setItem('revealedLetters', newCount.toString())
  }

  if (!letters) return <div className="text-center">Cargando cartas...</div>

  return (
    <div className="space-y-6">
      <button
        onClick={revealAll}
        className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full font-semibold transition-colors shadow-lg"
      >
        Revelar todas mis cartas
      </button>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {letters.map((letter, index) => (
          <motion.div
            key={letter.id}
            className="bg-black/30 rounded-lg p-4 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={revealedCount > index ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.9 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3 className="text-xl font-bold text-red-400">{letter.title}</h3>
            <p className="text-sm text-gray-400">{letter.date}</p>
            <p className="mt-2 text-white/90 whitespace-pre-line">{letter.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const Timeline: React.FC = () => {
  const timeline = useData<{ id: number; date: string; title: string; description: string }[]>('timeline.json')

  if (!timeline) return <div className="text-center">Cargando línea de tiempo...</div>

  return (
    <div className="relative">
      <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-red-400/30 rounded-full" />
      <div className="space-y-12">
        {timeline.map((item, index) => (
          <motion.div
            key={item.id}
            className="flex items-center"
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            style={{ justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end' }}
          >
            <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
              <div className="inline-block w-12 h-12 bg-red-400 rounded-full flex items-center justify-center mb-2">
                <HiStar className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white">{item.title}</h3>
              <p className="text-red-400 font-semibold">{item.date}</p>
              <p className="text-gray-300 mt-2">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const Gallery: React.FC = () => {
  const gallery = useData<{ id: number; title: string; src: string; caption: string; date: string }>('gallery.json')

  if (!gallery) return <div className="text-center">Cargando galería...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gallery.map((item) => (
        <motion.div
          key={item.id}
          className="relative group cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="aspect-square rounded-lg overflow-hidden bg-black/30">
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-bold text-white">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.caption}</p>
            <p className="text-xs text-gray-500">{item.date}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const Quotes: React.FC = () => {
  const quotes = useData<{ id: number; text: string; author: string }>('quotes.json')
  const [currentQuote, setCurrentQuote] = useState(0)

  if (!quotes || quotes.length === 0) return <div className="text-center">Cargando frases...</div>

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [quotes.length])

  return (
    <div className="max-w-2xl mx-auto text-center">
      <motion.div
        key={currentQuote}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <AiOutlineStar className="text-4xl text-red-400/50 mx-auto mb-6" />
        <p className="text-xl md:text-2xl italic text-white/90 mb-4">"{quotes[currentQuote].text}"</p>
        <p className="text-right text-gray-400">— {quotes[currentQuote].author}</p>
      </motion.div>
      <div className="flex justify-center gap-2 mt-6">
        {quotes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuote(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentQuote ? 'bg-red-400' : 'bg-gray-500/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

const Reasons: React.FC = () => {
  const reasons = useData<{ id: number; text: string; author: string }>('reasons.json')

  if (!reasons || reasons.length === 0) return <div className="text-center">Cargando razones...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reasons.map((reason) => (
        <motion.div
          key={reason.id}
          className="bg-black/30 rounded-lg p-6 backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: reason.id * 0.1 }}
        >
          <div className="flex items-start gap-3">
            <HiHeart className="text-2xl text-red-400 flex-shrink-0 mt-1" />
            <p className="text-white/90">{reason.text}</p>
          </div>
          <p className="mt-3 text-sm text-gray-400">— {reason.author}</p>
        </motion.div>
      ))}
    </div>
  )
}

const Flowers: React.FC = () => {
  const flowers = useData<{ id: number; name: string; color: string; message: string }>('flowers.json')

  if (!flowers || flowers.length === 0) return <div className="text-center">Cargando flores...</div>

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {flowers.map((flower) => (
        <motion.div
          key={flower.id}
          className="flex flex-col items-center p-4 bg-black/30 rounded-lg backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
        >
          <div
            className="w-16 h-16 rounded-full"
            style={{ backgroundColor: flower.color }}
          />
          <h3 className="mt-2 text-lg font-bold text-white">{flower.name}</h3>
          <p className="text-sm text-gray-400">{flower.message}</p>
        </motion.div>
      ))}
    </div>
  )
}

const Promises: React.FC = () => {
  const promises = useData<{ id: number; text: string; date: string }>('promises.json')

  if (!promises || promises.length === 0) return <div className="text-center">Cargando promesas...</div>

  return (
    <div className="space-y-6">
      {promises.map((promise) => (
        <motion.div
          key={promise.id}
          className="border-l-4 border-red-400 pl-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: promise.id * 0.2 }}
        >
          <p className="text-xl text-white/90">{promise.text}</p>
          <p className="mt-2 text-sm text-gray-400">{promise.date}</p>
        </motion.div>
      ))}
    </div>
  )
}

const DailyMessages: React.FC = () => {
  const messages = useData<{ id: number; message: string; date: string }>('dailyMessages.json')

  if (!messages || messages.length === 0) return <div className="text-center">Cargando mensaje...</div>

  const [currentMessage, setCurrentMessage] = useState(0)

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * messages.length)
    setCurrentMessage(randomIndex)
  }, [messages.length])

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        key={currentMessage}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl p-8 backdrop-blur-sm text-center"
      >
        <HiStar className="text-3xl text-red-400 mx-auto mb-4" />
        <p className="text-2xl italic text-white/95">{messages[currentMessage].message}</p>
        <p className="mt-4 text-sm text-gray-400">{messages[currentMessage].date}</p>
      </motion.div>
    </div>
  )
}

const Hero: React.FC = () => {
  const config = useData<Config>('config.json')
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const y = useTransform(scrollY, [0, 500], ['0%', '-10%'])

  if (!config) return <div className="text-center">Cargando...</div>

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url("/assets/images/hero-bg.svg")',
          y,
        }}
      />
      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-display font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {config.title}
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {config.description}
        </motion.p>
        <motion.button
          className="px-8 py-4 bg-red-500 hover:bg-red-600 rounded-full text-xl font-bold transition-all shadow-2xl"
          onClick={() => {
            document.getElementById('letters')?.scrollIntoView({ behavior: 'smooth' })
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Comenzar nuestro viaje
        </motion.button>
        <HeartParticles />
      </motion.div>
    </section>
  )
}

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <Hero />

      <Section id="letters" title="Mis Cartas">
        <LettersReveal />
      </Section>

      <Section id="timeline" title="Nuestra Historia">
        <Timeline />
      </Section>

      <Section id="gallery" title="Momentos Especiales">
        <Gallery />
      </Section>

      <Section id="quotes" title="Frases Que Me Inspiran">
        <Quotes />
      </Section>

      <Section id="reasons" title="Razones Por Las Que Te Amo">
        <Reasons />
      </Section>

      <Section id="flowers" title="Flores Simbólicas">
        <Flowers />
      </Section>

      <Section id="promises" title="Promesas Para El Futuro">
        <Promises />
      </Section>

      <Section id="daily" title="Mensaje Del Día">
        <DailyMessages />
      </Section>

      <MusicPlayer />

      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-red-400 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 transition-colors"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          ↑
        </motion.button>
      )}
    </div>
  )
}

export default App