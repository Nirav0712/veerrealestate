import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
console.log('Reading .env from:', envPath);

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    console.log('File content length:', envConfig.length);

    envConfig.split('\n').forEach(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return; // Ignore comments and empty lines

        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            process.env[key] = value;
            // console.log(`Loaded: ${key}`); // Uncomment for debugging
        }
    });
} else {
    console.log('❌ .env file not found!');
}

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
};

console.log('Testing connection with config:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port,
    password: dbConfig.password ? '******' : 'MISSING'
});

if (!dbConfig.host || !dbConfig.user || !dbConfig.password) {
    console.error('❌ Missing required environment variables! Please check your .env file.');
    process.exit(1);
}

(async () => {
    try {
        console.log('Attempting to connect...');
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connection successful!');
        await connection.end();
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\n⚠️  POSSIBLE CAUSE: IP Whitelist');
            console.error('If the password is correct, you likely need to whitelist your IP in Hostinger Remote MySQL.');
        }
    }
})();
