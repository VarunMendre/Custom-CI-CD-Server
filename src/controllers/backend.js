import { exec } from "child_process";
import { sendTelegramMessage } from "../services/telegram.service.js";

export const backendWebhook = (req, res) => {
  const { ref, head_commit } = req.body;
  const branch = ref ? ref.split("/").pop() : "unknown";
  const commitMsg = head_commit ? head_commit.message : "No message";
  const author = head_commit ? head_commit.author.name : "Unknown author";

  console.log(`🔥 Backend webhook received: ${branch} - ${commitMsg} by ${author}`);

  const deployUser = process.env.DEPLOY_SERVER_USER || "ubuntu";
  const deployIp = process.env.DEPLOY_SERVER_IP || "13.127.51.250";

  // Initial notification
  sendTelegramMessage(
    `🚀 *Backend Deployment Started*\n\n` +
      `*Branch:* \`${branch}\`\n` +
      `*Commit:* ${commitMsg}\n` +
      `*Author:* ${author}`
  );

  exec(
    `ssh -o StrictHostKeyChecking=no ${deployUser}@${deployIp} 'bash ~/deploy-backend.sh'`,
    async (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Backend deploy failed:", stderr);
        await sendTelegramMessage(
          `🔴 *Backend Deployment Failed*\n\n` +
            `*Error:* \`${stderr || err.message}\``
        );
        return res.status(500).send("Backend deploy failed");
      }

      console.log("✅ Backend deployed:", stdout);
      await sendTelegramMessage(
        `✅ *Backend Deployment Successful*\n\n` +
          `*Server:* \`${deployIp}\`\n` +
          `*Status:* Live on [api.cloudvault.cloud](https://api.cloudvault.cloud/health)`
      );
      res.send("✅ Backend deployed");
    }
  );
};
