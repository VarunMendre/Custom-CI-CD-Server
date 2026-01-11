import { detectChanges } from "../utils/changeDetector.js";
import { triggerRemoteDeploy } from "../services/remoteExecutor.js";

export const webhookController = async (req, res) => {
  res.status(200).json({ message: "Webhook received" });

  if (req.headers["x-github-event"] !== "push") return;

  const { frontendChanges, backendChanges } = detectChanges(req.body.commits);

  console.log("🧠 Change Detection Result:");
  console.log("Frontend:", frontendChanges);
  console.log("Backend :", backendChanges);

  if (frontendChanges && backendChanges) {
    triggerRemoteDeploy("both");
  } else if (frontendChanges) {
    triggerRemoteDeploy("frontend");
  } else if (backendChanges) {
    triggerRemoteDeploy("backend");
  }
};
