# 🚀 Despliegue Gratuito en Render — Medusa v2

Guía definitiva para desplegar el backend de **MedusaJS v2** completamente gratis usando:

| Servicio | Proveedor | Costo |
|----------|-----------|-------|
| 🌐 Servidor Web (Node.js) | [Render.com](https://render.com) | $0.00 |
| 🗄️ Base de datos (PostgreSQL) | [Supabase.com](https://supabase.com) | $0.00 |
| ⚡ Caché (Redis) | [Upstash.com](https://upstash.com) | $0.00 |

---

## Paso 1 — Conseguir la URL de la base de datos (Supabase)

1. Inicia sesión en [supabase.com](https://supabase.com) y entra a tu proyecto.
2. Haz clic en el **botón verde "Connect"** que aparece en la barra superior.
3. En la ventana que se abre, elige la pestaña **"ORM (Third-party library)"**.
4. Selecciona **"Prisma"** como ORM en el selector desplegable.
5. Baja al paso 2 ("Configure ORM") y localiza la línea que dice:
   ```
   DATABASE_URL="postgresql://postgres.XXXXXXXX:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
   ```
6. **Copia ese enlace** (entre las comillas) y **reemplaza `[YOUR-PASSWORD]`** con la contraseña que creaste en Supabase.

> [!IMPORTANT]
> Usa el enlace que tiene el puerto **5432** (Session Mode), NO el de 6543. El ORM de Medusa (Knex) requiere iniciar características de sesión durante el arranque, y el Transaction Mode (6543) causará que la aplicación haga timeout y no inicie.

---

## Paso 2 — Conseguir la URL de Redis (Upstash)

1. Entra a [upstash.com](https://upstash.com) y crea una cuenta gratuita.
2. Haz clic en **"Create Redis Database"**.
3. Ponle un nombre, elige la región **US-East-1** (o la más cercana) y haz clic en Crear.
4. En la pantalla principal de tu base de datos, busca la sección **"Endpoint"**. Verás una línea así:
   ```
   redis-cli --tls -u redis://default:TU_CLAVE_LARGA@united-xxxx.upstash.io:6379
   ```
5. De esa línea, **solo copia la parte que empieza con `redis://`**, y **cambia `redis://` por `rediss://`** (con doble "s").

   Tu URL final debe verse así:
   ```
   rediss://default:TU_CLAVE_LARGA@united-xxxx.upstash.io:6379
   ```

> [!NOTE]
> La doble "s" en `rediss://` activa la conexión TLS/SSL segura que Upstash exige obligatoriamente.

---

## Paso 3 — Crear el Blueprint en Render

1. Inicia sesión en [dashboard.render.com](https://dashboard.render.com).
2. Haz clic en el botón **"New +"** (arriba a la derecha).
3. Selecciona la opción **"Blueprint"**.
4. Conecta tu cuenta de GitHub y selecciona el repositorio `saviel-dev/backend-de-medusa`.
5. Elige la rama `main` y haz clic en **"Apply"**.

Render detectará automáticamente el archivo `render.yaml` de tu repositorio.

---

## Paso 4 — Llenar las variables secretas

Render te mostrará un formulario con 4 campos vacíos. Llénalos así:

| Variable | Valor que debes pegar |
|----------|----------------------|
| `DATABASE_URL` | La URL de Supabase completa del Paso 1 (con tu contraseña incluida) |
| `REDIS_URL` | La URL de Upstash del Paso 2 (empezando por `rediss://`) |
| `STRIPE_API_KEY` | Tu clave secreta de Stripe (`sk_test_...`) o `temporal1` si no la tienes aún |
| `STRIPE_WEBHOOK_SECRET` | Tu webhook secret de Stripe (`whsec_...`) o `temporal2` si no la tienes aún |

Una vez llenados los 4 campos, haz clic en **"Apply/Aplicar"** al final.

---

## Paso 5 — Esperar el despliegue inicial

Render comenzará a trabajar automáticamente:
- Descargará tu código desde GitHub.
- Ejecutará `npm install` para instalar dependencias.
- Ejecutará `npm run build` para compilar Medusa.

**Esto tarda entre 3 a 5 minutos.** Cuando la bolita giratoria junto a tu servicio se vuelva verde, el servidor estará en línea.

---

## Paso 6 — Inicializar la base de datos (solo la primera vez)

Como la base de datos en Supabase está recién creada y vacía, debes crear las tablas de Medusa:

1. En tu dashboard de Render, haz clic sobre el servicio `babygoo-backend`.
2. En el menú lateral izquierdo, haz clic en **"Shell"**.
3. Ejecuta el siguiente comando para crear todas las tablas:
   ```bash
   npx medusa db:migrate
   ```
4. Cuando termine, crea tu usuario administrador:
   ```bash
   npx medusa user -e tu@correo.com -p tu_contraseña_segura
   ```

---

## ✅ ¡Tu backend ya está en línea!

Render te habrá asignado una URL pública que termina en `.onrender.com`. 

Para ingresar al panel de administración añade `/app` al final:
```
https://babygoo-backend.onrender.com/app
```

Ingresa con el correo y contraseña que usaste en el **Paso 6**.

> [!NOTE]
> En el plan **gratuito de Render**, el servidor se "duerme" tras 15 minutos de inactividad. La primera petición después de ese tiempo tardará unos 30-60 segundos en responder mientras vuelve a arrancar. Esto es normal y completamente gratuito.

---

## 🔧 Variables de entorno a actualizar después

Cuando tengas lista tu tienda pública (Storefront), actualiza estas variables desde el panel de Render → **Environment**:

- `STORE_CORS`: La URL real de tu tienda (ej. `https://mitienda.com`)
- `ADMIN_CORS`: La URL de tu panel de administrador
- `AUTH_CORS`: Ambas URLs separadas por comas
- `STRIPE_API_KEY`: Tu clave real de Stripe de producción
- `STRIPE_WEBHOOK_SECRET`: Tu secreto de webhook de Stripe de producción
