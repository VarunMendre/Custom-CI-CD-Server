/**
 * Reads webhook payload
Extracts:
- repo name
- changed files

Decides:
- FE?
- BE?
- BOTH?
 */

export const webhookController = async (req, res) => {
  try {
    console.log("📦 Event:", req.headers["x-github-event"]);
    console.log("📁 Repo:", req.body.repository?.full_name);

    // Respond immediately to GitHub
    res.status(200).json({ message: "Webhook received" });

    // Later we will process async deployment here
  } catch (error) {
    console.error("Webhook error:", error);
  }
};
