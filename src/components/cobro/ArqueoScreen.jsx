import { moneda } from '../../utils/format.js'

// TODO Dev 3: pedir efectivo contado, mostrar esperado vs contado vs diferencia, sesionesRepo.cerrar(), TicketCierre
export default function ArqueoScreen({ sesion }) {
  const esperado = sesion.fondoInicial + sesion.totalEfectivo
  return (
    <section className="rounded-xl bg-white p-4 shadow">
      <h2 className="font-bold">Arqueo</h2>
      <p>Efectivo esperado: {moneda(esperado)}</p>
    </section>
  )
}
