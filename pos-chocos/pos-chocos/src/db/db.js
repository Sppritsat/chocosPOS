import Dexie from 'dexie'

export const db = new Dexie('pos_chocos')

// Solo se indexan campos que se consultan. Subir de versión al cambiar el esquema.
db.version(1).stores({
  // tipo: 'sabor' | 'leche' | 'topping' | 'base'
  productos: '++id, tipo, nombre, activo',
  pedidos: '++id, sesionId, cliente, metodoPago, fecha',
  sesiones_caja: '++id, estado, fecha',
  config: 'clave' // p. ej. { clave: 'pinAdmin', valor: '...' }
})

/* Formas de los documentos (referencia para todo el equipo)
productos:     { id, tipo, nombre, precio, activo }
pedidos:       { id, sesionId, cliente, items:[{productoId, nombre, sabor, leche, toppings:[{nombre,precio}], precio, cantidad}],
                 total, metodoPago:'efectivo'|'tarjeta', pagoCon, cambio, fecha(ISO) }
sesiones_caja: { id, fecha(ISO), fondoInicial, totalEfectivo, totalTarjeta, efectivoContado, diferencia, estado:'abierta'|'cerrada', cierre(ISO) }
*/
