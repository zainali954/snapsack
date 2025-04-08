import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import formatDate from "../utils/formatDate.js";

export const fetchOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).populate('items.product').sort({createdAt : -1})
    if (!orders.length) apiResponse.success(res, "No Orders found", {}, 200);
    apiResponse.success(res, "Fetched Successfully", orders, 200)

})

export const createOrder = asyncHandler(async (req, res) => {
    const { items, address, totalPrice, paymentMethod } = req.body;

    const transformedItems = items.map((item) => ({
        ...item,
        product: item.product?._id || item.product, // use product._id if available, otherwise fallback
    }));
    const orderData = {
        user: req.user._id,
        items: transformedItems,
        address,
        totalPrice,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "Not Paid" : "Paid",
    };

    const order = await Order.create(orderData);
    if (!order) throw new apiError(500, "Order not placed")

    apiResponse.success(res, "Order Placed Successfully.", order, 200)
})

export const buyNowOrder = asyncHandler(async (req, res) => {
    const { items, address, totalPrice, paymentMethod } = req.body;

    const transformedItems = [];

    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) throw new apiError(404, "Product not found");

        let variant = null;

        //  Check if variant exists and adjust inventory accordingly
        if (item.variant) {
            variant = product.priceDependentAttributes.find(
                (attr) => attr._id.toString() === item.variant
            );
            if (!variant) throw new apiError(404, "Variant not found");

            // **Ensure stock is available before reducing**
            if (variant.inventory < item.quantity) {
                throw new apiError(400, "Insufficient stock for this variant");
            }

            // 🟢 Reduce variant inventory
            variant.inventory -= item.quantity;
        } else {
            //  If no variant, manage product's total stock
            if (product.countOfStock < item.quantity) {
                throw new apiError(400, "Insufficient stock for this product");
            }

            product.inventory -= item.quantity;
        }

        //  Save inventory updates
        await product.save();

        //  Prepare item for order storage
        transformedItems.push({
            ...item,
            product: product._id,
        });
    }

    //  Create order
    const orderData = {
        user: req.user._id,
        items: transformedItems,
        address,
        totalPrice,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "Not Paid" : "Paid",
    };

    const order = await Order.create(orderData);
    if (!order) throw new apiError(500, "Order not placed");

    apiResponse.success(res, "Order Placed Successfully.", order, 200);
});

// admin controllers 
//  Get All Orders (Admin Only)
export const getAllOrders_admin = asyncHandler(async (req, res) => {
    const orders = await Order.find().populate("user", "name email").populate('items.product').sort({ createdAt: -1 });
    if(!orders.length) apiResponse.success(res, "No orders found.", orders, 200);

    // Loop through each order and format createdAt
    const refinedData = orders.map(order => ({
        ...order.toObject(),
        createdAt: formatDate(order.createdAt)
    }));
    apiResponse.success(res, "Fetched successfully.", refinedData, 200)
});

//  Update Order Status (Admin Only)
export const updateOrder = asyncHandler(async (req, res) => {
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
        throw new apiError(404, "Order not found");
    }

    // Valid statuses for order and payment
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    const validPaymentStatuses = ["Not Paid", "Paid", "Refunded"];

    const updateFields = {};

    if (status) {
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status update" });
        }
        updateFields.status = status;

        // Auto-update payment status if order is delivered
        if (status === "Delivered") {
            updateFields.paymentStatus = "Paid";
        }
    }

    if (paymentStatus) {
        if (!validPaymentStatuses.includes(paymentStatus)) {
            return res.status(400).json({ success: false, message: "Invalid payment status update" });
        }
        updateFields.paymentStatus = paymentStatus;
    }


    // Use findByIdAndUpdate with custom update fields
    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true } 
    )
        .populate("user", "name email")
        .populate("items.product");

    if (!updatedOrder) {
        throw new apiError(500, "Order update failed");
    }

    apiResponse.success(res, "Order updated successfully.", updatedOrder, 200);
});

//  Delete Order (Admin Only)
export const deleteOrder = asyncHandler(async (req, res) => {

    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    await order.deleteOne();
    apiResponse.success(res, "Order deleted successfully");

});

// search orders
export const searchOrders = asyncHandler(async (req, res) => {
    const { userId, orderId, paymentStatus, status } = req.query;
    let filter = {};

    if (orderId) {
        // If searching by orderId, return a single order and ignore other filters
        const order = await Order.findById(orderId).populate("user", "name email").populate('items.product');
        if (!order) {
            throw new apiError(404, "Order not found.");
        }
        return apiResponse.success(res, "Fetched Successfully!", order, 200);
    }

    if (userId) {
        filter.user = userId;
    }
    if (paymentStatus) {
        filter.paymentStatus = paymentStatus;
    }
    if (status) {
        filter.status = status;
    }

    const orders = await Order.find(filter).populate("user", "name email").populate('items.product');
    if (!orders.length) return apiResponse.success(res, "No orders found.");
    apiResponse.success(res, "Fetched Successfully!", orders, 200)
})

// Quick Stats
export const getOrderStats = asyncHandler(async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }]);
    const paidOrders = await Order.countDocuments({ paymentStatus: "Paid" });
    const unpaidOrders = await Order.countDocuments({ paymentStatus: "Not Paid" });
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const shippedOrders = await Order.countDocuments({ status: "Shipped" });
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
    const canceledOrders = await Order.countDocuments({ status: "Canceled" });
    const codOrders = await Order.countDocuments({ paymentMethod: "COD" });
    const cardOrders = await Order.countDocuments({ paymentMethod: "Credit Card" });

    apiResponse.success(res, "Stats fetched successfully!", {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        paidOrders,
        unpaidOrders,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        canceledOrders,
        codOrders,
        cardOrders
    }, 200);
});

