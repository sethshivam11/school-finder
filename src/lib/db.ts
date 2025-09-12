import mysql, { Connection } from "mysql2/promise";

let connection: Connection;

export default async function connectDB() {
  try {
    if (!connection) {
      connection = await mysql.createConnection({
        uri: process.env.DATABASE_URI,
      });

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
