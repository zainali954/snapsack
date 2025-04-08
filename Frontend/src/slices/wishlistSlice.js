import { createSlice } from "@reduxjs/toolkit";
import API from "../utils/api";
import createThunk from "../utils/createThunk";
import handleAsyncCases from "../utils/handleAsync";

export const fetchWishlist = createThunk("wishlist/fetch" , ()=>API.get("/wishlist"), true);
export const addToWishlist = createThunk("wishlist/add" , (id)=>API.post("/wishlist", {id}));

// wish Slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
    isLoading: false,
  },
  reducers: {
    resetWishlist: (state) => {
      state.wishlist = [];
    },
  },
  extraReducers: (builder) => {
      // Fetch wishlist
      handleAsyncCases(builder, fetchWishlist, (state, action) => {
        state.wishlist = action.payload || [];
      });

      // Add to wishlist
      handleAsyncCases(builder, addToWishlist, (state, action) => {
        state.wishlist = [...state.wishlist, action.payload]
      });
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
