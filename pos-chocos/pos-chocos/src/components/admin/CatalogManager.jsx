// DEV 4 (César) — CHOCO-10 / Jira CHOCO-16: Panel CRUD de productos e ingredientes.
// Bases = productos; sabores, leches y toppings = ingredientes. Usa SOLO productosRepo.
import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { productosRepo } from '../../db/repositories.js'
import { moneda } from '../../utils/format.js'

const TIPOS = [
  { id: 'base', label: 'Bases' },
  { id: 'sabor', label: 'Sabores' },
  { id: 'leche', label: 'Leches' },
  { id: 'topping', label: 'Toppings' }
]

const VACIO = { id: null, tipo: 'base', nombre: '', precio: '' }

export default function CatalogManager() {
  // useLiveQuery refresca la lista sola cada vez que cambia la tabla
  const productos = useLiveQuery(() => productosRepo.listar(), []) ?? []
  const [tipo, setTipo] = useState('base')
  const [verInactivos, setVerInactivos] = useState(false)
  const [form, setForm] = useState(VACIO)
  const [error, setError] = useState('')

  const lista = productos
    .filter(p => p.tipo === tipo && (verInactivos || p.activo))
    .sort((a, b) => b.activo - a.activo || a.nombre.localeCompare(b.nombre))

  const editar = (p) => { setForm({ id: p.id, tipo: p.tipo, nombre: p.nombre, precio: String(p.precio) }); setError('') }
  const nuevo = () => { setForm({ ...VACIO, tipo }); setError('') }

  const guardar = async (e) => {
    e.preventDefault()
    const nombre = form.nombre.trim()
    const precio = Number(form.precio)
    if (!nombre) return setError('Escribe un nombre.')
    if (form.precio === '' || Number.isNaN(precio) || precio < 0) return setError('El precio debe ser un número igual o mayor a 0.')
    const repetido = productos.some(p => p.id !== form.id && p.tipo === form.tipo && p.activo &&
      p.nombre.trim().toLowerCase() === nombre.toLowerCase())
    if (repetido) return setError('Ya existe un elemento activo con ese nombre en esta categoría.')

    if (form.id) await productosRepo.actualizar(form.id, { nombre, precio, tipo: form.tipo })
    else await productosRepo.crear({ nombre, precio, tipo: form.tipo })
    setTipo(form.tipo)
    setForm({ ...VACIO, tipo: form.tipo })
    setError('')
  }

  const desactivar = async (p) => {
    if (!confirm(`¿Desactivar "${p.nombre}"? Ya no aparecerá en el punto de venta.`)) return
    await productosRepo.eliminar(p.id) // borrado lógico (activo: 0)
    if (form.id === p.id) setForm({ ...VACIO, tipo })
  }
  const reactivar = (p) => productosRepo.actualizar(p.id, { activo: 1 })

  const input = 'w-full rounded-lg border border-gray-300 p-3'

  return (
    <section className="rounded-xl bg-white p-4 shadow">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-choco-900">Catálogo de productos e ingredientes</h2>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={verInactivos} onChange={e => setVerInactivos(e.target.checked)} />
          Mostrar desactivados
        </label>
      </div>

      {/* Pestañas por tipo */}
      <div className="mb-4 flex flex-wrap gap-2">
        {TIPOS.map(t => (
          <button key={t.id} onClick={() => setTipo(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${tipo === t.id ? 'bg-choco-900 text-white' : 'bg-choco-50 text-choco-900'}`}>
            {t.label} ({productos.filter(p => p.tipo === t.id && p.activo).length})
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_320px]">
        {/* Lista */}
        <ul className="divide-y rounded-lg border">
          {lista.length === 0 && <li className="p-4 text-center text-gray-500">No hay elementos en esta categoría.</li>}
          {lista.map(p => (
            <li key={p.id} className={`flex items-center justify-between gap-2 p-3 ${p.activo ? '' : 'bg-gray-50 text-gray-400'}`}>
              <div>
                <p className="font-medium">{p.nombre} {!p.activo && <span className="text-xs">(desactivado)</span>}</p>
                <p className="text-sm">{p.precio > 0 ? (p.tipo === 'base' ? moneda(p.precio) : `+ ${moneda(p.precio)}`) : 'Sin costo extra'}</p>
              </div>
              <div className="flex gap-2">
                {p.activo ? (
                  <>
                    <button onClick={() => editar(p)} className="rounded-lg bg-choco-50 px-3 py-2 text-sm font-semibold text-choco-900">Editar</button>
                    <button onClick={() => desactivar(p)} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">Desactivar</button>
                  </>
                ) : (
                  <button onClick={() => reactivar(p)} className="rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">Reactivar</button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Formulario alta / edición */}
        <form onSubmit={guardar} className="grid content-start gap-3 rounded-lg bg-choco-50 p-4">
          <h3 className="font-semibold text-choco-900">{form.id ? 'Editar elemento' : 'Agregar nuevo'}</h3>
          <select className={input} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
            {TIPOS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <input className={input} placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
          <input className={input} type="number" inputMode="decimal" min="0" step="0.5"
            placeholder={form.tipo === 'base' ? 'Precio' : 'Costo extra (0 si no cobra)'}
            value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} />
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <button className="rounded-lg bg-choco-900 p-3 font-semibold text-white active:scale-95">
            {form.id ? 'Guardar cambios' : 'Agregar'}
          </button>
          {form.id && <button type="button" onClick={nuevo} className="rounded-lg bg-white p-3 text-choco-900">Cancelar</button>}
        </form>
      </div>
    </section>
  )
}
