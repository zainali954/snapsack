import { createSlice } from "@reduxjs/toolkit";
import API from "../utils/api";
import createThunk from "../utils/createThunk";
import handleAsyncCases from "../utils/handleAsync";

export const fetchUsers = createThunk("users/fetchUsers", () => API.get("/admin/users"), true );
export const refreshUsers = createThunk("users/refreshUsers", () => API.get("/admin/users") );
export const searchUsers = createThunk("users/searchUsers", (queryParams) => API.get("/admin/users/search", {params: queryParams}));
export const fetchUserStats = createThunk("users/fetchUserStats", () => API.get("/admin/users/stats"), true);
export const verifyUser = createThunk("users/verifyUser", (userId) => API.put(`/admin/users/${userId}/verify`));
export const toggleBanUser = createThunk("users/toggleBanUser", (userId) => API.put(`/admin/users/${userId}/ban`));
export const deleteUser = createThunk("users/deleteUser", (userId) => API.delete(`/admin/users/${userId}`));

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    searchedUsers: [],
    stats: {},
    isLoading: false,
  },
  reducers: {
    resetUsers: (state) => {
      state.users = [];
    },
    resetSearchedUsers: (state) => {
      state.searchedUsers = [];
    },
  },
  extraReducers: (builder) => {
    handleAsyncCases(builder, fetchUsers, (state, action) => {
      state.users = action.payload;
    });

    handleAsyncCases(builder, refreshUsers, (state, action) => {
        state.users = action.payload;
      });

    handleAsyncCases(builder, searchUsers, (state, action) => {
      state.searchedUsers = action.payload;
    });

    handleAsyncCases(builder, fetchUserStats, (state, action) => {
      state.stats = action.payload;
    });

    handleAsyncCases(builder, verifyUser, (state, action) => {
      const userIndex = state.users.findIndex((user) => user._id === action.payload);
      if (userIndex !== -1) {
        state.users[userIndex].isVerified = true;
      }
    });

    handleAsyncCases(builder, toggleBanUser, (state, action) => {
      const userIndex = state.users.findIndex((user) => user._id === action.payload);
      if (userIndex !== -1) {
        state.users[userIndex].isBanned = !state.users[userIndex].isBanned;
      }
    });

    handleAsyncCases(builder, deleteUser, (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.meta.arg);
    });
  },
});

export const { resetUsers, resetSearchedUsers } = usersSlice.actions;
export default usersSlice.reducer;
