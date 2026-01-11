/**
 * Entry point
 * Loads env
 * Starts HTTP server
 */

import path from "path";
import dotenv from "dotenv";

// Load .env from project root
dotenv.config({ path: path.join(process.cwd(), ".env") });

import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CI/CD server running on port ${PORT}`);
});
