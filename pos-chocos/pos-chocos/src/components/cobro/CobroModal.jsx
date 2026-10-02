import { calcularCambio } from '../../utils/cambio.js'

// TODO Dev 3: efectivo/tarjeta, "pago con", cambio -> pedidosRepo.registrar() -> limpiar carrito
export default function CobroModal({ total, onClose }) {
  const ejemplo = calcularCambio(total, total)
  return (
    <div className="fixed inset-0 grid place-items-center bg-black/40">
      <div className="rounded-xl bg-white p-6">
        TODO: CobroModal (Dev 3) — cambio de ejemplo: {ejemplo}
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  )
}
