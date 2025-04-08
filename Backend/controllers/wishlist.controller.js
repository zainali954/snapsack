import Wishlist from "../models/wishlist.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addToWishlist = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) throw new apiError(400, "Product Id is required");

    const existingItem = await Wishlist.findOne({ user: req.user._id, product: id });
    if (existingItem) throw new apiError(400, "This product is already in your wishlist.");

    const newItem = await Wishlist.create({ user: req.user._id, product: id });
    if (!newItem) throw new apiError(500, "Failed to add to Wishlist."); 

    apiResponse.success(res, "Added Successfully.", newItem, 201);
});

export const fetchWishlist = asyncHandler(async (req, res) => {
    const items = await Wishlist.find({ user: req.user._id }).populate("product"); 
    apiResponse.success(res, "Fetched Successfully.", items, 200);
});
