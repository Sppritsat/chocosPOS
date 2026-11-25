import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import { configRepo } from '../../db/repositories.js'
import { useToastStore } from '../../store/useToastStore.js'

export default function CambiarPin() {
  const [actual, setActual] = useState('')
  const [nuevo, setNuevo] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const mostrar = useToastStore((s) => s.mostrar)

  const guardar = async () => {
    const pinGuardado = await configRepo.pin()
    if (actual !== pinGuardado) {
      mostrar('El PIN actual no es correcto', 'error')
      return
    }
    if (nuevo.length < 4) {
      mostrar('El nuevo PIN debe tener al menos 4 dígitos', 'error')
      return
    }
    if (nuevo !== confirmar) {
      mostrar('Los dos PIN no coinciden', 'error')
      return
    }
    await configRepo.guardarPin(nuevo)
    setActual(''); setNuevo(''); setConfirmar('')
    mostrar('PIN actualizado correctamente', 'success')
  }

  const input = (valor, set, placeholder) => (
    <input
      type="password" inputMode="numeric" maxLength={6}
      className="w-full rounded-xl border-2 border-canela-600/30 bg-marshmallow-surface p-3 text-lg text-cacao-950 outline-none focus:border-canela-600"
      placeholder={placeholder}
      value={valor}
      onChange={(e) => set(e.target.value.replace(/\D/g, ''))}
    />
  )

  return (
    <section className="rounded-2xl bg-marshmallow-surface p-6 shadow-warmsm">
      <h2 className="mb-5 flex items-center gap-2 font-display text-2xl text-cacao-950">
        <KeyRound size={22} /> Cambiar PIN de acceso
      </h2>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {input(actual, setActual, 'PIN actual')}
        {input(nuevo, setNuevo, 'Nuevo PIN')}
        {input(confirmar, setConfirmar, 'Confirmar nuevo PIN')}
      </div>
      <button
        onClick={guardar}
        className="min-h-[52px] rounded-xl bg-canela-600 px-6 text-lg font-semibold text-marshmallow-50"
      >
        Guardar nuevo PIN
      </button>
    </section>
  )
}
