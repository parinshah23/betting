/**
 * Server Entry Point
 *
 * Initializes and starts the Express server.
 */

import app from './app';
import { config } from './config/env';
import { validateEnv } from './config/env-validator';

// Validate environment variables before starting
validateEnv();

const PORT = config.port || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
