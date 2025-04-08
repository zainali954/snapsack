import { createSlice } from "@reduxjs/toolkit";
import API from "../utils/api";
import createThunk from "../utils/createThunk";
import handleAsyncCases from "../utils/handleAsync";

export const fetchReviews = createThunk("review/fetchReviews",  () => API.get("/admin/reviews"), true);
export const refreshReviews = createThunk("review/refreshReviews",  () => API.get("/admin/reviews"));
export const searchReviews = createThunk("review/searchReviews", ({type, value, rating, startDate, endDate}, ) =>  API.get(`/admin/reviews/search?type=${type}&value=${value}&rating=${rating}&startDate=${startDate}&endDate=${endDate}`));
export const fetchReviewStats = createThunk("review/fetchReviewStats",() => API.get("/admin/reviews/stats"), true);
export const deleteReview = createThunk("review/deleteReview", (reviewId) => API.delete(`/admin/reviews/${reviewId}`));

const reviewsSlice = createSlice({
    name: "reviews",
    initialState: {
        reviews: [],
        searchedReviews: [],
        reviewStats : {},
        isLoading: false,
    },
    reducers: {
        resetReviews: (state) => {
            state.reviews = [];
        },
        resetSearchedReviews: (state) => {
            state.searchedReviews = [];
        },
    },
    extraReducers: (builder) => {
        handleAsyncCases(builder, fetchReviews, (state, action) => {
            state.reviews = action.payload;
          });

          handleAsyncCases(builder, refreshReviews, (state, action) => {
            state.reviews = action.payload;
          });

          handleAsyncCases(builder, searchReviews, (state, action) => {
            state.users = state.users.filter((user) => user._id !== action.meta.arg);
          });

          handleAsyncCases(builder, fetchReviewStats, (state, action) => {
            state.searchedReviews = action.payload;
          });

          handleAsyncCases(builder, deleteReview, (state, action) => {
            state.reviewStats = action.payload;
          });
    },
});

export const { resetReviews, resetSearchedReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;