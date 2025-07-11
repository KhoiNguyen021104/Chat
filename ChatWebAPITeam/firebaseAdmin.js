import admin from "firebase-admin";
import dotenv from "dotenv";
const serviceAccount = require("./src/serviceAccountKey.json");

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
  