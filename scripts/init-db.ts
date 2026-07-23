import 'dotenv/config';
import pool from '../lib/db';

async function initDb() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database');

        await connection.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(15, 2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        bedrooms INT NOT NULL DEFAULT 0,
        bathrooms INT NOT NULL DEFAULT 0,
        area INT NOT NULL DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        image TEXT,
        description TEXT,
        yearBuilt INT,
        parking INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

        console.log('Properties table initialized successfully');
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initDb();
