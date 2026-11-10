import { db } from './db.js'

export async function seedIfEmpty() {
  if ((await db.productos.count()) === 0) {
    await db.productos.bulkAdd([
      { tipo: 'base', nombre: 'Mediano', precio: 45, activo: 1 },
      { tipo: 'base', nombre: 'Grande', precio: 58, activo: 1 },
      { tipo: 'sabor', nombre: 'Fresa', precio: 0, activo: 1 },
      { tipo: 'sabor', nombre: 'Vainilla', precio: 0, activo: 1 },
      { tipo: 'sabor', nombre: 'Avellana', precio: 5, activo: 1 },
      { tipo: 'leche', nombre: 'Entera', precio: 0, activo: 1 },
      { tipo: 'leche', nombre: 'Deslactosada', precio: 0, activo: 1 },
      { tipo: 'leche', nombre: 'Almendra', precio: 10, activo: 1 },
      { tipo: 'topping', nombre: 'Crema batida', precio: 8, activo: 1 },
      { tipo: 'topping', nombre: 'Grageas', precio: 5, activo: 1 },
      { tipo: 'topping', nombre: 'Malvaviscos', precio: 6, activo: 1 }
    ])
  }
  if (!(await db.config.get('pinAdmin'))) {
    await db.config.put({ clave: 'pinAdmin', valor: '1234' })
  }
  await migrarTamanios()
}

// Migración: si alguien ya tenía la base vieja (Choco clásico/blanco) en su navegador,
// la reemplaza por Mediano/Grande sin perder el resto de los datos.
async function migrarTamanios() {
  const bases = await db.productos.where('tipo').equals('base').toArray()
  const tieneViejos = bases.some((b) => ['Choco clásico', 'Choco blanco'].includes(b.nombre))
  if (tieneViejos) {
    await db.productos.where('tipo').equals('base').delete()
    await db.productos.bulkAdd([
      { tipo: 'base', nombre: 'Mediano', precio: 45, activo: 1 },
      { tipo: 'base', nombre: 'Grande', precio: 58, activo: 1 }
    ])
  }
}
