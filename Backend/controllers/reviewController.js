import Review from "../models/review.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import formatDate from "../utils/formatDate.js";
import mongoose from "mongoose";

export const createReview = asyncHandler(async (req, res) => {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;

    // Step 1: Check if user has bought this product
    const order = await Order.findOne({
        user: userId,
        "items.product": productId,
        status: "Delivered" // Only allow if order is delivered
    });

    if (!order) {
        throw new apiError(403, "You can only review products you have purchased.");
    }

    // Step 2: Create new review
    const review = new Review({
        user: userId,
        product: productId,
        rating,
        comment
    });

    await review.save();

    // Step 3: Add review to product (optional)
    await Product.findByIdAndUpdate(productId, {
        $push: { reviews: review._id }
    });
    await review.populate("user", "name email")

    apiResponse.success(res, "Review submitted successfully!", review, 201)
})

// ✅ GET REVIEWS OF A PRODUCT
export const getProductReviews = asyncHandler(async (req, res) => {
    const { id: productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate("user", "name email");
    apiResponse.success(res, "Fetched Successfully!", reviews, 200)
});

// ✅ EDIT REVIEW
export const editReview = asyncHandler(async (req, res) => {
    const { id: reviewId } = req.params;
    const userId = req.user._id;
    const { comment } = req.body;

    const review = await Review.findOne({ _id: reviewId, user: userId });

    if (!review) {
        throw new apiError(404, "Review not found or you are not authorized to edit it.");
    }

    // ✅ Update review fields
    review.comment = comment || review.comment;
    await review.save();
    await review.populate("user", "name email")

    apiResponse.success(res, "Review updated successfully!", review, 200)
});

// ✅ DELETE REVIEW
export const deleteReview = asyncHandler(async (req, res) => {
    const { id: reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findOne({ _id: reviewId, user: userId });

    if (!review) {
        throw new apiError(404, "Review not found or you are not authorized to delete it.");
    }

    // ✅ Remove review reference from Product
    await Product.findByIdAndUpdate(review.product, { $pull: { reviews: review._id } });

    // ✅ Delete review
    await Review.findByIdAndDelete(reviewId);

    apiResponse.success(res, "Deleted Successfully!", reviewId, 200)
});

/**
 * @desc Get all reviews (Admin)
 * @route GET /api/admin/reviews
 * @access Private (Admin Only)
 */
export const getReviews = asyncHandler(async (req, res) => {
    const { product, user } = req.query;
    let filter = {};

    if (product) filter.product = product;
    if (user) filter.user = user;

    const reviews = await Review.find(filter)
        .populate("user", "name email")
        .populate("product", "name")
        .sort({ createdAt: -1 });

    // Map over users and format date fields
    const data = reviews.map(review => ({
        ...review._doc,
        createdAt: formatDate(review.createdAt)
    }));
    apiResponse.success(res, "Fetched Successfully!", data, 200)

})

/**
 * @desc Delete any review (Admin)
 * @route DELETE /api/admin/reviews/:reviewId
 * @access Private (Admin Only)
 */
export const adminDeleteReview = asyncHandler(async (req, res) => {

    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }

    await review.deleteOne();
    apiResponse.success(res, "Deleted Successfully!", reviewId, 200)
});


// Stats
export const reviewStats = asyncHandler(async (req, res) => {
        const totalReviews = await Review.countDocuments();

        // Calculate average rating
        const avgRatingResult = await Review.aggregate([
            { $group: { _id: null, avgRating: { $avg: "$rating" } } },
        ]);

        // Find the most reviewed product
        const mostReviewedProductResult = await Review.aggregate([
            { $group: { _id: "$product", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 },
        ]);

        let mostReviewedProduct = "N/A";
        if (mostReviewedProductResult.length > 0) {
            const product = await Product.findById(mostReviewedProductResult[0]._id).select("name");
            mostReviewedProduct = product ? product.name : "Unknown Product";
        }

        apiResponse.success(res, "Fetched Successfully!", {
            totalReviews,
            avgRating: avgRatingResult[0]?.avgRating.toFixed(1) || 0,
            mostReviewedProduct,
        }, 200);
});

export const searchReviews = asyncHandler(async (req, res) => {
    const { type, value, rating, startDate, endDate } = req.query;
    let filter = {};

    // If `type` exists but `value` is empty, skip Mongoose validation
    if (type && value?.trim() !== "") {
        if (type === "Id") {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return res.status(400).json({ success: false, message: "Invalid Review ID format." });
            }
            filter = { _id: value };
        }
        else if (type === "userId") {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return res.status(400).json({ success: false, message: "Invalid User ID format." });
            }
            filter = { user: value }; // Exact match for ObjectId
        }
        else if (type === "productId") {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return res.status(400).json({ success: false, message: "Invalid Product ID format." });
            }
            filter = { productId: value }; // Exact match for ObjectId
        }
        else if (type === "comment") {
            filter = { comment: { $regex: value, $options: "i" } }; // Case-insensitive search
        }
        else {
            return res.status(400).json({ success: false, message: "Invalid Search Type." });
        }
    }

    // Apply rating filter
    if (rating) {
        filter.rating = Number(rating);
    }

    // Apply date range filter
    if (startDate && endDate) {
        filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Fetch reviews with user and product details
    const reviews = await Review.find(filter)
        .populate("user", "name email")
        .populate("product", "name");

    if (!reviews.length) apiResponse.success(res, "No Reviews found.", reviews, 200);

    apiResponse.success(res, "Fetched successfully!", reviews, 200);
});
