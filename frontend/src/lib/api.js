
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Share simultaneous public GET requests.
const pendingRequests = new Map();

async function request(path, options = {}) {
  const token = sessionStorage.getItem("admin_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const method = (options.method || "GET").toUpperCase();

  // Only deduplicate public GET requests.
  // Admin requests and write operations remain independent.
  const canDeduplicate = method === "GET" && !token;

  const requestKey = `${method}:${path}`;

  if (canDeduplicate && pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }

  const fetchPromise = (async () => {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      method,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  })();

  if (!canDeduplicate) {
    return fetchPromise;
  }

  pendingRequests.set(requestKey, fetchPromise);

  try {
    return await fetchPromise;
  } finally {
    if (pendingRequests.get(requestKey) === fetchPromise) {
      pendingRequests.delete(requestKey);
    }
  }
}

export const api = {
  getBlogPosts: () => request("/blog"),

  getBlogPost: (slug) =>
    request(`/blog/${encodeURIComponent(slug)}`),

  getAdminBlogPosts: () =>
    request("/blog?scope=admin"),

  createBlogPost: (body) =>
    request("/blog", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateBlogPost: (id, body) =>
    request(`/blog/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteBlogPost: (id) =>
    request(`/blog/${id}`, {
      method: "DELETE",
    }),

  uploadProjectImage: async (file) => {
    const token = sessionStorage.getItem("admin_token");

    const response = await fetch(
      `${API_BASE}/projects/upload-image`,
      {
        method: "POST",
        headers: {
          "Content-Type": file.type,
          Authorization: `Bearer ${token}`,
        },
        body: file,
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Image upload failed");
    }

    return data;
  },

  getProjectImages: (id) =>
    request(`/projects/${id}/images`),

  addProjectImage: (id, body) =>
    request(`/projects/${id}/images`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  deleteProjectImage: (id, imageId) =>
    request(`/projects/${id}/images/${imageId}`, {
      method: "DELETE",
    }),

  getProjects: () => request("/projects"),

  getProject: (id) =>
    request(`/projects/${id}`),

  createProject: (body) =>
    request("/projects", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateProject: (id, body) =>
    request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteProject: (id) =>
    request(`/projects/${id}`, {
      method: "DELETE",
    }),

  uploadMedia: async (file) => {
    const token = sessionStorage.getItem("admin_token");

    const response = await fetch(
      `${API_BASE}/upload-media`,
      {
        method: "POST",
        headers: {
          "Content-Type": file.type,
          Authorization: `Bearer ${token}`,
        },
        body: file,
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Upload failed");
    }

    return data;
  },

  getTravelAlbums: () =>
    request("/travel"),

  getTravelMedia: (id) =>
    request(`/travel/${id}/media`),

  createTravelAlbum: (body) =>
    request("/travel", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateTravelAlbum: (id, body) =>
    request(`/travel/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteTravelAlbum: (id) =>
    request(`/travel/${id}`, {
      method: "DELETE",
    }),

  addTravelMedia: (id, body) =>
    request(`/travel/${id}/media`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateTravelMedia: (id, mediaId, body) =>
    request(`/travel/${id}/media/${mediaId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteTravelMedia: (id, mediaId) =>
    request(`/travel/${id}/media/${mediaId}`, {
      method: "DELETE",
    }),

  getGallery: () =>
    request("/gallery"),

  addGalleryImage: (body) =>
    request("/gallery", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateGalleryImage: (id, body) =>
    request(`/gallery/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteGalleryImage: (id) =>
    request(`/gallery/${id}`, {
      method: "DELETE",
    }),

  getSkills: () =>
    request("/skills"),

  createSkill: (body) =>
    request("/skills", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateSkill: (id, body) =>
    request(`/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteSkill: (id) =>
    request(`/skills/${id}`, {
      method: "DELETE",
    }),

  getSettings: () =>
    request("/settings"),

  saveSettings: (body) =>
    request("/settings", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  getEducation: () =>
    request("/education"),

  sendMessage: (body) =>
    request("/contact", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getMessages: () =>
    request("/contact"),

  updateMessageStatus: (id, status) =>
    request(`/contact/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  deleteMessage: (id) =>
    request(`/contact/${id}`, {
      method: "DELETE",
    }),

  login: (username, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    }),
};
