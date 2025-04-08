import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Cancel01Icon,
  Copy01Icon,
  RefreshIcon,
  Search01Icon,
} from "hugeicons-react";
import { toast } from "react-toastify";
import { deleteAbondoned, refreshCart, resetSearchedCart, searchCart } from "../../slices/cartSlice";

const CartList = () => {
  const dispatch = useDispatch();
  const { cart, searchedCart } = useSelector((state) => state.cart);

  const [searchType, setSearchType] = useState("userId");
  const [searchTerm, setSearchTerm] = useState("");

  const getCartAgeInfo = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now - createdDate;
    const daysOld = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const isAbandoned = daysOld > 30;

    return { daysOld, isAbandoned };
  };

  const handleSearch = () => {
    const payload = { type: searchType, term: searchTerm };
    dispatch(searchCart(payload));
  };

  const handleClear = () => {
    setSearchType("userId");
    setSearchTerm("");
    dispatch(resetSearchedCart());
  };

  const handleClearAbandonedCarts = () => {
    if (window.confirm("Are you sure you want to delete all abandoned carts (older than 30 days)?")) {
      dispatch(deleteAbondoned());
    }
  };

  const handleAbandonedFilter = () => {
    dispatch(searchCart({ type: "abandoned" }));
  };


  const getVariantInfo = (order) => {
    const matched = order.product.priceDependentAttributes.find(
      (attr) => attr._id === order.variant
    );
    if (!matched) return "-";
    return matched.variants.map((v) => `${v.variantName}: ${v.value}`).join(", ");
  };

  const getVisualAttributesInfo = (order) => {
    const matched = order.product.visualAttributes.filter((attr) =>
      order.visualAttributes.includes(attr._id)
    );
    if (matched.length === 0) return "-";
    return matched.map((attr) => `${attr.name}: ${attr.value}`).join(", ");
  };

  const handleRefresh = ()=>{dispatch(refreshCart())}

  return (
    <div>

      <div className="flex items-center justify-between bg-white mb-4 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4">
        <h3 className="text-xl font-medium dark:text-gray-200">Cart</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 px-3 py-1.5 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"

          >
            <RefreshIcon size={14} />
            Refresh
          </button>
          <button
            onClick={handleClearAbandonedCarts}
            className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white text-sm"
          >
            Clear Abandoned Carts
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 border p-4 mb-4 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-600"
          >
            <option value="userId">Search by User Id</option>
            <option value="itemId">Search by Cart Id</option>
            <option value="abandoned">Abandoned Carts</option>
          </select>

          {searchType !== "abandoned" && (
            <input
              type="text"
              placeholder={`Enter ${searchType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300"
            />
          )}

          <div className="flex gap-2 items-center">
            <button
              onClick={searchType === "abandoned" ? handleAbandonedFilter : handleSearch}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Search01Icon size={18} />
              Search
            </button>
            <button
              onClick={handleClear}
              className="border border-orange-500 hover:bg-orange-600 hover:text-white dark:text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Cancel01Icon size={18} />
              Clear
            </button>
          </div>
        </div>

        <div className="overflow-auto max-w-full">
          <table className="min-w-full bg-white dark:bg-zinc-900 border dark:border-zinc-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border-b dark:border-zinc-700">
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase">#</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Id</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase">User</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Product</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Variants</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Visual</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Qty</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Price</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase">CreatedAt</th>
                <th className="py-3 px-4 text-left text-sm font-semibold uppercase">Days Old</th>
              </tr>
            </thead>
            <tbody className="dark:text-zinc-400">
              {(searchedCart?.length > 0 ? searchedCart : cart)?.map((order, index) => (
                <tr
                  key={order._id}
                  className={`cursor-pointer transition "hover:bg-gray-50 dark:hover:bg-zinc-800"}`}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{order._id}</td>
                  <td className="py-3 px-4">
                    {order.user}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(order._id);
                        toast.info("Copied!");
                      }}
                      className="ml-2 text-orange-500 text-sm flex items-center gap-1"
                    >
                      <Copy01Icon size={18} />
                      Copy
                    </button>
                  </td>
                  <td className="py-3 px-4">{order.product.name}</td>
                  <td className="py-3 px-4">{getVariantInfo(order)}</td>
                  <td className="py-3 px-4">{getVisualAttributesInfo(order)}</td>
                  <td className="py-3 px-4">{order.quantity}</td>
                  <td className="py-3 px-4">{order.price}</td>
                  <td className="py-3 px-4">{order.createdAt}</td>
                  {(() => {
                    const { daysOld, isAbandoned } = getCartAgeInfo(order.createdAt);
                    return (
                      <td className={`py-3 px-4 font-semibold ${isAbandoned ? "text-red-500" : ""}`}>
                        {daysOld} days
                        {isAbandoned && (
                          <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs">
                            Abandoned
                          </span>
                        )}
                      </td>
                    );
                  })()}

                </tr>
              ))}
            </tbody>
          </table>

          {cart.length === 0 && (
            <p className="py-2 text-center text-gray-400">No carts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartList;
