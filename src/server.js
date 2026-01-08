/**
Starts Express
Loads dotenv
Starts listening
 */

import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "cicd-server" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

