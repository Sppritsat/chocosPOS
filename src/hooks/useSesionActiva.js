import { useEffect } from 'react'
import { useSessionStore } from '../store/useSessionStore.js'

export function useSesionActiva() {
  const { sesion, cargarSesion } = useSessionStore()
  useEffect(() => { cargarSesion() }, [cargarSesion])
  return sesion
}
