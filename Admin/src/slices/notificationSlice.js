import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { message: null, error: null },
  reducers: {
    setSuccess: (state, action) => {
      state.message = action.payload;
      state.error = null; // Reset error
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.message = null; // Reset success message
    },
    clearNotification: (state) => {
      state.message = null;
      state.error = null;
    },
  },
});

export const { setSuccess, setError, clearNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
