# 🍫 ChocoPOS

Punto de venta **offline-first** (PWA) para un negocio pequeño de chocos. Corre en tablet/celular Android sin internet.

**Stack:** React 18 · Vite · TailwindCSS · Dexie.js (IndexedDB) · Zustand · React Router · vite-plugin-pwa · Web Bluetooth API (impresora térmica; modo simulado por defecto).

---

## 🚦 Estado del proyecto

| Ticket | Módulo | Dev | Estado |
|---|---|---|---|
| CHOCO-1 | Dexie.js y seeds | Emilio | ✅ Done |
| CHOCO-2 | Stores y rutas | Emilio | ✅ Done |
| CHOCO-3 | DrinkBuilder | Jimena | 🔄 Todo |
| CHOCO-4 | CartPanel | Jimena | 🔄 Todo |
| CHOCO-5 | Impresión de etiquetas | Jimena | 🔄 Todo |
| CHOCO-6 | Apertura de caja | Karlo | 🔄 Todo |
| CHOCO-7 | Cobro y cambio | Karlo | 🔄 Todo |
| CHOCO-8 | Arqueo y cierre | Karlo | 🔄 Todo |
| CHOCO-9 | PinGate (acceso admin) | César | 🔄 Todo |
| CHOCO-10 | Catálogo (CRUD) | César | 🔄 Todo |
| CHOCO-11 | Dashboard de ventas | César | 🔄 Todo |

La base (Dexie, stores, rutas, layout, PWA) ya está en `main` y lista para construir encima.

---

## 🚀 Instalación

```bash
git clone https://github.com/Sppritsat/chocosPOS.git
cd chocosPOS
npm install
npm run dev        # http://localhost:5173
npm run build && npm run preview   # probar PWA/offline
```

> Requiere Node.js instalado (versión 18+). Verifica con `node --version` y `npm --version`.
> Web Bluetooth necesita HTTPS o localhost y Chrome en Android.
> PIN de administradora inicial: `1234` (cambiarlo desde Admin una vez implementado CHOCO-10).

---

## 📁 Estructura del proyecto

src/
├─ db/ db.js · seed.js · repositories.js (Dev 1 — listo)
├─ store/ useCartStore · useSessionStore (Dev 1 — listo)
├─ hooks/ useCajaAbierta (Dev 1 — listo)
├─ utils/ format.js(D1) · cambio.js(D3) · stats.js(D4) · printer/(D2)
├─ components/ common/(D1) · pos/(D2) · cobro/(D3) · admin/(D4)
└─ pages/ PosPage(D2) · CajaPage(D3) · AdminPage(D4)


**Regla de oro:** cada dev trabaja solo en su carpeta asignada. Las páginas **nunca** importan `db` directo — usan siempre `src/db/repositories.js`.

---

## 🧩 Matriz de responsabilidades

| Dev | Módulo | Ruta exclusiva | Entregable |
|---|---|---|---|
| 1 — Emilio | Core & DB | `src/db/**`, `src/store/**`, `src/hooks/**`, `src/App.jsx`, `src/main.jsx`, `src/components/common/**` | ✅ Dexie estable, repositorios, stores, PWA offline, layout |
| 2 — Jimena | POS & Impresión | `src/pages/PosPage.jsx`, `src/components/pos/**`, `src/utils/printer/**` | Armar bebidas, carrito, etiquetas (simulada + Bluetooth) |
| 3 — Karlo | Cobro & Caja | `src/pages/CajaPage.jsx`, `src/components/cobro/**`, `src/utils/cambio.js` | Apertura, cobro con cambio, arqueo, ticket de cierre |
| 4 — César | Admin & Dashboard | `src/pages/AdminPage.jsx`, `src/components/admin/**`, `src/utils/stats.js` | PIN, CRUD catálogo, ventas por día y cliente |

Si necesitas cambiar un archivo ajeno (esquema, store, repositorio), abre un issue o PR pequeño dirigido a Emilio (Dev 1).

---

## 🔀 Git workflow

- `main`: estable, protegida. Cada dev crea su rama desde ahí.
- Ramas: `feature/CHOCO-3-4-5-pos`, `feature/CHOCO-6-7-8-caja`, `feature/CHOCO-9-10-11-admin`. Correcciones: `fix/<tema>`.
- Commits: `CHOCO-N feat(módulo): descripción` (p. ej. `CHOCO-3 feat(pos): componente DrinkBuilder`).
- Flujo:
```bash
  git fetch origin
  git checkout main
  git pull origin main
  git checkout -b feature/CHOCO-X-Y-Z-nombre
  # ... trabajas, haces commits ...
  git push origin feature/CHOCO-X-Y-Z-nombre
  # Luego en GitHub: Create Pull Request → Merge a main
```
- Cambios de esquema Dexie: **siempre** subir `db.version(n)`, nunca editar una versión ya publicada.

---

## 🗄️ Modelo de datos (Dexie)

```javascript
productos:     { id, tipo, nombre, precio, activo }       // tipo: base | sabor | leche | topping
pedidos:       { id, sesionId, cliente, notas, items:[{nombre, sabor, leche, toppings, precio, cantidad}],
                 total, metodoPago, pagoCon, cambio, fecha }
sesiones_caja: { id, fecha, fondoInicial, totalEfectivo, totalTarjeta, efectivoContado, diferencia, estado, cierre }
config:        { clave, valor }   // p. ej. { clave: 'pinAdmin', valor: '1234' }
```

Acceso siempre vía `src/db/repositories.js` (`productosRepo`, `sesionesRepo`, `pedidosRepo`, `configRepo`).

---

## 🤖 ¿Usas una IA para avanzar tu parte?

Antes de pedir ayuda, comparte con tu IA (Claude, ChatGPT, etc.) el documento de contexto completo del proyecto (pídeselo a Emilio o revisa el canal del equipo). Incluye la estructura, los stores, los repos y el detalle de cada ticket, para que la IA tenga todo lo necesario sin que tengas que explicarlo desde cero.