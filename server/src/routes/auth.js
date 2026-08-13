import { Router } from 'express';
import { z } from 'zod';
import {
  authRequired,
  clearSession,
  findUserByEmail,
  issueSession,
  refreshSession,
  verifyPassword,
} from '../middleware/auth.js';
import { generateCsrfToken, setCsrfCookie } from '../middleware/csrf.js';
import { asyncHandler, fail, ok } from '../utils/helpers.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.get(
  '/csrf',
  asyncHandler(async (_req, res) => {
    const token = generateCsrfToken();
    setCsrfCookie(res, token);
    return ok(res, { csrfToken: token });
  }),
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, 400, 'VALIDATION_ERROR', 'Données de connexion invalides.', parsed.error.flatten().fieldErrors);
    }

    const user = await findUserByEmail(parsed.data.email);
    const valid = user && user.is_active && (await verifyPassword(user, parsed.data.password));
    if (!valid) {
      return fail(res, 401, 'INVALID_CREDENTIALS', 'Adresse e-mail ou mot de passe invalide.');
    }

    const publicData = await issueSession(res, user, req);
    return ok(res, publicData);
  }),
);

router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    await clearSession(req, res);
    return ok(res, null);
  }),
);

router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const user = await refreshSession(req, res);
    if (!user) {
      return fail(res, 401, 'UNAUTHENTICATED', 'Session expirée ou non autorisée.');
    }
    return ok(res, user);
  }),
);

router.get(
  '/me',
  authRequired,
  asyncHandler(async (req, res) => {
    return ok(res, req.user);
  }),
);

router.post(
  '/forgot-password',
  asyncHandler(async (_req, res) => {
    return ok(res, { message: 'Si un compte existe, un e-mail a été envoyé.' });
  }),
);

router.post(
  '/reset-password',
  asyncHandler(async (_req, res) => {
    return fail(res, 501, 'NOT_IMPLEMENTED', 'Réinitialisation non configurée.');
  }),
);

router.post(
  '/verify-email',
  asyncHandler(async (_req, res) => {
    return fail(res, 501, 'NOT_IMPLEMENTED', 'Vérification e-mail non configurée.');
  }),
);

export default router;
