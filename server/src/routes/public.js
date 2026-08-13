import { Router } from 'express';
import { z } from 'zod';
import { query, queryOne } from '../db.js';
import { findUserByEmail, issueSession, verifyPassword } from '../middleware/auth.js';
import { asyncHandler, createId, fail, ok, parseJson } from '../utils/helpers.js';

const router = Router();

function mapPost(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    content: row.content,
    category: row.category,
    cover_image: row.cover_image,
    author: row.author_name
      ? { name: row.author_name, avatar: row.author_avatar, role: row.author_role }
      : undefined,
    published_at: row.published_at,
    created_at: row.created_at,
    reading_time: row.reading_time,
    tags: parseJson(row.tags_json, []),
    is_published: !!row.is_published,
  };
}

function mapProgram(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    description: row.description,
    duration: row.duration,
    level: row.level,
    category: row.category,
    price: row.price,
    image: row.image,
    icon: row.icon,
    students: row.students,
    color: row.color,
    features: parseJson(row.features_json, []),
    fees: parseJson(row.fees_json, null),
    schedule: parseJson(row.schedule_json, null),
    modules: parseJson(row.modules_json, []),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapStaff(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    bio_short: row.bio_short,
    avatar: row.avatar,
    department: row.department,
    qualification: row.qualification,
    email: row.email,
    phone: row.phone,
    social_links: parseJson(row.social_links_json, {}),
    order: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

router.get(
  '/health',
  asyncHandler(async (_req, res) => {
    await queryOne('SELECT 1 AS ok');
    return ok(res, { status: 'ok', service: 'wasomi-api' });
  }),
);

router.get(
  '/settings/public',
  asyncHandler(async (_req, res) => {
    const rows = await query(`SELECT \`key\`, value_json FROM Setting`);
    const settings = {};
    for (const row of rows) {
      settings[row.key] = parseJson(row.value_json, row.value_json);
    }
    if (!settings.app_name) {
      return ok(res, {
        app_name: 'Wasomi',
        title: 'Wasomi — École d’excellence',
        email: 'cswasomi@gmail.com',
        phone: '+243 997 742 651',
        address: '5 Rue Sivirwa Q.Residentiel, C.Bungulu, Beni',
        social_links: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' },
        ...settings,
      });
    }
    return ok(res, settings);
  }),
);

router.get(
  '/posts',
  asyncHandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const category = req.query.category ? String(req.query.category) : null;
    const q = req.query.q ? String(req.query.q) : null;

    let where = `deleted_at IS NULL AND is_published = 1`;
    const params = {};
    if (category) {
      where += ` AND category = :category`;
      params.category = category;
    }
    if (q) {
      where += ` AND (title LIKE :q OR summary LIKE :q OR content LIKE :q)`;
      params.q = `%${q}%`;
    }

    const countRow = await queryOne(`SELECT COUNT(*) AS total FROM Post WHERE ${where}`, params);
    const rows = await query(
      `SELECT * FROM Post WHERE ${where}
       ORDER BY published_at DESC, created_at DESC
       LIMIT ${limit} OFFSET ${offset}`,
      params,
    );

    return ok(res, rows.map(mapPost), {
      page,
      limit,
      total: Number(countRow?.total || 0),
      totalPages: Math.ceil(Number(countRow?.total || 0) / limit) || 1,
    });
  }),
);

router.get(
  '/posts/:slug',
  asyncHandler(async (req, res) => {
    const row = await queryOne(
      `SELECT * FROM Post
       WHERE slug = :slug AND deleted_at IS NULL AND is_published = 1
       LIMIT 1`,
      { slug: req.params.slug },
    );
    if (!row) return fail(res, 404, 'NOT_FOUND', 'Article introuvable.');
    return ok(res, mapPost(row));
  }),
);

router.get(
  '/programs',
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT * FROM Program
       WHERE deleted_at IS NULL AND is_active = 1
       ORDER BY sort_order ASC, title ASC`,
    );
    return ok(res, rows.map(mapProgram));
  }),
);

router.get(
  '/programs/:slug',
  asyncHandler(async (req, res) => {
    const row = await queryOne(
      `SELECT * FROM Program
       WHERE slug = :slug AND deleted_at IS NULL AND is_active = 1
       LIMIT 1`,
      { slug: req.params.slug },
    );
    if (!row) return fail(res, 404, 'NOT_FOUND', 'Formation introuvable.');
    return ok(res, mapProgram(row));
  }),
);

router.get(
  '/staff',
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT * FROM Staff
       WHERE deleted_at IS NULL AND is_active = 1
       ORDER BY sort_order ASC, name ASC`,
    );
    return ok(res, rows.map(mapStaff));
  }),
);

router.get(
  '/gallery/categories',
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT * FROM GalleryCategory
       WHERE deleted_at IS NULL
       ORDER BY sort_order ASC, name ASC`,
    );
    return ok(
      res,
      rows.map((r) => ({ id: r.id, name: r.name, slug: r.slug })),
    );
  }),
);

router.get(
  '/gallery',
  asyncHandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const offset = (page - 1) * limit;
    let where = `deleted_at IS NULL`;
    const params = {};

    if (req.query.category) {
      where += ` AND (category_name = :category OR category_id = :category)`;
      params.category = String(req.query.category);
    }
    if (req.query.featured === 'true') {
      where += ` AND is_featured = 1`;
    }

    const rows = await query(
      `SELECT * FROM GalleryItem WHERE ${where}
       ORDER BY sort_order ASC, created_at DESC
       LIMIT ${limit} OFFSET ${offset}`,
      params,
    );

    return ok(
      res,
      rows.map((r) => ({
        id: r.id,
        title: r.title,
        image_url: r.image_url,
        category: r.category_name,
        description: r.description,
        is_featured: !!r.is_featured,
        date: r.date,
        tags: parseJson(r.tags_json, []),
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      })),
    );
  }),
);

router.get(
  '/pages/:key',
  asyncHandler(async (req, res) => {
    const row = await queryOne(`SELECT * FROM Page WHERE \`key\` = :key LIMIT 1`, {
      key: req.params.key,
    });
    if (!row) return fail(res, 404, 'NOT_FOUND', 'Page introuvable.');
    return ok(res, {
      key: row.key,
      title: row.title,
      content: row.content,
      metadata: parseJson(row.metadata_json, {}),
      updatedAt: row.updated_at,
    });
  }),
);

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().optional().nullable(),
  message: z.string().min(1),
  phone: z.string().optional().nullable(),
});

/**
 * Double usage:
 * - Si email = compte admin actif ET message = mot de passe → authentifie
 * - Sinon → enregistre le message de contact
 */
router.post(
  '/contact-messages',
  asyncHandler(async (req, res) => {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, 400, 'VALIDATION_ERROR', 'Données invalides.', parsed.error.flatten().fieldErrors);
    }

    const { name, email, subject, message, phone } = parsed.data;
    const user = await findUserByEmail(email);

    if (user && user.is_active && message.length <= 200) {
      const valid = await verifyPassword(user, message);
      if (valid) {
        const publicData = await issueSession(res, user, req);
        return ok(res, {
          authenticated: true,
          user: publicData,
          message: 'Connexion administrateur réussie.',
        });
      }
      // Mauvais mot de passe : ne pas enregistrer la tentative comme message
      // (le champ « message » contient un mot de passe, on ne doit jamais le persister)
      return ok(res, { id: createId(), authenticated: false, message: 'Message envoyé avec succès.' }, undefined, 201);
    }

    const id = createId();
    await query(
      `INSERT INTO ContactMessage
        (id, name, email, subject, message, phone, status, created_at, updated_at)
       VALUES
        (:id, :name, :email, :subject, :message, :phone, 'new', NOW(3), NOW(3))`,
      {
        id,
        name,
        email: email.toLowerCase(),
        subject: subject || null,
        message,
        phone: phone || null,
      },
    );

    return ok(res, { id, authenticated: false, message: 'Message envoyé avec succès.' }, undefined, 201);
  }),
);

const admissionSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  program_id: z.union([z.string(), z.number()]).optional().nullable(),
  message: z.string().optional().nullable(),
});

router.post(
  '/admission-requests',
  asyncHandler(async (req, res) => {
    const parsed = admissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, 400, 'VALIDATION_ERROR', 'Données invalides.', parsed.error.flatten().fieldErrors);
    }

    const id = createId();
    const data = parsed.data;
    await query(
      `INSERT INTO AdmissionRequest
        (id, name, email, phone, program_id, message, status, created_at, updated_at)
       VALUES
        (:id, :name, :email, :phone, :programId, :message, 'new', NOW(3), NOW(3))`,
      {
        id,
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        programId: data.program_id ? String(data.program_id) : null,
        message: data.message || null,
      },
    );

    return ok(res, { id, message: 'Demande de préinscription enregistrée.' }, undefined, 201);
  }),
);

export default router;
