import { Router } from 'express';
import { z } from 'zod';
import { query, queryOne } from '../db.js';
import { authRequired, requirePermission } from '../middleware/auth.js';
import { asyncHandler, createId, fail, ok } from '../utils/helpers.js';

function mapHero(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    image_url: row.image_url,
    video_url: row.video_url,
    cta_label: row.cta_label,
    cta_href: row.cta_href,
    sort_order: row.sort_order,
    is_active: !!row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapReview(row) {
  if (!row) return null;
  return {
    id: row.id,
    author_name: row.author_name,
    author_role: row.author_role,
    content: row.content,
    rating: Number(row.rating || 5),
    status: row.status,
    is_featured: !!row.is_featured,
    sort_order: row.sort_order,
    admin_notes: row.admin_notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapClass(row) {
  if (!row) return null;
  return {
    id: row.id,
    section: row.section,
    option_name: row.option_name,
    class_name: row.class_name,
    label: row.label || row.class_name,
    is_open: !!row.is_open,
    sort_order: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildClassTree(rows) {
  const sectionsMap = new Map();
  for (const row of rows) {
    const section = row.section || 'Autres';
    if (!sectionsMap.has(section)) {
      sectionsMap.set(section, { name: section, options: new Map() });
    }
    const sec = sectionsMap.get(section);
    const optionKey = row.option_name || '__none__';
    if (!sec.options.has(optionKey)) {
      sec.options.set(optionKey, {
        name: row.option_name || null,
        classes: [],
      });
    }
    sec.options.get(optionKey).classes.push(mapClass(row));
  }
  return {
    sections: [...sectionsMap.values()].map((s) => ({
      name: s.name,
      options: [...s.options.values()],
    })),
  };
}

export const publicCmsRouter = Router();

publicCmsRouter.get(
  '/hero-slides',
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT * FROM HeroSlide
       WHERE deleted_at IS NULL AND is_active = 1
       ORDER BY sort_order ASC, created_at ASC`,
    );
    return ok(res, rows.map(mapHero));
  }),
);

publicCmsRouter.get(
  '/reviews',
  asyncHandler(async (req, res) => {
    const featured = req.query.featured === 'true';
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || (featured ? 7 : 50)));
    let where = `deleted_at IS NULL AND status = 'approved'`;
    if (featured) where += ` AND (is_featured = 1 OR rating >= 4)`;
    const rows = await query(
      `SELECT * FROM Review WHERE ${where}
       ORDER BY is_featured DESC, rating DESC, sort_order ASC, created_at DESC
       LIMIT ${limit}`,
    );
    return ok(res, rows.map(mapReview));
  }),
);

const reviewSchema = z.object({
  author_name: z.string().min(2).max(160),
  author_role: z.string().max(160).optional().nullable(),
  content: z.string().min(10).max(2000),
  rating: z.coerce.number().int().min(1).max(5).optional(),
});

publicCmsRouter.post(
  '/reviews',
  asyncHandler(async (req, res) => {
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, 400, 'VALIDATION_ERROR', 'Données invalides.', parsed.error.flatten().fieldErrors);
    }
    const id = createId();
    const { author_name, author_role, content, rating } = parsed.data;
    await query(
      `INSERT INTO Review
        (id, author_name, author_role, content, rating, status, is_featured, sort_order, created_at, updated_at)
       VALUES
        (:id, :authorName, :authorRole, :content, :rating, 'pending', 0, 0, NOW(3), NOW(3))`,
      {
        id,
        authorName: author_name.trim(),
        authorRole: author_role?.trim() || null,
        content: content.trim(),
        rating: rating ?? 5,
      },
    );
    return ok(res, { id, message: 'Avis envoyé. Il sera publié après validation.' }, undefined, 201);
  }),
);

publicCmsRouter.get(
  '/classes',
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT * FROM SchoolClass
       WHERE deleted_at IS NULL AND is_open = 1
       ORDER BY sort_order ASC, section ASC, class_name ASC`,
    );
    return ok(res, rows.map(mapClass));
  }),
);

publicCmsRouter.get(
  '/classes/tree',
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT * FROM SchoolClass
       WHERE deleted_at IS NULL AND is_open = 1
       ORDER BY sort_order ASC, section ASC, option_name ASC, class_name ASC`,
    );
    return ok(res, buildClassTree(rows));
  }),
);

export const adminCmsRouter = Router();
adminCmsRouter.use(authRequired);

// ——— Hero slides ———
adminCmsRouter.get(
  '/hero-slides',
  requirePermission('pages.manage'),
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT * FROM HeroSlide WHERE deleted_at IS NULL ORDER BY sort_order ASC, created_at ASC`,
    );
    return ok(res, rows.map(mapHero));
  }),
);

adminCmsRouter.post(
  '/hero-slides',
  requirePermission('pages.manage'),
  asyncHandler(async (req, res) => {
    const id = createId();
    const body = req.body || {};
    await query(
      `INSERT INTO HeroSlide
        (id, title, subtitle, image_url, video_url, cta_label, cta_href, sort_order, is_active, created_at, updated_at)
       VALUES
        (:id, :title, :subtitle, :imageUrl, :videoUrl, :ctaLabel, :ctaHref, :sortOrder, :isActive, NOW(3), NOW(3))`,
      {
        id,
        title: body.title || null,
        subtitle: body.subtitle || null,
        imageUrl: body.image_url || null,
        videoUrl: body.video_url || null,
        ctaLabel: body.cta_label || null,
        ctaHref: body.cta_href || null,
        sortOrder: Number(body.sort_order || 0),
        isActive: body.is_active === false ? 0 : 1,
      },
    );
    const row = await queryOne(`SELECT * FROM HeroSlide WHERE id = :id`, { id });
    return ok(res, mapHero(row), undefined, 201);
  }),
);

adminCmsRouter.patch(
  '/hero-slides/:id',
  requirePermission('pages.manage'),
  asyncHandler(async (req, res) => {
    const body = req.body || {};
    await query(
      `UPDATE HeroSlide SET
        title = COALESCE(:title, title),
        subtitle = COALESCE(:subtitle, subtitle),
        image_url = COALESCE(:imageUrl, image_url),
        video_url = COALESCE(:videoUrl, video_url),
        cta_label = COALESCE(:ctaLabel, cta_label),
        cta_href = COALESCE(:ctaHref, cta_href),
        sort_order = COALESCE(:sortOrder, sort_order),
        is_active = COALESCE(:isActive, is_active),
        updated_at = NOW(3)
       WHERE id = :id AND deleted_at IS NULL`,
      {
        id: req.params.id,
        title: body.title ?? null,
        subtitle: body.subtitle ?? null,
        imageUrl: body.image_url ?? null,
        videoUrl: body.video_url ?? null,
        ctaLabel: body.cta_label ?? null,
        ctaHref: body.cta_href ?? null,
        sortOrder: body.sort_order != null ? Number(body.sort_order) : null,
        isActive: body.is_active != null ? (body.is_active ? 1 : 0) : null,
      },
    );
    const row = await queryOne(`SELECT * FROM HeroSlide WHERE id = :id`, { id: req.params.id });
    if (!row) return fail(res, 404, 'NOT_FOUND', 'Slide introuvable.');
    return ok(res, mapHero(row));
  }),
);

adminCmsRouter.delete(
  '/hero-slides/:id',
  requirePermission('pages.manage'),
  asyncHandler(async (req, res) => {
    await query(
      `UPDATE HeroSlide SET deleted_at = NOW(3), updated_at = NOW(3) WHERE id = :id`,
      { id: req.params.id },
    );
    return ok(res, null);
  }),
);

adminCmsRouter.post(
  '/hero-slides/reorder',
  requirePermission('pages.manage'),
  asyncHandler(async (req, res) => {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    for (let i = 0; i < ids.length; i++) {
      await query(`UPDATE HeroSlide SET sort_order = :ord, updated_at = NOW(3) WHERE id = :id`, {
        id: ids[i],
        ord: i,
      });
    }
    return ok(res, { reordered: ids.length });
  }),
);

// ——— Reviews moderation ———
adminCmsRouter.get(
  '/reviews',
  requirePermission('contacts.read'),
  asyncHandler(async (req, res) => {
    const status = req.query.status ? String(req.query.status) : null;
    let where = `deleted_at IS NULL`;
    const params = {};
    if (status) {
      where += ` AND status = :status`;
      params.status = status;
    }
    const rows = await query(
      `SELECT * FROM Review WHERE ${where} ORDER BY created_at DESC`,
      params,
    );
    return ok(res, rows.map(mapReview));
  }),
);

adminCmsRouter.patch(
  '/reviews/:id',
  requirePermission('contacts.manage'),
  asyncHandler(async (req, res) => {
    const body = req.body || {};
    await query(
      `UPDATE Review SET
        status = COALESCE(:status, status),
        is_featured = COALESCE(:featured, is_featured),
        sort_order = COALESCE(:sortOrder, sort_order),
        admin_notes = COALESCE(:notes, admin_notes),
        rating = COALESCE(:rating, rating),
        updated_at = NOW(3)
       WHERE id = :id AND deleted_at IS NULL`,
      {
        id: req.params.id,
        status: body.status ?? null,
        featured: body.is_featured != null ? (body.is_featured ? 1 : 0) : null,
        sortOrder: body.sort_order != null ? Number(body.sort_order) : null,
        notes: body.admin_notes ?? null,
        rating: body.rating != null ? Number(body.rating) : null,
      },
    );
    const row = await queryOne(`SELECT * FROM Review WHERE id = :id`, { id: req.params.id });
    if (!row) return fail(res, 404, 'NOT_FOUND', 'Avis introuvable.');
    return ok(res, mapReview(row));
  }),
);

adminCmsRouter.delete(
  '/reviews/:id',
  requirePermission('contacts.manage'),
  asyncHandler(async (req, res) => {
    await query(
      `UPDATE Review SET deleted_at = NOW(3), updated_at = NOW(3) WHERE id = :id`,
      { id: req.params.id },
    );
    return ok(res, null);
  }),
);

// ——— School classes ———
adminCmsRouter.get(
  '/classes',
  requirePermission('admissions.read'),
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT * FROM SchoolClass WHERE deleted_at IS NULL ORDER BY sort_order ASC, section ASC, class_name ASC`,
    );
    return ok(res, rows.map(mapClass));
  }),
);

adminCmsRouter.post(
  '/classes',
  requirePermission('admissions.manage'),
  asyncHandler(async (req, res) => {
    const body = req.body || {};
    if (!body.section || !body.class_name) {
      return fail(res, 400, 'VALIDATION_ERROR', 'section et class_name requis.');
    }
    const id = createId();
    await query(
      `INSERT INTO SchoolClass
        (id, section, option_name, class_name, label, is_open, sort_order, created_at, updated_at)
       VALUES
        (:id, :section, :optionName, :className, :label, :isOpen, :sortOrder, NOW(3), NOW(3))`,
      {
        id,
        section: String(body.section).trim(),
        optionName: body.option_name ? String(body.option_name).trim() : null,
        className: String(body.class_name).trim(),
        label: body.label || body.class_name,
        isOpen: body.is_open === false ? 0 : 1,
        sortOrder: Number(body.sort_order || 0),
      },
    );
    const row = await queryOne(`SELECT * FROM SchoolClass WHERE id = :id`, { id });
    return ok(res, mapClass(row), undefined, 201);
  }),
);

adminCmsRouter.patch(
  '/classes/:id',
  requirePermission('admissions.manage'),
  asyncHandler(async (req, res) => {
    const body = req.body || {};
    await query(
      `UPDATE SchoolClass SET
        section = COALESCE(:section, section),
        option_name = COALESCE(:optionName, option_name),
        class_name = COALESCE(:className, class_name),
        label = COALESCE(:label, label),
        is_open = COALESCE(:isOpen, is_open),
        sort_order = COALESCE(:sortOrder, sort_order),
        updated_at = NOW(3)
       WHERE id = :id AND deleted_at IS NULL`,
      {
        id: req.params.id,
        section: body.section ?? null,
        optionName: body.option_name !== undefined ? body.option_name : null,
        className: body.class_name ?? null,
        label: body.label ?? null,
        isOpen: body.is_open != null ? (body.is_open ? 1 : 0) : null,
        sortOrder: body.sort_order != null ? Number(body.sort_order) : null,
      },
    );
    const row = await queryOne(`SELECT * FROM SchoolClass WHERE id = :id`, { id: req.params.id });
    if (!row) return fail(res, 404, 'NOT_FOUND', 'Classe introuvable.');
    return ok(res, mapClass(row));
  }),
);

adminCmsRouter.delete(
  '/classes/:id',
  requirePermission('admissions.manage'),
  asyncHandler(async (req, res) => {
    await query(
      `UPDATE SchoolClass SET deleted_at = NOW(3), updated_at = NOW(3) WHERE id = :id`,
      { id: req.params.id },
    );
    return ok(res, null);
  }),
);

// ——— Programs reorder ———
adminCmsRouter.post(
  '/programs/reorder',
  requirePermission('programs.manage'),
  asyncHandler(async (req, res) => {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    for (let i = 0; i < ids.length; i++) {
      await query(`UPDATE Program SET sort_order = :ord, updated_at = NOW(3) WHERE id = :id`, {
        id: ids[i],
        ord: i,
      });
    }
    return ok(res, { reordered: ids.length });
  }),
);
