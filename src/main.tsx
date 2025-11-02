import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setThemeColors } from './utils/setThemeColors'
import { initializeMetaTags } from './utils/setMetaTags'

// Set theme colors from environment variables
setThemeColors()

// Initialize meta tags early with defaults (will be updated when config loads)
initializeMetaTags()

createRoot(document.getElementById('root')!).render(
    <App />
)
