import axios from "axios";
import "dotenv/config";
await axios.post(
  `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
  {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text: "✅ CICD server is alive"
  }
);

