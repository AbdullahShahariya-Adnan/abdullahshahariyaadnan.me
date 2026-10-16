import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";
const router=Router();
const clean=(v,max)=>typeof v==="string"?v.trim().slice(0,max+1):"";
router.post("/",async(req,res)=>{
 const {name,email,subject,message,website}=req.body||{};
 if(website) return res.status(201).json({success:true}); // honeypot
 const n=clean(name,100), e=clean(email,254), s=clean(subject,200), m=clean(message,5000);
 if(!n||!e||!m||n.length>100||e.length>254||s.length>200||m.length>5000||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))return res.status(400).json({error:"Please provide a valid name, email and message."});
 try{
  await pool.execute("INSERT INTO messages (name,email,subject,message) VALUES (?,?,?,?)",[n,e,s||null,m]);
  res.status(201).json({success:true});
  if(process.env.RESEND_API_KEY&&process.env.CONTACT_NOTIFY_EMAIL&&process.env.RESEND_FROM_EMAIL){
   try{const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({from:process.env.RESEND_FROM_EMAIL,to:[process.env.CONTACT_NOTIFY_EMAIL],subject:"New portfolio contact message",text:`From: ${n} <${e}>\nSubject: ${s}\n\n${m}`})});if(!response.ok)console.error("Contact notification failed:",response.status)}catch(error){console.error("Contact notification failed:",error.message)}
  }
 }catch(error){console.error(error);res.status(500).json({error:"Failed to save your message"})}
});
router.get("/",requireAdmin,async(_req,res)=>{try{const [rows]=await pool.query("SELECT * FROM messages ORDER BY created_at DESC LIMIT 500");res.json(rows)}catch(e){console.error(e);res.status(500).json({error:"Could not load messages"})}});
router.patch("/:id/status",requireAdmin,async(req,res)=>{const status=req.body?.status;if(!["new","read","replied"].includes(status))return res.status(400).json({error:"Invalid status"});try{const [r]=await pool.execute("UPDATE messages SET status=?,is_read=? WHERE id=?",[status,status!=="new",req.params.id]);if(!r.affectedRows)return res.status(404).json({error:"Message not found"});res.json({ok:true})}catch(e){console.error(e);res.status(500).json({error:"Run the v6 database migration"})}});
router.delete("/:id",requireAdmin,async(req,res)=>{try{await pool.execute("DELETE FROM messages WHERE id=?",[req.params.id]);res.json({ok:true})}catch(e){console.error(e);res.status(500).json({error:"Could not delete message"})}});
export default router;
