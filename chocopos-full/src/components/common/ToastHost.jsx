import { useToastStore } from '../../store/useToastStore.js'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'

const estilos = {
  error: 'bg-chile-600 text-marshmallow-50',
  success: 'bg-matcha-600 text-marshmallow-50',
  info: 'bg-cacao-950 text-marshmallow-50'
}
const Icono = { error: AlertTriangle, success: CheckCircle2, info: Info }

export default function ToastHost() {
  const toasts = useToastStore((s) => s.toasts)
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => {
        const Icon = Icono[t.tipo]
        return (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-2 rounded-xl px-5 py-3 text-base font-medium shadow-warm ${estilos[t.tipo]}`}>
            <Icon size={20} /> {t.mensaje}
          </div>
        )
      })}
    </div>
  )
}
