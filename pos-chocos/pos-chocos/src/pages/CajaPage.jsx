
import { useState } from 'react'
import AperturaCaja from '../components/cobro/AperturaCaja.jsx'
import ArqueoScreen from '../components/cobro/ArqueoScreen.jsx'
import TicketCierre from '../components/cobro/TicketCierre.jsx'
import { useSesionActiva } from '../hooks/useSesionActiva.js'

export default function CajaPage() {
  const sesion = useSesionActiva()
  const [ticketCierre, setTicketCierre] = useState(null)

  const mostrarTicket = (sesionCerrada) => {
    setTicketCierre(sesionCerrada)
  }

  if (ticketCierre) {
    return (
      <TicketCierre
        sesion={ticketCierre}
        onContinuar={() => setTicketCierre(null)}
      />
    )
  }

  if (!sesion) {
    return <AperturaCaja />
  }

  return (
    <ArqueoScreen
      sesion={sesion}
      onCerrarCaja={mostrarTicket}
    />
  )
}
