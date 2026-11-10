export function construirEtiqueta({ cliente, item }) {
  const toppings = (item.toppings ?? []).map((t) => t.nombre).join(', ') || '-'
  return [`${cliente || 'Cliente'}`, `${item.base ?? ''}`, `${item.sabor ?? ''} | ${item.leche ?? ''}`, `+ ${toppings}`].join('\n')
}
