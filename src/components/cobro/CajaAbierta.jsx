import { useNavigate } from 'react-router-dom'
import { ShoppingCart, ClipboardList } from 'lucide-react'
import { moneda } from '../../utils/format.js'

export default function CajaAbierta({ sesion, onCerrarCaja }) {
  const navigate = useNavigate()

  return (
    <section className="mx-auto max-w-md rounded-2xl bg-marshmallow-surface p-6 text-center shadow-warmsm">
      <h2 className="mb-2 font-display text-2xl text-cacao-950">La caja está abierta</h2>
      <p className="mb-6 text-base text-cacao-950/60">Fondo inicial: {moneda(sesion.fondoInicial)}</p>

      <button
        onClick={() => navigate('/pos')}
        className="mb-3 flex w-full min-h-[64px] items-center justify-center gap-2 rounded-xl bg-canela-600 text-xl font-semibold text-marshmallow-50"
      >
        <ShoppingCart size={22} /> Empezar a tomar pedidos
      </button>

      <button
        onClick={onCerrarCaja}
        className="flex w-full min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 border-cacao-950/20 text-base font-medium text-cacao-950"
      >
        <ClipboardList size={18} /> Hacer arqueo y cerrar caja
      </button>
    </section>
  )
}
