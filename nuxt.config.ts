// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFrom: process.env.SMTP_FROM,
    smtpBcc: process.env.SMTP_BCC,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    public: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3000",
    },
  },
});
