import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
const validId = id => /^\d{1,12}$/.test(String(id));
const url = v => typeof v === "string" && v.length <= 2048 && /^https:\/\/[^\s]+$/i.test(v);
const order = v => Number.isInteger(Number(v)) && Math.abs(Number(v)) <= 100000;
const albumFields = b => b && typeof b.title === "string" && b.title.trim().length > 0 && b.title.length <= 160 && typeof (b.description ?? "") === "string" && (b.description ?? "").length <= 2000 && (!b.cover_url || url(b.cover_url)) && order(b.sort_order ?? 0) && typeof (b.location ?? "") === "string" && (b.location ?? "").length <= 200 && typeof (b.visited_on ?? "") === "string" && /^$|^\d{4}-\d{2}-\d{2}$/.test(b.visited_on ?? "") && (!b.map_url || (url(b.map_url) && /^https:\/\/(www\.)?(google\.[^/]+\/maps|maps\.app\.goo\.gl|openstreetmap\.org)\//i.test(b.map_url)));
const mediaFields = b => b && ["image", "video"].includes(b.type) && url(b.src) && typeof (b.caption ?? "") === "string" && (b.caption ?? "").length <= 300 && order(b.sort_order ?? 0);

router.get("/", async (_req, res) => {
  try { const [rows] = await pool.query(`SELECT a.*, (SELECT COUNT(*) FROM travel_media m WHERE m.album_id = a.id) AS media_count FROM travel_albums a ORDER BY a.sort_order, a.id DESC`); res.json(rows); }
  catch (e) { console.error(e); res.status(500).json({error:"Could not load travel albums. Apply database/travel_albums_migration.sql first."}); }
});
router.get("/:id/media", async (req,res) => {
  if (!validId(req.params.id)) return res.status(400).json({error:"Invalid album ID"});
  try { const [rows] = await pool.execute("SELECT * FROM travel_media WHERE album_id = ? ORDER BY sort_order, id", [req.params.id]); res.json(rows); }
  catch (e) { console.error(e); res.status(500).json({error:"Could not load album media"}); }
});
router.post("/", requireAdmin, async (req,res) => {
  if (!albumFields(req.body)) return res.status(400).json({error:"Album title, cover URL, description or order is invalid"});
  const {title,description="",cover_url="",sort_order=0,location="",visited_on="",map_url=""} = req.body;
  try { const [r] = await pool.execute("INSERT INTO travel_albums (title, description, cover_url, sort_order, location, visited_on, map_url) VALUES (?,?,?,?,?,?,?)", [title.trim(),description,cover_url,Number(sort_order),location,visited_on||null,map_url]); res.status(201).json({id:r.insertId}); }
  catch(e) { console.error(e); res.status(500).json({error:"Could not create album"}); }
});
router.put("/:id", requireAdmin, async(req,res) => {
  if (!validId(req.params.id) || !albumFields(req.body)) return res.status(400).json({error:"Invalid album"});
  const {title,description="",cover_url="",sort_order=0,location="",visited_on="",map_url=""}=req.body;
  try { const [r]=await pool.execute("UPDATE travel_albums SET title=?,description=?,cover_url=?,sort_order=?,location=?,visited_on=?,map_url=? WHERE id=?",[title.trim(),description,cover_url,Number(sort_order),location,visited_on||null,map_url,req.params.id]); if(!r.affectedRows) return res.status(404).json({error:"Album not found"}); res.json({ok:true}); }
  catch(e) { console.error(e); res.status(500).json({error:"Could not update album"}); }
});
router.delete("/:id", requireAdmin, async(req,res) => {
  if (!validId(req.params.id)) return res.status(400).json({error:"Invalid album ID"});
  try { const [r]=await pool.execute("DELETE FROM travel_albums WHERE id=?",[req.params.id]); if(!r.affectedRows) return res.status(404).json({error:"Album not found"}); res.json({ok:true}); }
  catch(e) { console.error(e); res.status(500).json({error:"Could not delete album"}); }
});
router.post("/:id/media", requireAdmin, async(req,res) => {
  if (!validId(req.params.id) || !mediaFields(req.body)) return res.status(400).json({error:"Valid image/video HTTPS URL, caption and order required"});
  const {type,src,caption="",sort_order=0}=req.body;
  try { const [r]=await pool.execute("INSERT INTO travel_media (album_id,type,src,caption,sort_order) VALUES (?,?,?,?,?)",[req.params.id,type,src,caption,Number(sort_order)]); res.status(201).json({id:r.insertId}); }
  catch(e) { console.error(e); res.status(500).json({error:"Could not add media. Check album ID and database migration."}); }
});
router.put("/:id/media/:mediaId", requireAdmin, async(req,res) => {
  if (!validId(req.params.id) || !validId(req.params.mediaId) || !mediaFields(req.body)) return res.status(400).json({error:"Invalid media"});
  const {type,src,caption="",sort_order=0}=req.body;
  try { const [r]=await pool.execute("UPDATE travel_media SET type=?,src=?,caption=?,sort_order=? WHERE id=? AND album_id=?",[type,src,caption,Number(sort_order),req.params.mediaId,req.params.id]); if(!r.affectedRows) return res.status(404).json({error:"Media not found"}); res.json({ok:true}); }
  catch(e) { console.error(e); res.status(500).json({error:"Could not update media"}); }
});
router.delete("/:id/media/:mediaId", requireAdmin, async(req,res) => {
  if (!validId(req.params.id) || !validId(req.params.mediaId)) return res.status(400).json({error:"Invalid media ID"});
  try { const [r]=await pool.execute("DELETE FROM travel_media WHERE id=? AND album_id=?",[req.params.mediaId,req.params.id]); if(!r.affectedRows) return res.status(404).json({error:"Media not found"}); res.json({ok:true}); }
  catch(e) { console.error(e); res.status(500).json({error:"Could not delete media"}); }
});
export default router;
