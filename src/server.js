import "./config.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CI/CD server running on port ${PORT}`);
});
