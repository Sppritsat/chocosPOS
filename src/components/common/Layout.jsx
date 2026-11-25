import { NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, Wallet, Settings } from 'lucide-react'
import { useSessionStore } from '../../store/useSessionStore.js'
import { useToastStore } from '../../store/useToastStore.js'
import ToastHost from './ToastHost.jsx'

export default function Layout({ children }) {
  const estado = useSessionStore((s) => s.estadoCaja)
  const mostrar = useToastStore((s) => s.mostrar)
  const navigate = useNavigate()
  const cajaAbierta = estado === 'ABIERTA'

  const irAPedidos = (e) => {
    if (!cajaAbierta) {
      e.preventDefault()
      mostrar('Debes abrir la caja antes de tomar pedidos', 'error')
      navigate('/caja')
    }
  }

  const link = ({ isActive }) =>
    `flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-5 py-2 sm:py-3 text-base sm:text-lg font-medium transition
     ${isActive ? 'bg-marshmallow-surface text-cacao-950' : 'text-marshmallow-50/70'}`

  return (
    <div className="min-h-screen bg-marshmallow-50">
      <ToastHost />
      <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-cacao-950 px-2 sm:px-4 py-2 sm:py-3">
        <span className="mr-2 hidden font-display text-xl text-marshmallow-50 sm:inline">ChocoPOS</span>
        <NavLink to="/pos" onClick={irAPedidos} className={link + (cajaAbierta ? '' : ' opacity-50')}>
          <ShoppingCart size={20} /> <span className="hidden sm:inline">Pedidos</span>
        </NavLink>
        <NavLink to="/caja" className={link}>
          <Wallet size={20} /> <span className="hidden sm:inline">Caja</span>
        </NavLink>
        <NavLink to="/admin" className={link}>
          <Settings size={20} /> <span className="hidden sm:inline">Admin</span>
        </NavLink>
        <span className={`ml-auto rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-semibold whitespace-nowrap
          ${cajaAbierta ? 'bg-matcha-600 text-marshmallow-50' : 'bg-chile-600 text-marshmallow-50'}`}>
          Caja {cajaAbierta ? 'abierta' : 'cerrada'}
        </span>
      </nav>
      <main className="p-3 sm:p-4">{children}</main>
    </div>
  )
}
