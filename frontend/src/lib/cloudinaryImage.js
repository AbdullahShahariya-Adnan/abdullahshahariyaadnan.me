// Cloudinary performs image optimization on delivery, without changing stored originals.
export function optimizedImageUrl(src, width=900){
  if(typeof src!=="string")return src;
  try{
    const u=new URL(src);
    if(u.protocol!=="https:"||u.hostname!=="res.cloudinary.com"||!u.pathname.includes("/image/upload/"))return src;
    const safeWidth=Math.max(200,Math.min(2400,Math.round(width)));
    u.pathname=u.pathname.replace("/image/upload/",`/image/upload/f_auto,q_auto,w_${safeWidth}/`);
    return u.toString();
  }catch{return src}
}
