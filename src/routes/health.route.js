/**
/health

Used by:

- You
- NGINX
- Monitoring
- Telegram pings
 */
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "cicd-server"
  });
});

export default router;
