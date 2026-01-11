import axios from "axios";

/**
 * Sends a message to the configured Telegram bot
 * @param {string} message - The message to send
 */
export const sendTelegramMessage = async (message) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("❌ Telegram configuration missing (TOKEN/CHAT_ID)");
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    });
    console.log("✅ Telegram message sent");
  } catch (error) {
    console.error("❌ Failed to send Telegram message:", error.response?.data || error.message);
  }
};
