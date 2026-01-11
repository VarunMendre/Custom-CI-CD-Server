import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we are looking for .env in the root directory (one level up from src)
const rootDir = path.resolve(__dirname, "..");
const envPath = path.join(rootDir, ".env");

console.log(`🔍 Loading .env from: ${envPath}`);

dotenv.config({ path: envPath });

// Verify it loaded something (don't log the secret itself for security, just check presence)
if (process.env.GITHUB_WEBHOOK_SECRET) {
    console.log("✅ GITHUB_WEBHOOK_SECRET found in environment");
} else {
    console.error("❌ GITHUB_WEBHOOK_SECRET NOT found after loading .env");
}
