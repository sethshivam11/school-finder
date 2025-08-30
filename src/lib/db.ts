import mysql, { Connection } from "mysql2/promise";

let connection: Connection;

export default async function connectDB() {
  try {
    if (!connection) {
      connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        user: process.env.DATABASE_USER,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
      });
    }

    connection.on("connection", () => {
      connection.execute(`CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email_id TEXT NOT NULL
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        contact BIGINT NOT NULL,
        image TEXT,
      )`);
    });

    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}
