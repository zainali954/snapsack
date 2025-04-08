import pLimit from 'p-limit';
import { v2 as cloudinary } from 'cloudinary';

import { configureCloudinary, uploadToCloudinary } from '../utils/cloudinary.js';
import Product from '../models/product.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';
import apiError from '../utils/apiError.js'
import extractPublicId from '../utils/extractPublicId.js';
import mongoose from 'mongoose';
import Category from '../models/category.model.js'
import Brand from '../models/brand.model.js'
import Review from '../models/review.model.js'

const deleteImageFromCloudinary = async (imageUrl) => {
    try {
        configureCloudinary();

        const publicId = extractPublicId(imageUrl);

        if (!publicId) {
            throw new apiError(400, "Invalid Image URL, cannot extract public ID");
        }

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== "ok") {
            throw new apiError(500, "Failed to remove image.");
        }

    } catch (error) {
        console.error("❌ Error deleting image:", error);
        throw error; // Re-throw for handling in the calling function
    }
};

// Route to create a product ✔
export const createProduct = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        throw new apiError(400, 'No images provided');
    }

    // Limit concurrent uploads to 2
    const limit = pLimit(2);
    const uploadedUrls = await Promise.all(
        req.files.map((file) => limit(() => uploadToCloudinary(file.path, 'product')))
    );

    if (!req.productData) {
        return next(new apiError(400, 'Product data is missing'));
    }

    const product = await Product.create({
        ...req.productData,
        images: uploadedUrls
    });

    apiResponse.success(res, 'Product created successfully', product, 201);
});

export const productImageDelete = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.params;
        const { imageUrl } = req.body;

        if (!productId || !imageUrl) {
            return apiResponse.error(res, "Product ID and Image URL are required.", 400);
        }

        await deleteImageFromCloudinary(imageUrl);

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $pull: { images: imageUrl } },
            { new: true }
        );

        if (!updatedProduct) {
            return apiResponse.error(res, "Product not found.", 404);
        }
        return apiResponse.success(res, "Image deleted successfully.", updatedProduct, 200);
    } catch (error) {
        console.error("❌ Error deleting image:", error);
        return apiResponse.error(res, "Failed to delete image.", 500);
    }
});

export const editProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let updatedData = req.body;

    //Parse stringified JSON fields
    try {
        if (typeof updatedData.tags === 'string') {
            updatedData.tags = JSON.parse(updatedData.tags);
        }
        if (typeof updatedData.priceDependentAttributes === 'string') {
            updatedData.priceDependentAttributes = JSON.parse(updatedData.priceDependentAttributes);
        }
        if (typeof updatedData.visualAttributes === 'string') {
            updatedData.visualAttributes = JSON.parse(updatedData.visualAttributes);
        }
        if (typeof updatedData.otherAttributes === 'string') {
            updatedData.otherAttributes = JSON.parse(updatedData.otherAttributes);
        }
        if (typeof updatedData.shippingDetails === 'string') {
            updatedData.shippingDetails = JSON.parse(updatedData.shippingDetails);
        }
        if (typeof updatedData.images === 'string') {
            updatedData.images = JSON.parse(updatedData.images);
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid JSON format in request body" });
    }


    let uploadedUrls = [];
    const limit = pLimit(2);
    if (req.files && req.files.length > 0) {
        uploadedUrls = await Promise.all(
            req.files.map((file) => limit(() => uploadToCloudinary(file.path, 'product')))
        );
    }

    if (!Array.isArray(updatedData.images)) {
        updatedData.images = [];
    }



    if (uploadedUrls.length > 0) {
        updatedData.images = [...updatedData.images, ...uploadedUrls];
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }
    apiResponse.success(res, "Updated Successfully", updatedProduct, 200)
})
// single Image Upload (for visual attributes)
export const singleImageUpload = asyncHandler(async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadedUrl = await uploadToCloudinary(req.file.path, "product");
    apiResponse.success(res, "Image uploaded successfully.", uploadedUrl, 200)
})

// single Image Upload (for visual attributes)
export const singleImageDelete = asyncHandler(async (req, res) => {

    const { imageUrl } = req.body;

    if (!imageUrl) {
        throw new apiError(400, "imageUrl is required.")
    }

    // delete image from Cloudinary
    await deleteImageFromCloudinary(imageUrl);

    apiResponse.success(res, "Image removed successfully.", {}, 200)
})

// get all Products
export const getProducts = asyncHandler(async (req, res) => {
    const { category, subcategory, subsubcategory, brand, minPrice, maxPrice, search } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (subsubcategory) filter.subsubcategory = subsubcategory;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
        filter.basePrice = {};
        if (minPrice) filter.basePrice.$gte = Number(minPrice);
        if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
    }
    if (search) {
        filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    const products = await Product.find(filter)
        .populate("category", "name")
        .populate("subcategory", "name")
        .populate("subsubcategory", "name")
        .populate("brand", "name");


    if (!products.length) {
        return apiResponse.success(res, 'No Products found', [], 200);
    }

    apiResponse.success(res, 'Fetched successfully', products, 200);
});

// get all fetured Products
export const feturedProducts = asyncHandler(async (req, res) => {;

    const products = await Product.find({isFeatured:true})
        .populate("category", "name")
        .populate("subcategory", "name")
        .populate("subsubcategory", "name")
        .populate("brand", "name");

    if (!products.length) {
        return apiResponse.success(res, 'No Products found', [], 200);
    }

    apiResponse.success(res, 'Fetched successfully', products, 200);
});

export const getproductById = asyncHandler(async (req, res) => {
    const { id } = req.params

    // Find Product
    const product = await Product.findById(id)
        .populate('brand')
        .populate('category')
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    apiResponse.success(res, "fetched Successfully.", product, 200)
})

export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params

    // Find Product
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Delete All Images from Cloudinary
    if (product.images && product.images.length > 0) {
        await Promise.all(
            product.images.map(async (url) => {
                await deleteImageFromCloudinary(url);
            })
        );
    };

    // Delete Visual Attribute Images
    if (product.visualAttributes && product.visualAttributes.length > 0) {
        await Promise.all(
            product.visualAttributes.map(async (attr) => {
                if (attr.imageUrl) {
                    await deleteImageFromCloudinary(attr.imageUrl);
                }
            })
        );
    };
    // Delete Product from MongoDB
    await Product.findByIdAndDelete(id);

    // Respond with success
    apiResponse.success(res, 'Product and associated images deleted successfully', id, 200);
});
export const relatedProducts = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) throw new apiError(404, "Product not found.");

    const relatedProducts = await Product.find({
        _id: { $ne: id },
        $or: [
            { category: product.category },
            { subcategory: product.subcategory },
            { subsubcategory: product.subsubcategory },
            { tags: { $in: product.tags } }
        ]
    }).limit(10);

    if (!relatedProducts) {
        return apiResponse.success(res, "No related products found.", {}, 200);
    }

    // Remove circular references before sending the response
    const safeRelatedProducts = relatedProducts.map((prod) => {
        const safeProd = prod.toObject();
        // Customize the removal of any circular references if necessary
        return safeProd;
    });

    return apiResponse.success(res, "Related products fetched successfully.", safeRelatedProducts, 200);
});

// Search Products
export const searchProducts = asyncHandler(async (req, res) => {
    const { type, value } = req.query;

    if (!type || !value) {
        return res.status(400).json({ success: false, message: "Search type and value are required." });
    }

    let query = {};

    if (type === "id") {
        // ✅ Return error immediately if value is not a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return res.status(400).json({ success: false, message: "Invalid Product ID format." });
        }
        query = { _id: value };
    } else if (type === "name") {
        query = { "name": { $regex: value, $options: "i" } }; // Case-insensitive search
    }  else {
        return res.status(400).json({ success: false, message: "Invalid Search Type." });
    }

    const products = await Product.find(query)
        .populate("category", "name")
        .populate("subcategory", "name")
        .populate("subsubcategory", "name")
        .populate("brand", "name");

    if(!products.length) return apiResponse.success(res, "No product found for given criteria.", {}, 200);

    return apiResponse.success(res, "Fetched Successfully!", products, 200);
});

// Quick Stats
export const quickStats =  asyncHandler(async (req, res) => {
    const totalProducts = await Product.countDocuments();
    const availableProducts = await Product.countDocuments({ status: "available" });
    const outOfStockProducts = await Product.countDocuments({ countOfStock: 0 });
    const totalCategories = await Category.countDocuments();
    const totalBrands = await Brand.countDocuments();
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
  
    // Calculate average rating
    const ratings = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
  
    const avgRating = ratings.length > 0 ? ratings[0].avgRating.toFixed(1) : "N/A";
  
    apiResponse.success(res, "fetched Successfully",{
      totalProducts,
      availableProducts,
      outOfStockProducts,
      totalCategories,
      totalBrands,
      featuredProducts,
      avgRating,
    }, 200);
  });
  

