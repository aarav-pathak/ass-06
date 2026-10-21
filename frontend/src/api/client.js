import axios from "axios";

let baseURL = "https://ass-06.onrender.com/api";
if (import.meta.env.VITE_API_URL) {
  baseURL = import.meta.env.VITE_API_URL;
}

const client = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverMessage = error.response?.data?.message;
    const fallbackMessage = error.message || "An unexpected network error occurred.";
    const formattedError = new Error(serverMessage || fallbackMessage);
    formattedError.status = error.response?.status;
    formattedError.data = error.response?.data;
    return Promise.reject(formattedError);
  }
);

export default client;
