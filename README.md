# 🍫 ChocoPOS — Sistema de Punto de Venta Offline-First para Chocolatería

ChocoPOS es una aplicación web progresiva (PWA) de alto rendimiento diseñada para operar **100% offline** (sin conexión a Internet) desde tablets o teléfonos celulares Android. Permite la toma rápida de pedidos personalizados, impresión directa de etiquetas adhesivas para vasos vía Bluetooth/USB, gestión de pagos, control estricto de caja (arqueo/corte) y administración de catálogo y reportes con control de acceso mediante PIN.

---

## 🛠️ Stack Tecnológico

* **Frontend Framework:** React 18+ con Vite (JavaScript / JSX)
* **Estilos & UI:** TailwindCSS + Lucide React (Íconos *touch-friendly*)
* **Persistencia Local (Offline-First):** IndexedDB encapsulado con **Dexie.js**
* **Gestión de Estado & Rutas:** Zustand · React Router
* **PWA & Impresión:** `vite-plugin-pwa` · Web Bluetooth API (modo simulado por defecto) / CSS Print Media
* **Ejecución Target:** Navegador Chrome / PWA instalada en Tablet o Celular Android

---

## 🚦 Estado del Proyecto

| Ticket | Módulo | Dev | Estado |
|---|---|---|---|
| **CHOCO-1** | Dexie.js y seeds | Emilio | ✅ Done |
| **CHOCO-2** | Stores y rutas | Emilio | ✅ Done |
| **CHOCO-3** | DrinkBuilder (Armado de Bebidas) | Jimena | 🔄 Todo |
| **CHOCO-4** | CartPanel (Carrito) | Jimena | 🔄 Todo |
| **CHOCO-5** | Impresión de etiquetas | Jimena | 🔄 Todo |
| **CHOCO-6** | Apertura de caja | Karlo | 🔄 Todo |
| **CHOCO-7** | Cobro y cálculo de cambio | Karlo | 🔄 Todo |
| **CHOCO-8** | Arqueo y cierre de caja | Karlo | 🔄 Todo |
| **CHOCO-9** | PinGate (Acceso Admin) | César | 🔄 Todo |
| **CHOCO-10** | Catálogo (CRUD) | César | 🔄 Todo |
| **CHOCO-11** | Dashboard de ventas | César | 🔄 Todo |

> La base (Dexie, stores, rutas, layout, PWA) ya está en `main` y lista para construir encima.

---

## 🚀 Instalación y Ejecución Local

```bash
# 1. Clonar el repositorio
git clone [https://github.com/Sppritsat/chocosPOS.git](https://github.com/Sppritsat/chocosPOS.git)
cd chocosPOS

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo local
npm run dev        # http://localhost:5173

# 4. Probar PWA / Modo Offline
npm run build && npm run preview

```

> **Notas de entorno:**
> * Requiere Node.js instalado (versión 18+). Verifica con `node --version` y `npm --version`.
> * Web Bluetooth necesita HTTPS o localhost en Google Chrome para Android.
> * **PIN de administradora inicial:** `1234` (cambiar desde el módulo Admin una vez implementado el ticket CHOCO-10).
> 
> 

---

## 📁 Estructura del Proyecto

```text
chocopos/
├── public/
│   ├── favicon.ico
│   ├── icon-192.png           # Ícono PWA
│   ├── icon-512.png           # Ícono PWA
│   └── manifest.json          # Configuración PWA Offline
├── src/
│   ├── db/                    # [Dev 1] db.js · seed.js · repositories.js (Listo)
│   ├── store/                 # [Dev 1] useCartStore · useSessionStore (Listo)
│   ├── hooks/                 # [Dev 1] useCajaAbierta (Listo)
│   ├── utils/                 
│   │   ├── format.js          # [Dev 1] Formateadores generales
│   │   ├── cambio.js          # [Dev 3] Lógica matemática para cálculo de cambio
│   │   ├── stats.js           # [Dev 4] Procesamiento de métricas y reportes
│   │   └── printer/           # [Dev 2] Impresión de etiquetas (Bluetooth / Simulación)
│   ├── components/            
│   │   ├── common/            # [Dev 1] Layout y componentes compartidos
│   │   ├── pos/               # [Dev 2] DrinkBuilder · CartPanel · PrintLabelButton
│   │   ├── cobro/             # [Dev 3] AperturaCaja · CobroModal · ArqueoScreen · TicketCierre
│   │   └── admin/             # [Dev 4] PinGate · CatalogManager · SalesDashboard
│   ├── pages/                 
│   │   ├── PosPage.jsx        # [Dev 2]
│   │   ├── CajaPage.jsx       # [Dev 3]
│   │   └── AdminPage.jsx      # [Dev 4]
│   ├── App.jsx                # [Dev 1] Enrutador principal y layout
│   └── main.jsx               # [Dev 1] Punto de entrada de React
├── index.html
├── package.json
├── tailwind.config.js
└── README.md

```

> ⚠️ **Regla de oro:** Cada dev trabaja solo en su carpeta/archivos asignados. Las páginas **nunca** importan `db` directo — usan siempre la capa de abstracción en `src/db/repositories.js`.

---

## 👥 Matriz de Responsabilidades y Asignación

| Dev | Módulo | Ruta exclusiva | Entregables |
| --- | --- | --- | --- |
| **Dev 1: José Emilio** | Core & Base de Datos | `src/db/**`, `src/store/**`, `src/hooks/**`, `src/App.jsx`, `src/main.jsx`, `src/components/common/**` | ✅ Dexie estable, repositorios, stores, PWA offline, layout base. |
| **Dev 2: Jimena** | POS & Impresión | `src/pages/PosPage.jsx`, `src/components/pos/**`, `src/utils/printer/**` | Armado de bebidas, carrito de compras, etiquetas (simulada + Bluetooth). |
| **Dev 3: Karlo** | Cobro & Caja | `src/pages/CajaPage.jsx`, `src/components/cobro/**`, `src/utils/cambio.js` | Apertura de caja, cobro con cálculo de cambio, arqueo y ticket de cierre. |
| **Dev 4: César** | Admin & Dashboard | `src/pages/AdminPage.jsx`, `src/components/admin/**`, `src/utils/stats.js` | Autenticación por PIN, CRUD de catálogo y dashboard de ventas diarias/cliente. |

*Si necesitas modificar un archivo fuera de tu alcance asignado (esquema, store o repositorio), abre un issue o un Pull Request pequeño dirigido a José Emilio (Dev 1).*

---

## 🔀 Git Workflow

Para mantener la rama `main` estable y limpia, **está strictly prohibido hacer commits directos a `main**`.

### Convención de Ramas:

* **Principal:** `main` (protegida y estable).
* **Módulos:** `feature/CHOCO-3-4-5-pos`, `feature/CHOCO-6-7-8-caja`, `feature/CHOCO-9-10-11-admin`.
* **Correcciones:** `fix/<descripcion-corta>`.

### Convención de Commits (Integración con Jira):

Formato: `CHOCO-N feat(módulo): descripción` (ejemplo: `CHOCO-3 feat(pos): componente DrinkBuilder`).

### Flujo de Trabajo Paso a Paso:

```bash
# 1. Actualizar la rama main local
git fetch origin
git checkout main
git pull origin main

# 2. Crear tu rama de trabajo
git checkout -b feature/CHOCO-X-Y-Z-nombre

# 3. Trabajar y realizar commits con la clave de Jira
git add .
git commit -m "CHOCO-X feat(módulo): descripción de los cambios"

# 4. Subir la rama a GitHub
git push origin feature/CHOCO-X-Y-Z-nombre

# 5. En GitHub: Crear Pull Request → Solicitar revisión → Merge a main

```

> **Importante para Dexie:** Si se requieren cambios en la estructura de la base de datos, **siempre** se debe incrementar la versión con `db.version(n)`. Nunca se debe editar una versión de base de datos ya publicada.

---

## 🗄️ Modelo de Datos Local (`src/db/db.js`)

```javascript
productos:     { id, tipo, nombre, precio, activo }       // tipo: 'base' | 'sabor' | 'leche' | 'topping'
pedidos:       { id, sesionId, cliente, notas, items:[{nombre, sabor, leche, toppings, precio, cantidad}],
                 total, metodoPago, pagoCon, cambio, fecha }
sesiones_caja: { id, fecha, fondoInicial, totalEfectivo, totalTarjeta, efectivoContado, diferencia, estado, cierre }
config:        { clave, valor }   // ej. { clave: 'pinAdmin', valor: '1234' }

```

El acceso a los datos debe realizarse a través de `src/db/repositories.js` (`productosRepo`, `sesionesRepo`, `pedidosRepo`, `configRepo`).

---

## 🤖 Uso de Asistentes de IA para el Desarrollo

Si utilizas herramientas de IA (Claude, ChatGPT, etc.) para acelerar la programación de tu módulo:

1. Comparte con la IA la estructura de carpetas, el estado de las stores, los repositorios y la descripción específica de tus tickets de Jira.
2. Indícale que respete las rutas exclusivamente asignadas a tu rol para evitar conflictos al fusionar el código.
