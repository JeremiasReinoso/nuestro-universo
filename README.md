# Nuestro Universo

Una experiencia romántica premium construida con HTML5, CSS3 y JavaScript puro.

## Tecnologías

- HTML5
- CSS3 (con animaciones y transiciones)
- JavaScript ES6
- Canvas API para fondo dinámico
- localStorage para persistencia
- JSON para datos

## Estructura del proyecto

```
/
├── index.html          # Página principal
├── css/
│   ├── style.css       # Estilos principales
│   ├── animations.css  # Animaciones CSS
│   └── responsive.css  # Media queries responsive
├── js/
│   ├── app.js          # Navegación y scroll
│   ├── canvas.js       # Canvas del fondo
│   ├── loader.js       # Cargador de datos JSON
│   ├── gallery.js      # Galería de imágenes
│   ├── timeline.js     # Línea de tiempo
│   ├── letters.js      # Cartas
│   ├── reasons.js      # Tarjetas de razones
│   ├── garden.js       # Jardín de flores
│   ├── music.js        # Reproductor de música
│   ├── messages.js     # Mensaje del día
│   ├── particles.js    # Partículas del fondo
│   ├── secrets.js      # Gestión de secretos
│   └── utils.js        # Utilidades
├── data/
│   ├── config.json     # Configuración
│   ├── letters.json    # Cartas
│   ├── timeline.json   # Línea de tiempo
│   ├── gallery.json    # Galería
│   ├── reasons.json    # Razones
│   ├── promises.json   # Promesas
│   ├── flowers.json    # Flores del jardín
│   ├── songs.json      # Canciones
│   └── dailyMessages.json # Mensajes del día
└── assets/
    ├── images/         # Imágenes
    ├── audio/          # Archivos de audio
    ├── videos/         # Videos
    ├── icons/          # Iconos SVG
    └── fonts/          # Fuentes
```

## Uso en GitHub Pages

1. Forkea o clona este repositorio
2. Suba los archivos a su repositorio de GitHub
3. En Settings → Pages → Configure Branch
   - Source: `main` branch (o `master`)
   - Directory: `/ (root)`
4. Su sitio estará disponible en: `https://usuario.github.io/repositorio`

## Personalización

Actualice los archivos JSON en la carpeta `/data/` para personalizar el contenido:

- **letters.json**: Cartas con formatos `{id, sender, date, subject, content, revealed}`
- **timeline.json**: Eventos cronológicos
- **gallery.json**: Fotos con `{id, title, src, caption}`
- **reasons.json**: Tarjetas con `{id, text, author}`
- **promises.json**: Promesas con `{id, text, date, revealed}`
- **flowers.json**: Flores del jardín con `{id, name, color, message, type, position}`
- **songs.json**: Canciones con `{id, title, src, artist, duration}`
- **dailyMessages.json**: Mensajes con `{id, message, date}`
- **config.json**: Configuración general

## Características

- ✅ Fondo dinámico con partículas y parallax
- ✅ Galería con vista tipo polaroid y lightbox
- ✅ Cartas con efecto de sobre interactivo
- ✅ Tarjetas de razones que se doblan
- ✅ Jardín interactivo con flores
- ✅ Reproductor de música integrado
- ✅ Mensaje del día automático
- ✅ Cuenta regresiva personalizable
- ✅ Scroll suave y animaciones fluidas
- ✅ Totalmente responsive
- ✅ Sin dependencias externas

## Desarrollo

Después de editar archivos:

1. Haga commit de los cambios
2. Push a la rama `main` (o `master`)
3. GitHub Pages se actualizará automáticamente

## Créditos

Inspirado en: Journey, Ori and the Blind Forest, Sky Children of the Light, Interstellar