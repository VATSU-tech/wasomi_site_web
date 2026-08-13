import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config.js';

export function createId() {
  return crypto.randomUUID();
}

export function slugify(input) {
  return String(input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 180);
}

export function parseJson(value, fallback = null) {
  if (value == null || value === '') return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function toJson(value) {
  if (value == null) return null;
  return JSON.stringify(value);
}

export function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

export function parseTtlToMs(ttl) {
  const match = String(ttl).match(/^(\d+)([smhd])$/i);
  if (!match) return 15 * 60 * 1000;
  const n = Number(match[1]);
  const unit = match[2].toLowerCase();
  const map = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return n * map[unit];
}

export function signAccessToken(payload) {
  return jwt.sign(payload, env.accessTokenSecret, {
    expiresIn: env.accessTokenTtl,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.accessTokenSecret);
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, env.refreshTokenSecret, {
    expiresIn: env.refreshTokenTtl,
  });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.refreshTokenSecret);
}

export function ok(res, data, meta, status = 200) {
  return res.status(status).json({ data, meta });
}

export function fail(res, status, code, message, fields) {
  return res.status(status).json({
    error: { code, message, fields },
    meta: { requestId: res.getHeader('X-Request-Id') || undefined },
  });
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
