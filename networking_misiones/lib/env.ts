export const env = {
  DB_HOST: process.env.DB_HOST ?? "",
  DB_PORT: process.env.DB_PORT ?? "",
  DB_NAME: process.env.DB_NAME ?? "",
  DB_USER: process.env.DB_USER ?? "",
  DB_PASSWORD: process.env.DB_PASSWORD ?? "",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  AUTH_SECRET: process.env.AUTH_SECRET ?? "",
};

export function assertEnv() {
  const missing = Object.entries(env)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    throw new Error(
      `Faltan variables de entorno: ${missing.join(", ")}. Revisá tu archivo .env.`
    );
  }
}