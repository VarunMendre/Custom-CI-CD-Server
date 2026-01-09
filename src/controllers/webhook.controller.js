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
    const event = req.headers["x-github-event"];
    const payload = req.body;

    console.log("GitHub Event:", event);
    console.log("Repository:", payload.repository?.full_name);

    // Respond immediately to GitHub
    res.status(200).json({ message: "Webhook received" });

    // Later we will process async deployment here
  } catch (error) {
    console.error("Webhook error:", error);
  }
};
