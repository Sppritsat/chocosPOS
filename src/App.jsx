import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/common/Layout.jsx'
import PosPage from './pages/PosPage.jsx'     // Dev 2
import CajaPage from './pages/CajaPage.jsx'   // Dev 3
import AdminPage from './pages/AdminPage.jsx' // Dev 4
import { useCajaAbierta } from './hooks/useCajaAbierta.js'
import { useSessionStore } from './store/useSessionStore.js'

// El POS solo se desbloquea con la caja abierta.
function RequiereCaja({ children }) {
  const cargando = useSessionStore((s) => s.cargando)
  const abierta = useCajaAbierta()
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
