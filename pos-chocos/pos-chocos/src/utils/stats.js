// DEV 4 (César) — CHOCO-11 / Jira CHOCO-17: procesamiento de métricas y reportes.
// Funciones puras: reciben un arreglo de pedidos y regresan datos listos para pintar.

// Día LOCAL (no UTC) en formato YYYY-MM-DD.
// Ojo: iso.slice(0,10) da el día en UTC; en México (UTC-6) una venta a las 7 pm
// se iría al día siguiente. Por eso aquí se calcula con la hora local.
export const diaLocal = (iso) => {
  const d = new Date(iso)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

// Rango [desde, hasta] en ISO para pedidosRepo.entreFechas(), a partir de fechas locales "YYYY-MM-DD"
export const rangoISO = (desdeYMD, hastaYMD) => {
  const [y1, m1, d1] = desdeYMD.split('-').map(Number)
  const [y2, m2, d2] = hastaYMD.split('-').map(Number)
  return [
    new Date(y1, m1 - 1, d1, 0, 0, 0, 0).toISOString(),
    new Date(y2, m2 - 1, d2, 23, 59, 59, 999).toISOString()
  ]
}

const sumarPor = (pedidos, keyFn) => {
  const mapa = {}
  for (const p of pedidos) {
    const k = keyFn(p)
    mapa[k] ??= { clave: k, total: 0, pedidos: 0 }
    mapa[k].total += p.total ?? 0
    mapa[k].pedidos += 1
  }
  return Object.values(mapa)
}

// Ventas agrupadas por día, ordenadas de la fecha más antigua a la más reciente
export const ventasPorDia = (pedidos) =>
  sumarPor(pedidos, p => diaLocal(p.fecha)).sort((a, b) => a.clave.localeCompare(b.clave))

// Ventas agrupadas por cliente, de mayor a menor total
export const ventasPorCliente = (pedidos) =>
  sumarPor(pedidos, p => (p.cliente || '').trim() || 'Sin nombre').sort((a, b) => b.total - a.total)

// Ventas por hora del día (0-23), útil para ver horas pico
export const ventasPorHora = (pedidos) => {
  const horas = Array.from({ length: 24 }, (_, h) => ({ clave: h, total: 0, pedidos: 0 }))
  for (const p of pedidos) {
    const h = new Date(p.fecha).getHours()
    horas[h].total += p.total ?? 0
    horas[h].pedidos += 1
  }
  return horas
}

// Productos (bebidas) más vendidos por cantidad
export const productosMasVendidos = (pedidos, limite = 5) => {
  const mapa = {}
  for (const p of pedidos) {
    for (const it of p.items ?? []) {
      const nombre = it.sabor ? `${it.nombre} · ${it.sabor}` : it.nombre || 'Producto'
      const cant = it.cantidad ?? 1
      mapa[nombre] ??= { clave: nombre, cantidad: 0, total: 0 }
      mapa[nombre].cantidad += cant
      mapa[nombre].total += (it.precio ?? 0) * cant
    }
  }
  return Object.values(mapa).sort((a, b) => b.cantidad - a.cantidad).slice(0, limite)
}

// Indicadores generales del periodo
export const resumen = (pedidos) => {
  const total = pedidos.reduce((s, p) => s + (p.total ?? 0), 0)
  const efectivo = pedidos.filter(p => p.metodoPago === 'efectivo').reduce((s, p) => s + (p.total ?? 0), 0)
  const tarjeta = pedidos.filter(p => p.metodoPago === 'tarjeta').reduce((s, p) => s + (p.total ?? 0), 0)
  const bebidas = pedidos.reduce((s, p) => s + (p.items ?? []).reduce((a, it) => a + (it.cantidad ?? 1), 0), 0)
  return {
    total,
    numPedidos: pedidos.length,
    ticketPromedio: pedidos.length ? total / pedidos.length : 0,
    efectivo,
    tarjeta,
    bebidas
  }
}
