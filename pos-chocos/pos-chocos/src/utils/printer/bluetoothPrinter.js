// Web Bluetooth: requiere HTTPS (o localhost) y gesto del usuario. Chrome Android.
let characteristic = null

export async function conectar() {
  // TODO Dev 2: ajustar UUIDs según el modelo de impresora
  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true, optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
  })
  const server = await device.gatt.connect()
  const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb')
  characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb')
}

export async function imprimir(texto) {
  if (!characteristic) await conectar()
  const data = new TextEncoder().encode(texto + '\n\n\n')
  for (let i = 0; i < data.length; i += 20) await characteristic.writeValue(data.slice(i, i + 20))
}
