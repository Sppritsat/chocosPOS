import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/common/Layout.jsx'
import PosPage from './pages/PosPage.jsx'
import CajaPage from './pages/CajaPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/pos" replace />} />
        <Route path="/pos" element={<PosPage />} />      {/* Dev 2 */}
        <Route path="/caja" element={<CajaPage />} />    {/* Dev 3 */}
        <Route path="/admin" element={<AdminPage />} />  {/* Dev 4 */}
      </Routes>
    </Layout>
  )
}
