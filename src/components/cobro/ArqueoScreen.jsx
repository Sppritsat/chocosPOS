import { useState } from 'react'
import { useSessionStore } from '../../store/useSessionStore.js'
import { moneda } from '../../utils/format.js'
import TicketCierre from './TicketCierre.jsx'

export default function ArqueoScreen({ sesion }) {
  const cerrarCaja = useSessionStore((s) => s.cerrarCaja)
  const [contado, setContado] = useState('')
  const [cerrada, setCerrada] = useState(null)

  const esperado = sesion.fondoInicial + sesion.totalEfectivo
  const diferencia = Number(contado) ? Number(contado) - esperado : null

  const cerrar = async () => {
    const resultado = await cerrarCaja(contado)
    setCerrada(resultado)
  }

  if (cerrada) return <TicketCierre sesion={cerrada} onListo={() => setCerrada(null)} />

  return (
    <section className="mx-auto max-w-md rounded-2xl bg-marshmallow-surface p-6 shadow-warmsm">
      <h2 className="mb-5 font-display text-3xl text-cacao-950">Arqueo y corte</h2>
      <div className="mb-5 space-y-2 text-lg text-cacao-950">
        <p className="flex justify-between"><span>Fondo inicial</span><span>{moneda(sesion.fondoInicial)}</span></p>
        <p className="flex justify-between"><span>Ventas efectivo</span><span>{moneda(sesion.totalEfectivo)}</span></p>
        <p className="flex justify-between"><span>Ventas tarjeta</span><span>{moneda(sesion.totalTarjeta)}</span></p>
        <p className="flex justify-between font-semibold"><span>Efectivo esperado</span><span>{moneda(esperado)}</span></p>
      </div>

      <label className="mb-2 block text-base text-cacao-950/60">Efectivo contado</label>
      <input
        type="number" inputMode="decimal" min="0" step="0.01"
        className="mb-3 w-full rounded-xl border-2 border-canela-600/30 bg-marshmallow-surface p-4 text-xl text-cacao-950 outline-none focus:border-canela-600"
        value={contado}
        onChange={(e) => setContado(e.target.value)}
      />
      {diferencia !== null && (
        <p className={`mb-5 text-lg font-semibold ${diferencia < 0 ? 'text-chile-600' : diferencia > 0 ? 'text-miel-600' : 'text-matcha-600'}`}>
          Diferencia: {moneda(diferencia)} {diferencia < 0 ? '(falta)' : diferencia > 0 ? '(sobra)' : '(exacto)'}
        </p>
      )}

      <button
        disabled={contado === ''}
        onClick={cerrar}
        className="w-full rounded-xl bg-chile-600 px-4 py-4 text-xl font-semibold text-marshmallow-50 disabled:opacity-40"
      >
        Cerrar caja
      </button>
    </section>
  )
}
