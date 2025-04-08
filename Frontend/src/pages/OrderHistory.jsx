import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../slices/orderSlice";
import { Link, useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const { user } = useSelector( (state) => state.auth)
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(fetchOrders());
    } else {
      navigate("/login");
    }
  }, [user, dispatch, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      {orders && orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-gray-800  border border-gray-200 rounded-lg overflow-hidden mb-10"
          >
            <div className="flex flex-col md:flex-row">
              {/* Left Column: Order Info & Delivery Address */}
              <div className="md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    Order ID: {order._id}
                  </h2>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${order.status === "Delivered"
                        ? "bg-green-200 text-green-800"
                        : order.status === "Cancelled"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="mb-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Payment Method:</span>{" "}
                    {order.paymentMethod}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Payment Status:</span>{" "}
                    {order.paymentStatus}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                    Delivery Address
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {order.address.fullName}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {order.address.street}, {order.address.city}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {order.address.state} - {order.address.postalCode}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {order.address.country}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    <span className="font-semibold">Phone:</span>{" "}
                    {order.address.phone}
                  </p>
                </div>
              </div>
              {/* Right Column: Order Items */}
              <div className="md:w-1/2 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => {
                    const selectedVariant = item.product.priceDependentAttributes?.find(
                      (attr) => attr._id === item.variant
                    );
                    const selectedVisualAttributes = item.product.visualAttributes?.filter(
                      (attr) => item.visualAttributes.includes(attr._id)
                    );

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between border p-4 rounded-md bg-gray-50 dark:bg-gray-700"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.product.images?.[0] || "/fallback-image.jpg"}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <Link to={`/product/${item.product?._id}`} className="text-gray-800 hover:text-orange-500 dark:text-gray-100 font-medium">
                              {item.product.name}
                            </Link>
                            {selectedVariant && (
                              <div className="text-gray-600 dark:text-gray-300 text-sm">
                                {selectedVariant.variants.map((variant) => (
                                  <p key={variant._id}>
                                    {variant.variantName}: {variant.value}
                                  </p>
                                ))}
                              </div>
                            )}
                            {selectedVisualAttributes?.length > 0 && (
                              <div className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                {selectedVisualAttributes.map((attr) => (
                                  <p key={attr._id}>
                                    {attr.name}: {attr.value}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-gray-500">
                            {selectedVariant?.price || item.product?.basePrice} x {item.quantity}
                          </p>
                          =
                          <p className="text-lg font-semibold text-orange-600">
                            $
                            {item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 text-right border-t pt-4">
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Total: ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-700 dark:text-gray-300">
          No orders found.
        </p>
      )}
    </div>
  );
};

export default OrderHistory;
