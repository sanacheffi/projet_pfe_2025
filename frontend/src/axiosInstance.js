import axios from "axios";
import  store  from "./redux/store"; // Import your redux store
import { logout } from "./redux/slices/authSlice";
import { clearCart } from "./redux/slices/cartSlice";

// Axios interceptor to catch expired token responses
axios.interceptors.response.use(
  (response) => response, // Pass through non-error responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired (401 response)
      if (error.response.data.message === "Token expired") {
        // Dispatch logout and clear cart
        store.dispatch(logout());
        store.dispatch(clearCart()); // Clear the cart as well
        // Optionally redirect to login page
        window.location.href = "/login"; // or use a router if you have one
      }
    }
    return Promise.reject(error);
  }
);
