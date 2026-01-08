/**
 * /github-webhook
 * Entry point for GitHub webhook events
 */

import { Router } from "express";
import { gitHubSignature } from "../middlewares/githubSignature.js";

const router = Router();

router.post("/", gitHubSignature);

export default router;
