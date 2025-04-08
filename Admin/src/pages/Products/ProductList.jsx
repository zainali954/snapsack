import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductDetails from "../../components/ProductDetails";
import { deleteProduct, fetchStats, refreshProducts, resetSearchedProducts, searchProducts, } from "../../slices/productSlice";
import { Cancel01Icon, Delete02Icon, RefreshIcon, Search01Icon, ViewIcon, } from "hugeicons-react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, searchedProducts, stats, } = useSelector((state) => state.products);

  // State Management
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");

  // Fetch statistics if not already loaded
  useEffect(() => {
    if (!stats || Object.keys(stats).length === 0) {
      dispatch(fetchStats());
    }
  }, [dispatch, stats]);

  // Handlers
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleProductDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleSearch = () => {
    dispatch(searchProducts({ type: searchType, value: searchTerm }));
  };

  const handleClear = () => {
    dispatch(resetSearchedProducts());
    setSearchTerm("");
  };
  const handleRefresh = () =>{
    dispatch(refreshProducts())
  }
  return (
    <div className="">
      <ProductDetails Open={open} setOpen={setOpen} product={selectedProduct} />

      <div className="flex items-center justify-between bg-white mb-4 dark:bg-zinc-900  border border-gray-200 dark:border-zinc-700 p-4">
        <h3 className="text-xl font-medium dark:text-gray-200">Products</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 px-3 py-1.5 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"

          >
            <RefreshIcon size={14} />
            Refresh
          </button>
          <Link to={'/products/add-product'}
            className="buttonStyled"
          >
            Add new
          </Link>
        </div>
      </div>


      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="p-4 bg-white dark:bg-zinc-900  border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Products</h3>
            <p className="text-2xl font-bold text-orange-500">{stats.totalProducts}</p>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-900  border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Available</h3>
            <p className="text-2xl font-bold text-green-500">{stats.availableProducts}</p>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-900  border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Out of Stock</h3>
            <p className="text-2xl font-bold text-red-500">{stats.outOfStockProducts}</p>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-900  border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Categories</h3>
            <p className="text-2xl font-bold text-blue-500">{stats.totalCategories}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900  border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Featured Products</h3>
            <p className="text-2xl font-bold text-pink-500">{stats.featuredProducts}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900  border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Average Rating</h3>
            <p className="text-2xl font-bold text-yellow-500">{stats.avgRating}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4 mb-4">
          {/* Search Type Dropdown */}
          <div className="relative">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-orange-500"
            >
              <option value="name">Search by Name</option>
              <option value="id">Search by ID</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={`Enter ${searchType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-500"
            />
            <Search01Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
          </div>

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

        <div className="max-w-full w-full overflow-auto">
          <table className="min-w-full bg-white dark:bg-zinc-900 border dark:border-zinc-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-zinc-800 dark:text-gray-300 border-b dark:border-zinc-700">
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">#</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Variants</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Stock</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Brand</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Category</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Featured</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="dark:text-zinc-400">
              {(searchedProducts.length > 0 ? searchedProducts : products).map((product, index) => (
                <tr
                  key={product._id}
                  className={`cursor-pointer transition ${selectedProduct?._id === product?._id
                    ? "bg-orange-50 dark:bg-[#f974160a] border-l-4 border-orange-500 border-b border-b-gray-200 dark:border-b-zinc-700"
                    : "hover:bg-gray-50 dark:hover:bg-zinc-800 dark:border-zinc-700 border-b border-zinc-200"
                    }`}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">{product.priceDependentAttributes?.length}</td>
                  <td className={`py-3 px-4 ${product.countOfStock === 0 && 'text-red-600'}`}>{product.countOfStock}</td>
                  <td className="py-3 px-4">{product.status}</td>
                  <td className="py-3 px-4">{product.brand?.name}</td>
                  <td className="py-3 px-4">{product.category?.name}</td>
                  <td className="py-3 px-4">{product.isFeatured ? 'yes' : 'No'}</td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <button
                      className="p-1.5 rounded-md border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-blue-600 text-blue-500"
                      onClick={() => handleProductClick(product)}
                    >
                      <ViewIcon size={18} />
                    </button>

                    <button
                      className="ml-1 p-1.5 rounded-md border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-red-600 text-red-500"
                      onClick={() => handleProductDelete(product._id)}
                    >
                      <Delete02Icon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {products.length === 0 && <p className="py-2 text-center text-gray-400">No Product found</p>}
      </div>


    </div>
  );
};

export default ProductList;
