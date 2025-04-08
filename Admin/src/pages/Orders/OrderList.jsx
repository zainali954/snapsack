import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatus, updatePaymentStatus, deleteOrder, fetchOrders, searchOrders, resetSearchedOrders, fetchOrdersStats, refreshOrders } from "../../slices/orderSlice";
import { Cancel01Icon, Copy01Icon, Delete02Icon, RefreshIcon, Search01Icon, ViewIcon } from "hugeicons-react";
import OrderDetails from "./OrderModal";
import { toast } from "react-toastify";

const OrdersList = () => {
  const { orders, searchedOrders, stats } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("userId");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");

  useEffect(() => {
    if (!stats || Object.keys(stats).length === 0) {
      dispatch(fetchOrdersStats());
    }
  }, [dispatch, stats]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(id));
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const handlePaymentStatusChange = (orderId, newPaymentStatus) => {
    dispatch(updatePaymentStatus({ orderId, paymentStatus: newPaymentStatus }));
  };

  const handleSearch = () => {
    dispatch(searchOrders({ type: searchType, value: searchTerm, paymentStatus, orderStatus }));

  };
  const handleClear = () => {
    dispatch(resetSearchedOrders())
    setSearchTerm("")
    setPaymentStatus("")
    setOrderStatus("")
  }
  const handleRefresh =()=>{
dispatch(refreshOrders())
  }

  return (
    <div className="">
      <OrderDetails open={open} setOpen={setOpen} order={selectedOrder} />

      <div className="flex items-center justify-between bg-white mb-4 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4">
        <h3 className="text-xl font-medium dark:text-gray-200">Orders</h3>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 px-3 py-1.5 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"

        >
          <RefreshIcon size={14} />
          Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4 shadow-sm">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Total Orders */}
          <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Orders</h3>
            <p className="text-2xl font-bold text-orange-500">{stats.totalOrders}</p>
          </div>

          {/* Total Revenue */}
          <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-500">${stats.totalRevenue}</p>
          </div>

          {/* Paid Orders */}
          <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Paid Orders</h3>
            <p className="text-2xl font-bold text-blue-500">{stats.paidOrders}</p>
          </div>

          {/* Unpaid Orders */}
          <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Unpaid Orders</h3>
            <p className="text-2xl font-bold text-red-500">{stats.unpaidOrders}</p>
          </div>

          {/* Pending Orders */}
          <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Pending Orders</h3>
            <p className="text-2xl font-bold text-yellow-500">{stats.pendingOrders}</p>
          </div>

          {/* Shipped Orders */}
          <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Shipped Orders</h3>
            <p className="text-2xl font-bold text-indigo-500">{stats.shippedOrders}</p>
          </div>

          {/* Delivered Orders */}
          <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Delivered Orders</h3>
            <p className="text-2xl font-bold text-green-600">{stats.deliveredOrders}</p>
          </div>

          {/* Canceled Orders */}
          <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Canceled Orders</h3>
            <p className="text-2xl font-bold text-gray-500">{stats.canceledOrders}</p>
          </div>

          {/* Orders by COD */}
          <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Orders by COD</h3>
            <p className="text-2xl font-bold text-purple-500">{stats.codOrders}</p>
          </div>

          {/* Orders by Card */}
          <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Orders by Card</h3>
            <p className="text-2xl font-bold text-pink-500">{stats.cardOrders}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4 mb-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-orange-500"
          >
            <option value="userId">Search by User Id</option>
            <option value="orderId">Search by ID</option>
          </select>
          <input
            type="text"
            placeholder={`Enter ${searchType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Payment Status</option>
            <option value="Paid">Paid</option>
            <option value="Not Paid">Unpaid</option>
          </select>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Order Status</option>
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
          </select>
          <div className="flex gap-2 items-center">
            <button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
              <Search01Icon size={18} />
              Search
            </button>
            <button onClick={handleClear} className="border border-orange-500 hover:bg-orange-600 hover:text-white dark:text-white px-4 py-2 rounded-md flex items-center gap-2">
              <Cancel01Icon size={18} />
              Clear
            </button>
          </div>
        </div>

        <div className="max-w-full w-full overflow-auto ">
          <table className="min-w-full bg-white dark:bg-zinc-900 border dark:border-zinc-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-zinc-800 dark:text-gray-300 border-b dark:border-zinc-700">
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">#</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Id</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">User</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Items</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Total Price</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Date</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Payment Method</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Payment Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="dark:text-zinc-400">
              {(searchedOrders?.length > 0 ? searchedOrders : orders)?.map((order, index) => (
                <tr
                  key={order._id}
                  className={`cursor-pointer transition ${selectedOrder?._id === order?._id
                    ? "bg-orange-50 dark:bg-[#f974160a] border-l-4 border-orange-500 border-b border-b-gray-200 dark:border-b-zinc-700"
                    : "hover:bg-gray-50 dark:hover:bg-zinc-800 dark:border-zinc-700 border-b border-zinc-200"
                    }`}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{order._id}</td>
                  {/* <td className="py-3 px-4">{order.user?.email} <button className="flex items-center gap-2"><Copy01Icon size={18} />Copy Id</button></td> */}
                  <td className="py-3 px-4">
                    {order.user?.email}
                    <button
                      className="flex items-center gap-2 text-orange-500 hover:text-orange-700 font-medium ml-2 text-sm focus:text-orange-700"
                      onClick={() => {
                        navigator.clipboard.writeText(order.user?._id);
                        toast.info("Copied!")
                      }}
                    >
                      <Copy01Icon size={18} /> Copy ID
                    </button>
                  </td>

                  <td className="py-3 px-4">{order.items?.length}</td>
                  <td className="py-3 px-4">${order.totalPrice}</td>
                  <td className="py-3 px-4">{order.createdAt}</td>
                  <td className="py-3 px-4">{order.paymentMethod}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                      className="border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 p-1 rounded-md"
                    >
                      <option value="Not Paid">Not Paid</option>
                      <option value="Paid">Paid</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 p-1 rounded-md"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <button
                      className="p-1.5 rounded-md border dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-blue-500"
                      onClick={() => handleOrderClick(order)}
                    >
                      <ViewIcon size={18} />
                    </button>
                    <button
                      className="ml-1 p-1.5 rounded-md border dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-red-500"
                      onClick={() => handleDeleteOrder(order._id)}
                    >
                      <Delete02Icon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && <p className="py-2 text-center text-gray-400">No Orders found</p>}
        </div>
      </div>

    </div>
  );
};

export default OrdersList;
