/**
 * Auto Migration Runner
 *
 * Runs pending SQL migrations on server startup.
 * Tracks applied migrations in a `_migrations` table.
 */

import fs from 'fs';
import path from 'path';
import pool from './database';

export async function runMigrations(): Promise<void> {
  const client = await pool.connect();

  try {
    // Create migrations tracking table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Get already-applied migrations
    const { rows } = await client.query('SELECT filename FROM _migrations');
    const applied = new Set(rows.map((r: { filename: string }) => r.filename));

    // Find migration files
    const migrationsDir = path.join(__dirname, '../../database/migrations');

    if (!fs.existsSync(migrationsDir)) {
      console.log('⚠️  No migrations directory found, skipping migrations.');
      return;
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    let ran = 0;

    for (const file of files) {
      if (applied.has(file)) continue;

      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`✅ Migration applied: ${file}`);
        ran++;
      } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Migration failed for ${file}: ${(err as Error).message}`);
      }
    }

    if (ran === 0) {
      console.log('✅ Database up to date, no migrations needed.');
    } else {
      console.log(`✅ Applied ${ran} migration(s) successfully.`);
    }
  } finally {
    client.release();
  }
}
