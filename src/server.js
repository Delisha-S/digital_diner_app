const express = require("express");
const admin = require("firebase-admin");
const aiClient = require("./aiClient");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");
const menuRouter = require("./routes/menu");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use("/api", menuRouter);

const PORT = process.env.PORT || 4000;

// Initialize Firebase Admin (uses GOOGLE_APPLICATION_CREDENTIALS or ADC)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

// Simple rate limiter
app.use(
  rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 15,
  })
);

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Middleware: verify Firebase ID token in Authorization header
async function verifyAuth(req, res, next) {
  if (process.env.SKIP_AUTH === "true") {
    req.user = { uid: "local-dev", email: "dev@example.com" };
    return next();
  }

  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const idToken = match[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    return next();
  } catch (err) {
    console.error("Token verification failed:", err.message || err);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

// POST /api/ask { question: string, cannedId?: string }
app.post("/api/ask", verifyAuth, async (req, res) => {
  const { question, cannedId } = req.body || {};
  console.log("POST /api/ask", { user: req.user?.uid || "anon", question });

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "question is required" });
  }

  try {
    const messages = [
      {
        role: "system",
        content:
          cannedId === "recommend"
            ? "You are a culinary assistant. Provide 3 vegetarian dinner suggestions with short reasons."
            : "You are a helpful assistant for Digital Diner. Answer concisely.",
      },
      {
        role: "user",
        content: `${question}\n\nUser: ${req.user?.uid || "unknown"} ${req.user?.email || ""}`,
      },
    ];

    const aiResponse = await aiClient.callOpenAIChat(messages);
    return res.json(aiResponse);
  } catch (err) {
    console.error("AI call failed:", err);
    return res.status(500).json({ error: "AI engine call failed", details: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
