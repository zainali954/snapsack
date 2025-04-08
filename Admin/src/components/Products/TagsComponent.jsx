import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTag, removeTag } from "../../slices/productSlice";

const TagsComponent = () => {
  const { tags } = useSelector((state) => state.products)
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    if (inputValue.trim() !== "") {
      dispatch(addTag(inputValue.trim()))
      setInputValue("");
    }
  };

  const handleRemoveTag = (index) => {
    dispatch(removeTag(index));
  };

  return (
    <div className="bg-white mb-4 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 ">
      <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
        <h3 className="text-lg font-semibold dark:text-gray-200 ">
          Tags
        </h3>
      </div>
      <div className="p-4 space-y-3">
        {/* Tags Display */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full border border-orange-300 dark:bg-orange-900 dark:text-orange-400 dark:border-orange-600"
            >
              <span className="mr-2">{tag}</span>
              <button
              type="button"
                onClick={() => handleRemoveTag(index)}
                className="text-orange-500 hover:text-orange-700 dark:hover:text-orange-300"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        {/* Input and Add Button */}
        <div className="flex items-center gap-2">

          <input
            type="text"
            name="tags"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a tag"
            className="inputStyled"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="buttonStyled"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagsComponent;
