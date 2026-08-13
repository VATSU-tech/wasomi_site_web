import argon2 from 'argon2';
import { query, queryOne } from '../db.js';
import { COOKIES, env } from '../config.js';
import {
  createId,
  parseTtlToMs,
  sha256,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../utils/helpers.js';
import { generateCsrfToken, hashIp, setCsrfCookie } from './csrf.js';

export async function findUserByEmail(email) {
  return queryOne(
    `SELECT * FROM User
     WHERE email = :email AND deleted_at IS NULL
     LIMIT 1`,
    { email: String(email).trim().toLowerCase() },
  );
}

export async function findUserById(id) {
  return queryOne(
    `SELECT * FROM User
     WHERE id = :id AND deleted_at IS NULL
     LIMIT 1`,
    { id },
  );
}

export async function getUserRolesAndPermissions(userId) {
  const roles = await query(
    `SELECT r.id, r.name
     FROM UserRole ur
     JOIN Role r ON r.id = ur.role_id
     WHERE ur.user_id = :userId AND r.deleted_at IS NULL`,
    { userId },
  );

  const permissions = await query(
    `SELECT DISTINCT p.\`key\` AS slug
     FROM UserRole ur
     JOIN RolePermission rp ON rp.role_id = ur.role_id
     JOIN Permission p ON p.id = rp.permission_id
     WHERE ur.user_id = :userId`,
    { userId },
  );

  return {
    roles: roles.map((r) => ({ id: r.id, name: r.name, slug: r.name })),
    permissions: permissions.map((p) => p.slug),
  };
}

export function publicUser(user, rolesPerms) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: null,
    roles: rolesPerms.roles,
    permissions: rolesPerms.permissions,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

export async function verifyPassword(user, password) {
  if (!user?.password_hash || !password) return false;
  try {
    return await argon2.verify(user.password_hash, password);
  } catch {
    return false;
  }
}

function cookieOptions(maxAgeMs) {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.cookieSecure,
    domain: env.cookieDomain,
    path: '/',
    maxAge: maxAgeMs,
  };
}

export async function issueSession(res, user, req) {
  const rolesPerms = await getUserRolesAndPermissions(user.id);
  const access = signAccessToken({ sub: user.id, email: user.email });
  const refresh = signRefreshToken({ sub: user.id });
  const refreshHash = sha256(refresh);
  const sessionId = createId();
  const expiresAt = new Date(Date.now() + parseTtlToMs(env.refreshTokenTtl));

  await query(
    `INSERT INTO RefreshSession
      (id, user_id, token_hash, expires_at, revoked_at, replaced_by_session_id, ip_hash, user_agent, created_at, updated_at)
     VALUES
      (:id, :userId, :tokenHash, :expiresAt, NULL, NULL, :ipHash, :userAgent, NOW(3), NOW(3))`,
    {
      id: sessionId,
      userId: user.id,
      tokenHash: refreshHash,
      expiresAt,
      ipHash: hashIp(req.ip),
      userAgent: String(req.get('user-agent') || '').slice(0, 512),
    },
  );

  await query(`UPDATE User SET last_login_at = NOW(3), updated_at = NOW(3) WHERE id = :id`, {
    id: user.id,
  });

  res.cookie(COOKIES.access, access, cookieOptions(parseTtlToMs(env.accessTokenTtl)));
  res.cookie(COOKIES.refresh, refresh, cookieOptions(parseTtlToMs(env.refreshTokenTtl)));
  const csrf = generateCsrfToken();
  setCsrfCookie(res, csrf);

  return publicUser(user, rolesPerms);
}

export async function clearSession(req, res) {
  const refresh = req.cookies?.[COOKIES.refresh];
  if (refresh) {
    const hash = sha256(refresh);
    await query(
      `UPDATE RefreshSession SET revoked_at = NOW(3), updated_at = NOW(3)
       WHERE token_hash = :hash AND revoked_at IS NULL`,
      { hash },
    );
  }
  res.clearCookie(COOKIES.access, { path: '/' });
  res.clearCookie(COOKIES.refresh, { path: '/' });
  res.clearCookie(COOKIES.csrf, { path: '/' });
}

export async function refreshSession(req, res) {
  const refresh = req.cookies?.[COOKIES.refresh];
  if (!refresh) return null;

  let payload;
  try {
    payload = verifyRefreshToken(refresh);
  } catch {
    return null;
  }

  const hash = sha256(refresh);
  const session = await queryOne(
    `SELECT * FROM RefreshSession
     WHERE token_hash = :hash AND revoked_at IS NULL AND expires_at > NOW(3)
     LIMIT 1`,
    { hash },
  );
  if (!session || session.user_id !== payload.sub) return null;

  const user = await findUserById(session.user_id);
  if (!user || !user.is_active) return null;

  await query(
    `UPDATE RefreshSession SET revoked_at = NOW(3), updated_at = NOW(3) WHERE id = :id`,
    { id: session.id },
  );

  return issueSession(res, user, req);
}

export async function authRequired(req, res, next) {
  const token = req.cookies?.[COOKIES.access];
  if (!token) {
    return res.status(401).json({
      error: { code: 'UNAUTHENTICATED', message: 'Session expirée ou non autorisée.' },
    });
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await findUserById(payload.sub);
    if (!user || !user.is_active) {
      return res.status(401).json({
        error: { code: 'UNAUTHENTICATED', message: 'Session expirée ou non autorisée.' },
      });
    }
    const rolesPerms = await getUserRolesAndPermissions(user.id);
    req.user = publicUser(user, rolesPerms);
    req.userRow = user;
    return next();
  } catch {
    return res.status(401).json({
      error: { code: 'UNAUTHENTICATED', message: 'Session expirée ou non autorisée.' },
    });
  }
}

export function requirePermission(...keys) {
  return (req, res, next) => {
    const perms = req.user?.permissions || [];
    const roles = req.user?.roles?.map((r) => r.slug) || [];
    if (roles.includes('super_admin') || roles.includes('administrator')) {
      return next();
    }
    if (keys.length === 0 || keys.some((k) => perms.includes(k))) {
      return next();
    }
    return res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Accès refusé.' },
    });
  };
}
