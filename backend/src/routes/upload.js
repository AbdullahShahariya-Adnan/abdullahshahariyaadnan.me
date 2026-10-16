import { Router, raw } from "express";
import { createHash } from "node:crypto";
import { requireAdmin } from "../middleware/auth.js";
const router=Router();
router.post("/",requireAdmin,raw({type:["image/jpeg","image/png","image/webp","video/mp4","video/webm","video/quicktime"],limit:"25mb"}),async(req,res)=>{
  const {CLOUDINARY_CLOUD_NAME:cloud,CLOUDINARY_API_KEY:key,CLOUDINARY_API_SECRET:secret}=process.env;
  if(!cloud||!key||!secret) return res.status(503).json({error:"Configure Cloudinary credentials on the backend."});
  const bytes=req.body, mime=req.headers["content-type"];
  if(!Buffer.isBuffer(bytes)||!bytes.length) return res.status(400).json({error:"Select a file up to 25 MB"});
  const png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const jpg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
  const webp=bytes.toString("ascii",0,4)==="RIFF"&&bytes.toString("ascii",8,12)==="WEBP";
  const mp4=bytes.toString("ascii",4,8)==="ftyp";
  const webm=bytes.subarray(0,4).equals(Buffer.from([0x1a,0x45,0xdf,0xa3]));
  const mov=mp4;
  const image=(mime==="image/png"&&png)||(mime==="image/jpeg"&&jpg)||(mime==="image/webp"&&webp);
  const video=(mime==="video/mp4"&&mp4)||(mime==="video/webm"&&webm)||(mime==="video/quicktime"&&mov);
  if(!image&&!video) return res.status(400).json({error:"Invalid image or video file"});
  try {
    const timestamp=Math.floor(Date.now()/1000),folder="portfolio/travel";
    const signature=createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest("hex");
    const form=new FormData();form.append("file",new Blob([bytes],{type:mime}),video?"travel-video":"travel-image");form.append("api_key",key);form.append("timestamp",String(timestamp));form.append("folder",folder);form.append("signature",signature);
    const response=await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/${video?"video":"image"}/upload`,{method:"POST",body:form});
    const data=await response.json();if(!response.ok||!data.secure_url) return res.status(502).json({error:"Cloudinary upload failed. Check file size and Cloudinary settings."});
    res.json({url:data.secure_url,type:video?"video":"image"});
  }catch(e){console.error(e);res.status(502).json({error:"Media upload failed"});}
});
export default router;
