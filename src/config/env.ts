import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3000/api/v1'),
  VITE_APP_NAME: z.string().default('Wasomi'),
  VITE_API_TIMEOUT_MS: z.coerce.number().default(15000),
});

const parsed = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_API_TIMEOUT_MS: import.meta.env.VITE_API_TIMEOUT_MS,
});

if (!parsed.success) {
  console.warn('Invalid environment variables, fallback to defaults:', parsed.error.flatten().fieldErrors);
}

const envValues = parsed.success
  ? parsed.data
  : {
      VITE_API_BASE_URL: 'http://localhost:3000/api/v1',
      VITE_APP_NAME: 'Wasomi',
      VITE_API_TIMEOUT_MS: 15000,
    };

export const env = {
  apiBaseUrl: envValues.VITE_API_BASE_URL,
  appName: envValues.VITE_APP_NAME,
  apiTimeoutMs: envValues.VITE_API_TIMEOUT_MS,
} as const;
