import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, Filter } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedSubSubCategories, setSelectedSubSubCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const { categories, brands } = useSelector((state) => state.products);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryChange = (e) => {
    const { id, checked } = e.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, id] : prev.filter((cid) => cid !== id)
    );
  };

  const handleSubCategoryChange = (e) => {
    const { id, checked } = e.target;
    setSelectedSubCategories((prev) =>
      checked ? [...prev, id] : prev.filter((sid) => sid !== id)
    );
  };

  const handleSubSubCategoryChange = (e) => {
    const { id, checked } = e.target;
    setSelectedSubSubCategories((prev) =>
      checked ? [...prev, id] : prev.filter((ssid) => ssid !== id)
    );
  };

  const handleBrandChange = (e) => {
    const { id, checked } = e.target;
    setSelectedBrands((prev) =>
      checked ? [...prev, id] : prev.filter((bid) => bid !== id)
    );
  };

  const handleSubmit = () => {
    const queryParams = new URLSearchParams();
    if (minPrice > 0) queryParams.append("minPrice", minPrice);
    if (maxPrice > 0) queryParams.append("maxPrice", maxPrice);
    selectedCategories.forEach((cat) => queryParams.append("category", cat));
    selectedSubCategories.forEach((sub) => queryParams.append("subcategory", sub));
    selectedSubSubCategories.forEach((subsub) => queryParams.append("subsubcategory", subsub));
    selectedBrands.forEach((brand) => queryParams.append("brand", brand));
    navigate(`/products?${queryParams.toString()}`);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setMinPrice(0);
    setMaxPrice(0);
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedSubSubCategories([]);
    setSelectedBrands([]);
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach((input) => (input.checked = false));
    navigate("/products");
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="lg:hidden fixed top-[50%] left-4 bg-orange-500 text-white p-2 rounded shadow-md flex items-center gap-2 z-20"
        onClick={toggleSidebar}
      >
        <Filter className="w-5 h-5" />
        Filters
      </button>

      <div className={`lg:flex flex-col w-64 bg-white p-6 dark:bg-gray-800 min-h-screen   top-0 ${isOpen ? 'fixed z-20' : 'hidden'}`}>
        <SidebarContent
          categories={categories}
          brands={brands}
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          handleCategoryChange={handleCategoryChange}
          handleSubCategoryChange={handleSubCategoryChange}
          handleSubSubCategoryChange={handleSubSubCategoryChange}
          handleBrandChange={handleBrandChange}
          handleSubmit={handleSubmit}
          handleClearFilters={handleClearFilters}
          toggleSidebar={toggleSidebar}
          isOpen={isOpen}
        />
      </div>
    </>
  );
};

const SidebarContent = ({
  categories,
  brands,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  handleCategoryChange,
  handleSubCategoryChange,
  handleSubSubCategoryChange,
  handleBrandChange,
  handleSubmit,
  handleClearFilters,
  toggleSidebar,
  isOpen
}) => (
  <>
    <div className="flex justify-between items-start pb-4">
      <div></div> {/* Left placeholder, agar koi heading ya kuch aur ho toh */}
      <p
        onClick={toggleSidebar}
        className={`${isOpen ? "inline-flex" : 'hidden'} items-center gap-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full shadow transition duration-200 cursor-pointer`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Close
      </p>
    </div>



    {/* Price Filter */}
    <section className="mb-6">
      <h4 className="uppercase text-sm font-bold mb-2">Price Range</h4>
      <input
        type="number"
        value={minPrice === 0 ? "" : minPrice}
        onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
        placeholder="Min"
        className="w-full p-1 border rounded mb-2"
      />
      <input
        type="number"
        value={maxPrice === 0 ? "" : maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
        placeholder="Max"
        className="w-full p-1 border rounded"
      />
    </section>


    {/* Categories */}
    <section className="mb-6">
      <h4 className="uppercase text-sm font-bold mb-2">Categories</h4>
      <div className="h-60 overflow-y-auto space-y-2">
        {categories.map((category) => (
          <div key={category._id}>
            <div className="flex items-center">
              <input
                id={category._id}
                type="checkbox"
                onChange={handleCategoryChange}
              />
              <label htmlFor={category._id} className="ml-2 text-zinc-950">
                {category.name}
              </label>
            </div>
            {category.subCategories?.map((sub) => (
              <div key={sub._id} className="ml-4">
                <div className="flex items-center">
                  <input
                    id={sub._id}
                    type="checkbox"
                    onChange={handleSubCategoryChange}
                  />
                  <label htmlFor={sub._id} className="ml-2 text-zinc-800 text-base">
                    {sub.name}
                  </label>
                </div>
                {sub.subSubCategories?.map((subsub) => (
                  <div key={subsub._id} className="ml-8 flex items-center">
                    <input
                      id={subsub._id}
                      type="checkbox"
                      onChange={handleSubSubCategoryChange}
                    />
                    <label htmlFor={subsub._id} className="ml-2 text-zinc-600 text-sm">
                      {subsub.name}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>

    {/* Brand Filter */}
    <section className="mb-6">
      <h4 className="uppercase text-sm font-bold mb-2">Brands</h4>
      <div className="h-40 overflow-y-auto space-y-2">
        {brands.map((brand) => (
          <div key={brand._id} className="flex items-center">
            <input id={brand._id} type="checkbox" onChange={handleBrandChange} />
            <label htmlFor={brand._id} className="ml-2">{brand.name}</label>
          </div>
        ))}
      </div>
    </section>

    {/* Actions */}
    <button onClick={handleSubmit} className="bg-orange-500 text-white p-2 rounded w-full">
      Apply Filters
    </button>
    <button
      onClick={handleClearFilters}
      className="bg-gray-400 text-white p-2 rounded w-full mt-2"
    >
      Clear Filters
    </button>
  </>
);


export default Sidebar;
