import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

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

router.get("/:id", async (req, res) => {
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
  try {
    await pool.query("DELETE FROM projects WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
