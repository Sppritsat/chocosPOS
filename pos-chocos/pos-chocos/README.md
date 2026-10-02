```markdown
# 🍫 ChocoPOS — Sistema de Punto de Venta Offline-First para Chocolatería

ChocoPOS es una aplicación web progresiva (PWA) de alto rendimiento diseñada para operar **100% offline** (sin conexión a Internet) desde tablets o teléfonos celulares Android. Permite la toma rápida de pedidos personalizados, impresión directa de etiquetas adhesivas para vasos vía Bluetooth/USB, gestión de pagos, control estricto de caja (arqueo/corte) y administración de catálogo y reportes con control de acceso mediante PIN.

---

## 🛠️ Stack Tecnológico

* **Frontend Framework:** React 18+ con Vite (JavaScript / JSX)
* **Estilos & UI:** TailwindCSS + Lucide React (Íconos *touch-friendly*)
* **Persistencia Local (Offline-First):** IndexedDB encapsulado con **Dexie.js**
* **Impresión:** Web Bluetooth API / ESC-POS / CSS Print Media (`@media print`)
* **Ejecución Target:** Navegador Chrome / PWA instalada en Tablet o Celular Android

---

## 📁 Estructura del Repositorio (Croquis del Proyecto)

El proyecto está diseñado bajo una arquitectura modular limpia para evitar conflictos en Git entre los 4 desarrolladores.

```text
chocopos/
├── public/
│   ├── favicon.ico
│   ├── icon-192.png           # Ícono PWA (Pendiente de agregar)
│   ├── icon-512.png           # Ícono PWA (Pendiente de agregar)
│   └── manifest.json          # Configuración PWA Offline
├── src/
│   ├── assets/                # Logotipos, imágenes y recursos estáticos
│   ├── components/            # Componentes reutilizables UI
│   │   └── common/            # [Dev 1] Layout y elementos compartidos
│   ├── store/                 # [Dev 1] Estados globales (useCartStore, useSessionStore)
│   ├── hooks/                 # [Dev 1] Custom Hooks (useSesionActiva)
│   ├── db/                    # [Dev 1] Base de Datos Local IndexedDB (Dexie.js)
│   │   ├── db.js              # Definición del Schema y Tablas
│   │   ├── seed.js            # Datos iniciales (catálogo por defecto)
│   │   └── repositories.js    # Consultas y transacciones atómicas
│   ├── pages/                 # Páginas principales por módulo
│   │   ├── PosPage.jsx        # [Dev 2]
│   │   ├── CajaPage.jsx       # [Dev 3]
│   │   └── AdminPage.jsx      # [Dev 4]
│   ├── features/              
│   │   ├── pos/               # [Dev 2] Toma de Pedidos, Personalización e Impresión de Vaso
│   │   ├── register/          # [Dev 3] Cobro, Cambio, Apertura, Arqueo y Corte de Caja
│   │   └── admin/             # [Dev 4] Panel de Control, Menú, Precios y Estadísticas
│   ├── utils/                 
│   │   ├── printer/           # [Dev 2] Lógica de impresión Bluetooth / Simulación
│   │   ├── cambio.js          # [Dev 3] Lógica matemática para cálculo de cambio
│   │   └── stats.js           # [Dev 4] Procesamiento de métricas y reportes
│   ├── App.jsx                # Enrutador principal por módulos
│   └── main.jsx               # Punto de entrada
├── index.html
├── package.json
├── tailwind.config.js
└── README.md

```

---

## 💾 Modelo de Datos Local (`src/db/db.js`)

Se utiliza **Dexie.js** para gestionar **IndexedDB** en la memoria del dispositivo con cuatro colecciones principales:

* **productos:** Almacena tipo (`base`, `sabor`, `leche`, `topping`), nombre, precio y estado activo.
* **pedidos:** Guarda cliente, fecha, método de pago, ítems seleccionados, total, efectivo recibido y cambio, enlazado al ID de sesión de caja.
* **sesiones_caja:** Registra apertura, fondo inicial, ventas en efectivo/tarjeta, efectivo contado, diferencia y estado (`ABIERTA` o `CERRADA`).
* **config:** Almacena credenciales de seguridad (PIN de administrador).

---

## 👥 Matriz de Responsabilidades y Asignación del Equipo

| Desarrollador | Módulo / Rol | Carpetas / Archivos Asignados | Responsabilidades Clave |
| --- | --- | --- | --- |
| **Dev 1: José Emilio** | Core, Persistencia & Base de Datos | `src/db/`, `src/store/`, `src/hooks/`, `src/components/common/`, `App.jsx`, `main.jsx` | - Configurar Dexie.js, esquemas y seeds iniciales.<br>

<br>- Crear stores globales de carrito y sesión.<br>

<br>- Establecer la estructura base y enrutamiento. |
| **Dev 2: Jimena** | POS & Impresión de Etiquetas | `src/pages/PosPage.jsx`, `src/features/pos/`, `src/utils/printer/` | - Interfaz táctil de armado de bebidas (Sabor, Leche, Toppings, Cliente).<br>

<br>- Panel del carrito de compras.<br>

<br>- Plantilla de etiqueta y servicio de impresión Bluetooth/USB. |
| **Dev 3: Karlo** | Caja, Cobro & Arqueo | `src/pages/CajaPage.jsx`, `src/features/register/`, `src/utils/cambio.js` | - Formulario de apertura de caja con fondo inicial.<br>

<br>- Modal de cobro (Efectivo/Tarjeta) con cálculo automático de cambio.<br>

<br>- Pantalla de arqueo, cálculo de diferencias y ticket de cierre. |
| **Dev 4: César** | Administración & Dashboard | `src/pages/AdminPage.jsx`, `src/features/admin/`, `src/utils/stats.js` | - Control de acceso por PIN numérico.<br>

<br>- CRUD de catálogo, precios y componentes.<br>

<br>- Dashboard de estadísticas de ventas diarias y por cliente. |

---

## 🔀 Flujo de Trabajo en Git (Git Flow)

Para prevenir sobreescrituras en el código, **está estrictamente prohibido hacer commits directos a la rama `main**`.

1. **Clonar el repositorio:**
```bash
git clone [https://github.com/Sppritsat/chocosPOS.git](https://github.com/Sppritsat/chocosPOS.git)
cd chocopos

```


2. **Crear una rama según tu módulo asignado:**
* José Emilio (Dev 1): `git checkout -b feature/dev1-core-db`
* Jimena (Dev 2): `git checkout -b feature/dev2-pos-print`
* Karlo (Dev 3): `git checkout -b feature/dev3-caja-cobro`
* César (Dev 4): `git checkout -b feature/dev4-admin-stats`


3. **Guardar cambios y subir tu rama:**
```bash
git add .
git commit -m "feat: [CHOCO-X] descripción del avance"
git push origin <nombre-de-tu-rama>

```


4. **Crear un Pull Request (PR):** Solicitar revisión en GitHub antes de fusionar a `main`.

---

## 🚀 Instalación y Ejecución Local

1. Instalar dependencias del proyecto base:
```bash
npm install

```


2. Iniciar el servidor de desarrollo local:
```bash
npm run dev

```


3. Abrir la dirección IP generada en la terminal desde el navegador Chrome de la tablet o teléfono conectado a la red local Wi-Fi.

```