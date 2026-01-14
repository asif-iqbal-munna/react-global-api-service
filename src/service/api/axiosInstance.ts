import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Setup request interceptor
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (config as any).metadata = { startTime: performance.now() };

    // Example: logging
    // console.log("[API REQUEST]", config.method, config.url);

    return config;
  },
  (error) => Promise.reject(error)
);

// Setup response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metadata = (response.config as any).metadata;
    const duration = performance.now() - metadata.startTime;

    console.log(
      `[clientFetch] ${
        response.config.url
      } ${response.config.method?.toUpperCase()} - ${duration.toFixed(2)}ms`
    );

    return response;
  },
  async (error) => {
    // Example: global error handling
    if (error.response?.status === 401) {
      // logout, refresh token, redirect, etc.
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
