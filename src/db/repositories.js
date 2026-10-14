// Capa de acceso a datos. Las páginas y features NUNCA importan `db` directo: usan estos repos.
import { db } from './db.js'

export const productosRepo = {
  // Con tipo -> solo activos de ese tipo. Sin tipo -> todos (para el CRUD de admin).
  listar: (tipo) =>
    tipo ? db.productos.where('tipo').equals(tipo).and((p) => p.activo === 1).toArray() : db.productos.toArray(),
  crear: (p) => db.productos.add({ activo: 1, ...p }),
  actualizar: (id, cambios) => db.productos.update(id, cambios),
  activar: (id, activo) => db.productos.update(id, { activo: activo ? 1 : 0 }),
  eliminar: (id) => db.productos.update(id, { activo: 0 }) // borrado lógico
}

export const sesionesRepo = {
  abrir: (fondoInicial) =>
    db.sesiones_caja.add({
      fecha: new Date().toISOString(), fondoInicial: Number(fondoInicial),
      totalEfectivo: 0, totalTarjeta: 0, efectivoContado: null, diferencia: null, estado: 'ABIERTA'
    }),
  activa: () => db.sesiones_caja.where('estado').equals('ABIERTA').first(),
  obtener: (id) => db.sesiones_caja.get(id),
  cerrar: async (id, efectivoContado) => {
    const s = await db.sesiones_caja.get(id)
    const esperado = s.fondoInicial + s.totalEfectivo
    await db.sesiones_caja.update(id, {
      efectivoContado: Number(efectivoContado), diferencia: Number(efectivoContado) - esperado,
      estado: 'CERRADA', cierre: new Date().toISOString()
    })
    return db.sesiones_caja.get(id)
  },
  historial: () => db.sesiones_caja.orderBy('fecha').reverse().toArray()
}

export const pedidosRepo = {
  // Transacción atómica: guarda el pedido y suma al total de la sesión (efectivo o tarjeta).
  registrar: (pedido) =>
    db.transaction('rw', db.pedidos, db.sesiones_caja, async () => {
      const s = await db.sesiones_caja.get(pedido.sesionId)
      if (!s || s.estado !== 'ABIERTA') throw new Error('No hay una caja abierta')
      const id = await db.pedidos.add({ ...pedido, fecha: new Date().toISOString() })
      const campo = pedido.metodoPago === 'efectivo' ? 'totalEfectivo' : 'totalTarjeta'
      await db.sesiones_caja.update(s.id, { [campo]: s[campo] + pedido.total })
      return id
    }),
  porSesion: (sesionId) => db.pedidos.where('sesionId').equals(sesionId).toArray(),
  // fechas ISO, p. ej. '2026-10-14T00:00:00.000Z'
  entreFechas: (desdeISO, hastaISO) => db.pedidos.where('fecha').between(desdeISO, hastaISO, true, true).toArray(),
  todos: () => db.pedidos.toArray()
}

export const configRepo = {
  pin: async () => (await db.config.get('pinAdmin'))?.valor,
  guardarPin: (valor) => db.config.put({ clave: 'pinAdmin', valor })
}
