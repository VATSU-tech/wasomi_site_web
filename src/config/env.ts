import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_SCHOOL_API_BASE_URL: z.string().url().optional(),
  VITE_APP_NAME: z.string().default("Wasomi"),
  VITE_API_TIMEOUT_MS: z.coerce.number().default(15000),
});

// Les variables optionnelles fournies vides (ex : VITE_SCHOOL_API_BASE_URL="")
// doivent être traitées comme absentes. Sinon z.string().url().optional()
// reçoit "" -> "Invalid url" et fait échouer le build Docker.
const rawEnv = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_SCHOOL_API_BASE_URL:
    import.meta.env.VITE_SCHOOL_API_BASE_URL || undefined,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_API_TIMEOUT_MS: import.meta.env.VITE_API_TIMEOUT_MS,
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("VITE_API_BASE_URL is missing or invalid in your .env");
}

const envValues = parsed.data;

export const env = {
  apiBaseUrl: envValues.VITE_API_BASE_URL,
  schoolApiBaseUrl:
    envValues.VITE_SCHOOL_API_BASE_URL || envValues.VITE_API_BASE_URL,
  appName: envValues.VITE_APP_NAME,
  apiTimeoutMs: envValues.VITE_API_TIMEOUT_MS,
} as const;
