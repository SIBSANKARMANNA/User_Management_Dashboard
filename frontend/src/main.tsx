import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Modal from 'react-modal';

Modal.setAppElement('#root'); // add this line, once, before ReactDOM.render/createRoot

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
