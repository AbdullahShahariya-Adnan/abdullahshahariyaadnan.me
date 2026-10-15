const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const token = sessionStorage.getItem("admin_token");
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
  uploadProjectImage: async (file) => {
    const token = sessionStorage.getItem("admin_token");
    const base = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
    const response = await fetch(`${base}/projects/upload-image`, {
      method: "POST",
      headers: { "Content-Type": file.type, Authorization: `Bearer ${token}` },
      body: file,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Image upload failed");
    return data;
  },
  getProjectImages: (id) => request(`/projects/${id}/images`),
  addProjectImage: (id, body) => request(`/projects/${id}/images`, { method: "POST", body: JSON.stringify(body) }),
  deleteProjectImage: (id, imageId) => request(`/projects/${id}/images/${imageId}`, { method: "DELETE" }),
  getProjects: () => request("/projects"),
  getProject: (id) => request(`/projects/${id}`),
  createProject: (body) => request("/projects", { method: "POST", body: JSON.stringify(body) }),
  updateProject: (id, body) => request(`/projects/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteProject: (id) => request(`/projects/${id}`, { method: "DELETE" }),

  getGallery: () => request("/gallery"),
  addGalleryImage: (body) => request("/gallery", { method: "POST", body: JSON.stringify(body) }),
  updateGalleryImage: (id, body) => request(`/gallery/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteGalleryImage: (id) => request(`/gallery/${id}`, { method: "DELETE" }),
  getSkills: () => request("/skills"),
  getEducation: () => request("/education"),

  sendMessage: (body) => request("/contact", { method: "POST", body: JSON.stringify(body) }),
  getMessages: () => request("/contact"),
  deleteMessage: (id) => request(`/contact/${id}`, { method: "DELETE" }),

  login: (username, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
};
