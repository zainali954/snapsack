import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../slices/productSlice';
import authReducer from '../slices/authSlice';
import cartReducer from '../slices/cartSlice';
import orderReducer from '../slices/orderSlice';
import reviewReducer from '../slices/reviewSlice';
import wishlistReducer from '../slices/wishlistSlice';
import notificationReducer from '../slices/notificationSlice';
import { setupInterceptors } from '../utils/api';
// import userReducer from '../features/userSlice';

export const store = configureStore({
    reducer: {
        products: productsReducer,
        auth: authReducer,
        cart: cartReducer,
        order: orderReducer,
        review: reviewReducer,
        wishlist: wishlistReducer,
        notification: notificationReducer,
        // user: userReducer
    }
});

setupInterceptors(store)