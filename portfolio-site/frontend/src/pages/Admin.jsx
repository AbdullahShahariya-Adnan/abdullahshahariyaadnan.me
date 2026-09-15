import { useEffect, useState } from "react";
import { api } from "../lib/api.js";

const EMPTY_PROJECT = {
  title: "", tagline: "", description: "", long_description: "", role: "", duration: "",
  tech_stack: "", features: "", challenges: "", github_url: "", live_url: "", sort_order: 0,
};

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("admin_token") || "");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PROJECT);

  const loggedIn = Boolean(token);

  useEffect(() => {
    if (!loggedIn) return;
    refreshProjects();
    refreshMessages();
  }, [loggedIn]);

  const refreshProjects = () => api.getProjects().then(setProjects).catch(() => {});
  const refreshMessages = () => api.getMessages().then(setMessages).catch(() => {});

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const { token: t } = await api.login(loginForm.username, loginForm.password);
      localStorage.setItem("admin_token", t);
      setToken(t);
    } catch (err) {
      setLoginError(err.message || "Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken("");
  };

  const openEdit = (project) => { setEditing(project.id); setForm(project); };
  const openNew = () => { setEditing("new"); setForm(EMPTY_PROJECT); };

  const saveProject = async (e) => {
    e.preventDefault();
    if (editing === "new") await api.createProject(form);
    else await api.updateProject(editing, form);
    setEditing(null);
    refreshProjects();
  };

  const removeProject = async (id) => {
    if (!confirm("Delete this project?")) return;
    await api.deleteProject(id);
    refreshProjects();
  };

  const removeMessage = async (id) => {
    if (!confirm("Delete this message?")) return;
    await api.deleteMessage(id);
    refreshMessages();
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

  return (
    <div className="min-h-screen bg-bg text-text px-6 py-10 text-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-xl font-bold">Admin panel</h1>
          <button onClick={handleLogout} className="text-muted hover:text-accent text-xs">Log out</button>
        </div>

        <div className="flex gap-4 mb-8 border-b border-border">
          {["projects", "messages"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 px-1 text-xs uppercase tracking-wider ${
                tab === t ? "text-accent border-b-2 border-accent" : "text-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

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
                <div className="flex gap-3">
                  <button className="px-5 py-2 rounded-full gradient-bg text-[#14181c] font-semibold">Save</button>
                  <button type="button" onClick={() => setEditing(null)} className="px-5 py-2 rounded-full border border-border text-muted">Cancel</button>
                </div>
              </form>
            ) : (
              <button onClick={openNew} className="mb-6 px-5 py-2 rounded-full gradient-bg text-[#14181c] font-semibold">
                + New project
              </button>
            )}

            <div className="space-y-3">
              {projects.map((p) => (
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

        {tab === "messages" && (
          <div className="space-y-3">
            {messages.length === 0 && <p className="text-muted">No messages yet.</p>}
            {messages.map((m) => (
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
      </div>
    </div>
  );
}
