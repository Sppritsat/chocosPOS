import { create } from 'zustand'

// Carrito del pedido en curso (Dev 2 lo alimenta, Dev 3 lo consume al cobrar)
export const useCartStore = create((set, get) => ({
  cliente: '',
  items: [],
  setCliente: (cliente) => set({ cliente }),
  agregar: (item) => set(s => ({ items: [...s.items, { cantidad: 1, ...item }] })),
  quitar: (i) => set(s => ({ items: s.items.filter((_, idx) => idx !== i) })),
  limpiar: () => set({ cliente: '', items: [] }),
  total: () => get().items.reduce((t, i) => t + i.precio * i.cantidad, 0)
}))
