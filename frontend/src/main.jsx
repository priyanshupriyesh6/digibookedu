import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Redirect vercel.app and www subdomain to the custom production domain to prevent Clerk allowlist issues
const hostname = window.location.hostname;
if (hostname.endsWith('.vercel.app') || hostname === 'www.digibookedu.in') {
  window.location.replace('https://digibookedu.in' + window.location.pathname + window.location.search + window.location.hash);
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
