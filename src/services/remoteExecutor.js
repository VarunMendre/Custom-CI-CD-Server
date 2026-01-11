import { spawn } from "child_process";

const DEPLOY_SERVER = "ubuntu@3.7.31.7";

const COMMANDS = {
  backend: "nohup bash /home/ubuntu/deploy-backend.sh > be.log 2>&1 &",
};

export const triggerRemoteDeploy = (type) => {
  if (type !== "backend") return;

  console.log("🚀 Triggering BACKEND deployment");

  const ssh = spawn(
    "ssh",
    ["-o", "StrictHostKeyChecking=no", DEPLOY_SERVER, COMMANDS.backend],
    { detached: true, stdio: "ignore" }
  );

  ssh.unref();
};
