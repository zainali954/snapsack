import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const [searchContent, setSearchContent] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchContent.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(searchContent)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative h-12">
      <input
        type="text"
        value={searchContent}
        onChange={(e) => setSearchContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="px-8 h-full bg-gray-100 border border-gray-300 rounded-full w-full outline-none focus:border-orange-600"
        placeholder="Search for products..."
      />
      <BiSearch
        size={24}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
        onClick={handleSearch} 
      />
    </div>
  );
};

export default SearchBox;
