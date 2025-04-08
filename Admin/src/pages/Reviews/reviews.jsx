import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Cancel01Icon, Copy01Icon, Delete02Icon, RefreshIcon, Search01Icon, ViewIcon } from "hugeicons-react";
import { deleteReview, fetchReviewStats, refreshReviews, resetSearchedReviews, searchReviews } from "../../slices/reviewsSlice";
import { toast } from "react-toastify";

const UsersList = () => {
  const { reviews, reviewStats, searchedReviews } = useSelector((state) => state.reviews);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("Id");
  const [rating, setRating] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    if (!reviewStats || Object.keys(reviewStats).length === 0) {
      dispatch(fetchReviewStats());
    }
  }, [dispatch, reviewStats]);

  const handleDeleteOrder = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteReview(id));
    }
  };

  const handleSearch = () => {
    dispatch(searchReviews({ type: searchType, value: searchTerm, rating, orderStatus, startDate, endDate }));

  };
  const handleClear = () => {
    dispatch(resetSearchedReviews())
    setSearchTerm("")
    setRating("")
    setOrderStatus("")
    setStartDate(null)
    setEndDate(null)
  }

  const handleRefresh = () => {dispatch(refreshReviews()) }
  return (
    <div className="">

      <div className="flex items-center justify-between bg-white mb-6 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4">
        <h3 className="text-xl font-medium dark:text-gray-200">Reviews</h3>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 px-3 py-1.5 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"

        >
          <RefreshIcon size={14} />
          Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Reviews */}
          <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Reviews</h3>
            <p className="text-2xl font-bold text-orange-500">{reviewStats.totalReviews}</p>
          </div>

          {/* Average Rating */}
          <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Average Rating</h3>
            <p className="text-2xl font-bold text-yellow-500">{reviewStats.avgRating}</p>
          </div>

          {/* Most Reviewed Product */}
          <div className="p-4 col-span-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Most Reviewed Product</h3>
            <p className="text-2xl font-bold text-green-500">{reviewStats.mostReviewedProduct}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4 mb-6">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-orange-500"
          >
            <option value="reviewId">Search by ID</option>
            <option value="userId">Search by Reviewer Id</option>
            <option value="productId">Search by Product ID</option>
            <option value="comment">Search by Comment</option>
          </select>
          <input
            type="text"
            placeholder={`Enter ${searchType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Rating</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-orange-500"
          />

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
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Reviewer</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Product</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Rating</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Comment</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Created At</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="dark:text-zinc-400">
              {(searchedReviews.length > 0 ? searchedReviews : reviews)?.map((item, index) => (
                <tr
                  key={item._id}
                  className={`cursor-pointer transition hover:bg-gray-50 dark:hover:bg-zinc-800 dark:border-zinc-700 border-b border-zinc-200 `}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{item._id}</td>
                  <td className="py-3 px-4">
                    {item.user?.email}
                    <button
                      className="flex items-center gap-2 text-orange-500 hover:text-orange-700 font-medium ml-2 text-sm focus:text-orange-700"
                      onClick={() => {
                        navigator.clipboard.writeText(item.user?._id);
                        toast.info("Copied!")
                      }}
                    >
                      <Copy01Icon size={18} /> Copy ID
                    </button>
                  </td>
                  <td className="py-3 px-4">{item.product?.name}</td>
                  <td className="py-3 px-4">{item.rating}</td>
                  <td className="py-3 px-4">{item.comment}</td>
                  <td className="py-3 px-4">{item.createdAt}</td>


                  <td className="py-3 px-4 flex items-center gap-2">

                    <button
                      className="ml-1 p-1.5 rounded-md border dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-red-500"
                      onClick={() => handleDeleteOrder(item._id)}
                    >
                      <Delete02Icon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {reviews?.length === 0 && <p className="py-2 text-center text-gray-400">No reviews found</p>}
        </div>
      </div>

    </div>
  );
};

export default UsersList;
