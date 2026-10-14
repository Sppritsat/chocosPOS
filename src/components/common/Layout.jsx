import { NavLink } from 'react-router-dom'
import { ShoppingCart, Wallet, Settings } from 'lucide-react'
import { useSessionStore } from '../../store/useSessionStore.js'

const link = ({ isActive }) =>
  `flex items-center gap-2 rounded-lg px-4 py-2 ${isActive ? 'bg-white text-choco-900' : 'text-white/80'}`

export default function Layout({ children }) {
  const estado = useSessionStore((s) => s.estadoCaja)
  return (
    <div className="min-h-screen bg-choco-50">
      <nav className="flex items-center gap-2 bg-choco-900 p-3">
        <NavLink to="/pos" className={link}><ShoppingCart size={18} /> Pedidos</NavLink>
        <NavLink to="/caja" className={link}><Wallet size={18} /> Caja</NavLink>
        <NavLink to="/admin" className={link}><Settings size={18} /> Admin</NavLink>
        <span className={`ml-auto rounded-full px-3 py-1 text-sm font-semibold ${estado === 'ABIERTA' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          Caja {estado}
        </span>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  )
}
