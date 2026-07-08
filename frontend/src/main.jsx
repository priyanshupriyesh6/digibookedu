import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Render a premium custom domain notice for Vercel URLs to prevent Clerk auth issues & avoid redirect loops
const hostname = window.location.hostname;
if (hostname.endsWith('.vercel.app')) {
  document.getElementById('root').innerHTML = `
    <div style="
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0a0b10 0%, #12131e 100%);
      color: white;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      text-align: center;
      padding: 2rem;
      margin: 0;
      box-sizing: border-box;
    ">
      <div style="
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(20px);
        padding: 3.5rem 2.5rem;
        border-radius: 32px;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1);
        max-width: 460px;
        width: 100%;
        animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      ">
        <div style="font-size: 3.5rem; margin-bottom: 1.5rem; filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.3));">🌐</div>
        <h1 style="font-size: 1.8rem; font-weight: 800; margin: 0 0 1rem 0; letter-spacing: -0.025em; background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          Custom Domain Required
        </h1>
        <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin: 0 0 2.5rem 0;">
          To secure your connection and enable authentication via Clerk, please access this portal using our custom domain.
        </p>
        <a href="https://digibookedu.in" style="
          display: inline-block;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          text-decoration: none;
          padding: 0.9rem 2.2rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.35);
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 15px 30px rgba(99, 102, 241, 0.55)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 10px 25px rgba(99, 102, 241, 0.35)';">
          Go to digibookedu.in →
        </a>
      </div>
    </div>
    <style>
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      body { margin: 0; padding: 0; background-color: #0a0b10; }
    </style>
  `;
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
