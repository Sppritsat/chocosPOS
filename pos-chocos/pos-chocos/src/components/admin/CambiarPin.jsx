// DEV 4 (César) — CHOCO-9 / Jira CHOCO-15: cambio del PIN de administradora.
import { useState } from 'react'
import { configRepo } from '../../db/repositories.js'

export default function CambiarPin() {
  const [actual, setActual] = useState('')
  const [nuevo, setNuevo] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [msg, setMsg] = useState({ tipo: '', texto: '' })

  const guardar = async (e) => {
    e.preventDefault()
    if (actual !== (await configRepo.pin())) return setMsg({ tipo: 'error', texto: 'El PIN actual no es correcto.' })
    if (!/^\d{4}$/.test(nuevo)) return setMsg({ tipo: 'error', texto: 'El nuevo PIN debe tener exactamente 4 números.' })
    if (nuevo !== confirmar) return setMsg({ tipo: 'error', texto: 'La confirmación no coincide.' })
    if (nuevo === actual) return setMsg({ tipo: 'error', texto: 'El nuevo PIN debe ser distinto al actual.' })
    await configRepo.guardarPin(nuevo)
    setActual(''); setNuevo(''); setConfirmar('')
    setMsg({ tipo: 'ok', texto: 'PIN actualizado correctamente.' })
  }

  const input = 'w-full rounded-lg border border-gray-300 p-3 text-lg tracking-widest'
  const soloNum = (set) => (e) => set(e.target.value.replace(/\D/g, '').slice(0, 4))

  return (
    <section className="rounded-xl bg-white p-4 shadow">
      <h2 className="mb-3 text-lg font-bold text-choco-900">Cambiar PIN</h2>
      <form onSubmit={guardar} className="grid max-w-sm gap-3">
        <input className={input} type="password" inputMode="numeric" placeholder="PIN actual" value={actual} onChange={soloNum(setActual)} />
        <input className={input} type="password" inputMode="numeric" placeholder="Nuevo PIN (4 dígitos)" value={nuevo} onChange={soloNum(setNuevo)} />
        <input className={input} type="password" inputMode="numeric" placeholder="Confirmar nuevo PIN" value={confirmar} onChange={soloNum(setConfirmar)} />
        {msg.texto && (
          <p className={`text-sm ${msg.tipo === 'ok' ? 'text-green-700' : 'text-red-600'}`} role="alert">{msg.texto}</p>
        )}
        <button className="rounded-lg bg-choco-900 p-3 font-semibold text-white active:scale-95">Guardar PIN</button>
      </form>
    </section>
  )
}
