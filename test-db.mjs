import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function test() {
    console.log("DB_HOST:", process.env.DB_HOST);
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
        });

        const conn = await pool.getConnection();
        console.log("Connected successfully!");
        conn.release();
    } catch (e) {
        console.error("EXACT ERROR START");
        console.error(e);
        console.error("EXACT ERROR END");
    }
}
test();
