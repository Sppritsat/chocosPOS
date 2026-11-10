# 🍫 ChocoPOS

Punto de venta **offline-first** (PWA) para un negocio pequeño de chocos (malteadas, licuados y batidos). Pensado para tablet Android en modo horizontal, sin internet.

**Stack:** React 18 · Vite · TailwindCSS · Dexie.js (IndexedDB) · Zustand · React Router · vite-plugin-pwa · Web Bluetooth API (impresora térmica; modo simulado por defecto).

---

## 🚦 Estado del proyecto

El flujo completo funciona de punta a punta: **abrir caja → armar bebida → cobrar → imprimir etiqueta → arqueo y corte → panel admin con catálogo y reportes.**

### Mejoras de esta versión
- ⚠️ **Alertas visuales (toasts):** avisan si intentas tomar pedidos con la caja cerrada, si falta elegir tamaño/sabor/leche, al agregar una bebida, al cobrar, etc.
- 🔒 **Caja obligatoria:** la pestaña "Pedidos" queda bloqueada (atenuada) si la caja está cerrada; al intentar entrar, se muestra una alerta y se redirige a Caja.
- 👤 **Nombre del cliente obligatorio:** si intentas agregar una bebida sin nombre, se abre una ventana ahí mismo para llenarlo, sin perder la bebida que ya armaste.
- 🥤 **Tamaños en vez de "bases":** ahora se elige **Mediano** o **Grande** (antes era "Choco clásico/blanco"). La migración de datos es automática si ya tenías la base vieja guardada en tu navegador.
- 📱 **Interfaz para tablet/táctil:** botones más grandes (mínimo 48–64px de alto), tipografía más grande, y el panel "Pedido actual" queda **fijo a la derecha** (sticky) y más ancho mientras recorres el catálogo de bebidas.

---

## 🚀 Instalación

```bash
git clone https://github.com/Sppritsat/chocosPOS.git
cd chocosPOS
npm install
npm run dev        # http://localhost:5173
npm run build && npm run preview   # probar PWA/offline
```

> Requiere Node.js 18+. Verifica con `node --version` y `npm --version`.
> Web Bluetooth necesita HTTPS o localhost y Chrome en Android.
> PIN de administradora inicial: `1234`.
> Si ya habías abierto la app antes y ves "Choco clásico/blanco" en vez de "Mediano/Grande", recarga la página: la migración de datos corre sola al iniciar.

---

## 📁 Estructura del proyecto

```
src/
├─ db/            db.js · seed.js (con migración) · repositories.js
├─ store/         useCartStore · useSessionStore · useToastStore
├─ hooks/         useCajaAbierta
├─ utils/         format.js · cambio.js · stats.js · printer/
├─ components/    common/ (Layout, ToastHost) · pos/ · cobro/ · admin/
└─ pages/         PosPage · CajaPage · AdminPage
```

**Regla de oro:** las páginas **nunca** importan `db` directo — usan siempre `src/db/repositories.js`.

---

## 🧩 Matriz de responsabilidades

| Dev | Módulo | Ruta exclusiva |
|---|---|---|
| 1 — Emilio | Core & DB | `src/db/**`, `src/store/**`, `src/hooks/**`, `src/App.jsx`, `src/main.jsx`, `src/components/common/**` |
| 2 — Jimena | POS & Impresión | `src/pages/PosPage.jsx`, `src/components/pos/**`, `src/utils/printer/**` |
| 3 — Karlo | Cobro & Caja | `src/pages/CajaPage.jsx`, `src/components/cobro/**`, `src/utils/cambio.js` |
| 4 — César | Admin & Dashboard | `src/pages/AdminPage.jsx`, `src/components/admin/**`, `src/utils/stats.js` |

Hay una versión funcional en cada módulo. `useToastStore` y `ToastHost` son compartidos (Dev 1) — cualquier módulo puede llamar `useToastStore.getState().mostrar(mensaje, tipo)` para avisar algo (`tipo`: `'info' | 'success' | 'error'`).

---

## 🔀 Git workflow

- `main`: estable. Cada dev crea su rama desde ahí.
- Ramas: `feature/CHOCO-3-4-5-pos`, `feature/CHOCO-6-7-8-caja`, `feature/CHOCO-9-10-11-admin`. Correcciones: `fix/<tema>`.
- Commits: `CHOCO-N feat(módulo): descripción`.
- Cambios de esquema Dexie: **siempre** subir `db.version(n)`, nunca editar una versión ya publicada.

---

## 🗄️ Modelo de datos (Dexie)

```javascript
productos:     { id, tipo, nombre, precio, activo }       // tipo: base(tamaño) | sabor | leche | topping
pedidos:       { id, sesionId, cliente, notas, items, total, metodoPago, pagoCon, cambio, fecha }
sesiones_caja: { id, fecha, fondoInicial, totalEfectivo, totalTarjeta, efectivoContado, diferencia, estado, cierre }
config:        { clave, valor }   // p. ej. { clave: 'pinAdmin', valor: '1234' }
```

---

## 🎨 Identidad visual

El diseño se aleja de la plantilla genérica "SaaS café" (tarjetas blancas, sombra gris, un solo radio de borde en todo) y usa una paleta propia de chocolatería:

- **Cacao** `#2B1810` — texto, navegación, estado seleccionado.
- **Canela** `#AE5A2B` — acento de acción (botones de cobrar, agregar, confirmar).
- **Espuma de leche** `#FAF2E6` — fondo general; superficies en `#FFFCF6`.
- **Semánticos de ingrediente:** menta `#5B7553` (éxito), chile `#9C3B2E` (error/destructivo), miel `#C98A2C` (advertencia) — en vez de los verde/rojo/ámbar genéricos de Tailwind.

**Tipografía:** Fraunces (serif cálida, con gran peso en números) para títulos y el total del pedido; Work Sans para todo lo interactivo, por su legibilidad a distancia y al tacto.

El panel "Pedido actual" es el elemento más llamativo de la pantalla (fondo oscuro cacao, total en Fraunces grande) — el resto de la interfaz se mantiene en tonos claros y sobrios para no competir con él.
