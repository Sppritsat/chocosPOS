import { moneda, fechaHora } from '../../utils/format.js'

export default function TicketCierre({ sesion, onListo }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl bg-marshmallow-surface p-6 shadow-warmsm">
      <h2 className="mb-5 text-center font-display text-3xl text-cacao-950">Ticket de cierre</h2>
      <div className="mb-5 space-y-2 text-lg text-cacao-950">
        <p className="text-base text-cacao-950/60">Apertura: {fechaHora(sesion.fecha)}</p>
        <p className="text-base text-cacao-950/60">Cierre: {fechaHora(sesion.cierre)}</p>
        <hr className="my-2 border-cacao-950/10" />
        <p className="flex justify-between"><span>Fondo inicial</span><span>{moneda(sesion.fondoInicial)}</span></p>
        <p className="flex justify-between"><span>Ventas efectivo</span><span>{moneda(sesion.totalEfectivo)}</span></p>
        <p className="flex justify-between"><span>Ventas tarjeta</span><span>{moneda(sesion.totalTarjeta)}</span></p>
        <p className="flex justify-between font-semibold"><span>Esperado en caja</span><span>{moneda(sesion.fondoInicial + sesion.totalEfectivo)}</span></p>
        <p className="flex justify-between"><span>Efectivo contado</span><span>{moneda(sesion.efectivoContado)}</span></p>
        <p className={`flex justify-between font-display text-2xl
          ${sesion.diferencia < 0 ? 'text-chile-600' : sesion.diferencia > 0 ? 'text-miel-600' : 'text-matcha-600'}`}>
          <span>Diferencia</span><span>{moneda(sesion.diferencia)}</span>
        </p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => window.print()} className="min-h-[56px] flex-1 rounded-xl border-2 border-cacao-950/20 text-lg font-medium text-cacao-950">
          Imprimir
        </button>
        <button onClick={onListo} className="min-h-[56px] flex-1 rounded-xl bg-canela-600 text-lg font-semibold text-marshmallow-50">
          Listo
        </button>
      </div>
    </div>
  )
}
