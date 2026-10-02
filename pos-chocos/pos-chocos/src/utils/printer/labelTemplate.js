// Devuelve texto plano de la etiqueta (luego Dev 2 puede migrar a ESC/POS o TSPL).
export function construirEtiqueta({ cliente, item }) {
  const toppings = (item.toppings ?? []).map(t => t.nombre).join(', ') || '-'
  return [`${cliente || 'Cliente'}`, `${item.sabor ?? ''} | ${item.leche ?? ''}`, `+ ${toppings}`].join('\n')
}
