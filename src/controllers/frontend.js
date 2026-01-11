import { exec } from "child_process";

export const frontendWebhook = (req, res) => {
  console.log("🔥 Frontend webhook received");

  exec(
    "ssh -o StrictHostKeyChecking=no ubuntu@13.127.51.250 'bash ~/deploy-frontend.sh'",
    (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return res.status(500).send("Frontend deploy failed");
      }
      console.log(stdout);
      res.send("✅ Frontend deployed");
    }
  );
};
