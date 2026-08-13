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
  const alterColumns = [
    "ADD COLUMN `birth_date` varchar(40) DEFAULT NULL",
    "ADD COLUMN `gender` varchar(40) DEFAULT NULL",
    "ADD COLUMN `education_level` varchar(120) DEFAULT NULL",
    "ADD COLUMN `address` varchar(255) DEFAULT NULL",
    "ADD COLUMN `guardian_name` varchar(160) DEFAULT NULL",
    "ADD COLUMN `guardian_phone` varchar(60) DEFAULT NULL",
    "ADD COLUMN `preferred_schedule` varchar(80) DEFAULT NULL",
    "ADD COLUMN `source` varchar(120) DEFAULT NULL",
    "ADD COLUMN `previous_school` varchar(255) DEFAULT NULL",
    "ADD COLUMN `last_grade_result` varchar(120) DEFAULT NULL",
    "ADD COLUMN `guardian_relation` varchar(80) DEFAULT NULL",
    "ADD COLUMN `guardian_email` varchar(254) DEFAULT NULL",
    "ADD COLUMN `emergency_phone` varchar(60) DEFAULT NULL",
    "ADD COLUMN `start_term` varchar(120) DEFAULT NULL",
    "ADD COLUMN `payment_mode_preference` varchar(120) DEFAULT NULL",
    "ADD COLUMN `special_needs` text DEFAULT NULL",
  ];

  for (const colDef of alterColumns) {
    try {
      await conn.query(`ALTER TABLE \`AdmissionRequest\` ${colDef}`);
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
