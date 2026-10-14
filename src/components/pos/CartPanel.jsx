import { useCartStore } from '../../store/useCartStore.js'
import { moneda } from '../../utils/format.js'
import PrintLabelButton from './PrintLabelButton.jsx'

// TODO Dev 2: nombre del cliente, lista de items, botón "Cobrar" (abre CobroModal de Dev 3)
export default function CartPanel() {
  const { items, total } = useCartStore()
  return (
    <aside className="rounded-xl bg-white p-4 shadow">
      <h2 className="font-bold">Pedido ({items.length})</h2>
      <p className="mt-2 text-xl">{moneda(total())}</p>
      <PrintLabelButton />
    </aside>
  )
}
