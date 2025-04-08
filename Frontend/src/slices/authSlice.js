import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setSuccess, setError } from "./notificationSlice";
import API from "../utils/api";
import { resetCart } from "./cartSlice";
import { resetOrders } from "./orderSlice";
import { resetWishlist } from "./wishlistSlice";
import handleAsyncCases from "../utils/handleAsync";
import createThunk from "../utils/createThunk";

// Get user from localStorage if available
let user = null;

try {
  const storedUser = localStorage.getItem("user");

  if (storedUser && storedUser !== "undefined") {
    user = JSON.parse(storedUser);
  }
} catch (error) {
  console.error("Error parsing user from localStorage:", error);
  localStorage.removeItem("user"); // Clean up corrupt value
}


const initialState = {
  user,
  isLoading: false,

};

export const registerUser = createThunk("auth/register", (userData) => API.post("/auth/register", userData));
export const loginUser = createThunk("auth/login", (userData) => API.post("/auth/login", userData));
export const verifyEmail = createThunk("auth/verifyEmail", (code) => API.post("/auth/verify-email", code));
export const resendVerificationEmail = createThunk("auth/resendVerificationEmail", async () => API.post("/auth/resend-verification-email"));
export const logoutUser = createAsyncThunk("auth/logout", async (_, { dispatch, rejectWithValue }) => {
  try {
    const response = await API.post("/auth/logout");
    localStorage.removeItem("user");
    dispatch(resetCart())
    dispatch(resetOrders())
    dispatch(resetWishlist())
    dispatch(setSuccess(response.data.message));
    return null; // Return null since user should be removed
  } catch (error) {
    console.error("Logout Error:", error);
    dispatch(setError(error.response?.data?.message || "Logout failed"));
    return rejectWithValue(error.response?.data?.message || "Operation Failed");
  }
});

export const addAddress = createThunk("auth/addAddress", async (address) => API.post("/auth/add-address", address));
export const removeAddress = createThunk("auth/removeAddress", async (index) => API.post(`/auth/remove-address/${index}`));
export const forgotPassword = createThunk("auth/forgotPassword", (email) => API.post("/auth/forgot-password", email));
export const resetPassword = createThunk("auth/resetPassword", (data) => API.post("/auth/reset-password", data));

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; 
    },
    resetUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    handleAsyncCases(builder, registerUser, (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });

    // Login
    handleAsyncCases(builder, loginUser, (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });

    // Logout
    handleAsyncCases(builder, logoutUser, (state) => {
      state.user = null;
      localStorage.removeItem("user");
    });

    // add Address
    handleAsyncCases(builder, addAddress, (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });

    // Remove Address
    handleAsyncCases(builder, removeAddress, (state, action) => {
      state.user.addresses = state.user.addresses.filter(
        (_, index) => index !== action.meta.arg
      );
    });

    // forgot password
    handleAsyncCases(builder, forgotPassword);

    // reset password
    handleAsyncCases(builder, resetPassword);

    // verify Email
    handleAsyncCases(builder, verifyEmail, (state, action) => {
      state.user = action.payload;
    });
    // Resend verification email
    handleAsyncCases(builder, resendVerificationEmail);
  },
});

export const { resetUser, setUser } = authSlice.actions;
export default authSlice.reducer;