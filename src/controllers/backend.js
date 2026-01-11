import { exec } from "child_process";

export const backendWebhook = (req, res) => {
  console.log("🔥 Backend webhook received");

  exec(
    "ssh -o StrictHostKeyChecking=no ubuntu@13.127.51.250 'bash ~/deploy-backend.sh'",
    (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return res.status(500).send("Backend deploy failed");
      }
      console.log(stdout);
      res.send("✅ Backend deployed");
    }
  );
};
