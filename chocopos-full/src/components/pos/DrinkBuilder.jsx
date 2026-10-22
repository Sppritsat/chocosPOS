import { useEffect, useState } from 'react'
import { productosRepo } from '../../db/repositories.js'
import { useCartStore } from '../../store/useCartStore.js'
import { useToastStore } from '../../store/useToastStore.js'
import { moneda } from '../../utils/format.js'

const Opcion = ({ activo, onClick, children }) => (
  <button
    onClick={onClick}
    className={`min-h-[56px] rounded-full border-2 px-5 py-3 text-lg font-medium transition
      ${activo
        ? 'border-cacao-950 bg-cacao-950 text-marshmallow-50'
        : 'border-canela-600/30 bg-marshmallow-surface text-cacao-950'}`}
  >
    {children}
  </button>
)

// Pide el nombre del cliente ahí mismo, sin perder la bebida que ya se armó.
function ModalNombre({ valorInicial, onConfirmar, onCancelar }) {
  const [valor, setValor] = useState(valorInicial)
  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-cacao-950/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-marshmallow-surface p-6 shadow-warm">
        <h3 className="mb-2 font-display text-xl text-cacao-950">¿A nombre de quién va el pedido?</h3>
        <p className="mb-4 text-base text-cacao-950/60">El nombre del cliente es obligatorio para continuar.</p>
        <input
          autoFocus
          className="mb-4 w-full rounded-xl border-2 border-chile-600/60 bg-marshmallow-surface p-3 text-lg text-cacao-950 outline-none focus:border-chile-600"
          placeholder="Nombre del cliente"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && valor.trim() && onConfirmar(valor.trim())}
        />
        <div className="flex gap-3">
          <button onClick={onCancelar} className="min-h-[56px] flex-1 rounded-xl border-2 border-cacao-950/20 text-lg font-medium text-cacao-950">
            Cancelar
          </button>
          <button
            disabled={!valor.trim()}
            onClick={() => onConfirmar(valor.trim())}
            className="min-h-[56px] flex-1 rounded-xl bg-canela-600 text-lg font-semibold text-marshmallow-50 disabled:opacity-40"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DrinkBuilder() {
  const [tamanios, setTamanios] = useState([])
  const [sabores, setSabores] = useState([])
  const [leches, setLeches] = useState([])
  const [toppings, setToppings] = useState([])

  const [tamanio, setTamanio] = useState(null)
  const [sabor, setSabor] = useState(null)
  const [leche, setLeche] = useState(null)
  const [toppingsSel, setToppingsSel] = useState([])
  const [pedirNombre, setPedirNombre] = useState(false)

  const { cliente, notas, setCliente, setNotas, agregar } = useCartStore()
  const mostrarToast = useToastStore((s) => s.mostrar)

  useEffect(() => {
    productosRepo.listar('base').then(setTamanios)
    productosRepo.listar('sabor').then(setSabores)
    productosRepo.listar('leche').then(setLeches)
    productosRepo.listar('topping').then(setToppings)
  }, [])

  const toggleTopping = (t) =>
    setToppingsSel((prev) =>
      prev.some((p) => p.id === t.id) ? prev.filter((p) => p.id !== t.id) : [...prev, t]
    )

  const precio =
    (tamanio?.precio ?? 0) + (sabor?.precio ?? 0) + (leche?.precio ?? 0) +
    toppingsSel.reduce((t, s) => t + s.precio, 0)

  const puedeAgregar = tamanio && sabor && leche

  const agregarDefinitivo = (nombreCliente) => {
    agregar({
      nombre: `${tamanio.nombre} ${sabor.nombre}`,
      tamanio: tamanio.nombre,
      sabor: sabor.nombre,
      leche: leche.nombre,
      toppings: toppingsSel.map((t) => ({ nombre: t.nombre, precio: t.precio })),
      precio
    })
    setTamanio(null); setSabor(null); setLeche(null); setToppingsSel([])
    mostrarToast('Bebida agregada al pedido', 'success')
  }

  const intentarAgregar = () => {
    if (!puedeAgregar) {
      mostrarToast('Elige tamaño, sabor y leche antes de continuar', 'error')
      return
    }
    if (!cliente.trim()) {
      setPedirNombre(true)
      return
    }
    agregarDefinitivo(cliente.trim())
  }

  const Grupo = ({ titulo, opciones, valor, onPick }) => (
    <div className="mb-6">
      <h3 className="mb-2 font-display text-lg text-cacao-950">{titulo}</h3>
      <div className="flex flex-wrap gap-3">
        {opciones.map((o) => (
          <Opcion key={o.id} activo={valor?.id === o.id} onClick={() => onPick(o)}>
            {o.nombre}{o.precio > 0 ? ` +${moneda(o.precio)}` : ''}
          </Opcion>
        ))}
      </div>
    </div>
  )

  return (
    <section className="rounded-2xl bg-marshmallow-surface p-6 shadow-warmsm">
      <h2 className="mb-6 font-display text-3xl text-cacao-950">Armar malteada</h2>

      <Grupo titulo="Tamaño" opciones={tamanios} valor={tamanio} onPick={setTamanio} />
      <Grupo titulo="Sabor" opciones={sabores} valor={sabor} onPick={setSabor} />
      <Grupo titulo="Leche" opciones={leches} valor={leche} onPick={setLeche} />

      <div className="mb-6">
        <h3 className="mb-2 font-display text-lg text-cacao-950">Toppings</h3>
        <div className="flex flex-wrap gap-3">
          {toppings.map((t) => (
            <Opcion key={t.id} activo={toppingsSel.some((p) => p.id === t.id)} onClick={() => toggleTopping(t)}>
              {t.nombre} +{moneda(t.precio)}
            </Opcion>
          ))}
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <input
          className={`rounded-xl border-2 bg-marshmallow-surface p-3 text-lg text-cacao-950 outline-none
            ${cliente.trim() ? 'border-canela-600/30 focus:border-canela-600' : 'border-chile-600/50'}`}
          placeholder="Nombre del cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />
        <input
          className="rounded-xl border-2 border-canela-600/30 bg-marshmallow-surface p-3 text-lg text-cacao-950 outline-none focus:border-canela-600"
          placeholder="Notas (ej. sin azúcar)"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
        />
      </div>

      <button
        onClick={intentarAgregar}
        className="w-full rounded-xl bg-canela-600 px-4 py-4 text-xl font-semibold text-marshmallow-50"
      >
        Agregar al carrito — {moneda(precio)}
      </button>

      {pedirNombre && (
        <ModalNombre
          valorInicial={cliente}
          onCancelar={() => setPedirNombre(false)}
          onConfirmar={(nombre) => { setCliente(nombre); setPedirNombre(false); agregarDefinitivo(nombre) }}
        />
      )}
    </section>
  )
}
