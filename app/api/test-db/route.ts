export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
    console.log('Test DB Route Hit');
    console.log('Env Vars:', {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
        });

        await connection.end();
        return NextResponse.json({ status: 'Connected successfully', config: { host: process.env.DB_HOST } });
    } catch (error: any) {
        console.error('Test DB Connection Failed:', error);
        return NextResponse.json({
            status: 'Failed',
            error: error.message,
            code: error.code,
            config: { host: process.env.DB_HOST }
        }, { status: 500 });
    }
}
