import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/* Point d'entrée React : l'application est montée dans la div #root du fichier index.html. */
createRoot(document.getElementById('root')).render(
  /* StrictMode signale plus vite les erreurs possibles pendant le développement. */
  <StrictMode>
    <App />
  </StrictMode>,
)
