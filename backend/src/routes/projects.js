import { Router, raw } from "express";
import { createHash } from "node:crypto";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
const isId = (v) => /^\d{1,12}$/.test(String(v));
const allowedText = (v, max) => v == null || (typeof v === "string" && v.length <= max);
const safeUrl = (v) => v == null || v === "" || (typeof v === "string" && v.length <= 2048 && /^https:\/\/[^\s]+$/i.test(v));
function validateProject(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return "Invalid project data";
  const limits = { title: 160, tagline: 255, description: 5000, long_description: 20000, role: 255, duration: 100, tech_stack: 2000, features: 10000, challenges: 10000 };
  for (const [key, max] of Object.entries(limits)) if (!allowedText(body[key], max)) return `Invalid ${key}`;
  for (const key of ["github_url", "live_url", "image_url"]) if (!safeUrl(body[key])) return `Invalid ${key}: HTTPS URL required`;
  if (body.sort_order != null && (!Number.isInteger(Number(body.sort_order)) || Math.abs(Number(body.sort_order)) > 100000)) return "Invalid sort order";
  if (typeof body.title !== "string" || !body.title.trim() || typeof body.description !== "string" || !body.description.trim() || typeof body.tech_stack !== "string" || !body.tech_stack.trim()) return "Title, description and tech stack are required";
  return null;
}


router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load projects" });
  }
});

// Authenticated image upload to Cloudinary; no ephemeral server disk storage.
router.post("/upload-image", requireAdmin, raw({
  type: ["image/png", "image/jpeg", "image/webp"],
  limit: "5mb",
}), async (req, res) => {
  const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;
  if (!cloud || !key || !secret) {
    return res.status(503).json({ error: "Configure Cloudinary credentials on the backend first." });
  }
  if (!Buffer.isBuffer(req.body) || !req.body.length) {
    return res.status(400).json({ error: "Choose a PNG, JPG, or WebP image under 5 MB." });
  }
  const bytes = req.body;
  const png = bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const jpg = bytes.length > 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const webp = bytes.length > 12 && bytes.toString("ascii",0,4) === "RIFF" && bytes.toString("ascii",8,12) === "WEBP";
  if (!(png || jpg || webp)) return res.status(400).json({ error: "Invalid image file" });
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "portfolio/projects";
    const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest("hex");
    const form = new FormData();
    form.append("file", new Blob([req.body], { type: req.headers["content-type"] }), "project-image");
    form.append("api_key", key);
    form.append("timestamp", String(timestamp));
    form.append("folder", folder);
    form.append("signature", signature);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/image/upload`, {
      method: "POST", body: form,
    });
    const result = await response.json();
    if (!response.ok || !result.secure_url) {
      return res.status(502).json({ error: "Cloudinary upload failed. Check your credentials." });
    }
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(502).json({ error: "Unable to upload image." });
  }
});

// Public screenshots for each project, stored in MySQL; Cloudinary holds image bytes.
router.get("/:id/images", async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ error: "Invalid project ID" });
  try {
    const [rows] = await pool.query("SELECT id, project_id, image_url, caption, sort_order FROM project_images WHERE project_id = ? ORDER BY sort_order ASC, id ASC", [req.params.id]);
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: "Failed to load project screenshots. Apply the project images migration." }); }
});
router.post("/:id/images", requireAdmin, async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ error: "Invalid project ID" });
  const { image_url, caption = "", sort_order = 0 } = req.body || {};
  if (!image_url || !safeUrl(image_url) || !allowedText(caption, 255) || !Number.isInteger(Number(sort_order)) || Math.abs(Number(sort_order)) > 100000) return res.status(400).json({ error: "Valid HTTPS image URL, caption and order required" });
  try {
    const [result] = await pool.query("INSERT INTO project_images (project_id, image_url, caption, sort_order) VALUES (?, ?, ?, ?)", [req.params.id, image_url, caption, Number(sort_order)]);
    res.status(201).json({ id: result.insertId });
  } catch (err) { console.error(err); res.status(500).json({ error: "Could not save screenshot. Check database migration." }); }
});
router.delete("/:id/images/:imageId", requireAdmin, async (req, res) => {
  if (!isId(req.params.id) || !isId(req.params.imageId)) return res.status(400).json({ error: "Invalid ID" });
  try {
    const [result] = await pool.query("DELETE FROM project_images WHERE id = ? AND project_id = ?", [req.params.imageId, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "Screenshot not found" });
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: "Could not delete screenshot" }); }
});

router.get("/:id", async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ error: "Invalid project ID" });
  try {
    const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "Project not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load project" });
  }
});

const FIELDS = [
  "title", "tagline", "description", "long_description", "role", "duration",
  "tech_stack", "features", "challenges", "github_url", "live_url", "image_url", "sort_order",
];

function pickFields(body) {
  const out = {};
  for (const f of FIELDS) out[f] = body[f] ?? null;
  return out;
}

router.post("/", requireAdmin, async (req, res) => {
  const error = validateProject(req.body);
  if (error) return res.status(400).json({ error });
  const data = pickFields(req.body);

  if (!data.title || !data.description || !data.tech_stack) {
    return res.status(400).json({ error: "title, description, and tech_stack are required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO projects (${FIELDS.join(", ")}) VALUES (${FIELDS.map(() => "?").join(", ")})`,
      FIELDS.map((f) => data[f] ?? (f === "sort_order" ? 0 : null))
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ error: "Invalid project ID" });
  const error = validateProject(req.body);
  if (error) return res.status(400).json({ error });
  const data = pickFields(req.body);

  try {
    await pool.query(
      `UPDATE projects SET ${FIELDS.map((f) => `${f} = ?`).join(", ")} WHERE id = ?`,
      [...FIELDS.map((f) => data[f] ?? (f === "sort_order" ? 0 : null)), req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update project" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  if (!isId(req.params.id)) return res.status(400).json({ error: "Invalid project ID" });
  try {
    await pool.query("DELETE FROM projects WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
