/**
 * Verifies GitHub webhook signature
 * SECURITY CRITICAL
 */

import crypto from "crypto";

export const gitHubSignature = (req, res, next) => {
  const signature = req.headers["x-hub-signature-256"];

  if (!signature) {
    return res.status(401).json({ message: "Missing GitHub signature" });
  }

  const expectedSignature =
    "sha256=" +
    crypto
      .createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  next();
};
