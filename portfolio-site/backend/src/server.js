import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import contactRoutes from "./routes/contact.js";
import skillRoutes from "./routes/skills.js";
import educationRoutes from "./routes/education.js";

dotenv.config();

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",");

app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "100kb" }));

// Render and similar hosts sit behind a proxy; this makes rate limiting see real IPs.
app.set("trust proxy", 1);

// Throttle the endpoints most likely to be abused
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth", limiter);
app.use("/api/contact", limiter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/education", educationRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
