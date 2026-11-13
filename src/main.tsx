import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setThemeColors } from './utils/setThemeColors'
import { initializeMetaTags } from './utils/setMetaTags'
import { registerAgencyHeader } from './utils/agencyHeader'
import { brandManifest, setupInstall } from './utils/installApp'

// Set theme colors from environment variables
setThemeColors()

// Send the agency (tenant) with every API request
registerAgencyHeader()

// Install as an app (home-screen icon with the agency's name)
setupInstall()
brandManifest()

// Initialize meta tags early with defaults (will be updated when config loads)
initializeMetaTags()

createRoot(document.getElementById('root')!).render(
    <App />
)
