
import { moneda } from '../../utils/format.js'

export default function TicketCierre({ sesion, onContinuar }) {
  const fechaApertura = sesion.fecha
    ? new Date(sesion.fecha).toLocaleString('es-MX')
    : 'No disponible'

  const fechaCierre = sesion.cierre
    ? new Date(sesion.cierre).toLocaleString('es-MX')
    : 'No disponible'

  const efectivoEsperado =
    Number(sesion.fondoInicial) + Number(sesion.totalEfectivo)

  return (
    <main className="mx-auto max-w-lg p-4">
      <section
        id="ticket-cierre"
        className="rounded-xl border border-gray-300 bg-white p-6 shadow print:border-0 print:p-0 print:shadow-none"
      >
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold">ChocoPOS</h1>
          <h2 className="mt-2 text-lg font-semibold">
            Corte y cierre de caja
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sesión #{sesion.id}
          </p>
        </header>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Apertura:</strong> {fechaApertura}
          </p>
          <p>
            <strong>Cierre:</strong> {fechaCierre}
          </p>
          <p>
            <strong>Estado:</strong> {sesion.estado}
          </p>
        </div>

        <hr className="my-4 border-dashed border-gray-400" />

        <div className="space-y-3">
          <div className="flex justify-between gap-4">
            <span>Fondo inicial</span>
            <strong>{moneda(sesion.fondoInicial)}</strong>
          </div>

          <div className="flex justify-between gap-4">
            <span>Ventas en efectivo</span>
            <strong>{moneda(sesion.totalEfectivo)}</strong>
          </div>

          <div className="flex justify-between gap-4">
            <span>Ventas con tarjeta</span>
            <strong>{moneda(sesion.totalTarjeta)}</strong>
          </div>

          <div className="flex justify-between gap-4">
            <span>Efectivo esperado</span>
            <strong>{moneda(efectivoEsperado)}</strong>
          </div>

          <div className="flex justify-between gap-4">
            <span>Efectivo contado</span>
            <strong>{moneda(sesion.efectivoContado)}</strong>
          </div>
        </div>

        <hr className="my-4 border-dashed border-gray-400" />

        <div className="flex justify-between gap-4 text-lg">
          <strong>Diferencia</strong>
          <strong>{moneda(sesion.diferencia)}</strong>
        </div>

        <p className="mt-6 text-center text-sm">
          Corte de caja generado correctamente.
        </p>
      </section>

      <div className="mt-5 flex flex-col gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full rounded-lg bg-green-700 p-3 font-semibold text-white"
        >
          Imprimir corte
        </button>

        <button
          type="button"
          onClick={onContinuar}
          className="w-full rounded-lg border p-3 font-semibold"
        >
          Continuar a apertura de caja
        </button>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }

          #ticket-cierre,
          #ticket-cierre * {
            visibility: visible;
          }

          #ticket-cierre {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          @page {
            margin: 10mm;
          }
        }
      `}</style>
    </main>
  )
}
