import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import formatDate from "../utils/formatDate.js";


// 🟢 Add Item to Cart with Inventory Check
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity, visualAttributes } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new apiError(404, "Product not found");

  let price = product.basePrice * quantity; // Default price calculation
  let variant = null;
  let visualAttr = [];

  // Check if variantId exists before looking for a variant
  if (variantId) {
    variant = product.priceDependentAttributes.find(
      (attr) => attr._id.toString() === variantId
    );
    if (!variant) throw new apiError(404, "Variant not found");

    // Inventory Check for Variant
    if (variant.quantity < quantity) {
      throw new apiError(400, "Insufficient stock for this variant");
    }

    price = variant.price * quantity; // Override basePrice
  } else {
    // Inventory Check for Base Product
    if (product.inventory < quantity) {
      throw new apiError(400, "Insufficient stock for this product");
    }
  }

  // Handle Visual Attributes
  if (visualAttributes && visualAttributes.length > 0) {
    visualAttr = product.visualAttributes.filter((attr) =>
      visualAttributes.includes(attr._id.toString()) // Match IDs as strings
    );
  }

  // Build query for finding an existing cart item
  let query = {
    user: req.user._id,
    product: productId,
  };

  if (variantId) query.variant = variantId;
  if (visualAttr.length > 0) query.visualAttributes = { $all: visualAttr.map(attr => attr._id.toString()) };

  let cartItem = await Cart.findOne(query);

  if (cartItem) {
    // Check if adding more exceeds stock
    if (variantId && variant.inventory < cartItem.quantity + quantity) {
      throw new apiError(400, "Not enough stock for this variant");
    }
    if (!variantId && product.inventory < cartItem.quantity + quantity) {
      throw new apiError(400, "Not enough stock for this product");
    }

    cartItem.quantity += quantity;
    cartItem.price += price;
  } else {
    cartItem = new Cart({
      user: req.user._id,
      product: productId,
      variant: variantId || null,
      visualAttributes: visualAttr.map(attr => attr._id.toString()),
      quantity,
      price,
    });
  }

  await cartItem.save();

  // Reduce stock after adding to cart
  if (variantId) {
    variant.inventory -= quantity;
  } else {
    product.inventory -= quantity;
  }

  await product.save();

  // Populate related fields before sending response
  await cartItem.populate('product');

  apiResponse.success(res, "Added to cart", cartItem, 200);
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { cartItemId, quantity } = req.body;
  const userId = req.user._id;

  if (!cartItemId || quantity < 1) {
    throw new apiError(400, "Invalid Cart item ID or quantity.");
  }

  // Find cart item
  let cartItem = await Cart.findOne({ user: userId, _id: cartItemId }).populate('product');
  if (!cartItem) throw new apiError(404, "Cart item not found");

  const product = cartItem.product;
  if (!product) throw new apiError(404, "Product not found");

  let variant = null;
  if (cartItem.variant) {
    variant = product.priceDependentAttributes.find(
      (attr) => attr._id.toString() === cartItem.variant.toString()
    );
  }

  const previousQuantity = cartItem.quantity; // Previous quantity before update
  const quantityDifference = quantity - previousQuantity; // +ve means increase, -ve means decrease

  // 🛠 Inventory Adjustments
  if (quantityDifference > 0) {
    // Increasing quantity → Check available stock
    if (variant) {
      if (variant.inventory < quantityDifference) {
        throw new apiError(400, "Not enough stock available.");
      }
      variant.inventory -= quantityDifference; // Reduce stock
    } else {
      if (product.inventory < quantityDifference) {
        throw new apiError(400, "Not enough stock available.");
      }
      product.inventory -= quantityDifference; // Reduce general stock
    }
  } else if (quantityDifference < 0) {
    // Decreasing quantity → Restore inventory
    if (variant) {
      variant.inventory += Math.abs(quantityDifference);
    } else {
      product.inventory += Math.abs(quantityDifference);
    }
  }

  // Update quantity and price
  cartItem.quantity = quantity;
  cartItem.price = (cartItem.price / previousQuantity) * quantity; // Adjust price

  // Save product and cart item
  await product.save();
  await cartItem.save();

  apiResponse.success(res, "Cart item updated successfully.", cartItem, 200);
});

//  Get Cart by User ID
export const getCart = asyncHandler(
  async (req, res) => {

    const cartItems = await Cart.find({ user: req.user._id })
      .populate("product")

    if (!cartItems.length) return apiResponse.success(res, "No items found in the cart.", cartItems, 200);

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0)

    apiResponse.success(res, "Fetched Succcessuly", { totalPrice, cartItems }, 200)
  }
);

export const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.body;
  const userId = req.user._id;

  let cartItem = await Cart.findOne({ user: userId, _id: itemId });
  if (!cartItem) throw new apiError(404, "Cart not found");

  // Fetch Product
  const product = await Product.findById(cartItem.product);
  if (!product) throw new apiError(404, "Product not found");

  // Adjust Inventory Before Deleting Cart Item
  if (cartItem.variant) {
    // Variant-based inventory update
    const variant = product.priceDependentAttributes.find(
      (attr) => attr._id.toString() === cartItem.variant.toString()
    );
    if (variant) {
      variant.inventory += cartItem.quantity; // Restore stock
    }
  } else {
    // General product inventory update
    product.inventory += cartItem.quantity;
  }

  // Save product with updated inventory
  await product.save();

  // Remove cart item
  await cartItem.deleteOne();

  apiResponse.success(res, "Removed Successfully.", itemId, 200);
});


export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // User ka cart delete karo
  const result = await Cart.deleteMany({ user: userId });

  if (result.deletedCount === 0) {
    return apiResponse.success(res, "Cart is already empty.", {}, 200);
  }

  apiResponse.success(res, "Cart cleared successfully.", {}, 200);
});

// admin
export const getCartsInfo = asyncHandler(async (req, res) => {
  const cartItems = await Cart.find().populate('product', 'name priceDependentAttributes visualAttributes')
  if (!cartItems.length) {
    apiResponse.success(res, "No cart found.")
    return;
  }
  // Loop through each order and format createdAt
  const refinedData = cartItems.map(item => ({
    ...item.toObject(),
    createdAt: formatDate(item.createdAt)
  }));
  apiResponse.success(res, "Fetched Successfully!", refinedData, 200)
})

export const filterCarts = asyncHandler(async (req, res) => {
  const { type, term } = req.query;
  let filter = {};

  if ((type === "userId" || type === "itemId") && term) {
    const isValid = mongoose.Types.ObjectId.isValid(term);
    if (!isValid) {
      res.status(400);
      throw new Error(`${type === "userId" ? "User ID" : "Cart ID"} is not a valid MongoDB ObjectId`);
    }

    if (type === "userId") {
      filter.user = term;
    } else {
      filter._id = term;
    }
  } else if (type === "abandoned") {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    filter.createdAt = { $lte: thirtyDaysAgo };
  }

  const carts = await Cart.find(filter).populate(
    "product",
    "name priceDependentAttributes visualAttributes"
  );

  if (!carts.length) {
    return apiResponse.success(res, "No matching cart found.");
  }

  apiResponse.success(res, "Fetched Successfully!", carts, 200);
});

export const clearAbondonedCarts = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const result = await Cart.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
  // Fetch updated list of carts after deletion
  const refreshedCart = await Cart.find().populate("product").populate("user");

  apiResponse.success(res, result.deletedCount > 0 ? `${result.deletedCount} abandoned cart(s) cleared.` : "No abandoned carts to clear.", refreshedCart, 200)
})
