import mysql from "mysql2/promise";
import { env } from "./environment.js";

let AppDatabaseInstance = null;

export const CONNECT_DB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASS,
      database: env.DB_NAME,
    });

    AppDatabaseInstance = connection;
    console.log("Connected to MySQL Database!");
  } catch (error) {
    console.error("MySQL Connection Error:", error);
    process.exit(1);
  }
};

export const GET_DB = () => {
  if (!AppDatabaseInstance) throw new Error("No Database Connection");
  return AppDatabaseInstance;
};

export const CLOSE_DB = async () => {
  if (AppDatabaseInstance) {
    await AppDatabaseInstance.end();
    console.log("MySQL Connection Closed!");
  }
};
