import { db } from './db.js'

// Carga datos iniciales solo si la base está vacía.
export async function seedIfEmpty() {
  if ((await db.productos.count()) === 0) {
    await db.productos.bulkAdd([
      { tipo: 'base', nombre: 'Choco clásico', precio: 45, activo: 1 },
      { tipo: 'base', nombre: 'Choco blanco', precio: 48, activo: 1 },
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
    await db.config.put({ clave: 'pinAdmin', valor: '1234' }) // PIN inicial
  }
}
