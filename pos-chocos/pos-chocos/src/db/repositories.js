
 // Capa de acceso a datos: las páginas nunca importan db directamente.
import { db } from './db.js'

export const productosRepo = {
  listar: (tipo) =>
    tipo
      ? db.productos.where('tipo').equals(tipo).and(p => p.activo).toArray()
      : db.productos.toArray(),

  crear: (p) => db.productos.add({ activo: 1, ...p }),

  actualizar: (id, cambios) => db.productos.update(id, cambios),

  eliminar: (id) => db.productos.update(id, { activo: 0 })
}

export const sesionesRepo = {
  abrir: async (fondoInicial) => {
    const fondo = Number(fondoInicial)

    if (!Number.isFinite(fondo) || fondo < 0) {
      throw new Error('El fondo inicial no es válido.')
    }

    return db.transaction('rw', db.sesiones_caja, async () => {
      const activa = await db.sesiones_caja
        .where('estado')
        .equals('abierta')
        .first()

      if (activa) {
        throw new Error('Ya existe una sesión de caja abierta.')
      }

      return db.sesiones_caja.add({
        fecha: new Date().toISOString(),
        fondoInicial: Number(fondo.toFixed(2)),
        totalEfectivo: 0,
        totalTarjeta: 0,
        efectivoContado: null,
        diferencia: null,
        estado: 'abierta'
      })
    })
  },

  activa: () =>
    db.sesiones_caja.where('estado').equals('abierta').first(),

  cerrar: async (id, efectivoContado) => {
    const contado = Number(efectivoContado)

    if (!Number.isFinite(contado) || contado < 0) {
      throw new Error('El efectivo contado no es válido.')
    }

    return db.transaction('rw', db.sesiones_caja, async () => {
      const sesion = await db.sesiones_caja.get(id)

      if (!sesion) {
        throw new Error('La sesión de caja no existe.')
      }

      if (sesion.estado !== 'abierta') {
        throw new Error('La sesión de caja ya está cerrada.')
      }

      const esperado =
        Number(sesion.fondoInicial) + Number(sesion.totalEfectivo)

      const diferencia = Number(
        (contado - esperado).toFixed(2)
      )

      return db.sesiones_caja.update(id, {
        efectivoContado: Number(contado.toFixed(2)),
        diferencia,
        estado: 'cerrada',
        cierre: new Date().toISOString()
      })
    })
  }
}

export const pedidosRepo = {
  // Guarda el pedido y actualiza el total de caja en una transacción.
  registrar: (pedido) =>
    db.transaction('rw', db.pedidos, db.sesiones_caja, async () => {
      const sesion = await db.sesiones_caja.get(pedido.sesionId)

      if (!sesion || sesion.estado !== 'abierta') {
        throw new Error('No existe una sesión de caja abierta para este pedido.')
      }

      const total = Number(pedido.total)

      if (!Number.isFinite(total) || total <= 0) {
        throw new Error('El total del pedido no es válido.')
      }

      if (!['efectivo', 'tarjeta'].includes(pedido.metodoPago)) {
        throw new Error('El método de pago no es válido.')
      }

      const campo =
        pedido.metodoPago === 'efectivo'
          ? 'totalEfectivo'
          : 'totalTarjeta'

      const id = await db.pedidos.add({
        ...pedido,
        total: Number(total.toFixed(2)),
        fecha: new Date().toISOString()
      })

      const nuevoTotal = Number(
        (Number(sesion[campo] || 0) + total).toFixed(2)
      )

      await db.sesiones_caja.update(sesion.id, {
        [campo]: nuevoTotal
      })

      return id
    }),

  porSesion: (sesionId) =>
    db.pedidos.where('sesionId').equals(sesionId).toArray(),

  entreFechas: (desdeISO, hastaISO) =>
    db.pedidos.where('fecha').between(desdeISO, hastaISO).toArray()
}

export const configRepo = {
  pin: async () => (await db.config.get('pinAdmin'))?.valor,

  guardarPin: (valor) => db.config.put({ clave: 'pinAdmin', valor })
}
