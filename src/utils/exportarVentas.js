import { fechaHora } from './format.js'
import { ventasPorDia, ventasPorCliente } from './stats.js'

// xlsx es una librería pesada; se carga solo cuando se exporta (code-splitting),
// para no abultar la carga inicial del POS en la tablet.
export async function exportarVentasExcel(pedidos, { desde, hasta } = {}) {
  const XLSX = await import('xlsx')
  const libro = XLSX.utils.book_new()

  const filasPedidos = pedidos.map((p) => ({
    Fecha: fechaHora(p.fecha),
    Cliente: p.cliente || 'Sin nombre',
    Bebidas: (p.items ?? []).map((i) => i.nombre).join(', '),
    Total: p.total,
    'Método de pago': p.metodoPago,
    'Pago con': p.pagoCon ?? '',
    Cambio: p.cambio ?? '',
    Notas: p.notas || ''
  }))
  const hojaPedidos = XLSX.utils.json_to_sheet(filasPedidos)
  hojaPedidos['!cols'] = [{ wch: 18 }, { wch: 20 }, { wch: 30 }, { wch: 10 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 24 }]
  XLSX.utils.book_append_sheet(libro, hojaPedidos, 'Pedidos')

  const hojaDia = XLSX.utils.json_to_sheet(
    ventasPorDia(pedidos).map((d) => ({ Día: d.clave, Total: d.total }))
  )
  XLSX.utils.book_append_sheet(libro, hojaDia, 'Por día')

  const hojaCliente = XLSX.utils.json_to_sheet(
    ventasPorCliente(pedidos).map((c) => ({ Cliente: c.clave, Total: c.total }))
  )
  XLSX.utils.book_append_sheet(libro, hojaCliente, 'Por cliente')

  const rango = desde && hasta ? `${desde}_a_${hasta}` : 'todas'
  XLSX.writeFile(libro, `ventas_chocopos_${rango}.xlsx`)
}
