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

  console.log(`🔥 Backend webhook received: ${branch} - ${commitMsg} by ${author}`);

  const deployUser = process.env.DEPLOY_SERVER_USER;
  const deployIp = process.env.DEPLOY_SERVER_IP;
  const startTime = Date.now();
  const targetUrl = "https://api.cloudvault.cloud/"; // Checking root 

  // Initial notification
  sendTelegramMessage(
    `🚀 *Backend Deployment Started*\n\n` +
      `📦 *Repository:* ${repoName}\n` +
      `🌿 *Branch:* \`${branch}\`\n` +
      `✍️ *Author:* ${author}\n` +
      `📝 *Message:* ${commitMsg}`
  );

  exec(
    `ssh -o StrictHostKeyChecking=no ${deployUser}@${deployIp} 'bash ~/deploy-backend.sh'`,
    async (err, stdout, stderr) => {
      const duration = Math.round((Date.now() - startTime) / 1000);

      if (err) {
        console.error("❌ Backend deploy failed:", stderr);
        
        // Check if our script triggered a rollback
        const isRollback = stdout.includes("Rollback Complete");
        const statusText = isRollback 
          ? `🛡️ *Auto-Rollback:* ✅ SUCCESS (App restored to previous version)` 
          : `⚠️ *Status:* FAILED (Manual intervention required)`;

        await sendTelegramMessage(
          `🔴 *Backend Deployment Failed*\n\n` +
            `❌ *Error:* \`${stderr || err.message || "Script failed"}\`\n\n` +
            `${statusText}`
        );
        return res.status(500).send("Backend deploy failed");
      }

      console.log("✅ Backend script executed, verifying health...");
      
      try {
        await verifyHealth(targetUrl);

        console.log("✅ Backend deployed and healthy:", stdout);
      
        await sendTelegramMessage(
          `🚀 *Deployment Successful*\n\n` +
            `🧩 *Service:* Backend API\n` +
            `🌍 *Environment:* Production\n` +
            `🖥 *Server:* EC2 (${deployIp})\n\n` +
            `📦 *Repository:* ${repoName}\n` +
            `🌿 *Branch:* ${branch}\n` +
            `🔖 *Commit:* [${shortHash}](${commitUrl})\n` +
            `✍️ *Author:* ${author}\n` +
            `📝 *Message:* ${commitMsg}\n\n` +
            `⏱ *Duration:* ${duration}s\n` +
            `❤️ *Health Check:* [api.cloudvault.cloud](${targetUrl}) → 200 OK\n\n` +
            `🟢 *Status:* LIVE`
        );
        res.send("✅ Backend deployed and healthy");

      } catch (healthError) {
        console.error("❌ Backend health check failed:", healthError.message);
        await sendTelegramMessage(
          `🔴 *Backend Deployment Verified Failed*\n\n` +
            `🧩 *Service:* Backend API\n` +
            `📦 *Repository:* ${repoName}\n` +
            `⏱ *Duration:* ${duration}s\n` +
            `❌ *Error:* Health check failed.\nApp at ${targetUrl} did not respond with 200 OK.`
        );
        res.status(500).send("Deployed but health check failed");
      }
    }
  );
};
