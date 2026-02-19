import mysql from 'mysql2/promise';

async function testConnection(family) {
    console.log(`Testing MySQL connection with family: ${family}...`);
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
            family: family
        });

        console.log(`Successfully connected with family ${family}!`);
        await connection.end();
    } catch (error) {
        console.error(`MySQL Connection Failed for family ${family}:`, error.message);
    }
}

async function run() {
    await testConnection(6);
    // await testConnection(4); // We know 4 works or at least the default worked before
}

run();
