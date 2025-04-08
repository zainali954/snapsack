import { BiStar, BiPencil, BiTrash, BiSave, BiX } from "react-icons/bi"
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReview, fetchReviews, updateReview, deleteReview } from "../slices/reviewSlice";
import { useParams } from "react-router-dom";
const Reviews = () => {
  const dispatch = useDispatch();
  const { reviews } = useSelector((state) => state.review);
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [formData, setFormData] = useState({ rating: 0, comment: "", productId: id });
  const [editingReview, setEditingReview] = useState(null);
  const [editedData, setEditedData] = useState({ comment: "" });

  useEffect(() => {
    dispatch(fetchReviews(id));
  }, [dispatch, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to submit a review.");
    if (formData.rating < 1 || formData.rating > 5) return alert("Please select a rating from 1 to 5.");
    
    dispatch(addReview(formData));
    setFormData({ rating: 0, comment: "" });
  };

  const handleEdit = (review) => {
    if (!user) return;
    setEditingReview(review._id);
    setEditedData({ comment: review.comment });
  };

  const handleUpdate = (reviewId) => {
    if (!user) return;
    dispatch(updateReview({ id: reviewId, comment: editedData.comment }));
    setEditingReview(null);
  };

  const handleDelete = (reviewId) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview(reviewId));
    }
  };

  // Sorting: User reviews first
  const sortedReviews = [...reviews].sort((a, b) => (a.user._id === user?._id ? -1 : b.user._id === user?._id ? 1 : 0));

  // Calculate Average Rating
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col md:flex-row">
      {/* Left Side - Reviews List */}
      <div className="w-full md:w-2/3 pr-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Customer Reviews</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {averageRating} out of 5 stars ({totalReviews} reviews)
        </p>

        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <div key={review._id} className="relative p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 group">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {review.user._id === user?._id ? "You" : review.user.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>

              {editingReview === review._id ? (
                <div className="mt-2">
                  <textarea
                    value={editedData.comment}
                    onChange={(e) => setEditedData({ ...editedData, comment: e.target.value })}
                    className="w-full border rounded-lg p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-600"
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <button onClick={() => handleUpdate(review._id)} className="text-green-600 hover:text-green-800">
                      <BiSave className="w-5 h-5" />
                    </button>
                    <button onClick={() => setEditingReview(null)} className="text-gray-500 hover:text-gray-700">
                      <BiX className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex mt-1">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <BiStar key={i} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={0} className="w-4 h-4 text-yellow-500" />
                      ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">{review.comment}</p>
                </>
              )}

              {/* Show Edit/Delete buttons only if logged in and it's their review */}
              {user && review.user._id === user._id && (
                <div className="absolute top-2 right-2 hidden bg-gray-50 py-2 px-4 group-hover:flex space-x-4">
                  <button onClick={() => handleEdit(review)} className="text-blue-600 hover:text-blue-800">
                    <BiPencil className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(review._id)} className="text-red-600 hover:text-red-800">
                    <BiTrash className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Review Form (Only Show If Logged In) */}
      {user ? (
        <div className="w-full md:w-1/3 pl-4">
          <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Write a Review</h3>

            {/* Star Rating Selection */}
            <div className="mb-4">
              <label className="block text-gray-600 dark:text-gray-300 mb-1">Rating</label>
              <div className="flex space-x-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <button
                      type="button"
                      key={i + 1}
                      className={`w-12 h-12 text-lg ${formData.rating > i ? "fill-yellow-500 " : "text-gray-400"}`}
                      onClick={() => setFormData({ ...formData, rating: i + 1 })}
                    >
                      <BiStar fill="current" strokeWidth={0} />
                    </button>
                  ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-4">
              <label className="block text-gray-600 dark:text-gray-300 mb-1">Review</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full border rounded-lg p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-600"
                rows="4"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition">
              Submit Review
            </button>
          </form>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center w-full mt-4">
          You must be logged in to leave a review.
        </p>
      )}
    </div>
  );
};

export default Reviews;
