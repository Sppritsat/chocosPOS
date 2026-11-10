import { useState } from 'react'
import { useCartStore } from '../../store/useCartStore.js'
import { moneda } from '../../utils/format.js'
import PrintLabelButton from './PrintLabelButton.jsx'
import CobroModal from '../cobro/CobroModal.jsx'

export default function CartPanel() {
  const { cliente, items, eliminar, total } = useCartStore()
  const [cobroAbierto, setCobroAbierto] = useState(false)

  return (
    <aside className="flex max-h-[calc(100vh-7rem)] flex-col gap-4 rounded-2xl bg-cacao-950 p-6 text-marshmallow-50 shadow-warm md:sticky md:top-20">
      <div>
        <p className="text-base text-marshmallow-50/60">Pedido de</p>
        <h2 className="font-display text-3xl">{cliente || 'un cliente'}</h2>
      </div>

      {items.length === 0 && (
        <p className="rounded-xl bg-marshmallow-50/10 p-4 text-center text-base text-marshmallow-50/60">
          Aún no hay bebidas agregadas.
        </p>
      )}

      <ul className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {items.map((item, i) => (
          <li key={i} className="rounded-xl border border-marshmallow-50/15 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-lg font-medium">{item.nombre}</p>
                <p className="text-base text-marshmallow-50/60">{item.leche}</p>
                <p className="text-sm text-marshmallow-50/45">
                  {(item.toppings ?? []).map((t) => t.nombre).join(', ') || 'sin toppings'}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-lg font-medium">{moneda(item.precio)}</p>
                <button className="mt-1 text-sm font-medium text-canela-200 underline-offset-2 hover:underline" onClick={() => eliminar(i)}>
                  Quitar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-marshmallow-50/15 pt-4">
        <div className="mb-4 flex items-baseline justify-between">
          <span className="text-lg text-marshmallow-50/60">Total</span>
          <span className="font-display text-4xl">{moneda(total())}</span>
        </div>
        <div className="flex flex-col gap-2">
          <PrintLabelButton />
          <button
            disabled={items.length === 0}
            onClick={() => setCobroAbierto(true)}
            className="rounded-xl bg-canela-600 px-4 py-4 text-xl font-semibold text-marshmallow-50 disabled:opacity-40"
          >
            Cobrar
          </button>
        </div>
      </div>

      {cobroAbierto && <CobroModal onClose={() => setCobroAbierto(false)} />}
    </aside>
  )
}
