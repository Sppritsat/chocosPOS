import DrinkBuilder from '../components/pos/DrinkBuilder.jsx'
import CartPanel from '../components/pos/CartPanel.jsx'

// DEV 2: armado de bebidas y carrito
export default function PosPage() {
  return (
    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
      <DrinkBuilder />
      <CartPanel />
    </div>
  )
}
