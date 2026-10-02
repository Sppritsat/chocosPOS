import { diaISO } from './format.js'

const sumarPor = (pedidos, keyFn) =>
  Object.entries(pedidos.reduce((a, p) => ({ ...a, [keyFn(p)]: (a[keyFn(p)] ?? 0) + p.total }), {}))
    .map(([clave, total]) => ({ clave, total }))

export const ventasPorDia = (pedidos) => sumarPor(pedidos, p => diaISO(p.fecha))
export const ventasPorCliente = (pedidos) => sumarPor(pedidos, p => p.cliente || 'Sin nombre')
