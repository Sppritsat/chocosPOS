
import { useState } from 'react'
import { sesionesRepo } from '../../db/repositories.js'
import { useSessionStore } from '../../store/useSessionStore.js'

export default function AperturaCaja() {
  const [fondoInicial, setFondoInicial] = useState('500')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const cargarSesion = useSessionStore((state) => state.cargarSesion)

  const abrirCaja = async (event) => {
    event.preventDefault()
    setError('')

    const fondo = Number(fondoInicial)

    if (fondoInicial.trim() === '' || !Number.isFinite(fondo) || fondo < 0) {
      setError('Ingresa un fondo inicial válido.')
      return
    }

    try {
      setCargando(true)
      await sesionesRepo.abrir(fondo)
      await cargarSesion()
    } catch (err) {
      console.error('Error al abrir la caja:', err)
      setError('No se pudo abrir la caja. Inténtalo nuevamente.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="mx-auto max-w-lg rounded-xl bg-white p-6 shadow">
      <h2 className="mb-2 text-2xl font-bold text-gray-800">
        Apertura de caja
      </h2>

      <p className="mb-6 text-sm text-gray-600">
        Ingresa el efectivo disponible al iniciar el turno.
      </p>

      <form onSubmit={abrirCaja} className="space-y-4">
        <div>
          <label
            htmlFor="fondoInicial"
            className="mb-1 block font-medium text-gray-700"
          >
            Fondo inicial (MXN)
          </label>

          <input
            id="fondoInicial"
            type="number"
            min="0"
            step="0.01"
            required
            value={fondoInicial}
            onChange={(event) => setFondoInicial(event.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            placeholder="Ej. 500.00"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargando ? 'Abriendo caja...' : 'Abrir caja'}
        </button>
      </form>
    </section>
  )
}
