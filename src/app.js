/**
 * Express app configuration
 * Middlewares + routes
 */

import express from "express";
import healthRouter from "./routes/health.route.js";
import webhookRouter from "./routes/webhook.route.js";

const app = express();

app.use(express.json());
app.use("/health", healthRouter);
app.use("/github-webhook", webhookRouter);

export default app;
