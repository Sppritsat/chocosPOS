# ☕ POS Chocos

Punto de venta **offline-first** (PWA) para un negocio pequeño de chocos. Corre en tablet/celular Android sin internet.

**Stack:** React 18 · Vite · TailwindCSS · Dexie.js (IndexedDB) · Zustand · React Router · vite-plugin-pwa · Web Bluetooth (impresora térmica; modo simulado por defecto).

## Instalación
```bash
git clone <url-del-repo> && cd pos-chocos
npm install
npm run dev        # http://localhost:5173 (accesible en red local)
npm run build && npm run preview   # probar PWA/offline
```
> Añadir `public/icon-192.png` y `public/icon-512.png` para el manifest. PIN admin inicial: `1234` (cambiarlo desde Admin).
> Web Bluetooth requiere HTTPS o localhost y Chrome en Android.

## Estructura
```
src/
├─ db/            db.js · seed.js · repositories.js        (Dev 1)
├─ store/         useCartStore · useSessionStore           (Dev 1)
├─ hooks/         useSesionActiva                          (Dev 1)
├─ utils/         format.js · cambio.js(D3) · stats.js(D4) · printer/(D2)
├─ components/    common/(D1) · pos/(D2) · cobro/(D3) · admin/(D4)
└─ pages/         PosPage(D2) · CajaPage(D3) · AdminPage(D4)
```

## Matriz de responsabilidades
| Dev | Módulo | Rutas propias | Entregable |
|---|---|---|---|
| 1 | Core & DB | `src/db/**`, `src/store/**`, `src/hooks/**`, `src/main.jsx`, `src/App.jsx`, `src/components/common/**`, `src/utils/format.js`, configs raíz | Dexie estable, repositorios, stores, PWA offline, Layout |
| 2 | POS & Impresión | `src/pages/PosPage.jsx`, `src/components/pos/**`, `src/utils/printer/**` | Armar bebidas, carrito, etiquetas (simulada + Bluetooth) |
| 3 | Cobro & Caja | `src/pages/CajaPage.jsx`, `src/components/cobro/**`, `src/utils/cambio.js` | Apertura, cobro con cambio, arqueo, ticket de cierre |
| 4 | Admin & Dashboard | `src/pages/AdminPage.jsx`, `src/components/admin/**`, `src/utils/stats.js` | PIN, CRUD catálogo, ventas por día y cliente |

**Regla de oro:** cada dev solo edita sus rutas. Si necesitas cambiar un archivo ajeno (esquema, store, repositorio), abre un issue o PR pequeño a Dev 1.
Las páginas **nunca** importan `db` directo: usan `src/db/repositories.js`.

## Git workflow
- `main`: estable, protegida (solo PR con 1 aprobación). `develop`: integración.
- Ramas: `feature/core-db`, `feature/pos-pedidos`, `feature/pos-impresion`, `feature/caja-cobro`, `feature/caja-arqueo`, `feature/admin-catalogo`, `feature/admin-dashboard`. Correcciones: `fix/<tema>`.
- Commits: `feat(pos): ...`, `fix(caja): ...`, `chore(core): ...`.
- Flujo: `git checkout develop && git pull` → `git checkout -b feature/...` → commits pequeños → PR a `develop`. Rebase sobre `develop` antes del PR.
- Cambios de esquema Dexie: **siempre** subir `db.version(n)`, nunca editar una versión publicada.
