import { createSlice } from "@reduxjs/toolkit";
import API from "../utils/api";
import createThunk from "../utils/createThunk";
import handleAsyncCases from "../utils/handleAsync";

export const fetchCart = createThunk("cart/fetchCart", () => API.get("/admin/cart"), true);
export const refreshCart = createThunk("cart/refreshCart", () => API.get("/admin/cart"));
export const searchCart = createThunk("cart/searchCart", ({ type, term }) => API.get(`/admin/cart/filter?type=${type}&term=${term}`));
export const fetchCartStats = createThunk("cart/cartStats", () => API.get(`/cart/stats`), true);
export const deleteAbondoned = createThunk("cart/deleteCart", () => PI.delete(`/admin/cart/clear-abandoned`));

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: [],
        searchedCart: [],
        stats: {},
        isLoading: false,
    },
    reducers: {
        resetCart: (state) => {
            state.cart = [];
        },
        resetSearchedCart: (state) => {
            state.searchedCart = []
        }
    },
    extraReducers: (builder) => {
        handleAsyncCases(builder, fetchCart, (state, action) => {
            state.cart = action.payload;
        });
        
        handleAsyncCases(builder, refreshCart, (state, action) => {
            state.cart = action.payload;
        });

        handleAsyncCases(builder, searchCart, (state, action) => {
            state.searchedCart = action.payload;
        });

        handleAsyncCases(builder, fetchCartStats, (state, action) => {
            state.stats = action.payload;
        });

        handleAsyncCases(builder, deleteAbondoned, (state, action) => {
            state.cart = action.payload;
        });
    },
});

export const { resetCart, resetSearchedCart } = cartSlice.actions;
export default cartSlice.reducer;
