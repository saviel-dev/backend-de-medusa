# 🚀 Guía de Despliegue en Render (Medusa v2)

Este proyecto está preparado para ser desplegado automáticamente en [Render.com](https://render.com) utilizando **Blueprints** (Infraestructura como Código). 

El archivo `render.yaml` ya contiene toda la arquitectura necesaria:
- 🌐 **Web Service** (Servidor de Medusa)
- 🗄️ **PostgreSQL** (Base de datos relacional)
- ⚡ **Redis** (Administrador de caché)

Sigue estos pasos cuidadosamente para ponerlo en línea:

---

## Paso 1: Subir el proyecto a GitHub

Primero, necesitas tener este código en un repositorio de GitHub para que Render pueda sincronizarse con él.

Abre una terminal normal (o PowerShell) en esta misma carpeta y ejecuta:

```bash
git add render.yaml .gitignore package.json
git commit -m "chore: configuración para despliegue en render"
git push origin main
```
> *(Dependiendo del nombre de tu rama principal, puede ser `main` o `master`).*

---

## Paso 2: Crear el proyecto ("Blueprint") en Render

1. Ve a [Render.com](https://dashboard.render.com).
2. Haz clic en el botón superior derecho **New +**.
3. Selecciona la opción **Blueprint**.
4. Conecta la cuenta de GitHub y selecciona el repositorio que acabas de subir.
5. Render detectará inmediatamente el archivo `render.yaml` y construirá una planificación de la infraestructura. ¡Aprueba la creación!

> [!NOTE]
> **Variables solicitadas durante la creación:**  
> Render te solicitará llenar un par de variables importantes en un formulario web antes de arrancar. 
> - `STRIPE_API_KEY`: Tu clave secreta real de la cuenta de Stripe para cobros en vivo.
> - `STRIPE_WEBHOOK_SECRET`: Tu secreto de endpoint webhook de Stripe.

---

## Paso 3: Migración Inicial de la Base de Datos

Render ahora procederá a instalar dependencias, compilar y arrancar la base de datos PostgreSQL, Redis y tu servidor Web. Puede tardar entre 3 a 5 minutos el primer despliegue.

**Solo la primera vez que se crea el proyecto**, la base de datos está vacía. Debemos ejecutar las migraciones de tablas de Medusa y crear el administrador:

1. En el dashboard de tu servicio de Render Web (llamado `babygoo-backend`), ve a la pestaña **Shell**.
2. Una vez conectado a la línea de comandos de Render, ejecuta:

   ```bash
   npx medusa db:migrate
   ```
   *(Esto creará todas las tablas en la BD de Producción).*

3. Luego, vamos a crear tu usuario administrador inicial con tu propio email y clave segura:

   ```bash
   npx medusa user -e admin@tucorreo.com -p tu_super_clave_segura
   ```

---

## Paso 4: Ajustar dominios de CORS posteriormente

En el archivo `render.yaml` declaré dominios temporales. Tu backend **rechazará conexiones** desde clientes web que no estén autorizados.

Una vez que tengas hospedada tu **tienda pública (Storefront)** y el espacio donde verás tu panel de **Administrador Admin Web**, deberás ir al Dashboard de Render -> Variables de Entorno y modificar estas:

- `STORE_CORS`: La URL real donde viva el frente de tu tienda (ej. `https://mitienda.com`).
- `ADMIN_CORS`: La URL de tu panel de administrador.
- `AUTH_CORS`: La suma de ambas URLs separadas por comas.

¡Listo! Ya tienes Medusa v2 productivo corriendo en la nube. 🎊
