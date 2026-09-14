import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { env } from '../config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  });

  await conn.query(sql);

  // Migration des nouvelles colonnes si la table existait déjà
  const alterAdmissionColumns = [
    "ADD COLUMN `first_name` varchar(100) DEFAULT NULL",
    "ADD COLUMN `last_name` varchar(100) DEFAULT NULL",
    "ADD COLUMN `birth_date` date DEFAULT NULL",
    "ADD COLUMN `age` int DEFAULT NULL",
    "ADD COLUMN `gender` varchar(20) DEFAULT NULL",
    "ADD COLUMN `class_level` varchar(120) DEFAULT NULL",
    "ADD COLUMN `education_level` varchar(120) DEFAULT NULL",
    "ADD COLUMN `address` varchar(255) DEFAULT NULL",
    "ADD COLUMN `guardian_name` varchar(160) DEFAULT NULL",
    "ADD COLUMN `guardian_phone` varchar(60) DEFAULT NULL",
    "ADD COLUMN `guardian_relation` varchar(80) DEFAULT NULL",
    "ADD COLUMN `guardian_email` varchar(254) DEFAULT NULL",
    "ADD COLUMN `emergency_phone` varchar(60) DEFAULT NULL",
    "ADD COLUMN `preferred_schedule` varchar(80) DEFAULT NULL",
    "ADD COLUMN `source` varchar(120) DEFAULT NULL",
    "ADD COLUMN `previous_school` varchar(255) DEFAULT NULL",
    "ADD COLUMN `last_grade_result` varchar(120) DEFAULT NULL",
    "ADD COLUMN `start_term` varchar(120) DEFAULT NULL",
    "ADD COLUMN `payment_mode_preference` varchar(120) DEFAULT NULL",
    "ADD COLUMN `special_needs` text DEFAULT NULL",
  ];

  for (const colDef of alterAdmissionColumns) {
    try {
      await conn.query(`ALTER TABLE \`AdmissionRequest\` ${colDef}`);
    } catch {
      // Ignorer si la colonne existe déjà
    }
  }

  const alterMediaColumns = [
    "ADD COLUMN `title` varchar(255) DEFAULT NULL",
    "ADD COLUMN `alt_text` varchar(255) DEFAULT NULL",
    "ADD COLUMN `caption` text DEFAULT NULL",
    "ADD COLUMN `category` varchar(100) DEFAULT 'general'",
    "ADD COLUMN `folder` varchar(100) DEFAULT 'misc'",
    "ADD COLUMN `width` int DEFAULT NULL",
    "ADD COLUMN `height` int DEFAULT NULL",
  ];

  for (const colDef of alterMediaColumns) {
    try {
      await conn.query(`ALTER TABLE \`Media\` ${colDef}`);
    } catch {
      // Ignorer si la colonne existe déjà
    }
  }

  await conn.end();
  console.log('Migration contenu OK (Post, Program, Staff, Gallery, Page, Contact, Admission avec champs enrichis).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
