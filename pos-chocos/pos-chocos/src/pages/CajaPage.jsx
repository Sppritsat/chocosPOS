import AperturaCaja from '../components/cobro/AperturaCaja.jsx'
import ArqueoScreen from '../components/cobro/ArqueoScreen.jsx'
import { useSesionActiva } from '../hooks/useSesionActiva.js'

// DEV 3: apertura, arqueo y corte
export default function CajaPage() {
  const sesion = useSesionActiva()
  return sesion ? <ArqueoScreen sesion={sesion} /> : <AperturaCaja />
}
