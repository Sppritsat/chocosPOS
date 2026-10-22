import { create } from 'zustand'
import { sesionesRepo } from '../db/repositories.js'

export const useSessionStore = create((set, get) => ({
  estadoCaja: 'CERRADA',
  sesion: null,
  cargando: true,
  adminAutenticado: false,

  cargarSesion: async () => {
    const sesion = (await sesionesRepo.activa()) ?? null
    set({ sesion, estadoCaja: sesion ? 'ABIERTA' : 'CERRADA', cargando: false })
  },
  abrirCaja: async (fondoInicial) => {
    const id = await sesionesRepo.abrir(fondoInicial)
    set({ sesion: await sesionesRepo.obtener(id), estadoCaja: 'ABIERTA' })
  },
  refrescarSesion: async () => {
    const s = get().sesion
    if (s) set({ sesion: await sesionesRepo.obtener(s.id) })
  },
  cerrarCaja: async (efectivoContado) => {
    const cerrada = await sesionesRepo.cerrar(get().sesion.id, efectivoContado)
    set({ sesion: null, estadoCaja: 'CERRADA' })
    return cerrada
  },
  setAdmin: (v) => set({ adminAutenticado: v })
}))
