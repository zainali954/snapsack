import React, { useState } from "react";
import { BiMenu, BiChevronDown, BiChevronRight } from "react-icons/bi";
import { Link } from "react-router-dom";
import SearchBox from "./SearchBox";
import { useSelector } from "react-redux";


const Navigation = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const { categories } = useSelector((state) => state.products);

  return (
    <nav className="flex flex-col md:flex-row justify-between gap-4 items-center mt-6 pb-4 border-b border-gray-400 relative z-10">
      {/* Categories Dropdown */}
      <div className="relative w-64">
        {/* Toggle Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between gap-6 rounded-full px-4 py-3 text-white bg-orange-500 hover:bg-orange-600 transition w-full"
        >
          <div className="flex items-center gap-3">
            <BiMenu size={22} />
            <span className="text-white font-dosis font-semibold">ALL CATEGORIES</span>
          </div>
          <BiChevronDown size={22} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <aside className="absolute top-full bg-white shadow-md border border-gray-200 rounded-lg w-full z-50">
            <ul className="divide-y divide-gray-100">
              {/* Main Categories */}
              {categories?.map((category, index) => (
                <li
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link
                    to={`/products?category=${category._id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-orange-100 hover:text-orange-600 font-medium text-gray-700 cursor-pointer"
                  >
                    <span>{category.name}</span>
                    {category.subCategories && category.subCategories.length > 0 && (
                      <BiChevronRight size={18} className="text-gray-400 group-hover:text-orange-600" />
                    )}
                  </Link>

                  {/* Subcategories Side Menu */}
                  {hoveredCategory === category.name && category.subCategories && (
                    <div className="absolute top-0 left-full bg-white shadow-lg border border-gray-200 rounded-lg w-64">
                      {category.subCategories.map((sub, subIndex) => (
                        <div key={subIndex} className="relative group">
                          <Link
                            to={`/products?subcategory=${sub._id}`}
                            className="flex items-center justify-between px-4 py-2 hover:bg-orange-100 hover:text-orange-600 text-gray-700 text-sm"
                          >
                            <span className="font-medium text-black">{sub.name}</span>
                            {sub.subSubCategories && sub.subSubCategories.length > 0 && (
                              <BiChevronDown size={16} className="text-gray-400 group-hover:text-orange-600" />
                            )}
                          </Link>

                          {/* Sub-Subcategories */}
                          {sub.subSubCategories && sub.subSubCategories.length > 0 && (
                            <ul className="ml-4 mt-1">
                              {sub.subSubCategories.map((subsub, subsubIndex) => (
                                <li key={subsubIndex}>
                                  <Link
                                    to={`/products?subsubcategory=${subsub._id}`}
                                    className="block px-4 py-1 text-gray-600 hover:bg-orange-50 hover:text-orange-500 text-sm"
                                  >
                                    {subsub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>

      {/* Search Box */}
      <SearchBox />
    </nav>
  );
};

export default Navigation;
