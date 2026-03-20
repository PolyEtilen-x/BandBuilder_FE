import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import "@/styles/styles/reset.css"
import "@/styles/styles/global.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
