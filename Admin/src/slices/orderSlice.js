import { createSlice } from "@reduxjs/toolkit";
import API from "../utils/api";
import handleAsyncCases from "../utils/handleAsync";
import createThunk from "../utils/createThunk";

export const fetchOrders = createThunk("orders/fetchOrders", () => API.get("/orders/admin"), true);
export const refreshOrders = createThunk("orders/refreshOrders", () => API.get("/orders/admin"));
export const searchOrders = createThunk("orders/searchOrders", ({ type, value, paymentStatus, orderStatus }) => API.get(`/orders/search?type=${type}&value=${value}&paymentStatus=${paymentStatus}&orderStatus=${orderStatus}`));
export const fetchOrdersStats = createThunk("orders/orderStats", () => API.get(`/orders/stats`), true);
export const updatePaymentStatus = createThunk("orders/updatePaymentStatus", ({ orderId, paymentStatus }) => API.put(
                `/orders/${orderId}/admin`,
                { paymentStatus }
            ));
export const updateOrderStatus = createThunk("orders/updateOrderStatus", ({ orderId, status }) => API.put(
                `/orders/${orderId}/admin`,
                { status }
            ));
export const deleteOrder = createThunk("orders/deleteOrder", (orderId) => API.delete(`/orders/${orderId}/admin`));

const ordersSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        searchedOrders: [],
        stats : {},
        isLoading: false,
    },
    reducers: {
        resetOrders: (state) => {
            state.orders = [];
        },
        resetSearchedOrders : (state)=>{
            state.searchedOrders = []
        }
    },
    extraReducers: (builder) => {
        handleAsyncCases(builder, fetchOrders, (state, action) => {
            state.orders = action.payload;
          });

          handleAsyncCases(builder, refreshOrders, (state, action) => {
            state.orders = action.payload;
          });

          handleAsyncCases(builder, searchOrders, (state, action) => {
            state.searchedOrders = action.payload;
          });

          handleAsyncCases(builder, fetchOrdersStats, (state, action) => {
            state.stats = action.payload;
          });

          handleAsyncCases(builder, updatePaymentStatus, (state, action) => {
            const existingOrderIndex = state.orders.findIndex((item) => item._id === action.payload._id);
                if (existingOrderIndex !== -1) {
                    state.orders[existingOrderIndex] = action.payload;
                }
          });

          handleAsyncCases(builder, updateOrderStatus, (state, action) => {
            const existingOrderIndex = state.orders.findIndex((item) => item._id === action.payload._id);
                if (existingOrderIndex !== -1) {
                    state.orders[existingOrderIndex] = action.payload;
                }
          });

          handleAsyncCases(builder, deleteOrder, (state, action) => {
            state.orders = state.orders.filter((order) => order._id !== action.payload);
          });
    },
});

export const { resetOrders, resetSearchedOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
