import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Redirect vercel.app to the custom production domain to prevent Clerk subdomain allowlist issues
if (window.location.hostname.endsWith('.vercel.app')) {
  window.location.replace('https://digibookedu.in' + window.location.pathname + window.location.search + window.location.hash);
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
