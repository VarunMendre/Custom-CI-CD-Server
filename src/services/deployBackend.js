import { spawn } from "child_process";

export const deployBackend = async () => {
  console.log("🚀 Starting backend deployment");

  return new Promise((resolve, reject) => {
    const child = spawn("ssh", [
      "ubuntu@13.204.246.118",
      "/home/ubuntu/scripts/deploy-backend.sh",
    ]);

    child.stdout.on("data", (d) => process.stdout.write(d));
    child.stderr.on("data", (d) => process.stderr.write(d));

    child.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Backend deployed successfully");
        resolve();
      } else {
        reject(new Error("Backend deploy failed"));
      }
    });
  });
};
