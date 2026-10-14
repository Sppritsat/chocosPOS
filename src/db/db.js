import Dexie from 'dexie'

export const db = new Dexie('chocopos')

// Solo se indexan los campos que se consultan.
// Al cambiar el esquema: subir el número de versión, NUNCA editar una versión ya publicada.
db.version(1).stores({
  productos: '++id, tipo, nombre, activo',          // tipo: base | sabor | leche | topping
  pedidos: '++id, sesionId, cliente, metodoPago, fecha',
  sesiones_caja: '++id, estado, fecha',             // estado: ABIERTA | CERRADA
  config: 'clave'                                   // { clave: 'pinAdmin', valor: '1234' }
})

/* Forma de los documentos (referencia para el equipo)
productos:     { id, tipo, nombre, precio, activo(1|0) }
pedidos:       { id, sesionId, cliente, notas, items:[{nombre, sabor, leche, toppings:[{nombre,precio}], precio, cantidad}],
                 total, metodoPago:'efectivo'|'tarjeta', pagoCon, cambio, fecha(ISO) }
sesiones_caja: { id, fecha(ISO), fondoInicial, totalEfectivo, totalTarjeta, efectivoContado, diferencia, estado, cierre(ISO) }
*/
