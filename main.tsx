import '@fontsource-variable/bodoni-moda/opsz.css'
import '@fontsource-variable/bodoni-moda/opsz-italic.css'
import '@fontsource-variable/hanken-grotesk/wght.css'
import '@fontsource/ibm-plex-mono/400.css'
import './styles/global.css'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initSmoother } from './lib/motion'

initSmoother()
createRoot(document.getElementById('root')!).render(<App />)
