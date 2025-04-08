import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrderDetails = ({ open, setOpen, order }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!open) return null;

  if (!order) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-6 rounded-2xl shadow-lg max-w-md text-center">
          <p className="text-gray-500">Please select an order to view details.</p>
          <button onClick={() => setOpen(false)} className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900">
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-6 rounded-2xl shadow-lg max-h-screen overflow-y-auto w-11/12 sm:w-3/4 lg:w-1/2">
        
        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Order Details - #{order._id}
        </h2>

        {/* Customer Details */}
        <div className="mb-4 border-b dark:border-zinc-700 pb-3">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Customer Details</h3>
          <p className="text-gray-600 dark:text-gray-300">Name: {order.user?.name}</p>
          <p className="text-gray-600 dark:text-gray-300">Email: {order.user?.email}</p>
        </div>

        {/* Shipping Address */}
        <div className="mb-4 border-b dark:border-zinc-700 pb-3">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Shipping Address</h3>
          <p className="text-gray-600 dark:text-gray-300">{order.address.fullName}</p>
          <p className="text-gray-600 dark:text-gray-300">{order.address.street}, {order.address.city}, {order.address.state}</p>
          <p className="text-gray-600 dark:text-gray-300">{order.address.postalCode}, {order.address.country}</p>
          <p className="text-gray-600 dark:text-gray-300">Phone: {order.address.phone}</p>
        </div>

        {/* Order Items */}
        <div className="mb-4 border-b dark:border-zinc-700 pb-3">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => {
              const selectedVariant = item.product?.priceDependentAttributes?.find(attr => attr._id === item.variant);
              const selectedVisual = item.product?.visualAttributes?.find(attr => item.visualAttributes.includes(attr._id));
              
              return (
                <div key={item._id} className="p-4 border border-gray-300 dark:border-zinc-600 rounded-lg flex items-center gap-4">
                  {/* Product Image */}
                  <img 
                    src={selectedVisual?.imageUrl || "https://via.placeholder.com/80"} 
                    alt={item.product.name} 
                    className="w-16 h-16 object-cover rounded-md"
                  />

                  {/* Product Info */}
                  <div className="flex-1">
                    <p className="font-semibold dark:text-gray-300">{item.product.name}</p>

                    {/* Variant */}
                    {selectedVariant && (
                      <div className="mt-1">
                        <p className="text-sm text-gray-500">Variant:</p>
                        <div className="flex gap-2 text-gray-700 dark:text-gray-300">
                          {selectedVariant.variants.map(attr => (
                            <span key={attr._id} className="bg-gray-200 dark:bg-zinc-700 px-2 py-1 rounded-md text-xs">
                              {attr.variantName}: {attr.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Visual Attributes */}
                    {selectedVisual && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">Color: {selectedVisual.value}</p>
                    )}

                    {/* Quantity & Price */}
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Quantity: {item.quantity}</p>
                    <p className="text-gray-600 dark:text-gray-400">Price: ${item.price.toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Details */}
        <div className="mb-4 border-b dark:border-zinc-700 pb-3">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Payment Details</h3>
          <p className="text-gray-600 dark:text-gray-300">Method: {order.paymentMethod}</p>
          <p className="text-gray-600 dark:text-gray-300">Status: {order.paymentStatus}</p>
          <p className="text-gray-600 dark:text-gray-300">Total: ${order.totalPrice.toFixed(2)}</p>
        </div>

        {/* Order Status */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Order Status</h3>
          <p className={`px-3 py-1 rounded-md text-white text-sm w-fit ${
            order.status === "Pending" ? "bg-yellow-500" :
            order.status === "Shipped" ? "bg-blue-500" :
            order.status === "Delivered" ? "bg-green-500" :
            "bg-gray-500"
          }`}>
            {order.status}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 items-center mt-4">
          <button onClick={handleEdit} className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
            Edit Order
          </button>
          <button onClick={() => setOpen(false)} className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
