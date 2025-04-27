import axios from "axios";
import { logout } from "./redux/slices/authSlice";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Intercept 401s (unauthorized)
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      localStorage.getItem("userToken")
    ) {
      const { default: store } = await import("./redux/store"); // ⬅️ import inside interceptor
      store.dispatch(logout()); // Dispatch logout
    }
    return Promise.reject(error);
  }
);

export default instance;
