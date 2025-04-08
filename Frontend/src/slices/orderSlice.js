import { createSlice, } from "@reduxjs/toolkit";
import API from "../utils/api";
import createThunk from "../utils/createThunk";
import handleAsyncCases from "../utils/handleAsync";

export const fetchOrders = createThunk("orders/fetch", () => API.get("/orders"), true);
export const placeOrder = createThunk("orders/place", (orderData)=>API.post("/orders", orderData))
export const buyNow = createThunk("orders/buy-now", (orderData)=>API.post("/orders/buy-now", orderData))
const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    type: null,
    orderItems: [],
    orderPrice: null,
    isLoading: false,
  },
  reducers: {
    setOrderItems: (state, action) => {
      state.orderItems = action.payload;
    },
    setOrderPrice: (state, action) => {
      state.orderPrice = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    resetOrders: (state) => {
      state.orders = [];
      state.orderItems = [];
      state.orderPrice = null;
    },
  },
  extraReducers: (builder) => {
    handleAsyncCases(builder, fetchOrders, (state, action) => {
      state.orders = action.payload;
    });
    handleAsyncCases(builder, placeOrder, (state, action) => {
      state.orders = [...state.orders, action.payload]
    });

    handleAsyncCases(builder, buyNow, (state, action) => {
      state.orders = [...state.orders, action.payload];
    });
  },
});

export const { resetOrders, setOrderItems, setOrderPrice, setType } = orderSlice.actions;
export default orderSlice.reducer;
