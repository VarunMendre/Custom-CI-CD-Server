import { detectChanges } from "../utils/changeDetector.js";
import { runRemoteCommand } from "../services/remoteExecutor.js";

export const webhookController = async (req, res) => {
  try {
    const event = req.headers["x-github-event"];
    const payload = req.body;

    res.status(200).json({ message: "Webhook received" });

    if (event !== "push") return;

    const { frontendChanges, backendChanges, changedFiles } = detectChanges(
      payload.commits
    );

    console.log("🧠 Change Detection Result:");
    console.log("Frontend:", frontendChanges ? "YES" : "NO");
    console.log("Backend :", backendChanges ? "YES" : "NO");

    console.log("📂 Files changed:");
    changedFiles.forEach((f) => console.log(" -", f));

    if (frontendChanges) {
      console.log("🚀 Triggering Frontend Deployment");
      await runRemoteCommand("frontend");
    }

    if (backendChanges) {
      console.log("🚀 Triggering Backend Deployment");
      await runRemoteCommand("backend");
    }

    console.log("✅ Webhook processing completed");
  } catch (err) {
    console.error("❌ Webhook processing failed:", err);
  }
};
