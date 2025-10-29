import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setThemeColors } from './utils/setThemeColors'

// Set theme colors from environment variables
setThemeColors()

createRoot(document.getElementById('root')!).render(
    <App />
)
