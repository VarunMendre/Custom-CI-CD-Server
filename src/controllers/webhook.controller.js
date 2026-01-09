/**
 * Reads webhook payload
Extracts:
- repo name
- changed files

Decides:
- FE?
- BE?
- BOTH?
 */

import { detectChanges } from "../utils/changeDetector.js";

export const webhookController = async (req, res) => {
  try {
    const event = req.headers["x-github-event"];
    const payload = req.body;

    // response immediately to github

    res.status(200).json({ message: "Webhook received" });

    if (event !== "push") {
      console.log("Ignored event:", event);
      return;
    }

    const { frontendChanges, backendChanges, changedFiles } = detectChanges(
      payload.commits
    );

    console.log("🧠 Change Detection Result:");
    console.log("Frontend:", frontendChanged ? "YES" : "NO");
    console.log("Backend :", backendChanged ? "YES" : "NO");

    console.log("📂 Files changed:");
    changedFiles.forEach((file) => console.log(" -", file));
  } catch (error) {
    console.error("❌ Webhook processing failed:", error);
  }
};
