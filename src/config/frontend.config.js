export const frontendConfig = {
  repoPath: "/home/ubuntu/cicd-workspace/frontend",

  // ✅ ONLY the script name
  buildCommand: "build",

  // ✅ absolute path is safer for CI
  distDir: "/home/ubuntu/cicd-workspace/frontend/dist",

  s3Bucket: "s3://storageapp-frontend-s3-bucket",
  cloudfrontDistributionId: "E3FVNJY6OALVUD",

  // optional envs (empty is fine)
  envVars: {},
};
