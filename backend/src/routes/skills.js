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

router.put("/:id", requireAdmin, async (req,res)=>{
 const {category,name,sort_order=0}=req.body||{};
 if(!/^\d+$/.test(req.params.id)||typeof category!=="string"||!category.trim()||category.length>50||typeof name!=="string"||!name.trim()||name.length>100||!Number.isInteger(Number(sort_order)))return res.status(400).json({error:"Invalid skill"});
 try { const [r]=await pool.execute("UPDATE skills SET category=?, name=?, sort_order=? WHERE id=?",[category.trim(),name.trim(),Number(sort_order),req.params.id]);if(!r.affectedRows)return res.status(404).json({error:"Skill not found"});res.json({ok:true});}catch(e){console.error(e);res.status(500).json({error:"Could not update skill"});}
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
