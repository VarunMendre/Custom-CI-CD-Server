/**
 * Reads webhook payload
 * Extracts:
 * - repo name
 * - changed files
 *
 * Decides:
 * - FE?
 * - BE?
 * - BOTH?
 *
 * Triggers:
 * - FE deploy
 * - BE deploy
 */

import { detectChanges } from "../utils/changeDetector.js";
import { deployFrontend } from "../services/deployFrontend.js";
import { deployBackend } from "../services/deployBackend.js";

export const webhookController = async (req, res) => {
  try {
    const event = req.headers["x-github-event"];
    const payload = req.body;

    // ✅ Respond immediately to GitHub (CRITICAL)
    res.status(200).json({ message: "Webhook received" });

    // Ignore non-push events
    if (event !== "push") {
      console.log("⚠️ Ignored event:", event);
      return;
    }

    const { frontendChanges, backendChanges, changedFiles } = detectChanges(
      payload.commits
    );

    console.log("🧠 Change Detection Result:");
    console.log("Frontend:", frontendChanges ? "YES" : "NO");
    console.log("Backend :", backendChanges ? "YES" : "NO");

    console.log("📂 Files changed:");
    changedFiles.forEach((file) => console.log(" -", file));

    // 🚀 Trigger deployments
    if (frontendChanges) {
      console.log("🚀 Triggering Frontend Deployment...");
      await deployFrontend();
    }

    if (backendChanges) {
      console.log("🚀 Triggering Backend Deployment...");
      await deployBackend();
    }

    console.log("✅ Webhook processing completed");
  } catch (error) {
    console.error("❌ Webhook processing failed:", error);
  }
};
