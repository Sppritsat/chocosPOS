import { diaISO } from './format.js'

const sumarPor = (pedidos, keyFn) =>
  Object.entries(pedidos.reduce((a, p) => ({ ...a, [keyFn(p)]: (a[keyFn(p)] ?? 0) + p.total }), {}))
    .map(([clave, total]) => ({ clave, total }))
    .sort((a, b) => b.total - a.total)

export const ventasPorDia = (pedidos) => sumarPor(pedidos, (p) => diaISO(p.fecha))
export const ventasPorCliente = (pedidos) => sumarPor(pedidos, (p) => p.cliente || 'Sin nombre')
export const totalGeneral = (pedidos) => pedidos.reduce((t, p) => t + p.total, 0)
export const totalPorMetodo = (pedidos, metodo) => pedidos.filter((p) => p.metodoPago === metodo).reduce((t, p) => t + p.total, 0)
