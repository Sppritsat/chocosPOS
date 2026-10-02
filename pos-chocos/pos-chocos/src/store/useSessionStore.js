import { create } from 'zustand'
import { sesionesRepo } from '../db/repositories.js'

// Sesión de caja activa y estado de admin
export const useSessionStore = create((set) => ({
  sesion: null,
  adminAutenticado: false,
  cargarSesion: async () => set({ sesion: (await sesionesRepo.activa()) ?? null }),
  setAdmin: (v) => set({ adminAutenticado: v })
}))
