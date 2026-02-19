import mysql from 'mysql2/promise';
import net from 'net';

async function testStream(family) {
    console.log(`Creating socket for family ${family}...`);
    try {
        const socket = net.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
            family: family
        });

        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                socket.destroy();
                reject(new Error('Socket connection timeout'));
            }, 5000);

            socket.once('connect', () => {
                clearTimeout(timeout);
                console.log(`Socket connected (family ${family})`);
                resolve();
            });
            socket.once('error', (err) => {
                clearTimeout(timeout);
                reject(err);
            });
        });

        console.log(`Establishing MySQL handshake over socket (family ${family})...`);
        const connection = await mysql.createConnection({
            stream: socket,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log(`Successfully connected MySQL over family ${family}!`);
        await connection.end();
    } catch (error) {
        console.error(`Failed for family ${family}:`, error.message);
    }
}

async function run() {
    console.log('--- Testing IPv6 ---');
    await testStream(6);
    console.log('\n--- Testing IPv4 ---');
    await testStream(4);
}

run();
