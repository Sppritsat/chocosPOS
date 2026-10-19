// DEV 4 (César): panel de administradora (CHOCO-9, 10, 11 / Jira CHOCO-15, 16, 17)
import { useState } from 'react'
import { useSessionStore } from '../store/useSessionStore.js'
import PinGate from '../components/admin/PinGate.jsx'
import CatalogManager from '../components/admin/CatalogManager.jsx'
import SalesDashboard from '../components/admin/SalesDashboard.jsx'
import CambiarPin from '../components/admin/CambiarPin.jsx'

const SECCIONES = [
  { id: 'reportes', label: 'Reportes' },
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'seguridad', label: 'Seguridad' }
]

export default function AdminPage() {
  const ok = useSessionStore(s => s.adminAutenticado)
  const setAdmin = useSessionStore(s => s.setAdmin)
  const [seccion, setSeccion] = useState('reportes')

  if (!ok) return <PinGate />

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {SECCIONES.map(s => (
            <button key={s.id} onClick={() => setSeccion(s.id)}
              className={`rounded-lg px-4 py-2 font-semibold ${seccion === s.id ? 'bg-choco-900 text-white' : 'bg-white text-choco-900 shadow'}`}>
              {s.label}
            </button>
          ))}
        </div>
        <button onClick={() => setAdmin(false)} className="rounded-lg bg-white px-4 py-2 text-sm text-red-700 shadow">
          Cerrar sesión admin
        </button>
      </div>

      {seccion === 'reportes' && <SalesDashboard />}
      {seccion === 'catalogo' && <CatalogManager />}
      {seccion === 'seguridad' && <CambiarPin />}
    </div>
  )
}
