import "dotenv/config";

// Verify it loaded something (don't log the secret itself for security, just check presence)
if (process.env.GITHUB_WEBHOOK_SECRET) {
    console.log("✅ GITHUB_WEBHOOK_SECRET found in environment");
} else {
    console.error("❌ GITHUB_WEBHOOK_SECRET NOT found after loading .env");
}
