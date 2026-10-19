// DEV 4 (César) — CHOCO-9 / Jira CHOCO-15: Acceso de seguridad por PIN.
// Teclado numérico táctil, mensaje de error y bloqueo temporal tras varios intentos fallidos.
import { useEffect, useState } from 'react'
import { configRepo } from '../../db/repositories.js'
import { useSessionStore } from '../../store/useSessionStore.js'

const MAX_INTENTOS = 3
const SEGUNDOS_BLOQUEO = 30
const LARGO_PIN = 4

export default function PinGate() {
  const setAdmin = useSessionStore(s => s.setAdmin)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [intentos, setIntentos] = useState(0)
  const [bloqueadoHasta, setBloqueadoHasta] = useState(0)
  const [ahora, setAhora] = useState(Date.now())
  const [verificando, setVerificando] = useState(false)

  const restante = Math.max(0, Math.ceil((bloqueadoHasta - ahora) / 1000))
  const bloqueado = restante > 0

  // Reloj para la cuenta regresiva del bloqueo
  useEffect(() => {
    if (!bloqueadoHasta) return
    const t = setInterval(() => setAhora(Date.now()), 250)
    return () => clearInterval(t)
  }, [bloqueadoHasta])

  const verificar = async (valor) => {
    if (bloqueado || verificando) return
    setVerificando(true)
    const correcto = await configRepo.pin()
    setVerificando(false)
    if (valor === correcto) {
      setIntentos(0)
      setAdmin(true)
      return
    }
    const n = intentos + 1
    setPin('')
    if (n >= MAX_INTENTOS) {
      setIntentos(0)
      setBloqueadoHasta(Date.now() + SEGUNDOS_BLOQUEO * 1000)
      setAhora(Date.now())
      setError(`Demasiados intentos. Espera ${SEGUNDOS_BLOQUEO} segundos.`)
    } else {
      setIntentos(n)
      setError(`PIN incorrecto. Te quedan ${MAX_INTENTOS - n} intento(s).`)
    }
  }

  const teclear = (d) => {
    if (bloqueado) return
    setError('')
    const nuevo = (pin + d).slice(0, LARGO_PIN)
    setPin(nuevo)
    if (nuevo.length === LARGO_PIN) verificar(nuevo) // entra solo al completar el PIN
  }

  const borrar = () => setPin(p => p.slice(0, -1))

  // Soporte para teclado físico (útil al probar en computadora)
  useEffect(() => {
    const onKey = (e) => {
      if (/^\d$/.test(e.key)) teclear(e.key)
      else if (e.key === 'Backspace') borrar()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const tecla = 'h-16 rounded-xl bg-choco-50 text-2xl font-semibold text-choco-900 active:scale-95 active:bg-choco-500 active:text-white disabled:opacity-40'

  return (
    <div className="mx-auto mt-6 max-w-xs rounded-2xl bg-white p-6 shadow">
      <h2 className="text-center text-lg font-bold text-choco-900">Acceso de administradora</h2>
      <p className="mt-1 text-center text-sm text-gray-500">Ingresa tu PIN de {LARGO_PIN} dígitos</p>

      {/* Indicadores del PIN */}
      <div className="my-5 flex justify-center gap-3" aria-label="PIN ingresado">
        {Array.from({ length: LARGO_PIN }).map((_, i) => (
          <span key={i}
            className={`h-4 w-4 rounded-full border-2 border-choco-900 ${i < pin.length ? 'bg-choco-900' : ''}`} />
        ))}
      </div>

      <p className="mb-3 min-h-5 text-center text-sm text-red-600" role="alert">
        {bloqueado ? `Bloqueado. Intenta de nuevo en ${restante} s.` : error}
      </p>

      <div className="grid grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
          <button key={d} className={tecla} disabled={bloqueado || verificando} onClick={() => teclear(d)}>{d}</button>
        ))}
        <button className={tecla + ' text-base'} disabled={bloqueado || !pin} onClick={() => setPin('')}>Limpiar</button>
        <button className={tecla} disabled={bloqueado || verificando} onClick={() => teclear('0')}>0</button>
        <button className={tecla + ' text-base'} disabled={bloqueado || !pin} onClick={borrar}>⌫</button>
      </div>
    </div>
  )
}
