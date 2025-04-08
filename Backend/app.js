import express from 'express'
const app = express()
import cors from 'cors'
import categoryRoutes from './routes/category.routes.js'
import brandRoutes from './routes/brand.routes.js'
import productRoutes from './routes/product.routes.js'
import apiResponse from './utils/apiResponse.js'
import authRoutes from './routes/auth.routes.js'
import { adminCartRoutes, userCartRoutes } from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'
import WishlistRoutes from './routes/wishlist.routes.js'
import { userReviewRouter, adminReviewRouter } from "./routes/review.routes.js";
import OfferRoutes from './routes/offer.routes.js'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import adminUserRouter from './routes/user.routes.js'

// List of allowed origins (frontend URLs)
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

// CORS Configuration
const corsOptions = {
    origin: function(origin, callback) {
        // Check if origin is in the allowed origins list
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,  // Allow cookies to be sent
};

// Use the CORS middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Use cookie-parser middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve static file

app.use("/api/auth", authRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/brands", brandRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/wishlist", WishlistRoutes)
app.use("/api/reviews", userReviewRouter)
app.use('/api/website', OfferRoutes)

app.use("/api/cart", userCartRoutes)
app.use('/api/admin/cart',adminCartRoutes)

app.use("/api/admin/users", adminUserRouter)
app.use('/api/admin/reviews',adminReviewRouter)

app.use((err, req, res, next)=>{
    console.error("Error in app : ", err)
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    apiResponse.error(res, message, {}, statusCode)
})
export default app