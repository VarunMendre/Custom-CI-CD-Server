import { Router } from "express";
import { gitHubSignature } from "../middlewares/githubSignature.js";
import { frontendWebhook } from "../controllers/frontend.js";
import { backendWebhook } from "../controllers/backend.js";

const router = Router();

// frontend repo webhook
router.post("/frontend", gitHubSignature, frontendWebhook);

// backend repo webhook
router.post("/backend", gitHubSignature, backendWebhook);

export default router;
