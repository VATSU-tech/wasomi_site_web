import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function parseOrigins(value) {
  return (value || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'wasomi',
  },
  frontendOrigins: parseOrigins(process.env.FRONTEND_ORIGINS),
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'dev_access_secret_change_me_32xx',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'dev_refresh_secret_change_me_32x',
  csrfSecret: process.env.CSRF_SECRET || 'dev_csrf_secret_change_me_32xxxx',
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || '7d',
  uploadDir: path.resolve(rootDir, process.env.UPLOAD_DIR || './uploads'),
  publicUploadUrl: process.env.PUBLIC_UPLOAD_URL || '/uploads',
  bootstrapAdmin: {
    email: process.env.BOOTSTRAP_ADMIN_EMAIL || 'admin@wasomi.cd',
    password: process.env.BOOTSTRAP_ADMIN_PASSWORD || 'WasomiAdmin2026!',
    name: process.env.BOOTSTRAP_ADMIN_NAME || 'Administrateur Wasomi',
  },
};

export const COOKIES = {
  access: 'wasomi_access',
  refresh: 'wasomi_refresh',
  csrf: 'wasomi_csrf',
};
