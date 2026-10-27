
import { useEffect, useState } from 'react'
import { useCartStore } from '../../store/useCartStore.js'
import { useSessionStore } from '../../store/useSessionStore.js'
import { moneda } from '../../utils/format.js'
import PrintLabelButton from './PrintLabelButton.jsx'
import CobroModal from '../cobro/CobroModal.jsx'

export default function CartPanel() {
  const [mostrarCobro, setMostrarCobro] = useState(false)

  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const sesion = useSessionStore((s) => s.sesion)
  const cargarSesion = useSessionStore((s) => s.cargarSesion)

  useEffect(() => {
    cargarSesion()
  }, [cargarSesion])

  const importeTotal = total()

  return (
    <>
      <aside className="rounded-xl bg-white p-4 shadow">
        <h2 className="font-bold">Pedido ({items.length})</h2>

        {items.length > 0 ? (
          <ul className="my-3 space-y-2">
            {items.map((item, index) => (
              <li
                key={`${item.productoId ?? item.nombre ?? 'producto'}-${index}`}
                className="flex justify-between gap-3 border-b pb-2"
              >
                <span>
                  {item.nombre ?? 'Producto'} × {item.cantidad}
                </span>
                <span>
                  {moneda(Number(item.precio) * Number(item.cantidad))}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="my-3 text-sm text-gray-500">
            Todavía no hay productos en el pedido.
          </p>
        )}

        <p className="mt-2 text-xl font-bold">
          Total: {moneda(importeTotal)}
        </p>

        <div className="mt-4">
          <PrintLabelButton />
        </div>

        <button
          type="button"
          onClick={() => setMostrarCobro(true)}
          disabled={!items.length || !sesion || sesion.estado !== 'abierta'}
          className="mt-4 w-full rounded-lg bg-green-700 p-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cobrar
        </button>

        {!sesion && (
          <p className="mt-2 text-sm text-red-700">
            Primero debes abrir la caja en la sección Caja.
          </p>
        )}
      </aside>

      {mostrarCobro && (
        <CobroModal
          total={importeTotal}
          onClose={() => setMostrarCobro(false)}
        />
      )}
    </>
  )
}
