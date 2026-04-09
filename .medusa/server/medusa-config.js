"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV || "development", process.cwd());
let dbUrl = process.env.DATABASE_URL || "postgres://localhost/medusa";
// Knex no soporta Supavisor en transaction mode (puerto 6543) correctamente sin configuraciones previas, 
// lo que causa timeouts ("Timeout acquiring a connection"). Forzamos el uso de session mode (5432).
if (dbUrl.includes("supabase.com") && dbUrl.includes(":6543")) {
    dbUrl = dbUrl.replace(":6543", ":5432");
}
if (process.env.NODE_ENV !== "development" && !dbUrl.includes("sslmode=require")) {
    dbUrl += dbUrl.includes("?") ? "&sslmode=require" : "?sslmode=require";
}
exports.default = (0, utils_1.defineConfig)({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBa0U7QUFFbEUsSUFBQSxlQUFPLEVBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBRTlELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxJQUFJLDZCQUE2QixDQUFDO0FBRXRFLDBHQUEwRztBQUMxRyxvR0FBb0c7QUFDcEcsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUM5RCxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUNELElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssYUFBYSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUM7SUFDakYsS0FBSyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQztBQUN6RSxDQUFDO0FBRUQsa0JBQWUsSUFBQSxvQkFBWSxFQUFDO0lBQzFCLGFBQWEsRUFBRTtRQUNiLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLHFCQUFxQixFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLGFBQWE7WUFDM0QsQ0FBQyxDQUFDO2dCQUNFLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUNsRCxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLENBQUMsdURBQXVEO2FBQzNHO1lBQ0gsQ0FBQyxDQUFDLEVBQUU7UUFDTix1R0FBdUc7UUFDdkcsd0VBQXdFO1FBQ3hFLGtCQUFrQjtRQUNsQiw2QkFBNkI7UUFDN0IsZ0NBQWdDO1FBQ2hDLGtDQUFrQztRQUNsQyxtQkFBbUI7UUFDbkIsTUFBTTtRQUNOLEtBQUs7UUFDTCxJQUFJLEVBQUU7WUFDSixTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksdUJBQXVCO1lBQzVELFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSx1QkFBdUI7WUFDNUQsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLDZDQUE2QztZQUNoRixTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksYUFBYTtZQUNsRCxZQUFZLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLElBQUksYUFBYTtTQUN6RDtLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsaURBQWlEO1FBQ2pELHFGQUFxRjtRQUNyRixrRkFBa0Y7UUFDbEYsNEVBQTRFO1FBQzVFO1lBQ0UsT0FBTyxFQUFFLG1CQUFtQjtZQUM1QixPQUFPLEVBQUU7Z0JBQ1AsU0FBUyxFQUFFO29CQUNUO3dCQUNFLEVBQUUsRUFBRSxRQUFRO3dCQUNaLE9BQU8sRUFBRSwwQkFBMEI7d0JBQ25DLE9BQU8sRUFBRTs0QkFDUCxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjOzRCQUNsQyxhQUFhLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUI7eUJBQ2pEO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLHlEQUF5RDtLQUM1RDtDQUNGLENBQUMsQ0FBQyJ9