import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import SocialEmbed, { getSocialEmbed } from "../components/SocialEmbed.jsx";

const EMPTY_GALLERY = { src: "", caption: "", sort_order: 0, category: "gallery", link_url: "" };

const EMPTY_PROJECT = {
  title: "", tagline: "", description: "", long_description: "", role: "", duration: "",
  tech_stack: "", features: "", challenges: "", github_url: "", live_url: "", image_url: "", sort_order: 0,
};

export default function Admin() {
  const [token, setToken] = useState(sessionStorage.getItem("admin_token") || "");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const [tab, setTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryEditing, setGalleryEditing] = useState(null);
  const [galleryForm, setGalleryForm] = useState({ ...EMPTY_GALLERY });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const [screenshotForm, setScreenshotForm] = useState({ image_url: "", caption: "", sort_order: 0 });

  const loggedIn = Boolean(token);
  const socialPosts = galleryItems.filter(x => x.category === "social");
  const galleryPhotos = galleryItems.filter(x => ["gallery", "travelling"].includes(x.category || "gallery"));
  const matches = x => String(x || "").toLowerCase().includes(search.toLowerCase());
  const navigate = t => { setTab(t); setSearch(""); setMobileMenu(false); setEditing(null); setGalleryEditing(null); setNotice(""); };


  useEffect(() => {
    if (!loggedIn) return;
    refreshProjects();
    refreshMessages();
    refreshGallery();
  }, [loggedIn]);

  const refreshProjects = () => api.getProjects().then(setProjects).catch(() => {});
  const refreshMessages = () => api.getMessages().then(setMessages).catch(() => {});
  const refreshGallery = () => api.getGallery().then(setGalleryItems).catch(() => {});

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const { token: t } = await api.login(loginForm.username, loginForm.password);
      sessionStorage.setItem("admin_token", t);
      setToken(t);
    } catch (err) {
      setLoginError(err.message || "Login failed");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setToken("");
  };

  const openEdit = (project) => {
    setEditing(project.id); setForm(project); setNotice("");
    setScreenshots([]); setScreenshotForm({ image_url: "", caption: "", sort_order: 0 });
    api.getProjectImages(project.id).then(setScreenshots).catch((err) => setNotice(err.message));
  };
  const uploadScreenshot = async (file) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) { setNotice("Choose a JPG, PNG or WebP under 5 MB."); return; }
    setBusy(true); setNotice("");
    try { const { url } = await api.uploadProjectImage(file); setScreenshotForm(f => ({ ...f, image_url: url })); setNotice("Screenshot uploaded. Click Add screenshot to publish."); }
    catch (err) { setNotice(err.message); } finally { setBusy(false); }
  };
  const addScreenshot = async () => {
    setBusy(true); setNotice("");
    try { await api.addProjectImage(editing, screenshotForm); setScreenshots(await api.getProjectImages(editing)); setScreenshotForm({ image_url: "", caption: "", sort_order: 0 }); setNotice("Screenshot added."); }
    catch (err) { setNotice(err.message); } finally { setBusy(false); }
  };
  const deleteScreenshot = async (imageId) => {
    if (!window.confirm("Remove this screenshot?")) return;
    setBusy(true);
    try { await api.deleteProjectImage(editing, imageId); setScreenshots(await api.getProjectImages(editing)); setNotice("Screenshot removed."); }
    catch (err) { setNotice(err.message); } finally { setBusy(false); }
  };
  const openNew = () => { setEditing("new"); setForm({ ...EMPTY_PROJECT }); setNotice(""); };

  const uploadImage = async (file) => {
    if (!file) return;
    setNotice("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setNotice("Use a JPG, PNG or WebP image smaller than 5 MB.");
      return;
    }
    setBusy(true);
    try {
      const { url } = await api.uploadProjectImage(file);
      setForm((prev) => ({ ...prev, image_url: url }));
      setNotice("Image uploaded. Save the project to publish it.");
    } catch (err) {
      setNotice(err.message);
    } finally {
      setBusy(false);
    }
  };

  const uploadGalleryImage = async (file) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setNotice("Choose a PNG, JPG, or WebP image under 5 MB.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      const { url } = await api.uploadProjectImage(file);
      setGalleryForm((previous) => ({ ...previous, src: url }));
      setNotice("Photo uploaded. Click Save photo to publish it.");
    } catch (err) { setNotice(err.message); }
    finally { setBusy(false); }
  };

  const saveGallery = async (e) => {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      const payload = tab === "social" ? { ...galleryForm, src: galleryForm.link_url, category: "social" } : galleryForm;
      if (galleryEditing === "new") await api.addGalleryImage(payload);
      else await api.updateGalleryImage(galleryEditing, payload);
      await refreshGallery();
      setGalleryEditing(null);
      setNotice(tab === "social" ? "Social post published." : "Gallery photo saved.");
    } catch (err) { setNotice(err.message); }
    finally { setBusy(false); }
  };

  const removeGallery = async (id) => {
    if (!window.confirm("Remove this photo from your gallery?")) return;
    setBusy(true);
    try {
      await api.deleteGalleryImage(id);
      await refreshGallery();
      setNotice("Photo removed from gallery.");
    } catch (err) { setNotice(err.message); }
    finally { setBusy(false); }
  };

  const saveProject = async (e) => {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      if (editing === "new") await api.createProject(form);
      else await api.updateProject(editing, form);
      setEditing(null);
      await refreshProjects();
      setNotice("Project saved successfully.");
    } catch (err) {
      setNotice(err.message);
    } finally {
      setBusy(false);
    }
  };

  const removeProject = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.deleteProject(id);
      await refreshProjects();
      setNotice("Project deleted.");
    } catch (err) { setNotice(err.message); }
  };

  const removeMessage = async (id) => {
    if (!confirm("Delete this message?")) return;
    await api.deleteMessage(id);
    refreshMessages();
    refreshGallery();
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-bg text-text">
        <form onSubmit={handleLogin} className="w-full max-w-sm text-sm space-y-4">
          <p className="text-accent text-xs uppercase tracking-widest mb-2">Admin login</p>
          <input
            placeholder="username"
            value={loginForm.username}
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
          />
          <input
            type="password"
            placeholder="password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
          />
          <button className="w-full px-4 py-3 rounded-full gradient-bg text-[#14181c] font-semibold">
            Log in
          </button>
          {loginError && <p className="text-red-400 text-xs">{loginError}</p>}
        </form>
      </div>
    );
  }

  const nav = [{id:"dashboard",name:"Dashboard",icon:"◫"},{id:"projects",name:"Projects",icon:"▣"},{id:"gallery",name:"Gallery",icon:"▧"},{id:"travelling",name:"Travelling",icon:"✈"},{id:"social",name:"Social Media",icon:"◎"},{id:"messages",name:"Messages",icon:"✉"}];
  return (
    <div className="min-h-screen bg-bg text-text text-sm lg:flex">
      <aside className={`${mobileMenu ? "block" : "hidden"} lg:block lg:w-60 lg:h-screen lg:sticky lg:top-0 shrink-0 bg-[#07121b] border-r border-border p-5`}>
        <div className="flex items-center gap-3 mb-9"><span className="h-11 w-11 rounded-xl bg-accent text-[#07121b] grid place-items-center font-bold text-xl">A</span><div><p className="font-display font-bold text-lg">Adnan</p><p className="text-muted text-xs">Portfolio Admin</p></div></div>
        <nav aria-label="Admin navigation" className="space-y-2">{nav.map(n => <button key={n.id} onClick={() => navigate(n.id)} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 ${tab===n.id ? "bg-accent/15 text-accent border border-accent/30" : "text-muted hover:bg-surface hover:text-text"}`}><span className="text-lg">{n.icon}</span>{n.name}</button>)}</nav>
        <a href="/" target="_blank" rel="noopener noreferrer" className="block mt-10 border border-border rounded-xl p-3 text-accent">↗ View website</a>
        <button onClick={handleLogout} className="text-muted hover:text-red-400 mt-5 px-3 text-xs">Log out</button>
      </aside>
      <main className="flex-1 min-w-0 px-4 sm:px-8 py-8"><div className="max-w-6xl mx-auto">
        <header className="flex items-center gap-4 mb-7"><button type="button" aria-label="Toggle menu" onClick={() => setMobileMenu(v=>!v)} className="lg:hidden border border-border rounded-lg px-3 py-2">☰</button><div><h1 className="font-display text-2xl font-bold">{nav.find(n=>n.id===tab)?.name}</h1><p className="text-muted text-xs mt-1">Manage your portfolio content</p></div></header>
        {tab !== "dashboard" && <input type="search" aria-label="Search content" value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${tab}...`} className="w-full max-w-md bg-surface border border-border rounded-xl px-4 py-3 mb-6 outline-none focus:border-accent" />}
        {tab === "dashboard" && <div className="space-y-6">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">{[{name:"Projects",count:projects.length,tab:"projects"},{name:"Gallery photos",count:galleryPhotos.length,tab:"gallery"},{name:"Social posts",count:socialPosts.length,tab:"social"},{name:"Messages",count:messages.length,tab:"messages"}].map(c=><button key={c.tab} onClick={()=>navigate(c.tab)} className="text-left rounded-2xl border border-border bg-surface p-5 hover:border-accent"><div className="text-3xl font-bold text-accent">{c.count}</div><div className="text-muted mt-2">{c.name}</div></button>)}</div>
          <div className="grid md:grid-cols-2 gap-5"><section className="rounded-2xl border border-border bg-surface p-5 space-y-3"><h2 className="font-semibold text-lg mb-4">Quick actions</h2><button onClick={()=>{navigate("projects");openNew();}} className="w-full rounded-xl gradient-bg text-[#14181c] py-3 font-semibold">+ Add project</button><button onClick={()=>{navigate("gallery");setGalleryEditing("new");setGalleryForm({...EMPTY_GALLERY,category:"gallery"});}} className="w-full rounded-xl border border-border py-3">+ Add gallery photo</button><button onClick={()=>{navigate("social");setGalleryEditing("new");setGalleryForm({...EMPTY_GALLERY,category:"social"});}} className="w-full rounded-xl border border-border py-3">+ Add social post</button></section>
          <section className="rounded-2xl border border-border bg-surface p-5"><div className="flex justify-between mb-4"><h2 className="font-semibold text-lg">Recent messages</h2><button onClick={()=>navigate("messages")} className="text-accent text-xs">View all →</button></div>{messages.length ? messages.slice().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,4).map(m=><div key={m.id} className="border-b border-border py-3"><p className="font-medium">{m.name}</p><p className="text-muted text-xs truncate">{m.subject || m.message}</p></div>) : <p className="text-muted">No messages yet.</p>}</section></div>
          <p className="text-muted text-xs">Dashboard counts come from your existing API. No new services or database migrations required.</p>
        </div>}
        {notice && <p role="status" className="mb-5 text-accent text-sm">{notice}</p>}
        {tab === "projects" && (
          <div>
            {editing ? (
              <form onSubmit={saveProject} className="space-y-3 mb-8 border border-border rounded-2xl p-5 bg-surface">
                <input placeholder="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                <input placeholder="tagline (short one-liner for cards)" value={form.tagline || ""} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                <textarea placeholder="description (short, shown on cards)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={2} className="w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                <textarea placeholder="long_description (full write-up for the case study page)" value={form.long_description || ""} onChange={(e) => setForm({ ...form, long_description: e.target.value })} rows={4} className="w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                <div className="grid sm:grid-cols-2 gap-3">
                  <input placeholder="role (e.g. University project)" value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                  <input placeholder="duration (e.g. ~4 weeks)" value={form.duration || ""} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                </div>
                <input placeholder="tech_stack (comma separated)" value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} required className="w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                <textarea placeholder="features (comma separated)" value={form.features || ""} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={2} className="w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                <textarea placeholder="challenges (comma separated)" value={form.challenges || ""} onChange={(e) => setForm({ ...form, challenges: e.target.value })} rows={2} className="w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                <input placeholder="github_url" value={form.github_url || ""} onChange={(e) => setForm({ ...form, github_url: e.target.value })} className="w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                <input placeholder="live_url" value={form.live_url || ""} onChange={(e) => setForm({ ...form, live_url: e.target.value })} className="w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                <div className="space-y-2">
                  <label className="block text-muted">Project cover image</label>
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => uploadImage(e.target.files?.[0])} className="block w-full text-sm text-muted" />
                  <input type="url" placeholder="Or paste an HTTPS image URL" value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                  {form.image_url && <img src={form.image_url} alt="Project image preview" className="w-full max-w-sm h-40 object-cover rounded-lg" />}
                  <p className="text-xs text-muted">File uploads require Cloudinary credentials on the backend.</p>
                </div>
                {editing !== "new" && <section className="border border-border rounded-xl p-4 space-y-3" aria-label="Project screenshots">
                  <h3 className="font-semibold text-base">Project screenshots</h3>
                  <p className="text-xs text-muted">Add multiple screenshots for the public project detail page. Each screenshot is saved separately from the project cover.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{screenshots.map(img => <div key={img.id} className="min-w-0 rounded-lg border border-border p-2">
                    <img src={img.image_url} alt={img.caption || "Project screenshot"} loading="lazy" className="w-full h-24 object-cover rounded" />
                    <p className="text-xs text-muted truncate my-2">{img.caption || "Screenshot"}</p>
                    <button type="button" disabled={busy} onClick={() => deleteScreenshot(img.id)} className="text-red-400 text-xs">Remove</button>
                  </div>)}</div>
                  <label className="block text-muted text-xs">Upload screenshot (JPG, PNG or WebP, max 5 MB)
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => uploadScreenshot(e.target.files?.[0])} className="block w-full mt-2" />
                  </label>
                  <input type="url" placeholder="Or paste an HTTPS image URL" value={screenshotForm.image_url} onChange={e => setScreenshotForm(f => ({ ...f, image_url: e.target.value }))} className="w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                  <input placeholder="Screenshot caption (optional)" maxLength={255} value={screenshotForm.caption} onChange={e => setScreenshotForm(f => ({ ...f, caption: e.target.value }))} className="w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                  <label className="block text-muted text-xs">Display order <input type="number" value={screenshotForm.sort_order} onChange={e => setScreenshotForm(f => ({ ...f, sort_order: Number(e.target.value) }))} className="w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2 mt-1" /></label>
                  {screenshotForm.image_url && <img src={screenshotForm.image_url} alt="New screenshot preview" className="h-32 max-w-full object-contain rounded" />}
                  <button type="button" disabled={busy || !screenshotForm.image_url} onClick={addScreenshot} className="rounded-full border border-accent px-4 py-2 text-accent disabled:opacity-50">+ Add screenshot</button>
                </section>}
                <label className="block text-muted">Display order
                  <input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="block w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2 mt-1" />
                </label>
                <div className="flex gap-3">
                  <button disabled={busy} className="disabled:opacity-50 px-5 py-2 rounded-full gradient-bg text-[#14181c] font-semibold">Save</button>
                  <button type="button" onClick={() => setEditing(null)} className="px-5 py-2 rounded-full border border-border text-muted">Cancel</button>
                </div>
              </form>
            ) : (
              <button onClick={openNew} className="mb-6 px-5 py-2 rounded-full gradient-bg text-[#14181c] font-semibold">
                + New project
              </button>
            )}

            <div className="space-y-3">
              {projects.filter(p=>matches(`${p.title} ${p.tech_stack} ${p.description}`)).map((p) => (
                <div key={p.id} className="border border-border rounded-2xl p-4 bg-surface flex justify-between items-start">
                  <div>
                    <p className="text-text font-medium">{p.title}</p>
                    <p className="text-muted text-xs mt-1">{p.tech_stack}</p>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <button onClick={() => openEdit(p)} className="text-accent hover:underline">edit</button>
                    <button onClick={() => removeProject(p.id)} className="text-red-400 hover:underline">delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(tab === "gallery" || tab === "travelling" || tab === "social") && (
          <div className="space-y-5">
            <p className="text-muted">{tab === "social" ? "Paste a public Facebook, Instagram, YouTube, or TikTok post link. No upload required." : tab === "travelling" ? "Add travel photos to the Travelling collection on your website." : "Add pictures to your public homepage gallery."} Only a logged-in administrator can publish changes.</p>
            {galleryEditing ? (
              <form onSubmit={saveGallery} className="space-y-3 border border-border rounded-2xl p-5 bg-surface">
                {tab === "social" ? <>
                  <label className="block text-muted">Post or video link (Facebook, Instagram, YouTube, TikTok)
                    <input type="url" required value={galleryForm.link_url || ""} onChange={(e) => setGalleryForm({ ...galleryForm, link_url: e.target.value, src: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." className="block w-full mt-1 bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                  </label>
                  {galleryForm.link_url && (getSocialEmbed(galleryForm.link_url) ? <div className="max-w-sm rounded-xl overflow-hidden border border-border"><SocialEmbed url={galleryForm.link_url} /></div> : <p className="text-sm text-muted">This link cannot be previewed. Use the original public post URL, not iframe HTML or a share-code snippet.</p>)}
                </> : <>
                  <label className="block text-muted">Choose a photo (JPG, PNG or WebP, max 5 MB)
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => uploadGalleryImage(e.target.files?.[0])} className="block mt-2 w-full" />
                  </label>
                  <label className="block text-muted">Or paste an HTTPS photo URL
                    <input type="url" required value={galleryForm.src} onChange={(e) => setGalleryForm({ ...galleryForm, src: e.target.value })} placeholder="https://..." className="block w-full mt-1 bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                  </label>
                </>}
                <input value={galleryForm.caption} onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })} placeholder="Photo caption" maxLength={300} className="w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                <label className="block text-muted">Display order
                  <input type="number" value={galleryForm.sort_order} onChange={(e) => setGalleryForm({ ...galleryForm, sort_order: Number(e.target.value) })} className="block mt-1 w-full bg-surfaceAlt border border-border rounded-lg px-3 py-2" />
                </label>
                {tab !== "social" && galleryForm.src && <img src={galleryForm.src} alt="Gallery preview" className="w-full max-w-sm h-44 object-cover rounded-lg" />}
                {tab !== "social" && <p className="text-xs text-muted">Direct photo uploads require Cloudinary credentials in the backend. A hosted HTTPS image URL works without Cloudinary.</p>}
                <div className="flex gap-3">
                  <button disabled={busy || (tab === "social" ? !getSocialEmbed(galleryForm.link_url) : !galleryForm.src)} className="disabled:opacity-50 px-5 py-2 rounded-full gradient-bg text-[#14181c] font-semibold">{tab === "social" ? "Publish post" : "Save photo"}</button>
                  <button type="button" onClick={() => setGalleryEditing(null)} className="px-5 py-2 rounded-full border border-border">Cancel</button>
                </div>
              </form>
            ) : (
              <button onClick={() => { setGalleryEditing("new"); setGalleryForm({ ...EMPTY_GALLERY, category: tab === "social" ? "social" : tab === "travelling" ? "travelling" : "gallery" }); setNotice(""); }} className="px-5 py-2 rounded-full gradient-bg text-[#14181c] font-semibold">{tab === "social" ? "+ Add social post" : "+ Add gallery photo"}</button>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              {galleryItems.filter((item) => (item.category || "gallery") === tab && matches(`${item.caption} ${item.link_url} ${item.src}`)).map((item) => (
                <div key={item.id} className="border border-border rounded-2xl overflow-hidden bg-surface">
                  {tab === "social" && item.type === "embed" ? <SocialEmbed url={item.link_url || item.src} caption={item.caption} /> : <img src={item.src} alt={item.caption || "Gallery photo"} className="w-full h-44 object-cover" />}
                  <div className="p-4">
                    <p className="text-sm mb-3">{item.caption || "Untitled photo"}</p>
                    <div className="flex gap-4">
                      <button onClick={() => { setGalleryEditing(item.id); setGalleryForm({ src: item.src, caption: item.caption || "", sort_order: item.sort_order || 0, category: item.category || "gallery", link_url: item.link_url || "" }); setNotice(""); }} className="text-accent">Edit</button>
                      <button onClick={() => removeGallery(item.id)} className="text-red-400">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "messages" && (
          <div className="space-y-3">
            {messages.length === 0 && <p className="text-muted">No messages yet.</p>}
            {messages.filter(m=>matches(`${m.name} ${m.email} ${m.subject} ${m.message}`)).map((m) => (
              <div key={m.id} className="border border-border rounded-2xl p-4 bg-surface">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-text font-medium">{m.name} <span className="text-muted font-normal">&lt;{m.email}&gt;</span></p>
                    {m.subject && <p className="text-accent2 text-xs mt-1">{m.subject}</p>}
                  </div>
                  <button onClick={() => removeMessage(m.id)} className="text-red-400 hover:underline text-xs">delete</button>
                </div>
                <p className="text-muted text-sm">{m.message}</p>
                <p className="text-muted text-xs mt-2">{new Date(m.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div></main>
    </div>
  );
}
