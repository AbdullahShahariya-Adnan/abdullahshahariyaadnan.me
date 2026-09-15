import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM skills ORDER BY category ASC, sort_order ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load skills" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  const { category, name, sort_order } = req.body;
  if (!category || !name) {
    return res.status(400).json({ error: "category and name are required" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO skills (category, name, sort_order) VALUES (?, ?, ?)",
      [category, name, sort_order || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create skill" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM skills WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete skill" });
  }
});

export default router;
