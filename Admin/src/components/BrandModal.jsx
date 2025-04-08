import { Cancel01Icon } from "hugeicons-react";
import React from "react";

const BrandModal = ({
  isOpen,
  onClose,
  categories,
  brandName,
  setBrandName,
  categoryId,
  setCategoryId,
  handleCreateBrand,
  isEditing, // New prop to check if it's an editing mode
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 p-6 rounded-lg shadow-lg w-full max-w-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold dark:text-gray-300">{isEditing ? 'Edit Brand' : 'Add New Brand'}</h3>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-400 text-xl"
            >
              <Cancel01Icon size={18}/>
            </button>
          </div>

          <div className="space-y-3">
            <input
              className="capitalize inputStyled"
              placeholder="Brand Name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
            <select
              className="inputStyled"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="" disabled>Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleCreateBrand}
              className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-md shadow-sm hover:bg-orange-600 transition-all"
            >
              {isEditing ? 'Save Changes' : 'Save'} {/* Conditionally change button text */}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandModal;
