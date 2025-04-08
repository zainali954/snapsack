import { createSlice } from "@reduxjs/toolkit";
import API from "../utils/api";
import createThunk from "../utils/createThunk";
import handleAsyncCases from "../utils/handleAsync";

export const fetchReviews = createThunk("reviews/fetch", (id) => API.get(`/reviews/${id}`), true);
export const addReview = createThunk("reviews/add", (data) => API.post("/reviews", data));
export const updateReview = createThunk("reviews/update", ({ id, comment }) => API.put(`/reviews/${id}`, { comment }));
export const deleteReview = createThunk("reviews/delete", (id) => API.delete(`/reviews/${id}`));

// Review Slice
const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    isLoading: false,
  },
  reducers: {
    resetReview: (state) => {
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch review
    handleAsyncCases(builder, fetchReviews, (state, action) => {
      state.reviews = action.payload || [];
    });

    // Add to review
    handleAsyncCases(builder, addReview, (state, action) => {
      const reviews = state.reviews ? state.reviews : [];
      state.reviews = [...reviews, action.payload];
    });

    // Update review Item
    handleAsyncCases(builder, updateReview, (state, action) => {
      const existingIndex = state.reviews.findIndex(
        (item) => item._id === action.payload._id
      );

      if (existingIndex !== -1) {
        state.reviews[existingIndex] = action.payload;
      }
    });

    // Remove from review
    handleAsyncCases(builder, deleteReview, (state, action) => {
      state.reviews = state.reviews.filter((item) => item._id !== action.payload);
    });
  },
});

export const { resetReview } = reviewSlice.actions;
export default reviewSlice.reducer;