export const moneda = (n) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n ?? 0)
export const fechaHora = (iso) => new Date(iso).toLocaleString('es-MX')
export const diaISO = (iso) => iso.slice(0, 10)
