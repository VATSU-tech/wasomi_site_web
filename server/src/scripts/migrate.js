import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { env } from '../config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function columnExists(conn, table, column) {
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS n
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [table, column],
  );
  return Number(rows[0]?.n || 0) > 0;
}

async function ensureColumn(conn, table, column, definition) {
  if (await columnExists(conn, table, column)) {
    console.log(`  · ${table}.${column} déjà présent`);
    return false;
  }
  await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN ${definition}`);
  console.log(`  + ${table}.${column} ajouté`);
  return true;
}

async function main() {
  const sqlPath = path.resolve(__dirname, '../../sql/content_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const conn = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
    multipleStatements: true,
    ssl: false,
  });

  console.log(`Migration sur ${env.db.host}:${env.db.port}/${env.db.database}`);

  // CREATE TABLE IF NOT EXISTS pour les tables absentes
  await conn.query(sql);
  console.log('Schéma de base appliqué (CREATE IF NOT EXISTS).');

  console.log('Colonnes AdmissionRequest…');
  const admissionColumns = [
    ['first_name', '`first_name` varchar(100) DEFAULT NULL'],
    ['last_name', '`last_name` varchar(100) DEFAULT NULL'],
    ['birth_date', '`birth_date` date DEFAULT NULL'],
    ['age', '`age` int DEFAULT NULL'],
    ['gender', '`gender` varchar(20) DEFAULT NULL'],
    ['class_level', '`class_level` varchar(120) DEFAULT NULL'],
    ['education_level', '`education_level` varchar(120) DEFAULT NULL'],
    ['address', '`address` varchar(255) DEFAULT NULL'],
    ['guardian_name', '`guardian_name` varchar(160) DEFAULT NULL'],
    ['guardian_phone', '`guardian_phone` varchar(60) DEFAULT NULL'],
    ['guardian_relation', '`guardian_relation` varchar(80) DEFAULT NULL'],
    ['guardian_email', '`guardian_email` varchar(254) DEFAULT NULL'],
    ['emergency_phone', '`emergency_phone` varchar(60) DEFAULT NULL'],
    ['preferred_schedule', '`preferred_schedule` varchar(80) DEFAULT NULL'],
    ['source', '`source` varchar(120) DEFAULT NULL'],
    ['previous_school', '`previous_school` varchar(255) DEFAULT NULL'],
    ['last_grade_result', '`last_grade_result` varchar(120) DEFAULT NULL'],
    ['start_term', '`start_term` varchar(120) DEFAULT NULL'],
    ['payment_mode_preference', '`payment_mode_preference` varchar(120) DEFAULT NULL'],
    ['special_needs', '`special_needs` text DEFAULT NULL'],
  ];
  for (const [name, def] of admissionColumns) {
    await ensureColumn(conn, 'AdmissionRequest', name, def);
  }

  console.log('Colonnes Media…');
  const mediaColumns = [
    ['title', '`title` varchar(255) DEFAULT NULL'],
    ['category', "`category` varchar(100) DEFAULT 'general'"],
    ['folder', "`folder` varchar(100) DEFAULT 'misc'"],
  ];
  for (const [name, def] of mediaColumns) {
    await ensureColumn(conn, 'Media', name, def);
  }

  // alt_text / caption / width / height existent déjà sur le schéma Prisma
  for (const [name, def] of [
    ['alt_text', '`alt_text` varchar(255) DEFAULT NULL'],
    ['caption', '`caption` text DEFAULT NULL'],
    ['width', '`width` int DEFAULT NULL'],
    ['height', '`height` int DEFAULT NULL'],
  ]) {
    await ensureColumn(conn, 'Media', name, def);
  }

  // Vérification finale des colonnes critiques
  const required = [
    ['Media', 'title'],
    ['AdmissionRequest', 'first_name'],
    ['AdmissionRequest', 'last_name'],
    ['AdmissionRequest', 'birth_date'],
    ['AdmissionRequest', 'class_level'],
    ['AdmissionRequest', 'gender'],
  ];
  const missing = [];
  for (const [table, col] of required) {
    if (!(await columnExists(conn, table, col))) missing.push(`${table}.${col}`);
  }

  await conn.end();

  if (missing.length) {
    console.error('Migration incomplète — colonnes manquantes:', missing.join(', '));
    process.exit(1);
  }

  console.log('Migration OK — Media.title et AdmissionRequest.first_name synchronisés.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
