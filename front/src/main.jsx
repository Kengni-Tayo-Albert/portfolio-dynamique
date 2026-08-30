import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/* Point d'entree React : l'application est montee dans la div #root fournie par index.html. */
createRoot(document.getElementById('root')).render(
  /* StrictMode aide a detecter les effets de bord pendant le developpement. */
  <StrictMode>
    <App />
  </StrictMode>,
)
