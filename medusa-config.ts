import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

let dbUrl = process.env.DATABASE_URL || "postgres://localhost/medusa";

// Knex no soporta Supavisor en transaction mode (puerto 6543) correctamente sin configuraciones previas, 
// lo que causa timeouts ("Timeout acquiring a connection"). Forzamos el uso de session mode (5432).
if (dbUrl.includes("supabase.com") && dbUrl.includes(":6543")) {
  dbUrl = dbUrl.replace(":6543", ":5432");
}
if (process.env.NODE_ENV !== "development" && !dbUrl.includes("sslmode=require")) {
  dbUrl += dbUrl.includes("?") ? "&sslmode=require" : "?sslmode=require";
}

export default defineConfig({
  projectConfig: {
    databaseUrl: dbUrl,
    databaseDriverOptions: process.env.NODE_ENV !== "development" 
      ? { 
          connection: { ssl: { rejectUnauthorized: false } },
          pool: { min: 0, max: 3, idleTimeoutMillis: 30000 } // Limita a 3 conexiones para evitar deadlock en Render
        } 
      : {},
    // temporalmente deshabilitado para evitar crash en despliegue por credenciales de Upstash incorrectas:
    // redisUrl: process.env.REDIS_URL ? process.env.REDIS_URL : undefined, 
    // redisOptions: {
    //   maxRetriesPerRequest: 3,
    //   retryStrategy: (times) => {
    //     if (times > 3) return null;
    //     return 1000;
    //   }
    // },
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:9000,http://localhost:8000",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },

  modules: [
    // Payment module con Stripe provider — Medusa v2
    // Ver: https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider
    // NOTA: el cast `as any` es necesario por un conflicto de tipos en defineConfig()
    // de @medusajs/framework@2.13.1 cuando se usa la forma de array de módulos.
    {
      resolve: "@medusajs/payment",
      options: {
        providers: [
          {
            id: "stripe",
            resolve: "@medusajs/payment-stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            },
          },
        ],
      },
    } // eslint-disable-line @typescript-eslint/no-explicit-any
  ],
});


