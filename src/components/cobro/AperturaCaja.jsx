import { useState } from 'react'
import { useSessionStore } from '../../store/useSessionStore.js'
import { useToastStore } from '../../store/useToastStore.js'

export default function AperturaCaja() {
  const [fondo, setFondo] = useState('')
  const abrirCaja = useSessionStore((s) => s.abrirCaja)
  const mostrar = useToastStore((s) => s.mostrar)

  const abrir = async () => {
    const monto = Number(fondo)
    if (!monto || monto <= 0) return
    await abrirCaja(monto)
    mostrar('Caja abierta correctamente', 'success')
  }

  return (
    <section className="mx-auto max-w-md rounded-2xl bg-marshmallow-surface p-6 shadow-warmsm">
      <h2 className="mb-5 font-display text-3xl text-cacao-950">Apertura de caja</h2>
      <label className="mb-2 block text-base text-cacao-950/60">Fondo inicial (efectivo)</label>
      <input
        type="number" inputMode="decimal" min="0" step="0.01"
        className="mb-5 w-full rounded-xl border-2 border-canela-600/30 bg-marshmallow-surface p-4 text-xl text-cacao-950 outline-none focus:border-canela-600"
        placeholder="$0.00"
        value={fondo}
        onChange={(e) => setFondo(e.target.value)}
      />
      <button
        disabled={!Number(fondo) || Number(fondo) <= 0}
        onClick={abrir}
        className="w-full rounded-xl bg-canela-600 px-4 py-4 text-xl font-semibold text-marshmallow-50 disabled:opacity-40"
      >
        Abrir caja
      </button>
    </section>
  )
}
