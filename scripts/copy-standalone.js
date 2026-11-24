const fs = require('fs')
const path = require('path')

const staticSrc = path.join(__dirname, '..', '.next', 'static')
const staticDest = path.join(__dirname, '..', '.next', 'standalone', '.next', 'static')
const publicSrc = path.join(__dirname, '..', 'public')
const publicDest = path.join(__dirname, '..', '.next', 'standalone', 'public')

try {
  if (fs.existsSync(staticSrc)) {
    fs.mkdirSync(path.dirname(staticDest), { recursive: true })
    fs.cpSync(staticSrc, staticDest, { recursive: true, force: true })
  }
  if (fs.existsSync(publicSrc)) {
    fs.mkdirSync(publicDest, { recursive: true })
    fs.cpSync(publicSrc, publicDest, { recursive: true, force: true })
  }
  console.log('✓ Standalone assets bundled successfully.')
} catch (err) {
  console.warn('Note on standalone asset copy:', err.message)
}
