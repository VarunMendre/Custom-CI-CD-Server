import { spawn } from "child_process";

const SERVERS = {
  frontend: {
    host: "ubuntu@13.127.210.98",
    script: "/home/ubuntu/scripts/deploy-frontend.sh",
  },
  backend: {
    host: "ubuntu@13.127.210.98",
    script: "/home/ubuntu/scripts/deploy-backend.sh",
  },
};

export const runRemoteCommand = (type) =>
  new Promise((resolve, reject) => {
    const server = SERVERS[type];

    const ssh = spawn(
      "ssh",
      ["-o", "StrictHostKeyChecking=no", server.host, `bash ${server.script}`],
      { stdio: "inherit" }
    );

    ssh.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${type} deploy failed`));
    });
  });
