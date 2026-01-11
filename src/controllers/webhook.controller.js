import { detectChanges } from "../utils/changeDetector.js";
import { triggerRemoteDeploy } from "../services/remoteExecutor.js";
import { exec } from "child_process";

const buildFrontend = () => {
  exec("bash /home/ubuntu/frontend-builder/deploy-frontend.sh", (err) => {
    if (err) console.error("❌ Frontend build failed");
    else console.log("✅ Frontend deployed");
  });
};

export const webhookController = async (req, res) => {
  res.status(200).json({ message: "Webhook received" });

  if (req.headers["x-github-event"] !== "push") return;

  const { frontendChanges, backendChanges } = detectChanges(req.body.commits);

  if (frontendChanges) buildFrontend();
  if (backendChanges) triggerRemoteDeploy("backend");
};
