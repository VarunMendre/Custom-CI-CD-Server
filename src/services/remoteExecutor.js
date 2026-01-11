import { spawn } from "child_process";

const DEPLOY_SERVER = "ubuntu@13.204.246.118"; // your deploy EC2

const COMMANDS = {
  frontend: "nohup bash /home/ubuntu/deploy-frontend.sh > fe.log 2>&1 &",
  backend: "nohup bash /home/ubuntu/deploy-backend.sh > be.log 2>&1 &",
  both: `
    nohup bash /home/ubuntu/deploy-backend.sh > be.log 2>&1 &
    nohup bash /home/ubuntu/deploy-frontend.sh > fe.log 2>&1 &
  `,
};

export const triggerRemoteDeploy = (type) => {
  console.log(`🚀 Triggering ${type.toUpperCase()} deployment`);

  const ssh = spawn(
    "ssh",
    ["-o", "StrictHostKeyChecking=no", DEPLOY_SERVER, COMMANDS[type]],
    {
      detached: true,
      stdio: "ignore",
    }
  );

  ssh.unref(); // 🔥 THIS PREVENTS FREEZE
};
