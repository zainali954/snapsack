

import Category from '../models/category.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';
import apiError from '../utils/apiError.js'
import SubCategory from '../models/subCategory.model.js';
import SubSubCategory from '../models/subsubCategory.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const categoryImageUpload = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Upload file to Cloudinary
    const uploadedUrl = await uploadToCloudinary(req.file.path, "product");
    apiResponse.success(res, "Image uploaded successfully.", uploadedUrl, 200)
})
// Create Category
export const createMainCategory = asyncHandler(async (req, res) => {
    const { name, image } = req.body
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) throw new apiError(400, "Category with this name already exists.");

    const newCategory = await Category.create({ name, image })

    apiResponse.success(res, 'Category added successfully.', newCategory, 201);
});

// Create SubCategory
export const createSubCategory = asyncHandler(async (req, res) => {
    const { name, categoryId } = req.body;

    // 1. Check if parentCategory exists
    const parentCategory = await Category.findById(categoryId);
    if (!parentCategory) {
        throw new apiError(404, "Parent category not found.");
    }

    // 2. Check if the name already exists in the current category
    const existingSubCategory = await SubCategory.findOne({ name, category: categoryId });
    if (existingSubCategory) {
        throw new apiError(400, "Subcategory with this name already exists.");
    }

    // 3. Create subCategory correctly
    const subCategory = await SubCategory.create({ name, category: categoryId });

    // 4. Update parentCategory to include the new subCategory
    parentCategory.subCategories.push(subCategory._id);
    await parentCategory.save();

    // 5. Send response
    apiResponse.success(res, "SubCategory added successfully.", subCategory, 201);
});

// Create SubSubCategory
export const createSubSubCategory = asyncHandler(async (req, res) => {
    const { name, subCategoryId } = req.body;

    // 1. Check if parent SubCategory exists
    const parentSubCategory = await SubCategory.findById(subCategoryId);
    if (!parentSubCategory) {
        throw new apiError(404, "Parent subcategory not found.");
    }

    // 2. Check if the SubSubCategory name already exists in this SubCategory
    const existingSubSubCategory = await SubSubCategory.findOne({ name, subCategory: subCategoryId });
    if (existingSubSubCategory) {
        throw new apiError(400, "SubSubCategory with this name already exists in the selected SubCategory.");
    }

    // 3. Create SubSubCategory correctly
    const subSubCategory = await SubSubCategory.create({ name, subCategory: subCategoryId });

    // 4. Update parent SubCategory to include the new SubSubCategory
    parentSubCategory.subSubCategories.push(subSubCategory._id);
    await parentSubCategory.save();

    // 5. Send response
    apiResponse.success(res, "SubSubCategory added successfully.", subSubCategory, 201);
});


// get all categories
export const getCategoriesNoNest = asyncHandler(async (req, res) => {
    const categories = await Category.find().select('name')
    apiResponse.success(res, 'Fetched successfully', categories, 200);
});

export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find()
        .populate({
            path: 'subCategories',         // Populating subCategories
            populate: {
                path: 'subSubCategories',    // Populating subSubCategories within subCategories
                model: 'SubSubCategory'      // Ensure we specify the model for subSubCategories
            }
        });
    apiResponse.success(res, 'Fetched successfully.', categories, 200);
});

// UPDATE CATEGORY
export const updateMainCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body;

    // 1. Check if category exists
    const category = await Category.findById(categoryId).populate({
        path: "subCategories",
        populate: {
            path: "subSubCategories"
        }
    });
    if (!category) {
        throw new apiError(404, "Category not found.");
    }

    // 2. Check if new name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory && existingCategory._id.toString() !== categoryId) {
        throw new apiError(400, "Category with this name already exists.");
    }

    // 3. Update name 
    category.name = name;
    await category.save();

    apiResponse.success(res, "Category updated successfully.", category);
});

// UPDATE SUBCATEGORY
export const updateSubCategory = asyncHandler(async (req, res) => {
    const { subCategoryId } = req.params;
    const { name } = req.body;

    // 1. Check if subcategory exists
    const subCategory = await SubCategory.findById(subCategoryId)
        .populate('subSubCategories'); // Populate sub-subcategories
    if (!subCategory) {
        throw new apiError(404, "SubCategory not found.");
    }

    // 2. Check if name already exists in the same category
    const existingSubCategory = await SubCategory.findOne({
        name,
        category: subCategory.category,
    });

    if (existingSubCategory && existingSubCategory._id.toString() !== subCategoryId) {
        throw new apiError(400, "SubCategory with this name already exists in this category.");
    }

    // 3. Update name 
    subCategory.name = name;
    await subCategory.save();

    apiResponse.success(res, "SubCategory updated successfully.", subCategory);
});

// UPDATE SUBSUBCATEGORY
export const updateSubSubCategory = asyncHandler(async (req, res) => {
    const { subSubCategoryId } = req.params;
    const { name } = req.body;

    // 1. Check if sub-subcategory exists
    const subSubCategory = await SubSubCategory.findById(subSubCategoryId);
    if (!subSubCategory) {
        throw new apiError(404, "SubSubCategory not found.");
    }

    // 2. Check if name already exists in the same subcategory
    const existingSubSubCategory = await SubSubCategory.findOne({
        name,
        subCategory: subSubCategory.subCategory,
    });

    if (existingSubSubCategory && existingSubSubCategory._id.toString() !== subSubCategoryId) {
        throw new apiError(400, "SubSubCategory with this name already exists in this subcategory.");
    }

    // 3. Update name
    subSubCategory.name = name;
    await subSubCategory.save();

    apiResponse.success(res, "SubSubCategory updated successfully.", subSubCategory);
});

// DELETE MAIN CATEGORY
export const deleteMainCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    // 1. Find category
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new apiError(404, "Category not found.");
    }

    // 2. Find all related SubCategories and delete them along with their SubSubCategories
    const subCategories = await SubCategory.find({ category: categoryId });

    for (let subCategory of subCategories) {
        await SubSubCategory.deleteMany({ subCategory: subCategory._id }); // Delete sub-subcategories
        await subCategory.deleteOne(); // Delete subcategory
    }

    // 3. Delete category
    await category.deleteOne();

    apiResponse.success(res, "Category and all related subcategories deleted successfully.");
});

// DELETE SUBCATEGORY
export const deleteSubCategory = asyncHandler(async (req, res) => {
    const { subCategoryId } = req.params;

    // 1. Find subcategory
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
        throw new apiError(404, "SubCategory not found.");
    }

    // 2. Delete all SubSubCategories under this SubCategory
    await SubSubCategory.deleteMany({ subCategory: subCategoryId });

    // 3. Remove SubCategory reference from its parent Category
    await Category.updateOne(
        { _id: subCategory.category },
        { $pull: { subCategories: subCategoryId } }
    );

    // 4. Delete SubCategory
    await subCategory.deleteOne();

    apiResponse.success(res, "SubCategory and all related sub-subcategories deleted successfully.");
});

// DELETE SUBSUBCATEGORY
export const deleteSubSubCategory = asyncHandler(async (req, res) => {
    const { subSubCategoryId } = req.params;

    // 1. Find sub-subcategory
    const subSubCategory = await SubSubCategory.findById(subSubCategoryId);
    if (!subSubCategory) {
        throw new apiError(404, "SubSubCategory not found.");
    }

    // 2. Remove SubSubCategory reference from its parent SubCategory
    await SubCategory.updateOne(
        { _id: subSubCategory.subCategory },
        { $pull: { subSubCategories: subSubCategoryId } }
    );

    // 3. Delete SubSubCategory
    await subSubCategory.deleteOne();

    apiResponse.success(res, "SubSubCategory deleted successfully.");
});