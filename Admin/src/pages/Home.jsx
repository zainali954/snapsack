import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Copy01Icon } from "hugeicons-react";
import { toast } from "react-toastify";

const DashboardHome = () => {
  const { products } = useSelector(state => state.products);
  const { orders } = useSelector(state => state.orders);
  const { reviews } = useSelector(state => state.reviews);
  const { users } = useSelector(state => state.users);
  const lowStockProducts = products.filter(item => item.countOfStock < 10); // Filter low stock products
  const handleCopy = (id) => {
    navigator.clipboard.writeText(id)
      .then(() => toast.info(`Copied: ${id}`))  // You can replace this with toast notification
      .catch(err => console.error("Failed to copy:", err));
  };
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between bg-white mb-4 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4">
        <h3 className="text-xl font-medium dark:text-gray-200">Home</h3>
      </div>

      <div className="bg-white mb-4 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Link to='/dashboard/products/add-product' className="p-4 text-center border border-orange-500 dark:text-gray-300 rounded shadow-md hover:bg-orange-600">
            Add Product
          </Link>
          <Link to='/dashboard/orders' className="p-4 text-center border border-orange-500 dark:text-gray-300 rounded shadow-md hover:bg-orange-600">
            Manage Orders
          </Link>
          <Link to='/dashboard/users' className="p-4 text-center border border-orange-500 dark:text-gray-300 rounded shadow-md hover:bg-orange-600">
            View Users
          </Link>
          <Link to='/dashboard/reviews' className="p-4 text-center border border-orange-500 dark:text-gray-300 rounded shadow-md hover:bg-orange-600">
            Check Reviews
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Latest Orders */}
          <div className="bg-white dark:bg-zinc-800 p-4 rounded shadow-md overflow-auto">
            <h2 className="text-lg font-semibold mb-3 dark:text-gray-300">Latest Orders</h2>
            <table className="min-w-full bg-white dark:bg-zinc-900 border dark:border-zinc-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-zinc-800 dark:text-gray-300 border-b dark:border-zinc-700">
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Order ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Customer</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Total</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="dark:text-zinc-400">
                {orders.length > 0 ? (
                  orders.slice(0, 10).map((order, rowIndex) => (
                    <tr key={rowIndex} className="border-b dark:border-zinc-700">
                      <td className="py-3 px-4">{order._id}</td>
                      <td className="py-3 px-4">{order.user?.name}</td>
                      <td className="py-3 px-4">{order.totalPrice}</td>
                      <td className="py-3 px-4">{order.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-3 px-4 text-center text-gray-400">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Low Stock Products (with Action Column) */}
          <div className="bg-white dark:bg-zinc-800 p-4 rounded shadow-md overflow-auto">
            <h2 className="text-lg font-semibold mb-3 dark:text-gray-300">Low Stock Products</h2>
            <table className="min-w-full bg-white dark:bg-zinc-900 border dark:border-zinc-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-zinc-800 dark:text-gray-300 border-b dark:border-zinc-700">
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Product</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Stock</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase">action</th>
                </tr>
              </thead>
              <tbody className="dark:text-zinc-400">
                {lowStockProducts.length > 0 ? (
                  lowStockProducts.slice(0, 10).map((product, rowIndex) => (
                    <tr key={rowIndex} className="border-b dark:border-zinc-700">
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">{product.countOfStock}</td>

                      <td className="py-3 px-4 flex items-center gap-2">
                        <button onClick={() => handleCopy(product._id)} className="p-1.5 rounded-md border dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-blue-500">
                          <Copy01Icon size={18} />
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-3 px-4 text-center text-gray-400">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Recent Users */}
          <div className="bg-white dark:bg-zinc-800 p-4 rounded shadow-md overflow-auto">
            <h2 className="text-lg font-semibold mb-3 dark:text-gray-300">Recent Users</h2>
            <table className="min-w-full bg-white dark:bg-zinc-900 border dark:border-zinc-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-zinc-800 dark:text-gray-300 border-b dark:border-zinc-700">
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Verified</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Created At</th>
                </tr>
              </thead>
              <tbody className="dark:text-zinc-400">
                {users.length > 0 ? (
                  users.slice(0, 10).map((user, rowIndex) => (
                    <tr key={rowIndex} className="border-b dark:border-zinc-700">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.isVerified ? "Verified" : "Not Verified"}</td>
                      <td className="py-3 px-4">{user.createdAt}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-3 px-4 text-center text-gray-400">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Latest Reviews */}
          <div className="bg-white dark:bg-zinc-800 p-4 rounded shadow-md overflow-auto">
            <h2 className="text-lg font-semibold mb-3 dark:text-gray-300">Latest Reviews</h2>
            <table className="min-w-full bg-white dark:bg-zinc-900 border dark:border-zinc-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-zinc-800 dark:text-gray-300 border-b dark:border-zinc-700">
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase">User</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Rating</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Comment</th>
                </tr>
              </thead>
              <tbody className="dark:text-zinc-400">
                {reviews.length > 0 ? (
                  reviews.slice(0, 10).map((review, rowIndex) => (
                    <tr key={rowIndex} className="border-b dark:border-zinc-700">
                      <td className="py-3 px-4">{review.user?.name}</td>
                      <td className="py-3 px-4">{review.rating}</td>
                      <td className="py-3 px-4">{review.comment}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-3 px-4 text-center text-gray-400">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
