import { useEffect, useState } from 'react'
import AperturaCaja from '../components/cobro/AperturaCaja.jsx'
import CajaAbierta from '../components/cobro/CajaAbierta.jsx'
import ArqueoScreen from '../components/cobro/ArqueoScreen.jsx'
import { useSessionStore } from '../store/useSessionStore.js'

export default function CajaPage() {
  const sesion = useSessionStore((s) => s.sesion)
  const [mostrarArqueo, setMostrarArqueo] = useState(false)

  // Si se abre una caja nueva (cambia el id de sesión), siempre arranca en la pantalla
  // de confirmación — nunca directo en el arqueo de una sesión anterior.
  useEffect(() => { setMostrarArqueo(false) }, [sesion?.id])

  if (!sesion) return <AperturaCaja />
  if (mostrarArqueo) return <ArqueoScreen sesion={sesion} />
  return <CajaAbierta sesion={sesion} onCerrarCaja={() => setMostrarArqueo(true)} />
}
