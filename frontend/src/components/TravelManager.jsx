import { optimizedImageUrl } from "../lib/cloudinaryImage.js";
import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
const blankAlbum={title:"",description:"",cover_url:"",sort_order:0,location:"",visited_on:"",map_url:""};
const blankMedia={type:"image",src:"",caption:"",sort_order:0};
// Resize large JPEG/WebP images before upload; PNG and videos retain their original data.
async function optimizeUpload(file){
  if(!file || !["image/jpeg","image/webp"].includes(file.type) || file.size<800000) return file;
  try {
    const bitmap=await createImageBitmap(file);
    const scale=Math.min(1,2200/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement("canvas");canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
    canvas.getContext("2d").drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/webp",0.82));
    if(blob && blob.size<file.size) return new File([blob],file.name.replace(/\.[^.]+$/,".webp"),{type:"image/webp"});
  }catch(err){console.warn("Image optimization skipped",err)}
  return file;
}
const input="block w-full mt-1 bg-surfaceAlt border border-border rounded-lg px-3 py-2";
export default function TravelManager({setNotice}){
  const [albums,setAlbums]=useState([]),[selected,setSelected]=useState(null),[items,setItems]=useState([]);
  const [albumEdit,setAlbumEdit]=useState(null),[albumForm,setAlbumForm]=useState(blankAlbum);
  const [mediaEdit,setMediaEdit]=useState(null),[mediaForm,setMediaForm]=useState(blankMedia);
  const [busy,setBusy]=useState(false),[uploadProgress,setUploadProgress]=useState("");
  const [draggedId,setDraggedId]=useState(null);
  const reload=()=>api.getTravelAlbums().then(setAlbums).catch(e=>setNotice(e.message));
  useEffect(()=>{reload()},[]);
  const loadMedia=id=>api.getTravelMedia(id).then(setItems).catch(e=>setNotice(e.message));
  const choose=a=>{setSelected(a);setAlbumEdit(null);setMediaEdit(null);loadMedia(a.id)};
  const upload=async(file,callback)=>{if(!file)return;setBusy(true);try{const result=await api.uploadMedia(await optimizeUpload(file));callback(result.url,result.type);setNotice("Upload completed. Save to publish.")}catch(e){setNotice(e.message)}finally{setBusy(false)}};
  const saveAlbum=async e=>{e.preventDefault();setBusy(true);try{if(albumEdit==="new")await api.createTravelAlbum(albumForm);else await api.updateTravelAlbum(albumEdit,albumForm);setAlbumEdit(null);await reload();setNotice("Album saved.")}catch(e){setNotice(e.message)}finally{setBusy(false)}};
  const deleteAlbum=async a=>{if(!window.confirm(`Delete ${a.title} and all its album entries? This cannot be undone.`))return;setBusy(true);try{await api.deleteTravelAlbum(a.id);if(selected?.id===a.id)setSelected(null);await reload();setNotice("Album deleted. Cloudinary originals remain in your Cloudinary account.")}catch(e){setNotice(e.message)}finally{setBusy(false)}};
  const saveMedia=async e=>{e.preventDefault();setBusy(true);try{if(mediaEdit==="new")await api.addTravelMedia(selected.id,mediaForm);else await api.updateTravelMedia(selected.id,mediaEdit,mediaForm);setMediaEdit(null);await loadMedia(selected.id);await reload();setNotice("Album media saved.")}catch(e){setNotice(e.message)}finally{setBusy(false)}};
  const deleteMedia=async m=>{if(!window.confirm("Remove this item from the album?"))return;setBusy(true);try{await api.deleteTravelMedia(selected.id,m.id);await loadMedia(selected.id);await reload();setNotice("Media removed from album.")}catch(e){setNotice(e.message)}finally{setBusy(false)}};
  const uploadMany=async files=>{const chosen=Array.from(files||[]);if(!chosen.length)return;setBusy(true);let done=0;try{for(const file of chosen){setUploadProgress(`Uploading ${done+1} of ${chosen.length}: ${file.name}`);const result=await api.uploadMedia(await optimizeUpload(file));await api.addTravelMedia(selected.id,{type:result.type,src:result.url,caption:file.name.replace(/\.[^.]+$/,""),sort_order:items.length+done});done++}await loadMedia(selected.id);await reload();setNotice(`${done} file(s) uploaded and added.`)}catch(e){setNotice(`${done} file(s) added. ${e.message}`);await loadMedia(selected.id)}finally{setBusy(false);setUploadProgress("")}};
  const updateOrder=async (reordered)=>{
    if(busy)return;
    const original=items;
    const next=reordered.map((m,index)=>({...m,sort_order:index}));
    setItems(next);setBusy(true);
    try{
      for(const m of next){
        const old=original.find(x=>x.id===m.id);
        if(Number(old.sort_order)!==m.sort_order)await api.updateTravelMedia(selected.id,m.id,{type:m.type,src:m.src,caption:m.caption||"",sort_order:m.sort_order});
      }
      setNotice("Photo and video order saved.");
    }catch(e){setNotice(`Could not save order: ${e.message}`);await loadMedia(selected.id)}finally{setBusy(false)}
  };
  const moveItem=(index,direction)=>{
    const target=index+direction;if(target<0||target>=items.length)return;
    const next=[...items];[next[index],next[target]]=[next[target],next[index]];updateOrder(next);
  };
  const dropItem=(targetId)=>{
    if(draggedId===null||draggedId===targetId){setDraggedId(null);return}
    const next=[...items];const from=next.findIndex(m=>m.id===draggedId),to=next.findIndex(m=>m.id===targetId);
    setDraggedId(null);if(from<0||to<0)return;
    next.splice(to,0,next.splice(from,1)[0]);updateOrder(next);
  };
  const useAsCover=async m=>{
    if(m.type!=="image"||busy)return;
    setBusy(true);
    try{
      await api.updateTravelAlbum(selected.id,{title:selected.title,description:selected.description||"",cover_url:m.src,sort_order:selected.sort_order||0,location:selected.location||"",visited_on:selected.visited_on?.slice(0,10)||"",map_url:selected.map_url||""});
      setSelected(a=>({...a,cover_url:m.src}));await reload();setNotice("Album cover updated.");
    }catch(e){setNotice(e.message)}finally{setBusy(false)}
  };
  return <div className="space-y-6">
    <p className="text-muted">Create one album per trip or country, then upload photos and videos or paste direct HTTPS media links. Changes appear automatically on the public Travelling page.</p>
    {selected&&<button onClick={()=>{setSelected(null);setMediaEdit(null)}} className="text-accent font-semibold">← All albums</button>}
    {!selected&&<><button onClick={()=>{setAlbumEdit("new");setAlbumForm({...blankAlbum})}} className="px-5 py-2 rounded-full gradient-bg text-[#14181c] font-semibold">+ Create album</button>
      {albumEdit&&<form onSubmit={saveAlbum} className="space-y-3 p-5 rounded-2xl border border-border bg-surface">
        <label>Album title (e.g. Bulgaria)<input required maxLength={160} className={input} value={albumForm.title} onChange={e=>setAlbumForm({...albumForm,title:e.target.value})}/></label>
        <label>Description<textarea maxLength={2000} className={input} value={albumForm.description} onChange={e=>setAlbumForm({...albumForm,description:e.target.value})}/></label>
        <label>Location (e.g. Sofia, Bulgaria)<input maxLength={200} className={input} value={albumForm.location||""} onChange={e=>setAlbumForm({...albumForm,location:e.target.value})}/></label>
        <label>Visit date<input type="date" className={input} value={(albumForm.visited_on||"").slice(0,10)} onChange={e=>setAlbumForm({...albumForm,visited_on:e.target.value})}/></label>
        <label>Google Maps / OpenStreetMap share URL<input type="url" className={input} value={albumForm.map_url||""} onChange={e=>setAlbumForm({...albumForm,map_url:e.target.value})}/></label>
        <label>Cover photo from computer<input type="file" accept="image/png,image/jpeg,image/webp" className={input} onChange={e=>upload(e.target.files?.[0],url=>setAlbumForm(a=>({...a,cover_url:url})))}/></label>
        <label>Or cover image HTTPS URL<input type="url" className={input} value={albumForm.cover_url} onChange={e=>setAlbumForm({...albumForm,cover_url:e.target.value})}/></label>
        {albumForm.cover_url&&<img src={albumForm.cover_url} alt="Cover preview" className="h-36 rounded-lg object-cover"/>}
        <label>Display order<input type="number" className={input} value={albumForm.sort_order} onChange={e=>setAlbumForm({...albumForm,sort_order:Number(e.target.value)})}/></label>
        <button disabled={busy} className="px-5 py-2 rounded-full gradient-bg text-[#14181c] disabled:opacity-50">Save album</button> <button type="button" onClick={()=>setAlbumEdit(null)}>Cancel</button>
      </form>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{albums.map(a=><div key={a.id} className="rounded-xl border border-border overflow-hidden bg-surface"><button onClick={()=>choose(a)} className="w-full text-left"><div className="h-40 bg-surfaceAlt">{a.cover_url?<img src={optimizedImageUrl(a.cover_url,800)} alt={a.title} className="w-full h-full object-cover"/>:<div className="h-full grid place-items-center">✈</div>}</div><div className="p-4"><strong>{a.title}</strong><p className="text-muted text-xs">{a.media_count} items · Manage media →</p></div></button><div className="px-4 pb-4 flex gap-4"><button className="text-accent" onClick={()=>{setAlbumEdit(a.id);setAlbumForm({title:a.title,description:a.description||"",cover_url:a.cover_url||"",sort_order:a.sort_order||0,location:a.location||"",visited_on:a.visited_on?.slice(0,10)||"",map_url:a.map_url||""})}}>Edit</button><button className="text-red-400" onClick={()=>deleteAlbum(a)}>Delete</button></div></div>)}</div>
    </>}
    {selected&&<><div><h2 className="text-2xl font-bold">{selected.title}</h2><p className="text-muted">Upload several photos/videos at once or add an existing media URL.</p></div>
      <label className="block rounded-xl border border-dashed border-border p-5 cursor-pointer"><strong>Upload multiple files</strong><p className="text-muted text-xs mt-1">JPG, PNG, WebP, MP4, WebM, MOV · max 25 MB each. Files are uploaded one at a time.</p><input disabled={busy} type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" onChange={e=>{uploadMany(e.target.files);e.target.value=""}} className="block mt-3"/></label>
      {uploadProgress&&<p role="status" className="text-accent">{uploadProgress}</p>}
      <button onClick={()=>{setMediaEdit("new");setMediaForm({...blankMedia,sort_order:items.length})}} className="px-5 py-2 rounded-full gradient-bg text-[#14181c]">+ Add media URL</button>
      {mediaEdit&&<form onSubmit={saveMedia} className="space-y-3 border border-border rounded-xl p-5 bg-surface">
        <label>Type<select className={input} value={mediaForm.type} onChange={e=>setMediaForm({...mediaForm,type:e.target.value})}><option value="image">Photo</option><option value="video">Video</option></select></label>
        <label>HTTPS image or video URL<input required type="url" className={input} value={mediaForm.src} onChange={e=>setMediaForm({...mediaForm,src:e.target.value})}/></label>
        <label>Or upload file<input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" className={input} onChange={e=>upload(e.target.files?.[0],(url,type)=>setMediaForm(m=>({...m,src:url,type})))}/></label>
        <label>Caption<input maxLength={300} className={input} value={mediaForm.caption} onChange={e=>setMediaForm({...mediaForm,caption:e.target.value})}/></label>
        <label>Display order<input type="number" className={input} value={mediaForm.sort_order} onChange={e=>setMediaForm({...mediaForm,sort_order:Number(e.target.value)})}/></label>
        <button disabled={busy} className="px-5 py-2 rounded-full gradient-bg text-[#14181c] disabled:opacity-50">Save media</button> <button type="button" onClick={()=>setMediaEdit(null)}>Cancel</button>
      </form>}
      <p className="text-sm text-muted">Drag cards to reorder on desktop, or use the arrow buttons on mobile. Select “Use as cover” on any photo to update this album’s cover.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{items.map((m,index)=><div key={m.id} draggable={!busy} onDragStart={e=>{setDraggedId(m.id);e.dataTransfer.effectAllowed="move"}} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();dropItem(m.id)}} onDragEnd={()=>setDraggedId(null)} className={`rounded-xl border border-border bg-surface overflow-hidden ${draggedId===m.id?"opacity-50":""}`}>{m.type==="video"?<video src={m.src} controls preload="metadata" className="w-full h-40 object-cover"/>:<img src={optimizedImageUrl(m.src,650)} alt={m.caption} className="w-full h-40 object-cover"/>}<div className="p-3"><p className="text-sm truncate">{m.caption||m.type}</p><p className="text-xs text-muted">Position: {index+1} · Drag to reorder</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          <button type="button" disabled={busy||index===0} aria-label={`Move ${m.caption||"item"} earlier`} onClick={()=>moveItem(index,-1)} className="px-2 py-1 border border-border rounded disabled:opacity-40">←</button>
          <button type="button" disabled={busy||index===items.length-1} aria-label={`Move ${m.caption||"item"} later`} onClick={()=>moveItem(index,1)} className="px-2 py-1 border border-border rounded disabled:opacity-40">→</button>
          {m.type==="image"&&<button type="button" disabled={busy||selected.cover_url===m.src} onClick={()=>useAsCover(m)} className="text-accent text-xs disabled:opacity-40">{selected.cover_url===m.src?"Current cover":"Use as cover"}</button>}
        </div><div className="flex gap-4 mt-2"><button className="text-accent" onClick={()=>{setMediaEdit(m.id);setMediaForm({type:m.type,src:m.src,caption:m.caption||"",sort_order:m.sort_order||0})}}>Edit</button><button className="text-red-400" onClick={()=>deleteMedia(m)}>Delete</button></div></div></div>)}</div>
    </>}
  </div>;
}
