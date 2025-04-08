import { createSlice} from "@reduxjs/toolkit";
import API from "../utils/api";
import handleAsyncCases from "../utils/handleAsync";
import createThunk from "../utils/createThunk";

// Get user from localStorage if available
const user = JSON.parse(localStorage.getItem("user")) || null;

const initialState = {
  user,
  isLoading: false,
};

export const registerUser = createThunk("auth/register", (userData) => API.post("/auth/register", userData));
export const loginUser = createThunk("auth/login", (userData) => API.post("/auth/login", userData));
export const resendVerificationEmail = createThunk("auth/resendVerificationEmail", () => API.post("/auth/resend-verification-email"));
export const logoutUser = createThunk("auth/logout", () => API.post("/auth/logout"));
export const forgotPassword = createThunk("auth/forgotPassword", (email) => API.post("/auth/forgot-password", email));
export const resetPassword = createThunk("auth/resetPassword", async (data) => API.post("/auth/reset-password", data));

//  Auth Slice
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
    handleAsyncCases(builder, registerUser, (state, action) => {
      state.user = action.payload;
    });

    handleAsyncCases(builder, loginUser, (state, action) => {
      state.user = action.payload;
    });

    handleAsyncCases(builder, logoutUser, (state) => {
      localStorage.removeItem("user")
      state.user = null;
    });
    handleAsyncCases(builder, forgotPassword);
    handleAsyncCases(builder, resetPassword);
  },
});

export const { resetUser, setUser } = authSlice.actions;
export default authSlice.reducer;