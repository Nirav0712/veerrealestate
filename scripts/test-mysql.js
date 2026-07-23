import mysql from 'mysql2/promise';

async function testConnection() {
    console.log('Testing MySQL connection...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Port: ${process.env.DB_PORT || 3306}`);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
        });

        console.log('Successfully connected to MySQL!');
        await connection.end();
    } catch (error) {
        console.error('MySQL Connection Failed:', error);
    }
}

testConnection();
