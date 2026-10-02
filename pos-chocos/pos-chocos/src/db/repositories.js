// Capa de acceso a datos: las páginas NUNCA importan `db` directamente.
import { db } from './db.js'

export const productosRepo = {
  listar: (tipo) => (tipo ? db.productos.where('tipo').equals(tipo).and(p => p.activo).toArray() : db.productos.toArray()),
  crear: (p) => db.productos.add({ activo: 1, ...p }),
  actualizar: (id, cambios) => db.productos.update(id, cambios),
  eliminar: (id) => db.productos.update(id, { activo: 0 }) // borrado lógico
}

export const sesionesRepo = {
  abrir: (fondoInicial) =>
    db.sesiones_caja.add({ fecha: new Date().toISOString(), fondoInicial, totalEfectivo: 0, totalTarjeta: 0, efectivoContado: null, diferencia: null, estado: 'abierta' }),
  activa: () => db.sesiones_caja.where('estado').equals('abierta').first(),
  cerrar: async (id, efectivoContado) => {
    const s = await db.sesiones_caja.get(id)
    const esperado = s.fondoInicial + s.totalEfectivo
    return db.sesiones_caja.update(id, { efectivoContado, diferencia: efectivoContado - esperado, estado: 'cerrada', cierre: new Date().toISOString() })
  }
}

export const pedidosRepo = {
  // Transacción: guarda pedido y actualiza totales de la sesión de forma atómica.
  registrar: (pedido) =>
    db.transaction('rw', db.pedidos, db.sesiones_caja, async () => {
      const id = await db.pedidos.add({ ...pedido, fecha: new Date().toISOString() })
      const campo = pedido.metodoPago === 'efectivo' ? 'totalEfectivo' : 'totalTarjeta'
      const s = await db.sesiones_caja.get(pedido.sesionId)
      await db.sesiones_caja.update(s.id, { [campo]: s[campo] + pedido.total })
      return id
    }),
  porSesion: (sesionId) => db.pedidos.where('sesionId').equals(sesionId).toArray(),
  entreFechas: (desdeISO, hastaISO) => db.pedidos.where('fecha').between(desdeISO, hastaISO).toArray()
}

export const configRepo = {
  pin: async () => (await db.config.get('pinAdmin'))?.valor,
  guardarPin: (valor) => db.config.put({ clave: 'pinAdmin', valor })
}
