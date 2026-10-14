import { imprimirEtiquetas } from '../../utils/printer/index.js'
import { useCartStore } from '../../store/useCartStore.js'

export default function PrintLabelButton() {
  const { cliente, items } = useCartStore()
  return (
    <button className="mt-3 rounded bg-choco-500 px-3 py-2 text-white"
      onClick={() => imprimirEtiquetas({ cliente, items })}>
      Imprimir etiquetas
    </button>
  )
}
