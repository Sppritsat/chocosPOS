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

---

## ☁️ Despliegue en Cloudflare Pages

ChocoPOS es 100% frontend estático (todo vive en IndexedDB del navegador), así que no necesita servidor. Se eligió **Cloudflare Pages** porque, a diferencia de Vercel Hobby o GitHub Pages, no prohíbe explícitamente el uso comercial, y porque Dev-Team sirve archivos estáticos sin límite de ancho de banda ni riesgo de pausa por inactividad.

Ya incluye los dos archivos que necesita:
- `public/_redirects` — hace que recargar `/pos`, `/caja` o `/admin` no dé 404 (React Router es una SPA).
- `wrangler.toml` — permite desplegar también por línea de comandos con `wrangler pages deploy`.

### Pasos para desplegar (dashboard, recomendado)

1. **Crear la cuenta de Cloudflare** con un correo del equipo (no de la empresa — la cuenta queda a nombre de los autores, como marca el contrato). Después, en *Account → Members*, agrega al resto del equipo como miembros para que la cuenta no dependa de una sola persona.
2. En el dashboard, ve a **Workers & Pages → Create → Pages → Connect to Git** y selecciona el repositorio `chocosPOS`.
3. Configura el build:
   - Framework preset: **Vite** (o manual)
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Haz clic en **Save and Deploy**. Cloudflare te da una URL `https://chocospos.pages.dev` (o el nombre que elijas).
5. Cada `git push` a `main` vuelve a desplegar automáticamente.
6. **Opcional:** agrega un dominio propio en *Custom domains* dentro del proyecto de Pages.

### Para el Anexo A del contrato

| Campo | Valor |
|---|---|
| Modalidad de uso | En la nube |
| Proveedor de nube y plan | Cloudflare Pages, plan gratuito |
| Titular de la cuenta | LOS AUTORES |
| Dirección donde está desplegado | `https://chocospos.pages.dev` (o el dominio final) |
| Limitaciones conocidas | Cloudflare puede modificar las condiciones del plan gratuito sin aviso previo; la documentación oficial no detalla límites de builds ni despliegues por día para Pages — confirmar en la consola al desplegar |

Como la cuenta queda a nombre de los autores, aplica la cláusula duodécima del contrato: si "El yin y yang del sabor" quiere quedarse con el proyecto después del semestre, los autores deben trasladarle la cuenta o entregarle una exportación completa antes de la fecha que se fije en el Anexo A.

---

## 📊 Exportar ventas a Excel

En el panel Admin → Ventas hay un botón **"Exportar a Excel"** que genera un `.xlsx` con 3 hojas (Pedidos detallados, Por día, Por cliente) del rango de fechas seleccionado. Usa [SheetJS](https://www.npmjs.com/package/xlsx) y se carga de forma diferida (`import()` dinámico) para no abultar la carga inicial del POS — el archivo `xlsx` (~140 KB) solo se descarga cuando alguien hace clic en exportar.

---

## 📱 Empaquetar como app Android (Capacitor)

ChocoPOS ya está preparado para convertirse en una app Android instalable (`.apk`), usando [Capacitor](https://capacitorjs.com/). A diferencia de la PWA en el navegador, los datos de IndexedDB quedan guardados en el **almacenamiento privado de la app** (no del navegador del dispositivo): persisten entre usos, no se comparten con ninguna página web, y solo se borran si alguien desinstala la app o borra sus datos manualmente desde Ajustes de Android.

El proyecto ya incluye `capacitor.config.json` y las dependencias (`@capacitor/core`, `@capacitor/android`, `@capacitor/cli`). Lo que falta — añadir la carpeta nativa de Android y compilar el `.apk` — **requiere Android Studio y el SDK de Android instalados en tu computadora**; no se puede generar desde este chat porque necesita herramientas (Gradle, Android SDK) que no están disponibles aquí.

### Pasos para generar el `.apk` (en tu computadora, con Android Studio instalado)

1. Clona el repo e instala dependencias como siempre: `npm install`.
2. Agrega la plataforma Android (esto crea la carpeta `android/` con el proyecto nativo):
   ```bash
   npx cap add android
   ```
3. Cada vez que cambies el código web, reconstruye y sincroniza:
   ```bash
   npm run cap:sync
   ```
4. Abre el proyecto en Android Studio:
   ```bash
   npm run cap:open
   ```
5. Desde Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**. El `.apk` queda en `android/app/build/outputs/apk/debug/`.
6. Cópialo a la tablet e instálalo (activa "Instalar apps de orígenes desconocidos" si Android lo pide).

Para una versión firmada y lista para distribuir (no solo de prueba), Android Studio también permite generar un *Signed APK* desde ese mismo menú, pidiendo crear o usar un keystore.
