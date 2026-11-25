import { construirEtiqueta } from './labelTemplate.js'
import * as simulado from './simulatedPrinter.js'
import * as bluetooth from './bluetoothPrinter.js'

const DRIVER = 'simulado' // cambiar a 'bluetooth' con impresora real conectada

export async function imprimirEtiquetas({ cliente, items }) {
  const driver = DRIVER === 'bluetooth' ? bluetooth : simulado
  for (const item of items) {
    for (let n = 0; n < (item.cantidad ?? 1); n++) {
      await driver.imprimir(construirEtiqueta({ cliente, item }))
    }
  }
}
