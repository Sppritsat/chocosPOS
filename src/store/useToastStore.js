import { create } from 'zustand'

let contador = 0

export const useToastStore = create((set) => ({
  toasts: [],
  mostrar: (mensaje, tipo = 'info') => {
    const id = ++contador
    set((s) => ({ toasts: [...s.toasts, { id, mensaje, tipo }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3500)
  }
}))
