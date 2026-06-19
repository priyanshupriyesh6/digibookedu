import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0WrapperProvider } from './context/auth0-wrapper'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0WrapperProvider>
      <App />
    </Auth0WrapperProvider>
  </StrictMode>,
)
