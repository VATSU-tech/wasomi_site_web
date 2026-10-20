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

/**
 * Construit la liste des tranches à partir du tableau moderne ou des
 * anciens champs first/second/thirdInstallment.
 */
function buildInstallments(fees) {
  if (Array.isArray(fees.installments)) {
    return fees.installments
      .map((inst, i) => {
        if (!inst || typeof inst !== 'object') return null;
        const label = String(inst.label || '').trim().slice(0, 80);
        if (!label) return null;
        return {
          id: String(inst.id || createId()),
          label,
          amount: String(inst.amount ?? '').trim().slice(0, 40),
          sort_order: i,
        };
      })
      .filter(Boolean);
  }

  const legacy = [
    { id: 'inst-1', label: '1ère tranche', amount: fees.firstInstallment },
    { id: 'inst-2', label: '2ème tranche', amount: fees.secondInstallment },
    { id: 'inst-3', label: '3ème tranche', amount: fees.thirdInstallment },
  ]
    .filter((row) => row.amount != null && String(row.amount).trim() !== '')
    .map((row, i) => ({
      id: row.id,
      label: row.label,
      amount: String(row.amount).trim().slice(0, 40),
      sort_order: i,
    }));

  return legacy;
}

/**
 * Normalise la structure des frais d'une formation.
 * Prix total = somme des composantes lorsqu'elles existent.
 * Les tranches (installments) sont éditables par formation et exposées
 * au site public selon showInstallments.
 */
export function normalizeFees(fees, currencyFallback = '$') {
  if (fees == null) return null;
  if (typeof fees !== 'object' || Array.isArray(fees)) return null;

  const currency = String(fees.currency || currencyFallback || '$').trim() || '$';
  const rawComponents = Array.isArray(fees.components) ? fees.components : [];

  const components = rawComponents
    .map((c, i) => {
      if (!c || typeof c !== 'object') return null;
      const label = String(c.label || c.name || '').trim().slice(0, 120);
      if (!label) return null;
      const amount = Number.parseFloat(String(c.amount ?? c.value ?? 0).replace(',', '.'));
      return {
        id: String(c.id || createId()),
        label,
        amount: Number.isFinite(amount) ? amount : 0,
        description: c.description != null ? String(c.description).slice(0, 500) : '',
        sort_order: Number.isFinite(Number(c.sort_order)) ? Number(c.sort_order) : i,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c, i) => ({ ...c, sort_order: i }));

  const componentsTotal = components.reduce((sum, c) => sum + c.amount, 0);
  const formatMoney = (n) => `${Number(n).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${currency}`.trim();

  let total = fees.total != null ? String(fees.total).trim() : '';
  if (components.length > 0) {
    total = formatMoney(componentsTotal);
  }

  const installments = buildInstallments(fees);
  const showInstallments =
    fees.showInstallments !== false && fees.show_installments !== false;

  const result = {
    currency,
    total: total || null,
    components,
    cycle: fees.cycle != null ? String(fees.cycle).slice(0, 120) : undefined,
    showInstallments,
    installments,
  };

  for (const key of ['connectedFees', 'labotech', 'infirmary']) {
    if (fees[key] != null && fees[key] !== '') result[key] = String(fees[key]);
  }
  if (installments[0]) result.firstInstallment = installments[0].amount;
  else if (fees.firstInstallment) result.firstInstallment = String(fees.firstInstallment);
  if (installments[1]) result.secondInstallment = installments[1].amount;
  else if (fees.secondInstallment) result.secondInstallment = String(fees.secondInstallment);
  if (installments[2]) result.thirdInstallment = installments[2].amount;
  else if (fees.thirdInstallment) result.thirdInstallment = String(fees.thirdInstallment);

  return result;
}

export function feesTotalAsPrice(fees) {
  if (!fees) return null;
  if (fees.components?.length) {
    const sum = fees.components.reduce((s, c) => s + (Number(c.amount) || 0), 0);
    const currency = fees.currency || '$';
    return `${sum} ${currency}`.trim();
  }
  if (fees.total) return String(fees.total);
  return null;
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
