/**
 * Server Entry Point
 *
 * Initializes and starts the Express server.
 */

import app from './app';
import { config } from './config/env';
import { validateEnv } from './config/env-validator';
import { runMigrations } from './config/migrate';
import runSeeds from '../database/seeds/run-all';

// Validate environment variables before starting
validateEnv();

const PORT = config.port || 3001;

async function start() {
  await runMigrations();

  if (process.env.RUN_SEEDS === 'true') {
    console.log('🌱 RUN_SEEDS=true detected, running seeds...');
    await runSeeds();
    console.log('✅ Seeding complete. Remove RUN_SEEDS from environment to skip on next restart.');
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
