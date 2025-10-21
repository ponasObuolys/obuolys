import { createRoot } from 'react-dom/client'
import { inject } from '@vercel/analytics'
import App from './App.tsx'
import './index.css'
import './App.css'
import { initializeSentry } from './utils/sentry'

// Initialize Sentry error tracking before app starts
initializeSentry();

// Initialize Vercel Web Analytics
inject();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found. Make sure your index.html contains a div with id='root'");
}

createRoot(rootElement).render(<App />);
