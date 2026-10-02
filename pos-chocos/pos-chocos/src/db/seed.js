import { db } from './db.js'

export async function seedIfEmpty() {
  if ((await db.productos.count()) > 0) return
  await db.productos.bulkAdd([
    { tipo: 'base', nombre: 'Choco clásico', precio: 45, activo: 1 },
    { tipo: 'sabor', nombre: 'Fresa', precio: 0, activo: 1 },
    { tipo: 'sabor', nombre: 'Vainilla', precio: 0, activo: 1 },
    { tipo: 'leche', nombre: 'Entera', precio: 0, activo: 1 },
    { tipo: 'leche', nombre: 'Deslactosada', precio: 0, activo: 1 },
    { tipo: 'leche', nombre: 'Almendra', precio: 10, activo: 1 },
    { tipo: 'topping', nombre: 'Crema batida', precio: 8, activo: 1 },
    { tipo: 'topping', nombre: 'Grageas', precio: 5, activo: 1 }
  ])
  await db.config.put({ clave: 'pinAdmin', valor: '1234' }) // CAMBIAR en producción
}
