// Declaração global para evitar erro de tipo
declare global {
  interface Window {
    __TAURI__?: any;
  }
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Window } from '@tauri-apps/api/window'

// Impede que a janela seja escondida ao perder o foco (Tauri)
if (window.__TAURI__ !== undefined) {
  Window.getCurrent().listen('blur', () => {
    // Não faz nada ao perder o foco
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
