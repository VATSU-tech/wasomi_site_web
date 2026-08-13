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
  await conn.end();
  console.log('Migration contenu OK (Post, Program, Staff, Gallery, Page, Contact, Admission).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
