import mysql from 'mysql2/promise';

async function testLocalhost() {
    console.log('Testing connection to localhost (simulating undefined DB_HOST)...');
    try {
        // Omitting host defaults to localhost
        const connection = await mysql.createConnection({
            user: 'root', // dummy
            password: 'password', // dummy
            // host: undefined 
        });
        console.log('Connected to localhost!');
        await connection.end();
    } catch (error) {
        console.error('Connection failed:', error.message);
        console.error('Error code:', error.code);
    }
}

testLocalhost();
