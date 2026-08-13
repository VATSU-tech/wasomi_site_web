import 'dotenv/config';
import argon2 from 'argon2';
import { pool, query, queryOne } from '../db.js';
import { env } from '../config.js';
import { createId, slugify, toJson } from '../utils/helpers.js';

const permissionKeys = [
  'users.read',
  'users.manage',
  'roles.manage',
  'posts.read',
  'posts.create',
  'posts.update',
  'posts.publish',
  'posts.delete',
  'programs.read',
  'programs.manage',
  'staff.read',
  'staff.manage',
  'gallery.read',
  'gallery.manage',
  'media.upload',
  'media.delete',
  'pages.read',
  'pages.manage',
  'settings.read',
  'settings.manage',
  'contacts.read',
  'contacts.manage',
  'admissions.read',
  'admissions.manage',
  'audit.read',
];

const roles = ['super_admin', 'administrator', 'editor', 'publisher', 'secretary'];

async function ensurePermission(key) {
  const existing = await queryOne(`SELECT id FROM Permission WHERE \`key\` = :key`, { key });
  if (existing) return existing.id;
  const id = createId();
  await query(
    `INSERT INTO Permission (id, \`key\`, created_at, updated_at) VALUES (:id, :key, NOW(3), NOW(3))`,
    { id, key },
  );
  return id;
}

async function ensureRole(name) {
  const existing = await queryOne(`SELECT id FROM Role WHERE name = :name`, { name });
  if (existing) return existing.id;
  const id = createId();
  await query(
    `INSERT INTO Role (id, name, created_at, updated_at) VALUES (:id, :name, NOW(3), NOW(3))`,
    { id, name },
  );
  return id;
}

async function main() {
  for (const key of permissionKeys) await ensurePermission(key);
  for (const name of roles) await ensureRole(name);

  const superAdminRoleId = await ensureRole('super_admin');
  const permissions = await query(`SELECT id FROM Permission`);
  for (const p of permissions) {
    const link = await queryOne(
      `SELECT id FROM RolePermission WHERE role_id = :roleId AND permission_id = :permId`,
      { roleId: superAdminRoleId, permId: p.id },
    );
    if (!link) {
      await query(
        `INSERT INTO RolePermission (id, role_id, permission_id, created_at)
         VALUES (:id, :roleId, :permId, NOW(3))`,
        { id: createId(), roleId: superAdminRoleId, permId: p.id },
      );
    }
  }

  const email = env.bootstrapAdmin.email.toLowerCase();
  const passwordHash = await argon2.hash(env.bootstrapAdmin.password);
  let user = await queryOne(`SELECT * FROM User WHERE email = :email`, { email });

  if (!user) {
    const id = createId();
    await query(
      `INSERT INTO User
        (id, email, name, password_hash, is_active, email_verified_at, created_at, updated_at)
       VALUES
        (:id, :email, :name, :hash, 1, NOW(3), NOW(3), NOW(3))`,
      {
        id,
        email,
        name: env.bootstrapAdmin.name,
        hash: passwordHash,
      },
    );
    user = await queryOne(`SELECT * FROM User WHERE id = :id`, { id });
  } else {
    await query(
      `UPDATE User SET password_hash = :hash, name = :name, is_active = 1, deleted_at = NULL, updated_at = NOW(3)
       WHERE id = :id`,
      { id: user.id, hash: passwordHash, name: env.bootstrapAdmin.name },
    );
  }

  const userRole = await queryOne(
    `SELECT id FROM UserRole WHERE user_id = :userId AND role_id = :roleId`,
    { userId: user.id, roleId: superAdminRoleId },
  );
  if (!userRole) {
    await query(
      `INSERT INTO UserRole (id, user_id, role_id, created_at) VALUES (:id, :userId, :roleId, NOW(3))`,
      { id: createId(), userId: user.id, roleId: superAdminRoleId },
    );
  }

  // Settings publiques
  const defaultSettings = {
    app_name: 'Wasomi',
    title: 'Wasomi — École d’excellence',
    email: 'cswasomi@gmail.com',
    phone: '+243 997 742 651',
    address: '5 Rue Sivirwa Q.Residentiel, C.Bungulu, Beni',
    social_links: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' },
  };
  for (const [key, value] of Object.entries(defaultSettings)) {
    const existing = await queryOne(`SELECT id FROM Setting WHERE \`key\` = :key`, { key });
    if (!existing) {
      await query(
        `INSERT INTO Setting (id, \`key\`, value_json, created_at, updated_at)
         VALUES (:id, :key, :value, NOW(3), NOW(3))`,
        { id: createId(), key, value: toJson(value) },
      );
    }
  }

  // Catégories galerie
  const galleryCats = ['Site scolaire', 'Réalisations', 'Équipement', 'Vie scolaire', 'Événements'];
  for (let i = 0; i < galleryCats.length; i++) {
    const name = galleryCats[i];
    const slug = slugify(name);
    const existing = await queryOne(`SELECT id FROM GalleryCategory WHERE slug = :slug`, { slug });
    if (!existing) {
      await query(
        `INSERT INTO GalleryCategory (id, name, slug, sort_order, created_at, updated_at)
         VALUES (:id, :name, :slug, :sortOrder, NOW(3), NOW(3))`,
        { id: createId(), name, slug, sortOrder: i },
      );
    }
  }

  // Formations de base si vide
  const programCount = await queryOne(`SELECT COUNT(*) AS c FROM Program WHERE deleted_at IS NULL`);
  if (Number(programCount?.c || 0) === 0) {
    const sharedFees = {
      total: '530 $',
      connectedFees: '10 $',
      labotech: '50 $',
      infirmary: '12 $',
      firstInstallment: '200 $',
      secondInstallment: '150 $',
      thirdInstallment: '180 $',
      cycle: 'Cycle complet',
    };
    const programs = [
      {
        title: 'Creche',
        summary: 'Pré-éveil et socialisation',
        duration: '4 ans',
        students: '10+',
        image: '/gallerie/IMG-20260519-WA0016.jpg',
      },
      {
        title: 'Maternelle',
        summary: 'Cycle complet maternelle',
        duration: '3 ans',
        students: '20+',
        image: '/gallerie/formation_maternelle.jpg',
      },
      {
        title: 'Primaire',
        summary: '1ère en 6ème année',
        duration: '6 ans',
        students: '60+',
        image: '/gallerie/IMG-20260519-WA0021.jpg',
      },
    ];
    for (let i = 0; i < programs.length; i++) {
      const p = programs[i];
      await query(
        `INSERT INTO Program
          (id, title, slug, summary, description, duration, level, image, students, fees_json, sort_order, is_active, created_at, updated_at)
         VALUES
          (:id, :title, :slug, :summary, :description, :duration, :level, :image, :students, :fees, :sortOrder, 1, NOW(3), NOW(3))`,
        {
          id: createId(),
          title: p.title,
          slug: slugify(p.title),
          summary: p.summary,
          description: p.summary,
          duration: p.duration,
          level: p.title,
          image: p.image,
          students: p.students,
          fees: toJson(sharedFees),
          sortOrder: i,
        },
      );
    }
  }

  // Staff de base si vide
  const staffCount = await queryOne(`SELECT COUNT(*) AS c FROM Staff WHERE deleted_at IS NULL`);
  if (Number(staffCount?.c || 0) === 0) {
    const staff = [
      {
        name: 'Gaby Sivirwa',
        role: 'Gestionnaire',
        department: 'Administration',
        avatar: '/personnel/Gaby Sivirwa gestionnaire.jpeg',
        bio: 'Supervise la gestion administrative et le suivi des opérations quotidiennes.',
      },
      {
        name: 'Joachim Mbayahi',
        role: 'Directeur primaire',
        department: 'Direction générale',
        avatar: '/personnel/Joachim mbayahi directeur_primaire.jpeg',
        bio: 'Encadre l’organisation et la qualité pédagogique de la section primaire.',
      },
      {
        name: 'Fazila Muhima',
        role: 'Directrice maternelle',
        department: 'Direction générale',
        avatar: '/personnel/Fazila muhima direct_maternel.jpeg',
        bio: 'Encadre l’organisation et la qualité pédagogique de la section maternelle.',
      },
    ];
    for (let i = 0; i < staff.length; i++) {
      const s = staff[i];
      await query(
        `INSERT INTO Staff
          (id, name, role, bio, avatar, department, sort_order, is_active, created_at, updated_at)
         VALUES
          (:id, :name, :role, :bio, :avatar, :department, :sortOrder, 1, NOW(3), NOW(3))`,
        { id: createId(), ...s, sortOrder: i },
      );
    }
  }

  // Article blog de démonstration
  const postCount = await queryOne(`SELECT COUNT(*) AS c FROM Post WHERE deleted_at IS NULL`);
  if (Number(postCount?.c || 0) === 0) {
    await query(
      `INSERT INTO Post
        (id, title, slug, summary, content, category, cover_image, author_name, is_published, published_at, created_at, updated_at)
       VALUES
        (:id, :title, :slug, :summary, :content, :category, :cover, :author, 1, NOW(3), NOW(3), NOW(3))`,
      {
        id: createId(),
        title: 'Bienvenue sur le blog Wasomi',
        slug: 'bienvenue-blog-wasomi',
        summary: 'Actualités et vie de l’école.',
        content: 'Cet article peut être modifié depuis l’espace administration.',
        category: 'Actualités',
        cover: '/gallerie/IMG-20260519-WA0002.jpg',
        author: env.bootstrapAdmin.name,
      },
    );
  }

  console.log('Seed OK');
  console.log('--- Accès admin ---');
  console.log(`Email   : ${email}`);
  console.log(`Password: ${env.bootstrapAdmin.password}`);
  console.log('Connexion discrète : formulaire Contact → email admin + mot de passe dans le champ Message');
  console.log('Ou page /login');

  await pool.end();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await pool.end();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
