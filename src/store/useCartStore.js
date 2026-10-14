import { create } from 'zustand'

// Comanda actual. Dev 2 la llena; Dev 3 la lee al cobrar.
export const useCartStore = create((set, get) => ({
  cliente: '',
  notas: '',
  items: [],
  setCliente: (cliente) => set({ cliente }),
  setNotas: (notas) => set({ notas }),
  agregar: (item) => set((s) => ({ items: [...s.items, { cantidad: 1, ...item }] })),
  eliminar: (index) => set((s) => ({ items: s.items.filter((_, i) => i !== index) })),
  limpiar: () => set({ cliente: '', notas: '', items: [] }),
  total: () => get().items.reduce((t, i) => t + i.precio * i.cantidad, 0)
}))
