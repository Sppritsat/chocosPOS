import { useEffect, useState } from 'react'
import { pedidosRepo } from '../../db/repositories.js'
import { ventasPorDia, ventasPorCliente, totalGeneral, totalPorMetodo } from '../../utils/stats.js'
import { moneda } from '../../utils/format.js'

const hoyISO = () => new Date().toISOString().slice(0, 10)

export default function SalesDashboard() {
  const [desde, setDesde] = useState(hoyISO())
  const [hasta, setHasta] = useState(hoyISO())
  const [pedidos, setPedidos] = useState([])

  const buscar = async () => {
    const data = await pedidosRepo.entreFechas(`${desde}T00:00:00.000Z`, `${hasta}T23:59:59.999Z`)
    setPedidos(data)
  }
  useEffect(() => { buscar() }, []) // eslint-disable-line

  return (
    <section className="rounded-2xl bg-marshmallow-surface p-6 shadow-warmsm">
      <h2 className="mb-5 font-display text-2xl text-cacao-950">Ventas</h2>

      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm text-cacao-950/60">Desde</label>
          <input type="date" className="rounded-lg border-2 border-canela-600/30 bg-marshmallow-surface p-2 text-cacao-950" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-cacao-950/60">Hasta</label>
          <input type="date" className="rounded-lg border-2 border-canela-600/30 bg-marshmallow-surface p-2 text-cacao-950" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </div>
        <button onClick={buscar} className="min-h-[44px] rounded-xl bg-canela-600 px-5 font-semibold text-marshmallow-50">Buscar</button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-marshmallow-100 p-4">
          <p className="text-sm text-cacao-950/60">Total</p>
          <p className="font-display text-2xl text-cacao-950">{moneda(totalGeneral(pedidos))}</p>
        </div>
        <div className="rounded-xl bg-marshmallow-100 p-4">
          <p className="text-sm text-cacao-950/60">Efectivo</p>
          <p className="font-display text-2xl text-cacao-950">{moneda(totalPorMetodo(pedidos, 'efectivo'))}</p>
        </div>
        <div className="rounded-xl bg-marshmallow-100 p-4">
          <p className="text-sm text-cacao-950/60">Tarjeta</p>
          <p className="font-display text-2xl text-cacao-950">{moneda(totalPorMetodo(pedidos, 'tarjeta'))}</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 font-display text-lg text-cacao-950">Por día</h3>
          <ul className="divide-y divide-cacao-950/10 text-base text-cacao-950">
            {ventasPorDia(pedidos).map((d) => (
              <li key={d.clave} className="flex justify-between py-2"><span>{d.clave}</span><span>{moneda(d.total)}</span></li>
            ))}
            {pedidos.length === 0 && <p className="py-2 text-cacao-950/50">Sin ventas en el rango.</p>}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-display text-lg text-cacao-950">Por cliente</h3>
          <ul className="divide-y divide-cacao-950/10 text-base text-cacao-950">
            {ventasPorCliente(pedidos).map((c) => (
              <li key={c.clave} className="flex justify-between py-2"><span>{c.clave}</span><span>{moneda(c.total)}</span></li>
            ))}
            {pedidos.length === 0 && <p className="py-2 text-cacao-950/50">Sin ventas en el rango.</p>}
          </ul>
        </div>
      </div>
    </section>
  )
}
