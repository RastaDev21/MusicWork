import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("musicwork_token");

    if (token) {
      const cleanToken = token.replace(/^"|"$/g, "");
      config.headers.set("Authorization", `Bearer ${cleanToken}`);
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await api.post("/upload/avatar", formData);

  return response.data;
}

export async function uploadCover(file: File) {
  const formData = new FormData();
  formData.append("cover", file);

  const response = await api.post("/upload/cover", formData);

  return response.data;
}

export default api;
