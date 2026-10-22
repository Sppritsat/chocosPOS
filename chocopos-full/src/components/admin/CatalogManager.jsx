import { useEffect, useState } from 'react'
import { productosRepo } from '../../db/repositories.js'
import { useToastStore } from '../../store/useToastStore.js'

const TIPOS = [
  { id: 'base', label: 'Tamaños' },
  { id: 'sabor', label: 'Sabores' },
  { id: 'leche', label: 'Leches' },
  { id: 'topping', label: 'Toppings' }
]

export default function CatalogManager() {
  const [tipo, setTipo] = useState('sabor')
  const [items, setItems] = useState([])
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const mostrar = useToastStore((s) => s.mostrar)

  const cargar = () => productosRepo.listar(tipo).then(setItems)
  useEffect(() => { cargar() }, [tipo]) // eslint-disable-line

  const agregar = async () => {
    if (!nombre.trim()) { mostrar('Escribe un nombre antes de agregar', 'error'); return }
    await productosRepo.crear({ tipo, nombre: nombre.trim(), precio: Number(precio) || 0 })
    setNombre(''); setPrecio(''); cargar()
    mostrar('Producto agregado al catálogo', 'success')
  }
  const actualizarPrecio = async (id, nuevoPrecio) => {
    await productosRepo.actualizar(id, { precio: Number(nuevoPrecio) || 0 })
    cargar()
  }
  const desactivar = async (id) => { await productosRepo.activar(id, false); cargar() }

  return (
    <section className="rounded-2xl bg-marshmallow-surface p-6 shadow-warmsm">
      <h2 className="mb-5 font-display text-2xl text-cacao-950">Catálogo</h2>

      <div className="mb-5 flex flex-wrap gap-2">
        {TIPOS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTipo(t.id)}
            className={`min-h-[48px] rounded-full px-4 text-base font-medium ${tipo === t.id ? 'bg-cacao-950 text-marshmallow-50' : 'bg-marshmallow-100 text-cacao-950'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="mb-5 divide-y divide-cacao-950/10">
        {items.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-3 py-3">
            <span className="text-lg text-cacao-950">{p.nombre}</span>
            <div className="flex items-center gap-3">
              <input
                type="number" step="0.01"
                defaultValue={p.precio}
                onBlur={(e) => actualizarPrecio(p.id, e.target.value)}
                className="w-28 rounded-lg border-2 border-canela-600/30 bg-marshmallow-surface p-2 text-right text-lg text-cacao-950 outline-none focus:border-canela-600"
              />
              <button onClick={() => desactivar(p.id)} className="text-base font-medium text-chile-600">Eliminar</button>
            </div>
          </li>
        ))}
        {items.length === 0 && <p className="py-3 text-base text-cacao-950/50">Sin productos en esta categoría.</p>}
      </ul>

      <div className="flex flex-wrap gap-2">
        <input className="min-w-[160px] flex-1 rounded-xl border-2 border-canela-600/30 bg-marshmallow-surface p-3 text-lg text-cacao-950 outline-none focus:border-canela-600" placeholder="Nombre nuevo" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input className="w-32 rounded-xl border-2 border-canela-600/30 bg-marshmallow-surface p-3 text-lg text-cacao-950 outline-none focus:border-canela-600" placeholder="Precio" type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} />
        <button onClick={agregar} className="min-h-[52px] rounded-xl bg-canela-600 px-6 text-lg font-semibold text-marshmallow-50">Agregar</button>
      </div>
    </section>
  )
}
