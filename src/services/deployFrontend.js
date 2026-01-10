import { spawn } from "child_process";
import { frontendConfig } from "../config/frontend.config.js";

export const deployFrontend = async () => {
  const {
    repoPath,
    buildCommand,
    distDir,
    s3Bucket,
    cloudfrontDistributionId,
  } = frontendConfig;

  console.log("🚀 Starting frontend deployment");

  // Step 1: Pull latest code
  await runCommand("git", ["pull", "origin", "main"], repoPath);

  // Step 2: Install deps only if needed
  await runCommand("npm", ["ci"], repoPath);

  // Step 3: Build frontend
  await runCommand("npm", ["run", "build"], repoPath);

  // Step 4: Upload to S3
  await runCommand("aws", ["s3", "sync", distDir, s3Bucket, "--delete"], repoPath);

  // Step 5: Invalidate CloudFront
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

const runCommand = (cmd, args, cwd) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd });

    child.stdout.on("data", (d) => process.stdout.write(d));
    child.stderr.on("data", (d) => process.stderr.write(d));

    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} failed`));
    });
  });
