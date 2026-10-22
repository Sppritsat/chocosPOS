import Dexie from 'dexie'

export const db = new Dexie('chocopos')

db.version(1).stores({
  productos: '++id, tipo, nombre, activo',
  pedidos: '++id, sesionId, cliente, metodoPago, fecha',
  sesiones_caja: '++id, estado, fecha',
  config: 'clave'
})
