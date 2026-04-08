import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
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
    } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  ],
});


