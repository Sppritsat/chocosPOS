import { useSessionStore } from '../store/useSessionStore.js'

export function useCajaAbierta() {
  return useSessionStore((s) => s.estadoCaja === 'ABIERTA')
}
