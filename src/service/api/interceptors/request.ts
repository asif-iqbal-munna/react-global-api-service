import { axiosInstance } from "../axiosInstance";

axiosInstance.interceptors.request.use(
  (config) => {
    // Example: attach bearer token
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Example: logging
    // console.log("[API REQUEST]", config.method, config.url);

    return config;
  },
  (error) => Promise.reject(error)
);
