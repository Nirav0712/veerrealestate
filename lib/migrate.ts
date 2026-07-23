import pool from './db';

let migrated = false;

/**
 * Ensure all required columns exist on the `properties` table.
 * Runs once per server process (cached via `migrated` flag).
 */
export async function ensureSchema(): Promise<void> {
    if (migrated) return;

    const conn = await pool.getConnection();
    try {
        const alterStatements = [
            `ALTER TABLE properties ADD COLUMN IF NOT EXISTS images TEXT`,
            `ALTER TABLE properties ADD COLUMN IF NOT EXISTS areaUnit VARCHAR(20) DEFAULT 'sqft'`,
            `ALTER TABLE properties ADD COLUMN IF NOT EXISTS transaction VARCHAR(50) DEFAULT 'resale'`,
        ];

        for (const sql of alterStatements) {
            try {
                await conn.query(sql);
            } catch (err: any) {
                // Older MySQL without IF NOT EXISTS support
                if (!String(err.message).includes('Duplicate column')) throw err;
            }
        }

        // Migrate old single `image` column → JSON `images` array
        await conn.query(`
            UPDATE properties
            SET images = JSON_ARRAY(image)
            WHERE (images IS NULL OR images = '' OR images = '[]')
              AND image IS NOT NULL
              AND image != ''
        `);

        migrated = true;
        console.log('[migrate] Schema up-to-date.');
    } catch (err) {
        console.error('[migrate] Migration error:', err);
        // Don't set migrated=true so it retries next request
    } finally {
        conn.release();
    }
}
