import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function audit() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  });

  const conn = await pool.getConnection();
  try {
    const [tables] = await conn.query("SHOW TABLES");
    console.log("=== TABLES IN DB ===");
    console.log(JSON.stringify(tables, null, 2));

    for (const row of tables) {
      const tableName = Object.values(row)[0];
      const [columns] = await conn.query(`DESCRIBE \`${tableName}\``);
      const [countResult] = await conn.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
      console.log(`\nTable: ${tableName} (Count: ${countResult[0].count})`);
      console.log(columns.map(c => `${c.Field} (${c.Type})`).join(", "));
    }
  } catch (err) {
    console.error("Audit error:", err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

audit();
