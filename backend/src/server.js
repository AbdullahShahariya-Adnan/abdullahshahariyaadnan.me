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
import galleryRoutes from "./routes/gallery.js";

dotenv.config();

if (process.env.NODE_ENV === "production" && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.includes("change_this"))) {
  throw new Error("Production requires a strong JWT_SECRET of at least 32 characters");
}
const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",");

app.disable("x-powered-by");
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
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: "draft-7", legacyHeaders: false, message: { error: "Too many login attempts. Try again later." } });
const writeLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 80, standardHeaders: "draft-7", legacyHeaders: false });
app.use("/api/auth/login", loginLimiter);
app.use("/api/projects", (req, res, next) => req.method === "GET" ? next() : writeLimiter(req, res, next));
app.use("/api/gallery", (req, res, next) => req.method === "GET" ? next() : writeLimiter(req, res, next));
app.use("/api/auth", limiter);
app.use("/api/contact", limiter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/gallery", galleryRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
