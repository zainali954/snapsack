import { createSlice } from "@reduxjs/toolkit";
import API from "../utils/api";
import createThunk from "../utils/createThunk";
import handleAsyncCases from "../utils/handleAsync";

const initialState = {
  cartItems: [],
  totalPrice: 0,
  isLoading: false,
};

export const fetchCart = createThunk("cart/fetch", () => API.get("/cart"), true);
export const addToCart = createThunk("cart/add", ({ productId, quantity, variant, visualAttributes }) => 
  API.post("/cart/add", { productId, quantity, variantId: variant, visualAttributes })
);
export const updateCartItem = createThunk("cart/update", ({ cartItemId, quantity }) => 
  API.put("/cart/update", { cartItemId, quantity })
);
export const removeFromCart = createThunk("cart/remove", (itemId) => 
  API.post("/cart/remove", { itemId })
);
export const clearCart = createThunk("cart/clear", () => API.delete("/cart/clear"), true);


// Cart Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      state.cartItems = [];
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    handleAsyncCases(builder, fetchCart, (state, action) => {
      state.cartItems = action.payload?.cartItems || [];
      state.totalPrice = action.payload?.totalPrice || 0;
    });

    // Add to Cart
    handleAsyncCases(builder, addToCart, (state, action) => {
      const { product, variant, visualAttributes, price } = action.payload;

      // Ensure attributes are sorted before comparing
      const sortedPayloadAttributes = [...visualAttributes].sort();

      const existingIndex = state.cartItems.findIndex((item) => {
        return (
          item.product._id === product._id &&
          item.variant === variant &&
          JSON.stringify([...item.visualAttributes].sort()) === JSON.stringify(sortedPayloadAttributes)
        );
      });

      if (existingIndex !== -1 && state.cartItems[existingIndex]) {
        state.totalPrice -= state.cartItems[existingIndex].price;
        state.cartItems[existingIndex] = action.payload;
      } else {
        state.cartItems.push(action.payload);
      }

      state.totalPrice += price;
    });

    // Update Cart Item
    handleAsyncCases(builder, updateCartItem, (state, action) => {
      const existingIndex = state.cartItems.findIndex((item) => item._id === action.payload._id);
      if (existingIndex !== -1) {
        state.cartItems[existingIndex] = action.payload;
      }
      state.totalPrice = state.cartItems.reduce((sum, item) => sum + item.price, 0);
    });

    // Remove from Cart
    handleAsyncCases(builder, removeFromCart, (state, action) => {
      const removedItem = state.cartItems.find((item) => item._id === action.payload);
      if (removedItem) state.totalPrice -= removedItem.price;
      state.cartItems = state.cartItems.filter((item) => item._id !== action.payload);
    });

    // Clear Cart
    handleAsyncCases(builder, clearCart, (state) => {
      state.cartItems = [];
      state.totalPrice = 0;
    });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;