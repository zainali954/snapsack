import React, { useState } from "react";
import {  Image02Icon, ImageAdd02Icon } from "hugeicons-react";

const ImageUploader = ({ images, setImages, onImageChange }) => {
  const [previews, setPreviews] = useState([]);
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    if (images.length + files.length > 10) {
      alert("You can only upload up to 10 images.");
      return;
    }

    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      alert("Only image files are allowed.");
      return;
    }


    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);

    onImageChange([...images, ...validFiles]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));

    onImageChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-4">
        {/* First div: Select Images */}

        <div>
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-orange-300  dark:border-orange-800 dark:hover:bg-[#a35a008c] dark:bg-[#522D00] rounded-lg bg-orange-50 cursor-pointer hover:bg-orange-100 transition"
          >
            <div className="flex flex-col gap-2 items-center text-orange-500">
              <ImageAdd02Icon />
              <span className="font-medium text-xs">Click to Upload Images</span>
            </div>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Image previews */}
        {previews.map((preview, index) => (
          <div key={index} className="relative">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-56 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-4 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transform -translate-x-1/2 -translate-y-1/2"
            >
              ×
            </button>
          </div>
        ))}

        {/* Placeholder divs to maintain grid-cols-4 */}
        {Array.from({ length: Math.max(0, 4 - (previews.length % 4) - 1) }).map(
          (_, index) => (
            <div key={`placeholder-${index}`} className="grid place-items-center text-gray-300 dark:text-gray-600 w-full h-56 bg-gray-50 dark:bg-zinc-800 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-md">
          
                <Image02Icon/>
              
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
