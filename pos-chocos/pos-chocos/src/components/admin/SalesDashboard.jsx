// DEV 4 (César) — CHOCO-11 / Jira CHOCO-17: Reportes de ventas y estadísticas diarias.
// Lee pedidos con pedidosRepo.entreFechas() y los procesa con utils/stats.js.
import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { pedidosRepo } from '../../db/repositories.js'
import { moneda } from '../../utils/format.js'
import {
  diaLocal, rangoISO, resumen, ventasPorDia, ventasPorCliente, ventasPorHora, productosMasVendidos
} from '../../utils/stats.js'

const hoyYMD = () => diaLocal(new Date().toISOString())
const haceDias = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return diaLocal(d.toISOString()) }
const inicioMes = () => { const d = new Date(); d.setDate(1); return diaLocal(d.toISOString()) }

const PERIODOS = [
  { id: 'hoy', label: 'Hoy', rango: () => [hoyYMD(), hoyYMD()] },
  { id: 'ayer', label: 'Ayer', rango: () => [haceDias(1), haceDias(1)] },
  { id: '7d', label: '7 días', rango: () => [haceDias(6), hoyYMD()] },
  { id: 'mes', label: 'Este mes', rango: () => [inicioMes(), hoyYMD()] }
]

function Tarjeta({ titulo, valor, sub }) {
  return (
    <div className="rounded-lg bg-choco-50 p-3">
      <p className="text-xs font-medium uppercase text-gray-500">{titulo}</p>
      <p className="text-2xl font-bold text-choco-900">{valor}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  )
}

// Barras horizontales simples con CSS (sin librerías extra)
function Barras({ datos, etiqueta, valor, formato = moneda }) {
  const max = Math.max(1, ...datos.map(valor))
  if (datos.length === 0) return <p className="text-sm text-gray-500">Sin datos en este periodo.</p>
  return (
    <ul className="grid gap-2">
      {datos.map((d, i) => (
        <li key={i} className="grid grid-cols-[minmax(90px,40%)_1fr_auto] items-center gap-2 text-sm">
          <span className="truncate" title={etiqueta(d)}>{etiqueta(d)}</span>
          <span className="h-3 rounded bg-choco-50">
            <span className="block h-3 rounded bg-choco-500" style={{ width: `${(valor(d) / max) * 100}%` }} />
          </span>
          <span className="text-right font-medium">{formato(valor(d))}</span>
        </li>
      ))}
    </ul>
  )
}

const nombreDia = (ymd) => {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function SalesDashboard() {
  const [periodo, setPeriodo] = useState('hoy')
  const [desde, setDesde] = useState(hoyYMD())
  const [hasta, setHasta] = useState(hoyYMD())

  const elegir = (p) => { const [a, b] = p.rango(); setPeriodo(p.id); setDesde(a); setHasta(b) }

  const pedidos = useLiveQuery(() => {
    if (!desde || !hasta || desde > hasta) return []
    return pedidosRepo.entreFechas(...rangoISO(desde, hasta))
  }, [desde, hasta]) ?? []

  const r = resumen(pedidos)
  const porDia = ventasPorDia(pedidos)
  const porCliente = ventasPorCliente(pedidos).slice(0, 8)
  const top = productosMasVendidos(pedidos, 5)
  const porHora = ventasPorHora(pedidos).filter(h => h.pedidos > 0)

  const input = 'rounded-lg border border-gray-300 p-2'

  return (
    <section className="rounded-xl bg-white p-4 shadow">
      <h2 className="mb-3 text-lg font-bold text-choco-900">Reportes de ventas</h2>

      {/* Selector de periodo */}
      <div className="mb-4 flex flex-wrap items-end gap-2">
        {PERIODOS.map(p => (
          <button key={p.id} onClick={() => elegir(p)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${periodo === p.id ? 'bg-choco-900 text-white' : 'bg-choco-50 text-choco-900'}`}>
            {p.label}
          </button>
        ))}
        <label className="text-xs text-gray-600">Desde
          <input type="date" className={input + ' block'} value={desde} max={hasta}
            onChange={e => { setDesde(e.target.value); setPeriodo('custom') }} />
        </label>
        <label className="text-xs text-gray-600">Hasta
          <input type="date" className={input + ' block'} value={hasta} min={desde}
            onChange={e => { setHasta(e.target.value); setPeriodo('custom') }} />
        </label>
      </div>

      {/* Indicadores */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tarjeta titulo="Ventas totales" valor={moneda(r.total)} sub={`${r.numPedidos} pedido(s)`} />
        <Tarjeta titulo="Ticket promedio" valor={moneda(r.ticketPromedio)} sub={`${r.bebidas} bebida(s)`} />
        <Tarjeta titulo="Efectivo" valor={moneda(r.efectivo)} />
        <Tarjeta titulo="Tarjeta" valor={moneda(r.tarjeta)} />
      </div>

      {r.numPedidos === 0 ? (
        <p className="rounded-lg bg-choco-50 p-6 text-center text-gray-500">No hay ventas registradas en este periodo.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-semibold text-choco-900">Ventas por día</h3>
            <Barras datos={porDia} etiqueta={d => nombreDia(d.clave)} valor={d => d.total} />
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-choco-900">Ventas por cliente</h3>
            <Barras datos={porCliente} etiqueta={d => d.clave} valor={d => d.total} />
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-choco-900">Bebidas más vendidas</h3>
            <Barras datos={top} etiqueta={d => d.clave} valor={d => d.cantidad} formato={n => `${n} u.`} />
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-choco-900">Horas con más ventas</h3>
            <Barras datos={porHora} etiqueta={d => `${String(d.clave).padStart(2, '0')}:00`} valor={d => d.total} />
          </div>
        </div>
      )}
    </section>
  )
}
