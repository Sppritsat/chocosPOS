import { useState } from 'react'
import { configRepo } from '../../db/repositories.js'
import { useSessionStore } from '../../store/useSessionStore.js'

const TECLAS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '←']

export default function PinGate() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const setAdmin = useSessionStore((s) => s.setAdmin)

  const pulsar = async (tecla) => {
    setError(false)
    if (tecla === 'C') return setPin('')
    if (tecla === '←') return setPin((p) => p.slice(0, -1))
    const nuevo = (pin + tecla).slice(0, 6)
    setPin(nuevo)
    if (nuevo.length >= 4) {
      const correcto = await configRepo.pin()
      if (nuevo === correcto) setAdmin(true)
      else if (nuevo.length === 6) { setError(true); setPin('') }
    }
  }

  return (
    <section className="mx-auto max-w-sm rounded-2xl bg-marshmallow-surface p-6 shadow-warmsm">
      <h2 className="mb-5 text-center font-display text-2xl text-cacao-950">Acceso administradora</h2>
      <div className="mb-5 flex justify-center gap-3">
        {Array.from({ length: Math.max(4, pin.length) }).map((_, i) => (
          <span key={i} className={`h-5 w-5 rounded-full ${i < pin.length ? 'bg-cacao-950' : 'bg-cacao-950/15'}`} />
        ))}
      </div>
      {error && <p className="mb-4 text-center text-base font-medium text-chile-600">PIN incorrecto</p>}
      <div className="grid grid-cols-3 gap-3">
        {TECLAS.map((t) => (
          <button key={t} onClick={() => pulsar(t)} className="min-h-[64px] rounded-xl border-2 border-canela-600/30 text-2xl font-medium text-cacao-950">
            {t}
          </button>
        ))}
      </div>
    </section>
  )
}
