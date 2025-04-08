import { configureStore } from "@reduxjs/toolkit";
import uiReducer from '../slices/uiSlice.js';
import authReducer from '../slices/authSlice.js'
import productReducer from '../slices/productSlice.js';
import brandsReducer from "../slices/brandSlice.js";
import categoryReducer from "../slices/categorySlice.js";
import priceDependentAttributesReducer from "../slices/PriceDependentSlice.js";
import visualAttributesReducer from "../slices/visualAttributesSlice.js";
import otherAttributesReducer from "../slices/otherAttributesSlice.js";
import notificationReducer from "../slices/notificationSlice.js"
import orderReducer from '../slices/orderSlice.js'
import usersReducer from '../slices/usersSlice.js'
import reviewsReducer from '../slices/reviewsSlice.js'
import cartReducer from '../slices/cartSlice.js'
import { setupInterceptors } from "../utils/api.js";

const store = configureStore({
    reducer: {
        ui: uiReducer,
        auth: authReducer,
        products: productReducer,
        brands: brandsReducer,
        categories: categoryReducer,
        priceDependentAttributes: priceDependentAttributesReducer,
        visualAttributes: visualAttributesReducer,
        otherAttributes: otherAttributesReducer,
        notification : notificationReducer,
        orders : orderReducer,
        users : usersReducer,
        reviews: reviewsReducer,
        cart : cartReducer
        

    },
    devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools only in development mode
});

setupInterceptors(store)
export default store;
