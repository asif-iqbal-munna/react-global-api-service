import { axiosInstance } from "../axiosInstance";

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Example: global error handling
    if (error.response?.status === 401) {
      // logout, refresh token, redirect, etc.
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
