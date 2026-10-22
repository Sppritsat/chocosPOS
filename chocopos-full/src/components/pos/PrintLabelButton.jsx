import { imprimirEtiquetas } from '../../utils/printer/index.js'
import { useCartStore } from '../../store/useCartStore.js'
import { useToastStore } from '../../store/useToastStore.js'

export default function PrintLabelButton() {
  const { cliente, items } = useCartStore()
  const mostrar = useToastStore((s) => s.mostrar)

  const imprimir = async () => {
    await imprimirEtiquetas({ cliente, items })
    mostrar('Etiquetas enviadas a imprimir (ver consola)', 'info')
  }

  return (
    <button
      disabled={items.length === 0}
      className="min-h-[56px] rounded-xl border-2 border-marshmallow-50/30 px-4 py-3 text-lg font-medium text-marshmallow-50 disabled:opacity-40"
      onClick={imprimir}
    >
      Imprimir etiquetas
    </button>
  )
}
