import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { query, queryOne } from '../db.js';
import { authRequired, requirePermission } from '../middleware/auth.js';
import { env } from '../config.js';
import {
  asyncHandler,
  createId,
  fail,
  ok,
  parseJson,
  slugify,
  toJson,
} from '../utils/helpers.js';

const router = Router();
router.use(authRequired);

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const folder = String(req.body?.folder || 'misc').replace(/[^a-z0-9_-]/gi, '');
    const dest = path.join(env.uploadDir, folder || 'misc');
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(0, 10);
    cb(null, `${Date.now()}-${createId().slice(0, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const okMime = /^(image\/|application\/pdf|audio\/)/.test(file.mimetype);
    cb(okMime ? null : new Error('Type de fichier non autorisé'), okMime);
  },
});

function mapPost(row) {
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
    sort_order: row.sort_order,
    is_active: !!row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapStaff(row) {
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
    is_active: !!row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function writeAudit(req, action, entityType, entityId, before, after) {
  try {
    await query(
      `INSERT INTO AuditLog
        (id, actor_user_id, action, entity_type, entity_id, before_json, after_json, ip_hash, user_agent, request_id, created_at)
       VALUES
        (:id, :actor, :action, :entityType, :entityId, :beforeJson, :afterJson, :ipHash, :ua, :requestId, NOW(3))`,
      {
        id: createId(),
        actor: req.user?.id || null,
        action,
        entityType,
        entityId: entityId ? String(entityId) : null,
        beforeJson: before ? toJson(before) : null,
        afterJson: after ? toJson(after) : null,
        ipHash: 'n/a',
        ua: String(req.get('user-agent') || '').slice(0, 512),
        requestId: String(req.headers['x-request-id'] || createId().slice(0, 12)),
      },
    );
  } catch {
    // audit best-effort
  }
}

// ——— Posts ———
router.get(
  '/posts',
  requirePermission('posts.read'),
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT * FROM Post WHERE deleted_at IS NULL ORDER BY created_at DESC`,
    );
    return ok(res, rows.map(mapPost));
  }),
);

router.post(
  '/posts',
  requirePermission('posts.create'),
  asyncHandler(async (req, res) => {
    const body = req.body || {};
    const id = createId();
    const slug = body.slug || slugify(body.title);
    await query(
      `INSERT INTO Post
        (id, title, slug, summary, content, category, cover_image, author_name, author_avatar, author_role,
         tags_json, is_published, published_at, reading_time, created_at, updated_at)
       VALUES
        (:id, :title, :slug, :summary, :content, :category, :cover, :authorName, :authorAvatar, :authorRole,
         :tags, :published, :publishedAt, :readingTime, NOW(3), NOW(3))`,
      {
        id,
        title: body.title,
        slug,
        summary: body.summary || null,
        content: body.content || '',
        category: body.category || null,
        cover: body.cover_image || null,
        authorName: body.author?.name || body.author_name || req.user.name,
        authorAvatar: body.author?.avatar || null,
        authorRole: body.author?.role || null,
        tags: toJson(body.tags || []),
        published: body.is_published ? 1 : 0,
        publishedAt: body.is_published ? new Date() : null,
        readingTime: body.reading_time || null,
      },
    );
    const row = await queryOne(`SELECT * FROM Post WHERE id = :id`, { id });
    await writeAudit(req, 'create', 'Post', id, null, mapPost(row));
    return ok(res, mapPost(row), undefined, 201);
  }),
);

router.patch(
  '/posts/:id',
  requirePermission('posts.create'),
  asyncHandler(async (req, res) => {
    const before = await queryOne(`SELECT * FROM Post WHERE id = :id AND deleted_at IS NULL`, {
      id: req.params.id,
    });
    if (!before) return fail(res, 404, 'NOT_FOUND', 'Article introuvable.');
    const body = req.body || {};
    await query(
      `UPDATE Post SET
        title = COALESCE(:title, title),
        slug = COALESCE(:slug, slug),
        summary = COALESCE(:summary, summary),
        content = COALESCE(:content, content),
        category = COALESCE(:category, category),
        cover_image = COALESCE(:cover, cover_image),
        author_name = COALESCE(:authorName, author_name),
        author_avatar = COALESCE(:authorAvatar, author_avatar),
        author_role = COALESCE(:authorRole, author_role),
        tags_json = COALESCE(:tags, tags_json),
        reading_time = COALESCE(:readingTime, reading_time),
        updated_at = NOW(3)
       WHERE id = :id`,
      {
        id: req.params.id,
        title: body.title ?? null,
        slug: body.slug ?? null,
        summary: body.summary ?? null,
        content: body.content ?? null,
        category: body.category ?? null,
        cover: body.cover_image ?? null,
        authorName: body.author?.name ?? body.author_name ?? null,
        authorAvatar: body.author?.avatar ?? null,
        authorRole: body.author?.role ?? null,
        tags: body.tags ? toJson(body.tags) : null,
        readingTime: body.reading_time ?? null,
      },
    );
    const row = await queryOne(`SELECT * FROM Post WHERE id = :id`, { id: req.params.id });
    await writeAudit(req, 'update', 'Post', req.params.id, mapPost(before), mapPost(row));
    return ok(res, mapPost(row));
  }),
);

router.delete(
  '/posts/:id',
  requirePermission('posts.delete'),
  asyncHandler(async (req, res) => {
    await query(`UPDATE Post SET deleted_at = NOW(3), updated_at = NOW(3) WHERE id = :id`, {
      id: req.params.id,
    });
    await writeAudit(req, 'delete', 'Post', req.params.id, null, null);
    return ok(res, null);
  }),
);

router.post(
  '/posts/:id/publish',
  requirePermission('posts.publish'),
  asyncHandler(async (req, res) => {
    await query(
      `UPDATE Post SET is_published = 1, published_at = COALESCE(published_at, NOW(3)), updated_at = NOW(3)
       WHERE id = :id AND deleted_at IS NULL`,
      { id: req.params.id },
    );
    const row = await queryOne(`SELECT * FROM Post WHERE id = :id`, { id: req.params.id });
    return ok(res, mapPost(row));
  }),
);

router.post(
  '/posts/:id/unpublish',
  requirePermission('posts.publish'),
  asyncHandler(async (req, res) => {
    await query(
      `UPDATE Post SET is_published = 0, updated_at = NOW(3) WHERE id = :id AND deleted_at IS NULL`,
      { id: req.params.id },
    );
    const row = await queryOne(`SELECT * FROM Post WHERE id = :id`, { id: req.params.id });
    return ok(res, mapPost(row));
  }),
);

// ——— Programs ———
router.get(
  '/programs',
  requirePermission('programs.read'),
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT * FROM Program WHERE deleted_at IS NULL ORDER BY sort_order ASC, title ASC`,
    );
    return ok(res, rows.map(mapProgram));
  }),
);

router.post(
  '/programs',
  requirePermission('programs.manage'),
  asyncHandler(async (req, res) => {
    const body = req.body || {};
    const id = createId();
    const slug = body.slug || slugify(body.title);
    await query(
      `INSERT INTO Program
        (id, title, slug, summary, description, duration, level, category, price, image, icon, students, color,
         features_json, fees_json, schedule_json, modules_json, sort_order, is_active, created_at, updated_at)
       VALUES
        (:id, :title, :slug, :summary, :description, :duration, :level, :category, :price, :image, :icon, :students, :color,
         :features, :fees, :schedule, :modules, :sortOrder, 1, NOW(3), NOW(3))`,
      {
        id,
        title: body.title,
        slug,
        summary: body.summary || null,
        description: body.description || null,
        duration: body.duration || null,
        level: body.level || null,
        category: body.category || null,
        price: body.price != null ? String(body.price) : null,
        image: body.image || null,
        icon: body.icon || null,
        students: body.students || null,
        color: body.color || null,
        features: toJson(body.features || []),
        fees: toJson(body.fees || null),
        schedule: toJson(body.schedule || null),
        modules: toJson(body.modules || []),
        sortOrder: Number(body.sort_order || body.order || 0),
      },
    );
    const row = await queryOne(`SELECT * FROM Program WHERE id = :id`, { id });
    return ok(res, mapProgram(row), undefined, 201);
  }),
);

router.patch(
  '/programs/:id',
  requirePermission('programs.manage'),
  asyncHandler(async (req, res) => {
    const body = req.body || {};
    const existing = await queryOne(`SELECT * FROM Program WHERE id = :id AND deleted_at IS NULL`, {
      id: req.params.id,
    });
    if (!existing) return fail(res, 404, 'NOT_FOUND', 'Formation introuvable.');

    await query(
      `UPDATE Program SET
        title = COALESCE(:title, title),
        slug = COALESCE(:slug, slug),
        summary = COALESCE(:summary, summary),
        description = COALESCE(:description, description),
        duration = COALESCE(:duration, duration),
        level = COALESCE(:level, level),
        category = COALESCE(:category, category),
        price = COALESCE(:price, price),
        image = COALESCE(:image, image),
        icon = COALESCE(:icon, icon),
        students = COALESCE(:students, students),
        color = COALESCE(:color, color),
        features_json = COALESCE(:features, features_json),
        fees_json = COALESCE(:fees, fees_json),
        schedule_json = COALESCE(:schedule, schedule_json),
        modules_json = COALESCE(:modules, modules_json),
        sort_order = COALESCE(:sortOrder, sort_order),
        is_active = COALESCE(:isActive, is_active),
        updated_at = NOW(3)
       WHERE id = :id`,
      {
        id: req.params.id,
        title: body.title ?? null,
        slug: body.slug ?? null,
        summary: body.summary ?? null,
        description: body.description ?? null,
        duration: body.duration ?? null,
        level: body.level ?? null,
        category: body.category ?? null,
        price: body.price != null ? String(body.price) : null,
        image: body.image ?? null,
        icon: body.icon ?? null,
        students: body.students ?? null,
        color: body.color ?? null,
        features: body.features ? toJson(body.features) : null,
        fees: body.fees ? toJson(body.fees) : null,
        schedule: body.schedule ? toJson(body.schedule) : null,
        modules: body.modules ? toJson(body.modules) : null,
        sortOrder: body.sort_order != null || body.order != null ? Number(body.sort_order ?? body.order) : null,
        isActive: body.is_active != null ? (body.is_active ? 1 : 0) : null,
      },
    );
    const row = await queryOne(`SELECT * FROM Program WHERE id = :id`, { id: req.params.id });
    return ok(res, mapProgram(row));
  }),
);

router.delete(
  '/programs/:id',
  requirePermission('programs.manage'),
  asyncHandler(async (req, res) => {
    await query(`UPDATE Program SET deleted_at = NOW(3), updated_at = NOW(3) WHERE id = :id`, {
      id: req.params.id,
    });
    return ok(res, null);
  }),
);

// ——— Staff ———
router.get(
  '/staff',
  requirePermission('staff.read'),
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT * FROM Staff WHERE deleted_at IS NULL ORDER BY sort_order ASC, name ASC`,
    );
    return ok(res, rows.map(mapStaff));
  }),
);

router.post(
  '/staff',
  requirePermission('staff.manage'),
  asyncHandler(async (req, res) => {
    const body = req.body || {};
    const id = createId();
    await query(
      `INSERT INTO Staff
        (id, name, role, bio, bio_short, avatar, department, qualification, email, phone,
         social_links_json, sort_order, is_active, created_at, updated_at)
       VALUES
        (:id, :name, :role, :bio, :bioShort, :avatar, :department, :qualification, :email, :phone,
         :social, :sortOrder, 1, NOW(3), NOW(3))`,
      {
        id,
        name: body.name,
        role: body.role,
        bio: body.bio || null,
        bioShort: body.bio_short || null,
        avatar: body.avatar || body.image || null,
        department: body.department || body.category || null,
        qualification: body.qualification || null,
        email: body.email || null,
        phone: body.phone || null,
        social: toJson(body.social_links || {}),
        sortOrder: Number(body.order ?? body.sort_order ?? 0),
      },
    );
    const row = await queryOne(`SELECT * FROM Staff WHERE id = :id`, { id });
    return ok(res, mapStaff(row), undefined, 201);
  }),
);

router.patch(
  '/staff/:id',
  requirePermission('staff.manage'),
  asyncHandler(async (req, res) => {
    const body = req.body || {};
    const existing = await queryOne(`SELECT * FROM Staff WHERE id = :id AND deleted_at IS NULL`, {
      id: req.params.id,
    });
    if (!existing) return fail(res, 404, 'NOT_FOUND', 'Membre introuvable.');

    await query(
      `UPDATE Staff SET
        name = COALESCE(:name, name),
        role = COALESCE(:role, role),
        bio = COALESCE(:bio, bio),
        bio_short = COALESCE(:bioShort, bio_short),
        avatar = COALESCE(:avatar, avatar),
        department = COALESCE(:department, department),
        qualification = COALESCE(:qualification, qualification),
        email = COALESCE(:email, email),
        phone = COALESCE(:phone, phone),
        social_links_json = COALESCE(:social, social_links_json),
        sort_order = COALESCE(:sortOrder, sort_order),
        is_active = COALESCE(:isActive, is_active),
        updated_at = NOW(3)
       WHERE id = :id`,
      {
        id: req.params.id,
        name: body.name ?? null,
        role: body.role ?? null,
        bio: body.bio ?? null,
        bioShort: body.bio_short ?? null,
        avatar: body.avatar ?? body.image ?? null,
        department: body.department ?? body.category ?? null,
        qualification: body.qualification ?? null,
        email: body.email ?? null,
        phone: body.phone ?? null,
        social: body.social_links ? toJson(body.social_links) : null,
        sortOrder: body.order != null || body.sort_order != null ? Number(body.order ?? body.sort_order) : null,
        isActive: body.is_active != null ? (body.is_active ? 1 : 0) : null,
      },
    );
    const row = await queryOne(`SELECT * FROM Staff WHERE id = :id`, { id: req.params.id });
    return ok(res, mapStaff(row));
  }),
);

router.delete(
  '/staff/:id',
  requirePermission('staff.manage'),
  asyncHandler(async (req, res) => {
    await query(`UPDATE Staff SET deleted_at = NOW(3), updated_at = NOW(3) WHERE id = :id`, {
      id: req.params.id,
    });
    return ok(res, null);
  }),
);

// ——— Gallery ———
router.get(
  '/gallery/categories',
  requirePermission('gallery.read'),
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT * FROM GalleryCategory WHERE deleted_at IS NULL ORDER BY sort_order ASC`,
    );
    return ok(res, rows.map((r) => ({ id: r.id, name: r.name, slug: r.slug })));
  }),
);

router.post(
  '/gallery/categories',
  requirePermission('gallery.manage'),
  asyncHandler(async (req, res) => {
    const id = createId();
    const name = req.body?.name;
    const slug = req.body?.slug || slugify(name);
    await query(
      `INSERT INTO GalleryCategory (id, name, slug, sort_order, created_at, updated_at)
       VALUES (:id, :name, :slug, :sortOrder, NOW(3), NOW(3))`,
      { id, name, slug, sortOrder: Number(req.body?.sort_order || 0) },
    );
    return ok(res, { id, name, slug }, undefined, 201);
  }),
);

router.patch(
  '/gallery/categories/:id',
  requirePermission('gallery.manage'),
  asyncHandler(async (req, res) => {
    await query(
      `UPDATE GalleryCategory SET
        name = COALESCE(:name, name),
        slug = COALESCE(:slug, slug),
        sort_order = COALESCE(:sortOrder, sort_order),
        updated_at = NOW(3)
       WHERE id = :id AND deleted_at IS NULL`,
      {
        id: req.params.id,
        name: req.body?.name ?? null,
        slug: req.body?.slug ?? null,
        sortOrder: req.body?.sort_order != null ? Number(req.body.sort_order) : null,
      },
    );
    const row = await queryOne(`SELECT * FROM GalleryCategory WHERE id = :id`, { id: req.params.id });
    return ok(res, { id: row.id, name: row.name, slug: row.slug });
  }),
);

router.delete(
  '/gallery/categories/:id',
  requirePermission('gallery.manage'),
  asyncHandler(async (req, res) => {
    await query(`UPDATE GalleryCategory SET deleted_at = NOW(3), updated_at = NOW(3) WHERE id = :id`, {
      id: req.params.id,
    });
    return ok(res, null);
  }),
);

router.get(
  '/gallery/items',
  requirePermission('gallery.read'),
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT * FROM GalleryItem WHERE deleted_at IS NULL ORDER BY sort_order ASC, created_at DESC`,
    );
    return ok(
      res,
      rows.map((r) => ({
        id: r.id,
        title: r.title,
        image_url: r.image_url,
        category: r.category_name,
        category_id: r.category_id,
        description: r.description,
        is_featured: !!r.is_featured,
        date: r.date,
        tags: parseJson(r.tags_json, []),
      })),
    );
  }),
);

router.post(
  '/gallery/items',
  requirePermission('gallery.manage'),
  asyncHandler(async (req, res) => {
    const body = req.body || {};
    const id = createId();
    await query(
      `INSERT INTO GalleryItem
        (id, title, image_url, category_id, category_name, description, is_featured, date, tags_json, sort_order, created_at, updated_at)
       VALUES
        (:id, :title, :imageUrl, :categoryId, :categoryName, :description, :featured, :date, :tags, :sortOrder, NOW(3), NOW(3))`,
      {
        id,
        title: body.title,
        imageUrl: body.image_url || body.src,
        categoryId: body.category_id || null,
        categoryName: body.category || body.category_name || null,
        description: body.description || null,
        featured: body.is_featured ? 1 : 0,
        date: body.date || null,
        tags: toJson(body.tags || []),
        sortOrder: Number(body.sort_order || 0),
      },
    );
    const row = await queryOne(`SELECT * FROM GalleryItem WHERE id = :id`, { id });
    return ok(
      res,
      {
        id: row.id,
        title: row.title,
        image_url: row.image_url,
        category: row.category_name,
        description: row.description,
        is_featured: !!row.is_featured,
      },
      undefined,
      201,
    );
  }),
);

router.patch(
  '/gallery/items/:id',
  requirePermission('gallery.manage'),
  asyncHandler(async (req, res) => {
    const body = req.body || {};
    await query(
      `UPDATE GalleryItem SET
        title = COALESCE(:title, title),
        image_url = COALESCE(:imageUrl, image_url),
        category_id = COALESCE(:categoryId, category_id),
        category_name = COALESCE(:categoryName, category_name),
        description = COALESCE(:description, description),
        is_featured = COALESCE(:featured, is_featured),
        date = COALESCE(:date, date),
        tags_json = COALESCE(:tags, tags_json),
        sort_order = COALESCE(:sortOrder, sort_order),
        updated_at = NOW(3)
       WHERE id = :id AND deleted_at IS NULL`,
      {
        id: req.params.id,
        title: body.title ?? null,
        imageUrl: body.image_url ?? body.src ?? null,
        categoryId: body.category_id ?? null,
        categoryName: body.category ?? body.category_name ?? null,
        description: body.description ?? null,
        featured: body.is_featured != null ? (body.is_featured ? 1 : 0) : null,
        date: body.date ?? null,
        tags: body.tags ? toJson(body.tags) : null,
        sortOrder: body.sort_order != null ? Number(body.sort_order) : null,
      },
    );
    const row = await queryOne(`SELECT * FROM GalleryItem WHERE id = :id`, { id: req.params.id });
    return ok(res, {
      id: row.id,
      title: row.title,
      image_url: row.image_url,
      category: row.category_name,
      description: row.description,
      is_featured: !!row.is_featured,
    });
  }),
);

router.delete(
  '/gallery/items/:id',
  requirePermission('gallery.manage'),
  asyncHandler(async (req, res) => {
    await query(`UPDATE GalleryItem SET deleted_at = NOW(3), updated_at = NOW(3) WHERE id = :id`, {
      id: req.params.id,
    });
    return ok(res, null);
  }),
);

// ——— Media ———
router.post(
  '/media/upload',
  requirePermission('media.upload'),
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) return fail(res, 400, 'VALIDATION_ERROR', 'Fichier manquant.');
    const folder = String(req.body?.folder || 'misc').replace(/[^a-z0-9_-]/gi, '') || 'misc';
    const base = `${req.protocol}://${req.get('host')}`;
    const publicUrl = `${base}${env.publicUploadUrl}/${folder}/${req.file.filename}`;
    const id = createId();
    const kind = req.file.mimetype.startsWith('image/')
      ? 'image'
      : req.file.mimetype.startsWith('audio/')
        ? 'audio'
        : 'document';

    await query(
      `INSERT INTO Media
        (id, storage_key, public_url, original_filename, mime_type, size_bytes, kind, uploaded_by_user_id, created_at, updated_at)
       VALUES
        (:id, :key, :url, :original, :mime, :size, :kind, :userId, NOW(3), NOW(3))`,
      {
        id,
        key: `${folder}/${req.file.filename}`,
        url: publicUrl,
        original: req.file.originalname.slice(0, 180),
        mime: req.file.mimetype,
        size: req.file.size,
        kind,
        userId: req.user.id,
      },
    );

    return ok(
      res,
      {
        id,
        public_url: publicUrl,
        url: publicUrl,
        original_filename: req.file.originalname,
        mime_type: req.file.mimetype,
        size_bytes: req.file.size,
        kind,
      },
      undefined,
      201,
    );
  }),
);

router.get(
  '/media',
  requirePermission('media.upload'),
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT * FROM Media WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 200`,
    );
    return ok(
      res,
      rows.map((r) => ({
        id: r.id,
        public_url: r.public_url,
        original_filename: r.original_filename,
        mime_type: r.mime_type,
        size_bytes: Number(r.size_bytes || 0),
        kind: r.kind,
        createdAt: r.created_at,
      })),
    );
  }),
);

router.delete(
  '/media/:id',
  requirePermission('media.delete'),
  asyncHandler(async (req, res) => {
    const row = await queryOne(`SELECT * FROM Media WHERE id = :id AND deleted_at IS NULL`, {
      id: req.params.id,
    });
    if (!row) return fail(res, 404, 'NOT_FOUND', 'Média introuvable.');
    await query(`UPDATE Media SET deleted_at = NOW(3), updated_at = NOW(3) WHERE id = :id`, {
      id: req.params.id,
    });
    try {
      const filePath = path.join(env.uploadDir, row.storage_key);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch {
      // ignore fs errors
    }
    return ok(res, null);
  }),
);

// ——— Pages & settings ———
router.get(
  '/pages/:key',
  requirePermission('pages.read'),
  asyncHandler(async (req, res) => {
    const row = await queryOne(`SELECT * FROM Page WHERE \`key\` = :key`, { key: req.params.key });
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

router.patch(
  '/pages/:key',
  requirePermission('pages.manage'),
  asyncHandler(async (req, res) => {
    const key = req.params.key;
    const existing = await queryOne(`SELECT * FROM Page WHERE \`key\` = :key`, { key });
    if (!existing) {
      const id = createId();
      await query(
        `INSERT INTO Page (id, \`key\`, title, content, metadata_json, updated_by_user_id, created_at, updated_at)
         VALUES (:id, :key, :title, :content, :metadata, :userId, NOW(3), NOW(3))`,
        {
          id,
          key,
          title: req.body?.title || key,
          content: req.body?.content || '',
          metadata: toJson(req.body?.metadata || {}),
          userId: req.user.id,
        },
      );
    } else {
      await query(
        `UPDATE Page SET
          title = COALESCE(:title, title),
          content = COALESCE(:content, content),
          metadata_json = COALESCE(:metadata, metadata_json),
          updated_by_user_id = :userId,
          updated_at = NOW(3)
         WHERE \`key\` = :key`,
        {
          key,
          title: req.body?.title ?? null,
          content: req.body?.content ?? null,
          metadata: req.body?.metadata ? toJson(req.body.metadata) : null,
          userId: req.user.id,
        },
      );
    }
    const row = await queryOne(`SELECT * FROM Page WHERE \`key\` = :key`, { key });
    return ok(res, {
      key: row.key,
      title: row.title,
      content: row.content,
      metadata: parseJson(row.metadata_json, {}),
      updatedAt: row.updated_at,
    });
  }),
);

router.get(
  '/settings',
  requirePermission('settings.manage'),
  asyncHandler(async (_req, res) => {
    const rows = await query(`SELECT \`key\`, value_json FROM Setting`);
    const settings = {};
    for (const row of rows) settings[row.key] = parseJson(row.value_json, row.value_json);
    return ok(res, settings);
  }),
);

router.patch(
  '/settings',
  requirePermission('settings.manage'),
  asyncHandler(async (req, res) => {
    const entries = Object.entries(req.body || {});
    for (const [key, value] of entries) {
      const existing = await queryOne(`SELECT id FROM Setting WHERE \`key\` = :key`, { key });
      if (existing) {
        await query(
          `UPDATE Setting SET value_json = :value, updated_by_user_id = :userId, updated_at = NOW(3) WHERE \`key\` = :key`,
          { key, value: toJson(value), userId: req.user.id },
        );
      } else {
        await query(
          `INSERT INTO Setting (id, \`key\`, value_json, updated_by_user_id, created_at, updated_at)
           VALUES (:id, :key, :value, :userId, NOW(3), NOW(3))`,
          { id: createId(), key, value: toJson(value), userId: req.user.id },
        );
      }
    }
    const rows = await query(`SELECT \`key\`, value_json FROM Setting`);
    const settings = {};
    for (const row of rows) settings[row.key] = parseJson(row.value_json, row.value_json);
    return ok(res, settings);
  }),
);

// ——— Messages & admissions ———
router.get(
  '/contact-messages',
  requirePermission('contacts.read'),
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT * FROM ContactMessage WHERE deleted_at IS NULL ORDER BY created_at DESC`,
    );
    return ok(res, rows);
  }),
);

router.patch(
  '/contact-messages/:id',
  requirePermission('contacts.manage'),
  asyncHandler(async (req, res) => {
    await query(
      `UPDATE ContactMessage SET
        status = COALESCE(:status, status),
        admin_notes = COALESCE(:notes, admin_notes),
        updated_at = NOW(3)
       WHERE id = :id`,
      {
        id: req.params.id,
        status: req.body?.status ?? null,
        notes: req.body?.admin_notes ?? null,
      },
    );
    const row = await queryOne(`SELECT * FROM ContactMessage WHERE id = :id`, { id: req.params.id });
    return ok(res, row);
  }),
);

router.get(
  '/admission-requests',
  requirePermission('admissions.read'),
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT * FROM AdmissionRequest WHERE deleted_at IS NULL ORDER BY created_at DESC`,
    );
    return ok(res, rows);
  }),
);

router.patch(
  '/admission-requests/:id',
  requirePermission('admissions.manage'),
  asyncHandler(async (req, res) => {
    await query(
      `UPDATE AdmissionRequest SET
        status = COALESCE(:status, status),
        admin_notes = COALESCE(:notes, admin_notes),
        updated_at = NOW(3)
       WHERE id = :id`,
      {
        id: req.params.id,
        status: req.body?.status ?? null,
        notes: req.body?.admin_notes ?? null,
      },
    );
    const row = await queryOne(`SELECT * FROM AdmissionRequest WHERE id = :id`, { id: req.params.id });
    return ok(res, row);
  }),
);

// ——— Users (basic) ———
router.get(
  '/users',
  requirePermission('users.read'),
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT id, email, name, is_active, created_at, updated_at FROM User WHERE deleted_at IS NULL`,
    );
    return ok(res, rows);
  }),
);

router.get(
  '/audit-logs',
  requirePermission('audit.read'),
  asyncHandler(async (_req, res) => {
    const rows = await query(`SELECT * FROM AuditLog ORDER BY created_at DESC LIMIT 100`);
    return ok(res, rows);
  }),
);

export default router;
