import { runMigrations } from './migrations';

/**
 * Ensure all tables and columns exist.
 * Calls the unified migration engine.
 */
export async function ensureSchema(): Promise<void> {
  return runMigrations();
}

export default ensureSchema;
