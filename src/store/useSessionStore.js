import { create } from 'zustand'
import { sesionesRepo } from '../db/repositories.js'

// Estado de la caja (ABIERTA / CERRADA) y acceso de administradora.
export const useSessionStore = create((set, get) => ({
  estadoCaja: 'CERRADA',
  sesion: null,
  cargando: true,
  adminAutenticado: false,

  // Llamar al iniciar la app: recupera la caja si quedó abierta (persiste offline).
  cargarSesion: async () => {
    const sesion = (await sesionesRepo.activa()) ?? null
    set({ sesion, estadoCaja: sesion ? 'ABIERTA' : 'CERRADA', cargando: false })
  },
  abrirCaja: async (fondoInicial) => {
    const id = await sesionesRepo.abrir(fondoInicial)
    set({ sesion: await sesionesRepo.obtener(id), estadoCaja: 'ABIERTA' })
  },
  // Refresca los totales de la sesión (tras registrar un pedido).
  refrescarSesion: async () => {
    const s = get().sesion
    if (s) set({ sesion: await sesionesRepo.obtener(s.id) })
  },
  cerrarCaja: async (efectivoContado) => {
    const cerrada = await sesionesRepo.cerrar(get().sesion.id, efectivoContado)
    set({ sesion: null, estadoCaja: 'CERRADA' })
    return cerrada // para imprimir el ticket de cierre
  },
  setAdmin: (v) => set({ adminAutenticado: v })
}))
