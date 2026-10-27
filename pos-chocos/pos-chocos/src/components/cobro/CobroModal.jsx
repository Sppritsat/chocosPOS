
import { useState } from 'react'
import { pedidosRepo } from '../../db/repositories.js'
import { useCartStore } from '../../store/useCartStore.js'
import { useSessionStore } from '../../store/useSessionStore.js'
import { calcularCambio } from '../../utils/cambio.js'
import { moneda } from '../../utils/format.js'

export default function CobroModal({ total, onClose }) {
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [pagoCon, setPagoCon] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)

  const items = useCartStore((s) => s.items)
  const cliente = useCartStore((s) => s.cliente)
  const limpiar = useCartStore((s) => s.limpiar)
  const sesion = useSessionStore((s) => s.sesion)

  const importe = Number(pagoCon)
  const cambio = metodoPago === 'efectivo'
    ? calcularCambio(total, Number.isFinite(importe) ? importe : 0)
    : 0

  const confirmarCobro = async (event) => {
    event.preventDefault()
    setError('')

    if (!sesion || sesion.estado !== 'abierta') {
      setError('No hay una sesión de caja abierta.')
      return
    }

    if (!items.length) {
      setError('El carrito está vacío.')
      return
    }

    if (metodoPago === 'efectivo' &&
        (!pagoCon.trim() || !Number.isFinite(importe) || importe < total)) {
      setError('El pago recibido debe ser igual o mayor al total.')
      return
    }

    try {
      setCargando(true)

      await pedidosRepo.registrar({
        sesionId: sesion.id,
        cliente: cliente || 'Público general',
        items,
        total,
        metodoPago,
        pagoCon: metodoPago === 'efectivo' ? importe : total,
        cambio
      })

      limpiar()
      setExito(true)
    } catch (err) {
      console.error('Error al registrar el cobro:', err)
      setError('No se pudo registrar el cobro. Inténtalo de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-4">
      <section className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">
          {exito ? 'Cobro registrado' : 'Cobrar pedido'}
        </h2>

        {exito ? (
          <>
            <p className="mb-3 text-green-700">
              El pedido se registró correctamente.
            </p>
            <p>Total: {moneda(total)}</p>
            <p>Cambio: {moneda(cambio)}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-lg bg-green-700 p-3 font-semibold text-white"
            >
              Finalizar
            </button>
          </>
        ) : (
          <form onSubmit={confirmarCobro} className="space-y-4">
            <p className="text-2xl font-bold">{moneda(total)}</p>

            <label className="block">
              <span className="mb-1 block font-medium">Método de pago</span>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full rounded-lg border p-3"
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
              </select>
            </label>

            {metodoPago === 'efectivo' && (
              <>
                <label className="block">
                  <span className="mb-1 block font-medium">Pago recibido (MXN)</span>
                  <input
                    type="number"
                    min={total}
                    step="0.01"
                    required
                    value={pagoCon}
                    onChange={(e) => setPagoCon(e.target.value)}
                    className="w-full rounded-lg border p-3"
                    placeholder="Ej. 100.00"
                  />
                </label>
                <p className="font-medium">Cambio: {moneda(cambio)}</p>
              </>
            )}

            {metodoPago === 'tarjeta' && (
              <p className="text-sm text-gray-600">
                Registra el total como pago con tarjeta. Esta operación no procesa un cargo bancario.
              </p>
            )}

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={cargando}
                className="flex-1 rounded-lg border p-3"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={cargando}
                className="flex-1 rounded-lg bg-green-700 p-3 font-semibold text-white disabled:opacity-50"
              >
                {cargando ? 'Registrando...' : 'Confirmar cobro'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
