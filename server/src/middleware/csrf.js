import crypto from 'crypto';
import { COOKIES, env } from '../config.js';
import { sha256 } from '../utils/helpers.js';

export function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function setCsrfCookie(res, token) {
  res.cookie(COOKIES.csrf, token, {
    httpOnly: false,
    sameSite: 'lax',
    secure: env.cookieSecure,
    domain: env.cookieDomain,
    path: '/',
  });
  res.setHeader('X-CSRF-Token', token);
}

export function csrfProtection(req, res, next) {
  const method = req.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return next();

  const bypass = [
    '/auth/login',
    '/auth/csrf',
    '/auth/refresh',
    '/auth/logout',
    '/contact-messages',
    '/admission-requests',
  ];
  const path = req.path.startsWith(env.apiPrefix)
    ? req.path.slice(env.apiPrefix.length)
    : req.path;

  if (bypass.some((p) => path === p || path.startsWith(`${p}/`))) {
    return next();
  }

  const header = req.get('X-CSRF-Token');
  const cookie = req.cookies?.[COOKIES.csrf];
  if (!header || !cookie || header !== cookie) {
    return res.status(403).json({
      error: { code: 'CSRF_INVALID', message: 'Jeton CSRF invalide ou manquant.' },
    });
  }
  return next();
}

export function hashIp(ip) {
  return sha256(`${env.csrfSecret}:${ip || 'unknown'}`);
}
