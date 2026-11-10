import DrinkBuilder from '../components/pos/DrinkBuilder.jsx'
import CartPanel from '../components/pos/CartPanel.jsx'

export default function PosPage() {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_380px] lg:grid-cols-[1fr_420px]">
      <DrinkBuilder />
      <CartPanel />
    </div>
  )
}
