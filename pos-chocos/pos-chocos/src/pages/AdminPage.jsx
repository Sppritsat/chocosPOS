import { useSessionStore } from '../store/useSessionStore.js'
import PinGate from '../components/admin/PinGate.jsx'
import CatalogManager from '../components/admin/CatalogManager.jsx'
import SalesDashboard from '../components/admin/SalesDashboard.jsx'

// DEV 4: panel de administradora
export default function AdminPage() {
  const ok = useSessionStore(s => s.adminAutenticado)
  if (!ok) return <PinGate />
  return (
    <div className="grid gap-4">
      <CatalogManager />
      <SalesDashboard />
    </div>
  )
}
