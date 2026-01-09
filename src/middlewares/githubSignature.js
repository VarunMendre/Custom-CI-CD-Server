/**
 * Verifies GitHub webhook signature
 * SECURITY CRITICAL
 */

import crypto from "crypto";

export const gitHubSignature = (req, res, next) => {
  console.log("🔥 Webhook hit");
  const signature = req.headers["x-hub-signature-256"];

  if (!signature) {
    console.log("❌ No signature header");
    return res.status(401).json({ message: "Missing GitHub signature" });
  }

  const hmac = crypto.createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET);

  const digest = "sha256=" + hmac.update(req.rawBody).digest("hex");

  const sigBuffer = Buffer.from(signature);
  const digestBuffer = Buffer.from(digest);

  if (
    sigBuffer.length !== digestBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, digestBuffer)
  ) {
    console.log("❌ Signature mismatch");
    return res.status(401).json({ message: "Invalid signature" });
  }
  console.log("✅ Signature verified");
  next();
};
