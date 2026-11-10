import AperturaCaja from '../components/cobro/AperturaCaja.jsx'
import ArqueoScreen from '../components/cobro/ArqueoScreen.jsx'
import { useSessionStore } from '../store/useSessionStore.js'

export default function CajaPage() {
  const sesion = useSessionStore((s) => s.sesion)
  return sesion ? <ArqueoScreen sesion={sesion} /> : <AperturaCaja />
}
