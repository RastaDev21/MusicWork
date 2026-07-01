import axios from "axios";
import imageCompression from "browser-image-compression";

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

async function compressImage(file: File) {
  const options = {
    maxSizeMB: 1, // alvo: ~1MB
    maxWidthOrHeight: 1200, // redimensiona fotos gigantes
    useWebWorker: true,
  };
  try {
    return await imageCompression(file, options);
  } catch {
    return file; // se a compressão falhar, envia o original
  }
}

export async function uploadAvatar(file: File) {
  const compressed = await compressImage(file);
  const formData = new FormData();
  formData.append("avatar", compressed, file.name);

  const response = await api.post("/upload/avatar", formData);
  return response.data;
}

export async function uploadCover(file: File) {
  const compressed = await compressImage(file);
  const formData = new FormData();
  formData.append("cover", compressed, file.name);

  const response = await api.post("/upload/cover", formData);
  return response.data;
}

export function getImageUrl(url: string | null | undefined) {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${import.meta.env.VITE_API_URL}${url}`;
}

export async function forgotPassword(email: string) {
  const response = await api.post("/forgot-password", { email });
  return response.data;
}

export async function resetPassword(token: string, password: string) {
  const response = await api.post("/reset-password", { token, password });
  return response.data;
}

export default api;
