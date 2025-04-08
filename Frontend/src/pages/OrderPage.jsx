import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { buyNow, placeOrder } from "../slices/orderSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearCart } from "../slices/cartSlice";

const OrderPage = () => {
    const dispatch = useDispatch();
    const { orderItems, orderPrice, type } = useSelector(state => state.order);
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
useEffect(() => {
    if (!user) {
        navigate('/login');
    } else if (!user.isVerified) {
        toast.warn("Please verify your email before placing an order.");
        navigate('/verify-email');
    }
}, [user]);



    // Fetch saved addresses from user profile
    const savedAddresses = user?.addresses || [];
    const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0] || null);
    const [paymentMethod, setPaymentMethod] = useState("COD"); // default to COD

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedAddress) {
            toast.warn("Please select a delivery address.");
            return
        }
        

        // Build the order payload
        const orderData = {
            items: orderItems,
            address: selectedAddress,
            totalPrice: orderPrice,
            paymentMethod,
        };

        if (type === "buynow") {
            // Dispatch the buyNow action and wait for completion
            dispatch(buyNow(orderData))
              .unwrap()
              .then(() => {
                navigate('/orders'); 
              })
              .catch((error) => {
                console.error("Buy Now order failed:", error);
              });
        } else if (type === "cartbased") {
            dispatch(placeOrder(orderData))
              .unwrap()
              .then(() => {
                dispatch(clearCart()); 
                navigate('/orders');
              })
              .catch((error) => {
                console.error("Order failed:", error);
              });
        }        
    };

    return (
        <div className="mb-2 container mx-auto">
            <p>Check Out Previous Orders... <Link to="/orders">Click Here</Link></p>
            <div className="flex flex-col md:flex-row gap-8 p-6 mx-auto">
                {/* Address Selection */}
                <div className="w-full md:w-1/2 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200">
                    <h2 className="text-3xl font-semibold text-orange-600 mb-6">Select Address</h2>
                    {savedAddresses.length > 0 ? (
                        <select
                            value={selectedAddress?.id || ""}
                            onChange={(e) => setSelectedAddress(savedAddresses.find(addr => addr.id === e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            {savedAddresses.map((address) => (
                                <option key={address._id} value={address.id}>{address.street}, {address.city}</option>
                            ))}
                        </select>
                    ) : (
                        <p>No saved addresses. Add one in <Link to="/profile" className="text-orange-600">Profile</Link></p>
                    )}
                    {/* Payment Method Selection */}
                    <div className="mt-4">
                        <label className="text-gray-700 mb-2">Payment Method</label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="COD">Cash On Delivery</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition mt-4"
                    >
                        Place Order
                    </button>
                </div>

                {/* Cart Items */}
                <div className="w-full md:w-1/2 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200">
                    <h2 className="text-2xl font-semibold text-orange-600 mb-4">Your Cart</h2>
                    <div className="space-y-4">
                        {orderItems?.map((item) => {
                            const selectedVariant = item.product.priceDependentAttributes?.find(
                                (attr) => attr._id === item.variant
                            );
                            const selectedVisualAttributes = item.product.visualAttributes?.filter(
                                (attr) => item.visualAttributes.includes(attr._id)
                            );
                            return (
                                <div
                                    key={item._id}
                                    className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
                                >
                                    {item?.product?.images &&
                                        <img
                                            src={item?.product?.images[0]}
                                            alt="Product"
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />}
                                    <div className="flex-1">
                                        <Link to={`/product/${item.product?._id}`} className="text-gray-800 hover:text-orange-500 dark:text-gray-100 font-medium">
                                            {item.product.name}
                                        </Link>
                                        {selectedVariant && (
                                            <div className="text-gray-800 dark:text-gray-200 text-sm">
                                                {selectedVariant.variants.map((variant) => (
                                                    <p key={variant._id} className="text-sm">
                                                        {variant.variantName}: {variant.value}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                        {selectedVisualAttributes?.length > 0 && (
                                            <div>
                                                {selectedVisualAttributes.map((attr) => (
                                                    <span key={attr._id} className="text-sm">
                                                        {attr.name}: {attr.value}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-gray-500">
                                            {item.price} x {item.quantity}
                                        </p>
                                        =
                                        <p className="text-lg font-semibold text-orange-600">
                                            $
                                            {(selectedVariant?.price?.toFixed(2) ||
                                                item.product?.basePrice?.toFixed(2)) * item.quantity}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <h2 className="text-2xl font-semibold text-orange-600 mt-4">
                        Total: {orderPrice}
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
