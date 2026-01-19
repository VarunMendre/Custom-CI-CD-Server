import { exec } from "child_process";
import { sendTelegramMessage } from "../services/telegram.service.js";
import { verifyHealth } from "../utils/healthCheck.js";

export const backendWebhook = (req, res) => {
  const { ref, head_commit, repository } = req.body;
  const branch = ref ? ref.split("/").pop() : "unknown";
  const commitMsg = head_commit ? head_commit.message : "No message";
  const author = head_commit ? head_commit.author.name : "Unknown author";
  const repoName = repository ? repository.name : "Unknown Repo";
  const shortHash = head_commit ? head_commit.id.substring(0, 7) : "n/a";
  const commitUrl = head_commit ? head_commit.url : "#";

  console.log(`🔥 Backend Deploy: ${branch} - ${commitMsg}`);

  const deployUser = process.env.DEPLOY_SERVER_USER;
  const deployIp = process.env.DEPLOY_SERVER_IP;
  const startTime = Date.now();
  const targetUrl = "https://api.cloudvault.cloud/";

  sendTelegramMessage(
    `🚀 *Backend Deployment Started*\n\n` +
      `📦 *Repo:* ${repoName}\n` +
      `🌿 *Branch:* \`${branch}\`\n` +
      `✍️ *Author:* ${author}\n` +
      `📝 *Commit:* ${commitMsg}`
  );

  exec(
    `ssh -o StrictHostKeyChecking=no ${deployUser}@${deployIp} 'bash ~/deploy-backend.sh'`,
    async (err, stdout, stderr) => {
      const duration = Math.round((Date.now() - startTime) / 1000);

      if (err) {
        console.error("❌ Backend deploy failed:", stderr);
        
        const isRollback = stdout.includes("Rollback Complete");
        const statusText = isRollback 
          ? `🛡️ *Auto-Rollback:* ✅ SUCCESS (App restored)` 
          : `⚠️ *Status:* FAILED (Manual intervention required)`;

        await sendTelegramMessage(
          `🔴 *Backend Deployment Failed*\n\n` +
            `❌ *Error:* \`${stderr || err.message || "Script failed"}\`\n\n` +
            `${statusText}`
        );
        return res.status(500).send("Deploy failed");
      }

      try {
        await verifyHealth(targetUrl);
        await sendTelegramMessage(
          `🚀 *Deployment Successful*\n\n` +
            `🧩 *Service:* Backend API\n` +
            `📦 *Repo:* ${repoName}\n` +
            `🌿 *Branch:* ${branch}\n` +
            `🔖 *Commit:* [${shortHash}](${commitUrl})\n` +
            `⏱ *Time:* ${duration}s\n` +
            `🟢 *Status:* LIVE`
        );
        res.send("Deployed & Healthy");
      } catch (healthError) {
        console.error("❌ Health check failed");
        await sendTelegramMessage(
            `🔴 *Backend Verified Failed*\n\n` +
            `❌ *Error:* Health check failed at ${targetUrl}`
        );
        res.status(500).send("Health check failed");
      }
    }
  );
};
