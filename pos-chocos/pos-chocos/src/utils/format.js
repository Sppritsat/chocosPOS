export const moneda = (n) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n ?? 0)
export const fechaCorta = (iso) => new Date(iso).toLocaleString('es-MX')
// Día LOCAL (YYYY-MM-DD). Antes usaba iso.slice(0,10), que da el día en UTC:
// en México una venta después de las 6 pm se contaba como del día siguiente.
export const diaISO = (iso) => {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
