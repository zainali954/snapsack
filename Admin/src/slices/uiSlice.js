import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expanded: JSON.parse(localStorage.getItem("sidebarExpanded")) ?? true,
  theme: localStorage.getItem("theme"),
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.expanded = !state.expanded;
      // Save to localStorage
      localStorage.setItem("sidebarExpanded", JSON.stringify(state.expanded));
    },
    setTheme(state, action) {
      state.theme = action.payload;
      // Save to localStorage
      localStorage.setItem("theme", state.theme);
    },
  },
});

export const { toggleSidebar, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
