#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

const distDir = resolve(process.cwd(), 'dist')
const assetsDir = resolve(distDir, 'assets')
const baseUrl = '/nuestro-universo'

const dataDir = resolve(process.cwd(), 'public/assets/data')
const imagesDir = resolve(process.cwd(), 'public/assets/images')
const audioDir = resolve(process.cwd(), 'public/assets/audio')

function copyDir(src, dest) {
  if (!existsSync(dest)) mkdirSync(dest, { recursive: true })
  const entries = readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = resolve(src, entry.name)
    const destPath = resolve(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      const data = readFileSync(srcPath)
      writeFileSync(destPath, data)
    }
  }
}

if (existsSync(dataDir)) copyDir(dataDir, resolve(assetsDir, 'data'))
if (existsSync(imagesDir)) copyDir(imagesDir, resolve(assetsDir, 'images'))
if (existsSync(audioDir)) copyDir(audioDir, resolve(assetsDir, 'audio'))

const faviconSrc = resolve(process.cwd(), 'public/favicon.svg')
if (existsSync(faviconSrc)) {
  writeFileSync(resolve(distDir, 'favicon.svg'), readFileSync(faviconSrc))
}

const htmlIndex = readFileSync(resolve(distDir, 'index.html'), 'utf-8')
const scriptMatch = htmlIndex.match(/<script[^>]*src="([^"]+)"/)
const jsPathFromHtml = scriptMatch ? scriptMatch[1] : '/nuestro-universo/assets/index.js'
const jsPath = jsPathFromHtml.startsWith(baseUrl) ? jsPathFromHtml : `${baseUrl}${jsPathFromHtml}`

const content404 = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nuestro Universo</title>
    <link rel="icon" type="image/svg+xml" href="${baseUrl}/favicon.svg" />
    <script>
      (function() {
        var path = window.location.pathname;
        if (path !== '/') {
          var hash = window.location.hash;
          if (hash) {
            window.location.hash = hash;
          } else {
            window.history.replaceState({}, '', '/');
            window.location.reload();
          }
        }
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${jsPath}"></script>
  </body>
</html>`

writeFileSync(resolve(distDir, '404.html'), content404)
console.log('404.html created')
console.log('Assets copied')