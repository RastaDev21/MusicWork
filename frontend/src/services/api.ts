import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333",
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

export default api;
