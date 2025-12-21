import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // Disable SSL for Docker PostgreSQL connection
    databaseDriverOptions: {
      ssl: false,
    },
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    redisUrl: process.env.REDIS_URL,
  },
  admin: {
    // Vite config for admin dashboard in Docker
    vite: (config) => ({
      ...config,
      server: {
        ...config.server,
        host: "0.0.0.0",
        allowedHosts: true,
      },
    }),
  },
})
