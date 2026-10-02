// TODO Dev 3: ticket imprimible del corte (usar utils/printer o window.print)
export default function TicketCierre({ sesion }) {
  return <pre>{JSON.stringify(sesion, null, 2)}</pre>
}
