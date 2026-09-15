import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM education ORDER BY sort_order ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load education" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  const { degree, institution, start_year, end_year, description, sort_order } = req.body;
  if (!degree || !institution) {
    return res.status(400).json({ error: "degree and institution are required" });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO education (degree, institution, start_year, end_year, description, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [degree, institution, start_year || null, end_year || null, description || null, sort_order || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create education entry" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM education WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete education entry" });
  }
});

export default router;
