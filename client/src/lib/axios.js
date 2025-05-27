import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_API_URL
      : "https://mersal-production.up.railway.app/api",
  withCredentials: true,
});
