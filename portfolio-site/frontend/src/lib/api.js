const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("admin_token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export const api = {
  getProjects: () => request("/projects"),
  getProject: (id) => request(`/projects/${id}`),
  createProject: (body) => request("/projects", { method: "POST", body: JSON.stringify(body) }),
  updateProject: (id, body) => request(`/projects/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteProject: (id) => request(`/projects/${id}`, { method: "DELETE" }),

  getSkills: () => request("/skills"),
  getEducation: () => request("/education"),

  sendMessage: (body) => request("/contact", { method: "POST", body: JSON.stringify(body) }),
  getMessages: () => request("/contact"),
  deleteMessage: (id) => request(`/contact/${id}`, { method: "DELETE" }),

  login: (username, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
};
