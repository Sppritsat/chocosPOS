import { useState } from 'react'
import { useCartStore } from '../../store/useCartStore.js'
import { useSessionStore } from '../../store/useSessionStore.js'
import { useToastStore } from '../../store/useToastStore.js'
import { pedidosRepo } from '../../db/repositories.js'
import { calcularCambio } from '../../utils/cambio.js'
import { moneda } from '../../utils/format.js'

const BILLETES = [50, 100, 200, 500]

export default function CobroModal({ onClose }) {
  const { cliente, notas, items, total, limpiar } = useCartStore()
  const { sesion, refrescarSesion } = useSessionStore()
  const mostrar = useToastStore((s) => s.mostrar)
  const [metodo, setMetodo] = useState('efectivo')
  const [pagoCon, setPagoCon] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito] = useState(false)

  const totalPedido = total()
  const cambio = metodo === 'efectivo' ? calcularCambio(totalPedido, Number(pagoCon) || 0) : 0
  const puedeCobrar = metodo === 'tarjeta' || Number(pagoCon) >= totalPedido

  const cobrar = async () => {
    setGuardando(true)
    try {
      await pedidosRepo.registrar({
        sesionId: sesion.id,
        cliente,
        notas,
        items,
        total: totalPedido,
        metodoPago: metodo,
        pagoCon: metodo === 'efectivo' ? Number(pagoCon) : totalPedido,
        cambio
      })
      await refrescarSesion()
      limpiar()
      setExito(true)
      mostrar('Pedido cobrado y registrado', 'success')
      setTimeout(onClose, 1200)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-cacao-950/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-marshmallow-surface p-6 shadow-warm">
        {exito ? (
          <p className="py-10 text-center font-display text-2xl text-matcha-600">Pedido registrado</p>
        ) : (
          <>
            <h2 className="mb-5 font-display text-3xl text-cacao-950">Cobrar {moneda(totalPedido)}</h2>

            <div className="mb-5 flex gap-3">
              {['efectivo', 'tarjeta'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMetodo(m)}
                  className={`min-h-[56px] flex-1 rounded-xl border-2 text-lg font-medium capitalize
                    ${metodo === m ? 'border-cacao-950 bg-cacao-950 text-marshmallow-50' : 'border-canela-600/30 text-cacao-950'}`}
                >
                  {m}
                </button>
              ))}
            </div>

            {metodo === 'efectivo' && (
              <>
                <div className="mb-4 flex flex-wrap gap-3">
                  {BILLETES.map((b) => (
                    <button key={b} className="min-h-[52px] rounded-xl border-2 border-canela-600/30 px-4 text-lg font-medium text-cacao-950" onClick={() => setPagoCon(String(b))}>
                      {moneda(b)}
                    </button>
                  ))}
                </div>
                <input
                  type="number" inputMode="decimal" min="0" step="0.01"
                  className="mb-4 w-full rounded-xl border-2 border-canela-600/30 bg-marshmallow-surface p-4 text-xl text-cacao-950 outline-none focus:border-canela-600"
                  placeholder="Pago con…"
                  value={pagoCon}
                  onChange={(e) => setPagoCon(e.target.value)}
                />
                <p className={`mb-5 font-display text-2xl ${cambio >= 0 && Number(pagoCon) >= totalPedido ? 'text-matcha-600' : 'text-cacao-950/30'}`}>
                  Cambio: {moneda(cambio)}
                </p>
              </>
            )}

            <div className="flex gap-3">
              <button onClick={onClose} className="min-h-[56px] flex-1 rounded-xl border-2 border-cacao-950/20 text-lg font-medium text-cacao-950">
                Cancelar
              </button>
              <button
                disabled={!puedeCobrar || guardando}
                onClick={cobrar}
                className="min-h-[56px] flex-1 rounded-xl bg-canela-600 text-lg font-semibold text-marshmallow-50 disabled:opacity-40"
              >
                {guardando ? 'Guardando…' : 'Confirmar cobro'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
