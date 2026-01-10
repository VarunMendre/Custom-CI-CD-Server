import { exec } from "child_process";

const DEPLOY_USER = "ubuntu";
const DEPLOY_HOST = "13.202.240.78"; // your deploy EC2 PUBLIC IP

function run(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Command failed:", stderr);
        return reject(error);
      }
      console.log(stdout);
      resolve();
    });
  });
}

export async function deployFrontend() {
  console.log("🚀 Deploying Frontend...");
  await run(
    `ssh ${DEPLOY_USER}@${DEPLOY_HOST} "/home/ubuntu/scripts/deploy-frontend.sh"`
  );
}

export async function deployBackend() {
  console.log("🚀 Deploying Backend...");
  await run(
    `ssh ${DEPLOY_USER}@${DEPLOY_HOST} "/home/ubuntu/scripts/deploy-backend.sh"`
  );
}
