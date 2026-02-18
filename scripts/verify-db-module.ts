import pool from '../lib/db';

async function verify() {
    console.log('Successfully imported pool from lib/db.ts');
    try {
        // We don't need to connect to verify the module syntax, 
        // but we can check if the object is a valid pool
        if (pool && typeof pool.query === 'function') {
            console.log('✅ Pool object is valid');
        } else {
            console.error('❌ Pool object is invalid');
        }
    } catch (error) {
        console.error('❌ Error checking pool:', error);
    }
}

verify();
