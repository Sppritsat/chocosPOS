
import { useState } from 'react'
import { sesionesRepo } from '../../db/repositories.js'
import { moneda } from '../../utils/format.js'

export default function ArqueoScreen({ sesion, onCerrarCaja }) {
  const [efectivoContado, setEfectivoContado] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const esperado =
    Number(sesion.fondoInicial) + Number(sesion.totalEfectivo)

  const contado = Number(efectivoContado)
  const diferencia = Number((contado - esperado).toFixed(2))

  const cerrarCaja = async (event) => {
    event.preventDefault()
    setError('')

    if (!sesion || sesion.estado !== 'abierta') {
      setError('No existe una sesión de caja abierta.')
      return
    }

    if (
      efectivoContado.trim() === '' ||
      !Number.isFinite(contado) ||
      contado < 0
    ) {
      setError('Ingresa un monto de efectivo contado válido.')
      return
    }

    try {
      setCargando(true)

      await sesionesRepo.cerrar(sesion.id, contado)

      const cerrada = {
        ...sesion,
        efectivoContado: Number(contado.toFixed(2)),
        diferencia,
        estado: 'cerrada',
        cierre: new Date().toISOString()
      }

      onCerrarCaja(cerrada)
    } catch (err) {
      console.error('Error al cerrar la caja:', err)

      setError(
        err instanceof Error
          ? `No se pudo cerrar la caja: ${err.message}`
          : 'No se pudo cerrar la caja por un error desconocido.'
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="mx-auto max-w-lg space-y-4 rounded-xl bg-white p-6 shadow">
      <h2 className="text-2xl font-bold">Arqueo de caja</h2>

      <div className="space-y-2 rounded-lg bg-gray-50 p-4">
        <p>Fondo inicial: {moneda(sesion.fondoInicial)}</p>
        <p>Ventas en efectivo: {moneda(sesion.totalEfectivo)}</p>
        <p>Ventas con tarjeta: {moneda(sesion.totalTarjeta)}</p>
        <hr />
        <p className="font-bold">
          Efectivo esperado: {moneda(esperado)}
        </p>
      </div>

      <form onSubmit={cerrarCaja} className="space-y-4">
        <label className="block">
          <span className="mb-1 block font-medium">
            Efectivo contado (MXN)
          </span>

          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={efectivoContado}
            onChange={(e) => setEfectivoContado(e.target.value)}
            disabled={cargando}
            className="w-full rounded-lg border p-3 disabled:bg-gray-100"
            placeholder="Ingresa el efectivo en caja"
          />
        </label>

        {efectivoContado !== '' &&
          Number.isFinite(contado) &&
          contado >= 0 && (
            <div className="rounded-lg bg-gray-50 p-4">
              <p>Efectivo contado: {moneda(contado)}</p>
              <p className="font-bold">
                Diferencia: {moneda(diferencia)}
              </p>
            </div>
          )}

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-lg bg-red-700 p-3 font-semibold text-white disabled:opacity-50"
        >
          {cargando ? 'Cerrando caja...' : 'Cerrar caja e imprimir corte'}
        </button>
      </form>
    </section>
  )
}
