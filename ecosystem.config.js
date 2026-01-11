module.exports = {
  apps: [
    {
      name: "cicd-server",
      script: "./src/server.js",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};

