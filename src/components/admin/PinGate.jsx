import { useState } from 'react'
import { configRepo } from '../../db/repositories.js'
import { useSessionStore } from '../../store/useSessionStore.js'

export default function PinGate() {
  const [pin, setPin] = useState('')
  const setAdmin = useSessionStore(s => s.setAdmin)
  const entrar = async () => { if (pin === (await configRepo.pin())) setAdmin(true); else setPin('') }
  return (
    <div className="mx-auto max-w-xs rounded-xl bg-white p-4 shadow">
      <input type="password" inputMode="numeric" value={pin} onChange={e => setPin(e.target.value)}
        className="w-full border p-2" placeholder="PIN" />
      <button className="mt-2 w-full rounded bg-choco-900 p-2 text-white" onClick={entrar}>Entrar</button>
    </div>
  )
}
