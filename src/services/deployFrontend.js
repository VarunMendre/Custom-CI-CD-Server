import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { frontendConfig } from "../config/frontend.config.js";

export const deployFrontend = async () => {
  const {
    repoPath,
    buildCommand,
    distDir,
    s3Bucket,
    cloudfrontDistributionId,
    envVars, // 👈 IMPORTANT
  } = frontendConfig;

  console.log("🚀 Starting frontend deployment");

  // 1️⃣ Pull latest code
  await runCommand("git", ["pull", "origin", "main"], repoPath);

  // 2️⃣ Install dependencies (clean install)
  await runCommand("npm", ["ci"], repoPath);

  // 3️⃣ Inject environment variables
  await injectEnv(repoPath, envVars);

  // 4️⃣ Build frontend
  await runCommand("npm", ["run", buildCommand], repoPath);

  // 5️⃣ Upload build to S3
  await runCommand(
    "aws",
    ["s3", "sync", distDir, s3Bucket, "--delete"],
    repoPath
  );

  // 6️⃣ Invalidate CloudFront cache
  await runCommand("aws", [
    "cloudfront",
    "create-invalidation",
    "--distribution-id",
    cloudfrontDistributionId,
    "--paths",
    "/*",
  ]);

  console.log("✅ Frontend deployed successfully");
};

/* ------------------------------------------------------------------ */
/* ------------------------- Helpers -------------------------------- */
/* ------------------------------------------------------------------ */

const runCommand = (cmd, args, cwd) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`❌ ${cmd} ${args.join(" ")} failed`));
    });
  });

const injectEnv = async (repoPath, envVars = {}) => {
  if (!envVars || Object.keys(envVars).length === 0) {
    console.log("ℹ️ No frontend env vars to inject");
    return;
  }

  console.log("🧪 Injecting frontend environment variables");

  const envFilePath = path.join(repoPath, ".env.production");

  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  fs.writeFileSync(envFilePath, envContent);

  console.log("✅ .env.production created");
};
