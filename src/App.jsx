import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/common/Layout.jsx'
import PosPage from './pages/PosPage.jsx'
import CajaPage from './pages/CajaPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import { useCajaAbierta } from './hooks/useCajaAbierta.js'
import { useSessionStore } from './store/useSessionStore.js'
import { useToastStore } from './store/useToastStore.js'

function RequiereCaja({ children }) {
  const cargando = useSessionStore((s) => s.cargando)
  const abierta = useCajaAbierta()
  const mostrar = useToastStore((s) => s.mostrar)

  useEffect(() => {
    if (!cargando && !abierta) mostrar('Debes abrir la caja antes de tomar pedidos', 'error')
  }, [cargando, abierta]) // eslint-disable-line

  if (cargando) return <p>Cargando…</p>
  return abierta ? children : <Navigate to="/caja" replace />
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/pos" replace />} />
        <Route path="/pos" element={<RequiereCaja><PosPage /></RequiereCaja>} />
        <Route path="/caja" element={<CajaPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/pos" replace />} />
      </Routes>
    </Layout>
  )
}
