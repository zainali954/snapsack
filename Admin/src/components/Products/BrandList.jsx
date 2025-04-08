import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBrand } from "../../slices/productSlice";
import { Link } from "react-router-dom";

const BrandList = () => {
  const { brands } = useSelector((state) => state.brands);
  const { brand, category } = useSelector((state) => state.products);
  const [localBrand, setLocalBrand] = useState(null)

  const [filteredBrands, setFilteredBrands] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const categoryBrands = brands.filter((brand) => brand.category._id === category);
    setFilteredBrands(categoryBrands);

  }, [category, brands]);
  useEffect(() => {
    setLocalBrand(brands?.find((i) => i._id === brand))
    
  }, [brand])

  return (
    <div className="bg-white mb-4 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
      <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
        <h3 className="text-lg font-medium dark:text-gray-200">Brand</h3>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div>
          <label htmlFor="brandsList" className="block font-medium text-sm text-gray-900 dark:text-gray-300">
            Brand
          </label>
          <select
            id="brandsList"
            value={localBrand?.name || ""}
            onChange={(e) => {
              const selectedItem = filteredBrands.find((item) => item.name === e.target.value);
              setLocalBrand(selectedItem)
              dispatch(setBrand(selectedItem._id));
            }}
            className="mt-1 inputStyled"
          >
            <option value="">Select an option</option>
            {filteredBrands.map((item) => (
              <option key={item._id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <Link to="/dashboard/brands" className="text-sm text-orange-400 hover:text-orange-600 cursor-pointer">
            Add brand
          </Link>
        </div>
        {brand && (
          <div className="mt-2 text-sm dark:text-zinc-300">
            Selected Brand: <strong>{ localBrand?.name}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandList;
