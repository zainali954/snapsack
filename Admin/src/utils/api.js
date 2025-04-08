import axios from "axios";
import { logoutUser } from "../slices/authSlice";
import { navigateTo } from "./navigationHelper";
const BASE_URL = import.meta.env.VITE_BACKEND_API_URL ;

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const setupInterceptors = (store) => {
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || "An unexpected error occurred.";

    if (status === 401) {
      switch (errorMessage) {
        case "Session expired. Please login again.":
        case "Invalid or expired refresh token. Please login again.":
        case "User not found. Please login again.":
        case "Invalid session. Please login again.":
        case "Unauthorized. No access token provided.":
        case "Unauthorized. Invalid token.":
        case "Unauthorized. Authentication failed.":
        case "Unauthorized. No refresh token provided.":
          // logoutUserF();
          await store.dispatch(logoutUser())
          navigateTo("/login"); // User ko login page pe redirect karein
          
          return Promise.reject(error);

        case "Unauthorized. Token has expired.":
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            try {

              await axios.post(`${BASE_URL}/auth/refresh-access-token`, {}, { withCredentials: true });
              return API(originalRequest); // Retry request after refresh
            } catch (refreshError) {
              await store.dispatch(logoutUser())
              navigateTo("/login"); // User ko login page pe redirect karein
              return Promise.reject(refreshError);
            }
          }
          break;

        default:
          return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
)};

export default API;
