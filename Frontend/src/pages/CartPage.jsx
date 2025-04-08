import React  from "react";
import { useDispatch, useSelector } from "react-redux";
import {  removeFromCart, updateCartItem } from "../slices/cartSlice";
import { setOrderItems, setOrderPrice, setType } from "../slices/orderSlice";
import { Link, useNavigate } from "react-router-dom";
import { BiX } from "react-icons/bi";

const CartPage = () => {
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const updateQuantity = (cartItemId, increment) => {
    const updatedItem = cartItems.find((item) => item._id === cartItemId);
    if (!updatedItem) return;

    const newQuantity = updatedItem.quantity + increment;
    if (newQuantity < 1) return;

    dispatch(updateCartItem({ cartItemId, quantity: newQuantity }));
  };

  const removeItem = (cartItemId) => {
    dispatch(removeFromCart(cartItemId));
  };

  const handleBuy = () => {
    dispatch(setOrderItems(cartItems))
    dispatch(setOrderPrice(totalPrice))
    dispatch(setType('cartbased'))

    navigate('/checkout')
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Shopping Cart</h1>
      

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200">
          {cartItems && cartItems?.length > 0 ? (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Details</th>
                  <th className="p-3 text-right">Quantity</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Subtotal</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems?.map((item, index) => {
                  const selectedVariant = item.product.priceDependentAttributes?.find(
                    (attr) => attr._id === item.variant
                  );

                  const selectedVisualAttributes = item.product.visualAttributes?.filter((attr) =>
                    item.visualAttributes.includes(attr._id)
                  );

                  return (
                    <tr key={index + item._id} className="border-b border-gray-300 dark:border-gray-700">
                      <td className="p-3 flex items-center">
                        <img
                          src={item.product.images?.[0] || "/fallback-image.jpg"}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-lg mr-4 object-cover"
                        />
                        <Link to={`/product/${item.product?._id}`} className="text-gray-800 hover:text-orange-500 dark:text-gray-100 font-medium">
                          {item.product.name}
                        </Link>
                      </td>
                      <td className="p-3">
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
                          <div className="mt-2">
                            {selectedVisualAttributes.map((attr) => (
                              <div key={attr._id} className="flex items-center text-sm">
                                <span>{attr.name}: {attr.value}</span>
                                {attr.imageUrl && (
                                  <img
                                    src={attr.imageUrl}
                                    alt={attr.value}
                                    className="w-6 h-6 ml-2 rounded-full object-cover"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                          >
                            -
                          </button>
                          <span className="text-gray-800 dark:text-gray-200">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-right text-gray-800 dark:text-gray-200">
                        ${selectedVariant?.price?.toFixed(2) || item.product?.basePrice?.toFixed(2)}
                      </td>
                      <td className="p-3 text-right text-gray-800 dark:text-gray-200">
                        ${(item.price).toFixed(2)}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => removeItem(item._id)}
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <BiX size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">Your cart is empty.</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Checkout Summary</h2>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${totalPrice?.toFixed(2) || "0.00"}</span>
          </div>
          <button
            onClick={handleBuy}
            className="w-full mt-4 bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            disabled={!cartItems?.length}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
      
      <div className=" p-4 border-l-4 mt-4 border-yellow-500 bg-yellow-100 text-yellow-800 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Important Notice</h2>
      <p className="mt-1 text-sm">
        Items in your cart will automatically expire after <strong>30 days</strong>. Make sure to complete your purchase before they disappear!
      </p>
    </div>
    </div>
  );
};

export default CartPage;