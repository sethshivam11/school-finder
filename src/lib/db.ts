import mysql, { Connection } from "mysql2/promise";

let connection: Connection;

export default async function connectDB() {
  try {
    if (!connection) {
      connection = await mysql.createConnection({
        uri: process.env.DATABASE_URI,
      });

      await connection.execute(`
        CREATE TABLE IF NOT EXISTS schools (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email_id VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          address VARCHAR(500) NOT NULL,
          city VARCHAR(100) NOT NULL,
          state VARCHAR(100) NOT NULL,
          contact VARCHAR(15) NOT NULL,
          image TEXT
        )
      `);

      console.log("Database connected");
    } else {
      console.log("Already connected to the Database");
    }

    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}
