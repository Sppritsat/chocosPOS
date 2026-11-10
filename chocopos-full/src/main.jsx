import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { seedIfEmpty } from './db/seed.js'
import { useSessionStore } from './store/useSessionStore.js'
import './index.css'

async function iniciar() {
  await seedIfEmpty()
  await useSessionStore.getState().cargarSesion()
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>
  )
}
iniciar()
