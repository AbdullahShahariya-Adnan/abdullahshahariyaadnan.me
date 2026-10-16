import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
const socialPlatform = (value) => {
  try {
    const u = new URL(value);
    if (u.protocol !== "https:" || u.username || u.password) return false;
    const h = u.hostname.toLowerCase();
    return ["facebook.com", "fb.watch", "instagram.com", "youtube.com", "youtu.be", "tiktok.com"].some(d => h === d || h.endsWith("." + d));
  } catch { return false; }
};
const validEntry = (src, category, link) => (category === "gallery" || category === "travelling")
  ? validUrl(src) && (!link || validUrl(link))
  : category === "social" && socialPlatform(link || src) && (!link || !src || src === link || validUrl(src));

const validId = (id) => /^\d{1,12}$/.test(String(id));
const validUrl = (value) => typeof value === "string" && value.length <= 2048 && /^https:\/\/[^\s]+$/i.test(value);

router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, type, src, caption, sort_order, category, link_url FROM gallery_items ORDER BY sort_order ASC, id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Gallery read error", err);
    res.status(500).json({ error: "Could not load gallery" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  const { src, caption = "", sort_order = 0, category = "gallery", link_url = "" } = req.body || {};
  if (!validEntry(src, category, link_url) || typeof caption !== "string" || caption.length > 300 ||
      !Number.isInteger(Number(sort_order)) || Math.abs(Number(sort_order)) > 100000) {
    return res.status(400).json({ error: "Enter a valid HTTPS image URL or supported social post link, caption (max 300), and order." });
  }
  try {
    const [result] = await pool.execute(
      "INSERT INTO gallery_items (type, src, caption, sort_order, category, link_url) VALUES (?, ?, ?, ?, ?, ?)",
      [category === "social" && (!src || src === link_url) ? "embed" : "image", src || link_url, caption, Number(sort_order), category, link_url]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("Gallery create error", err);
    res.status(500).json({ error: "Could not save gallery item" });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid ID" });
  const { src, caption = "", sort_order = 0, category = "gallery", link_url = "" } = req.body || {};
  if (!validEntry(src, category, link_url) || typeof caption !== "string" || caption.length > 300 ||
      !Number.isInteger(Number(sort_order)) || Math.abs(Number(sort_order)) > 100000) {
    return res.status(400).json({ error: "Invalid gallery item" });
  }
  try {
    const [result] = await pool.execute(
      "UPDATE gallery_items SET type = ?, src = ?, caption = ?, sort_order = ?, category = ?, link_url = ? WHERE id = ?",
      [category === "social" && (!src || src === link_url) ? "embed" : "image", src || link_url, caption, Number(sort_order), category, link_url, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Image not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("Gallery update error", err);
    res.status(500).json({ error: "Could not update gallery item" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid ID" });
  try {
    const [result] = await pool.execute("DELETE FROM gallery_items WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "Image not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("Gallery delete error", err);
    res.status(500).json({ error: "Could not delete gallery item" });
  }
});

export default router;
