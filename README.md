## 🍫 ChocoPOS — Sistema de Punto de Venta Offline-First para Chocolatería

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
│   └── manifest.json          # Configuración PWA Offline
├── src/
│   ├── assets/                # Logotipos, imágenes y recursos estáticos
│   ├── components/            # Componentes reutilizables UI (Botones, Modales, Inputs)
│   ├── context/               # Estado global (Auth, Estado de Caja, Carrito actual)
│   ├── db/                    # Base de Datos Local IndexedDB (Dexie.js)
│   │   ├── db.js              # Definición del Schema y Tablas
│   │   └── seed.js            # Datos iniciales (catálogo por defecto)
│   ├── features/              # Módulos principales asignados al equipo
│   │   ├── admin/             # [Dev 4] Panel de Control, Menú, Precios y Estadísticas
│   │   ├── pos/               # [Dev 2] Toma de Pedidos, Personalización e Impresión de Vaso
│   │   └── register/          # [Dev 3] Cobro, Cambio, Apertura, Arqueo y Corte de Caja
│   ├── hooks/                 # Custom Hooks para lectura/escritura en IndexedDB
│   ├── services/              # Servicio de conexión e impresión Bluetooth
│   │   └── thermalPrinter.js  # Lógica para enviar comandos ESC/POS / TSPL
│   ├── utils/                 # Formateadores de moneda, fechas, validadores de PIN
│   ├── App.jsx                # Enrutador simple o selector de vistas según el rol
│   └── main.jsx               # Punto de entrada de la app
├── index.html
├── package.json
├── tailwind.config.js
└── README.md

```

---

## 💾 Modelo de Datos Local (`src/db/db.js`)

Se utiliza **Dexie.js** para gestionar **IndexedDB** en la memoria del dispositivo.

```javascript
import Dexie from 'dexie';

export const db = new Dexie('ChocoPOS_DB');

// Definición del esquema de tablas e índices
db.version(1).stores({
  productos: '++id, nombre, categoria, precio, activo',
  opciones: '++id, grupo, nombre, precioExtra', // Leches, sabores, toppings
  pedidos: '++id, fecha, cliente, metodoPago, total, sesionCajaId',
  sesionesCaja: '++id, fechaApertura, fechaCierre, estado' // estado: 'ABIERTA' | 'CERRADA'
});

```

---

## 👥 Matriz de Responsabilidades y Reparto de Tareas (4 Devs)

Cada integrante trabajará exclusivamente sobre sus rutas asignadas para mantener independencia operativa en Git.

| Desarrollador | Módulo / Rol | Carpetas Asignadas | Responsabilidades Clave |
| --- | --- | --- | --- |
| **Dev 1 (Lead & DB)** | Core, Persistencia & Estado Global | `src/db/`, `src/context/`, `src/hooks/` | - Configurar Dexie.js y seeds iniciales.<br>

<br>- Crear React Context para sesión/caja.<br>

<br>- Proveer custom hooks (`useProducts`, `useOrders`, `useRegister`). |
| **Dev 2 (POS & Impresión)** | Toma de Pedidos & Etiquetas | `src/features/pos/`, `src/services/` | - UI de armado de bebida (Sabor, Leche, Toppings, Cliente).<br>

<br>- Vista previa de comanda.<br>

<br>- Servicio de impresión Bluetooth/USB para vasos. |
| **Dev 3 (Caja & Cobro)** | Modal Cobro, Arqueo & Corte | `src/features/register/` | - Modal de cobro (Efectivo/Tarjeta, cálculo de cambio).<br>

<br>- Apertura de caja con fondo inicial.<br>

<br>- Proceso de arqueo, cálculo de diferencias y ticket de cierre. |
| **Dev 4 (Admin & Dashboard)** | Administración, Menú & Reportes | `src/features/admin/` | - Autenticación con PIN para Administradora.<br>

<br>- CRUD de productos, opciones y precios.<br>

<br>- Vista de estadísticas (Ventas del día, totales por cliente). |

---

## 💻 Especificaciones de Funciones por Módulo

### 1. Módulo POS - Toma de Pedidos (Dev 2)

* Selección intuitiva mediante botones grandes de categoría (Fríos, Calientes, Especia).
* Modificadores de bebida:
* **Sabor Base:** Oscuro, Blanco, Con Menta, etc.
* **Tipo de Leche:** Entera, Deslactosada, Almendra, Avena, etc.
* **Toppings / Extras:** Chispas, Crema batida, etc.


* Nombre del cliente y notas específicas del preparado.
* Envió de etiqueta a la impresora térmica con el formato:

```text
================================
  CHOCO-POS  -  PEDIDO #042     
================================
Cliente: JOSÉ
Fecha:   02/10/2026 14:30
--------------------------------
Bebida:  Choco Especial (Gde)
Leche:   Deslactosada
Sabor:   Menta / Oscuro
Notas:   Sin crema batida
================================

```

### 2. Módulo de Cobro, Arqueo y Cierre de Caja (Dev 3)

* **Flujo de Pago:**
* **Efectivo:** Muestra total, ingreso de efectivo recibido (con botones de billetes rápidos `$50`, `$100`, `$200`, `$500`) y **resalta el cambio exacto a entregar**.
* **Tarjeta:** Registra el pago sin cálculo de cambio.


* **Apertura de Caja:** Declaración del monto inicial en efectivo.
* **Corte de Caja (Cierre):**
* Suma automática de `Fondo Inicial` + `Ventas en Efectivo`.
* Ingreso manual del dinero contado físicamente por la administradora.
* Cálculo y registro de diferencias (Faltantes o Sobrantes).
* Generación del ticket impreso de resumen diario.



### 3. Módulo de Administración y Reportes (Dev 4)

* Teclado numérico (Numpad) para ingresar PIN de seguridad (Ejemplo: `1234`).
* Editor de Catálogo: Agregar, activar/desactivar y cambiar precios de bebidas o ingredientes secundario.
* Dashboard de Ventas:
* Historial de transacciones filtrable por día.
* Desglose: Total vendido en Efectivo vs. Tarjeta.
* Registro y conteo del total acumulado por cliente.



---

## 🔀 Flujo de Trabajo en Git (Git Flow)

Para prevenir sobreescrituras en el código, **está estrictamente prohibido hacer commits directos a la rama `main**`.

1. **Clonar el repositorio:**
```bash
git clone <URL_DEL_REPOSI TORIO>
cd chocopos

```


2. **Crear una rama según el módulo asignado:**
* Dev 1: `git checkout -b feature/core-database`
* Dev 2: `git checkout -b feature/pos-interface`
* Dev 3: `git checkout -b feature/caja-cobro`
* Dev 4: `git checkout -b feature/admin-dashboard`


3. **Guardar cambios y subir la rama:**
```bash
git add .
git commit -m "feat: agrega formulario de cobro con cálculo de cambio"
git push origin feature/caja-cobro

```


4. **Crear un Pull Request (PR):** Solicitar la revisión del Lead Developer antes de fusionar a `main`.

---

## 🚀 Instalación y Ejecución Local

1. Instalar dependencias:
```bash
npm install

```


2. Ejecutar servidor de desarrollo local:
```bash
npm run dev

```


3. Abrir la dirección IP mostrada en la terminal desde el navegador Chrome de la tablet o teléfono conectado a la misma red local Wi-Fi.
