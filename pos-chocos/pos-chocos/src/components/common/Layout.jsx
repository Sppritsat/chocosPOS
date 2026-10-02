import { NavLink } from 'react-router-dom'
const link = ({ isActive }) =>
  `px-4 py-2 rounded-lg ${isActive ? 'bg-white text-choco-900' : 'text-white/80'}`

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-choco-50">
      <nav className="flex gap-2 bg-choco-900 p-3">
        <NavLink to="/pos" className={link}>Pedidos</NavLink>
        <NavLink to="/caja" className={link}>Caja</NavLink>
        <NavLink to="/admin" className={link}>Admin</NavLink>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  )
}
