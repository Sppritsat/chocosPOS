import { useSessionStore } from '../store/useSessionStore.js'

// DEV 3 (Karlo): AperturaCaja / ArqueoScreen (src/features/register/).
// Placeholder temporal: permite abrir la caja para probar el flujo.
export default function CajaPage() {
  const { estadoCaja, abrirCaja } = useSessionStore()
  return (
    <section className="rounded-xl bg-white p-4 shadow">
      <p>TODO: Caja (Dev 3) — estado: {estadoCaja}</p>
      {estadoCaja === 'CERRADA' && (
        <button className="mt-2 rounded bg-choco-500 px-3 py-2 text-white" onClick={() => abrirCaja(500)}>
          Abrir caja de prueba ($500)
        </button>
      )}
    </section>
  )
}
