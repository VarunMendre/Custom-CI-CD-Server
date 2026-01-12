import { exec } from "child_process";
import { sendTelegramMessage } from "../services/telegram.service.js";

export const frontendWebhook = (req, res) => {
  const { ref, head_commit } = req.body;
  const branch = ref ? ref.split("/").pop() : "unknown";
  const commitMsg = head_commit ? head_commit.message : "No message";
  const author = head_commit ? head_commit.author.name : "Unknown author";

  console.log(`🔥 Frontend webhook received: ${branch} - ${commitMsg} by ${author}`);

  const deployUser = process.env.DEPLOY_SERVER_USER;
  const deployIp = process.env.DEPLOY_SERVER_IP;

  // Initial notification
  sendTelegramMessage(
    `🚀 *Frontend Deployment Started*\n\n` +
    `*Branch:* \`${branch}\`\n` +
    `*Commit:* ${commitMsg}\n` +
    `*Author:* ${author}`
  );

  exec(
    `ssh -o StrictHostKeyChecking=no ${deployUser}@${deployIp} 'bash ~/deploy-frontend.sh'`,
    async (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Frontend deploy failed:", stderr);
        await sendTelegramMessage(
          `🔴 *Frontend Deployment Failed*\n\n` +
          `*Error:* \`${stderr || err.message}\``
        );
        return res.status(500).send("Frontend deploy failed");
      }

      console.log("✅ Frontend deployed:", stdout);
      await sendTelegramMessage(
        `✅ *Frontend Deployment Successful*\n\n` +
        `*Server:* \`${deployIp}\`\n` +
        `*Status:* Live on [cloudvault.cloud](https://cloudvault.cloud)`
      );
      res.send("✅ Frontend deployed");
    }
  );
};
