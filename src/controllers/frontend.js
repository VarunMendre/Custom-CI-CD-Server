import { exec } from "child_process";
import { sendTelegramMessage } from "../services/telegram.service.js";
import { verifyHealth } from "../utils/healthCheck.js";

export const frontendWebhook = (req, res) => {
  const { ref, head_commit, repository } = req.body;
  const branch = ref ? ref.split("/").pop() : "unknown";
  const commitMsg = head_commit ? head_commit.message : "No message";
  const author = head_commit ? head_commit.author.name : "Unknown author";
  const repoName = repository ? repository.name : "Unknown Repo";
  const shortHash = head_commit ? head_commit.id.substring(0, 7) : "n/a";
  const commitUrl = head_commit ? head_commit.url : "#";

  console.log(`🔥 Frontend webhook received: ${branch} - ${commitMsg} by ${author}`);

  const deployUser = process.env.DEPLOY_SERVER_USER;
  const deployIp = process.env.DEPLOY_SERVER_IP;
  const startTime = Date.now();
  const targetUrl = "https://cloudvault.cloud";

  // Initial notification
  sendTelegramMessage(
    `🚀 *Frontend Deployment Started*\n\n` +
    `📦 *Repository:* ${repoName}\n` +
    `🌿 *Branch:* \`${branch}\`\n` +
    `✍️ *Author:* ${author}\n` +
    `📝 *Message:* ${commitMsg}`
  );

  exec(
    `ssh -o StrictHostKeyChecking=no ${deployUser}@${deployIp} 'bash ~/deploy-frontend.sh'`,
    async (err, stdout, stderr) => {
      const duration = Math.round((Date.now() - startTime) / 1000);

      if (err) {
        console.error("❌ Frontend deploy failed:", stderr);
        await sendTelegramMessage(
          `🔴 *Frontend Deployment Failed*\n\n` +
          `🧩 *Service:* Frontend Web\n` +
          `📦 *Repository:* ${repoName}\n` +
          `⏱ *Duration:* ${duration}s\n` +
          `❌ *Error:* \`${stderr || err.message}\``
        );
        return res.status(500).send("Frontend deploy failed");
      }

      console.log("✅ Frontend script executed, verifying health...");

      try {
        await verifyHealth(targetUrl); // Verify deployment

        console.log("✅ Frontend deployed and healthy:", stdout);

        await sendTelegramMessage(
          `🚀 *Deployment Successful*\n\n` +
          `🧩 *Service:* Frontend Web\n` +
          `🌍 *Environment:* Production\n` +
          `🖥 *Server:* EC2 (${deployIp})\n\n` +
          `📦 *Repository:* ${repoName}\n` +
          `🌿 *Branch:* ${branch}\n` +
          `🔖 *Commit:* [${shortHash}](${commitUrl})\n` +
          `✍️ *Author:* ${author}\n` +
          `📝 *Message:* ${commitMsg}\n\n` +
          `⏱ *Duration:* ${duration}s\n` +
          `❤️ *Health Check:* [cloudvault.cloud](${targetUrl}) → 200 OK\n\n` +
          `🟢 *Status:* LIVE`
        );
        res.send("✅ Frontend deployed and healthy");

      } catch (healthError) {
        console.error("❌ Frontend health check failed:", healthError.message);
        await sendTelegramMessage(
          `🔴 *Frontend Deployment Verified Failed*\n\n` +
          `🧩 *Service:* Frontend Web\n` +
          `📦 *Repository:* ${repoName}\n` +
          `⏱ *Duration:* ${duration}s\n` +
          `❌ *Error:* Health check failed.\nApp deployed but not responding at ${targetUrl}.`
        );
        res.status(500).send("Deployed but health check failed");
      }
    }
  );
};
