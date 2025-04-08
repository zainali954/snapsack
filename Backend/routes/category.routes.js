import express from 'express';
import { body, param } from 'express-validator';
const router = express.Router();
import { v2 as cloudinary } from 'cloudinary';

import {
    getCategories,
    getCategoriesNoNest,
    createSubCategory,
    createSubSubCategory,
    createMainCategory,
    updateSubCategory,
    updateMainCategory,
    updateSubSubCategory,
    deleteMainCategory,
    deleteSubCategory,
    deleteSubSubCategory,
    categoryImageUpload,
} from '../controllers/category.controller.js';
import { upload } from '../utils/multer.js';
import apiResponse from '../utils/apiResponse.js';
import { configureCloudinary } from '../utils/cloudinary.js';
import extractPublicId from '../utils/extractPublicId.js';
import apiError from '../utils/apiError.js';
import verifyAuth from '../middlewares/verifyAuth.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';

const valCreateCat = [
    body('name').notEmpty().withMessage('Name is required.'),
    body('description').notEmpty().withMessage('Color is required.'),
  ];
  
  const validateMongoId = [
    param('id').isMongoId().withMessage('Invalid ID'),
  ];

  const deleteImageFromCloudinary = async (imageUrl) => {
    try {
        configureCloudinary();
        const publicId = extractPublicId(imageUrl);

        if (!publicId) {
            throw new apiError(400, "Invalid Image URL, cannot extract public ID");
        }

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== "ok") {
            console.error(result)
            throw new apiError(500, "Failed to remove image.");
        }

        console.log(`✅ Image deleted successfully: ${publicId}`);
    } catch (error) {
        console.error("❌ Error deleting image:", error);
        throw error; // Re-throw for handling in the calling function
    }
};


// Route to create a category, subCategory and subSubSubCategories
router.post('/main-category',verifyAuth, verifyAdmin,  createMainCategory); 
router.post('/upload',verifyAuth, verifyAdmin, upload.single('image'), categoryImageUpload )
router.post('/delete-image',verifyAuth, verifyAdmin, async (req, res) => {
  const {imageUrl} = req.body;

  await deleteImageFromCloudinary(imageUrl)
  apiResponse.success(res, "Deleted Successfully", {}, 200)
});
router.post('/sub-category',verifyAuth, verifyAdmin,  createSubCategory);
router.post('/sub-sub-category',verifyAuth, verifyAdmin,  createSubSubCategory);

// Route to update a category, subCategory and subSubSubCategories
router.put("/main-category/:categoryId",verifyAuth, verifyAdmin, updateMainCategory)
router.put("/sub-category/:subCategoryId",verifyAuth, verifyAdmin, updateSubCategory)
router.put("/sub-sub-category/:subSubCategoryId",verifyAuth, verifyAdmin, updateSubSubCategory)

// Route to delete a category, subCategory and subSubSubCategories
router.delete("/main-category/:categoryId",verifyAuth, verifyAdmin, deleteMainCategory)
router.delete("/sub-category/:subCategoryId",verifyAuth, verifyAdmin, deleteSubCategory)
router.delete("/sub-sub-category/:subSubCategoryId",verifyAuth, verifyAdmin, deleteSubSubCategory)


router.get('/', getCategories);  // Route to get all categories
router.get('/noNest', getCategoriesNoNest)


export default router;