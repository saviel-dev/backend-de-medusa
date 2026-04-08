"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV || "development", process.cwd());
exports.default = (0, utils_1.defineConfig)({
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL || "postgres://localhost/medusa",
        redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
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
        },
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBa0U7QUFFbEUsSUFBQSxlQUFPLEVBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBRTlELGtCQUFlLElBQUEsb0JBQVksRUFBQztJQUMxQixhQUFhLEVBQUU7UUFDYixXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLElBQUksNkJBQTZCO1FBQ3RFLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSx3QkFBd0I7UUFDM0QsSUFBSSxFQUFFO1lBQ0osU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLHVCQUF1QjtZQUM1RCxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksdUJBQXVCO1lBQzVELFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSw2Q0FBNkM7WUFDaEYsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLGFBQWE7WUFDbEQsWUFBWSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxJQUFJLGFBQWE7U0FDekQ7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLGlEQUFpRDtRQUNqRCxxRkFBcUY7UUFDckYsa0ZBQWtGO1FBQ2xGLDRFQUE0RTtRQUM1RTtZQUNFLE9BQU8sRUFBRSxtQkFBbUI7WUFDNUIsT0FBTyxFQUFFO2dCQUNQLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxFQUFFLEVBQUUsUUFBUTt3QkFDWixPQUFPLEVBQUUsMEJBQTBCO3dCQUNuQyxPQUFPLEVBQUU7NEJBQ1AsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYzs0QkFDbEMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCO3lCQUNqRDtxQkFDRjtpQkFDRjthQUNGO1NBQ0s7S0FDVDtDQUNGLENBQUMsQ0FBQyJ9