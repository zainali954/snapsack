import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import Brand from "../models/brand.model.js";

// Create Brand
export const createBrand = asyncHandler(async (req, res) => {
    const { name, category } = req.body;

    const existingBrand = await Brand.findOne({ name, category });
    if (existingBrand) throw new apiError(400, "Brand with this name already exists in this category.");

    let newBrand = await Brand.create({ name, category });

  
    newBrand = await Brand.findById(newBrand._id).populate('category');

    apiResponse.success(res, "Added successfully.", newBrand, 201);
});

// Get all brands
export const getAllBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find().populate("category", "name");
    apiResponse.success(res, "Fetched successfully han brands.", brands, 200);
});

// Get brands by categoryId
export const getBrandsByCategoryId = asyncHandler(async (req, res) => {
    const { categoryId } = req.params; 

    const brands = await Brand.find({ category: categoryId }).populate("category", "name");
    if (!brands.length) throw new apiError(404, "No brands found for this category.");

    apiResponse.success(res, "Fetched successfully.", brands, 200);
});

// Update Brand by ID
export const updateBrand = asyncHandler(async (req, res) => {
    const { name, category } = req.body;

    // Prevent duplicate name in the same category
    const existingBrand = await Brand.findOne({ name, category, _id: { $ne: req.params.id } });
    if (existingBrand) throw new apiError(400, "Another brand with this name already exists in this category.");

    let brand = await Brand.findByIdAndUpdate(req.params.id, { name, category }, { new: true, runValidators: true });
    brand = await Brand.findById(brand._id).populate('category').exec();

    if (!brand) throw new apiError(404, "Brand not found.");

    apiResponse.success(res, "Updated successfully.", brand, 200);
});

// Delete Brand
export const deleteBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) throw new apiError(404, "Brand not found.");

    apiResponse.success(res, "Deleted successfully.", {}, 200);
});
