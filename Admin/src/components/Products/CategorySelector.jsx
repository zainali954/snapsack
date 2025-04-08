import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCategory, setSubCategory, setSubSubCategory } from "../../slices/productSlice";
import { Link } from "react-router-dom";

const CategorySelector = () => {
    const { categories } = useSelector((state) => state.categories);
    const { category, subcategory, subsubcategory } = useSelector((state) => state.products);
    const dispatch = useDispatch();
    
    const handleCategoryChange = (e) => {
        const category = e.target.value;
        dispatch(setCategory(category)); // Reset product category on category change
        dispatch(setSubCategory("")); // Reset product category on category change
        dispatch(setSubSubCategory("")); // Reset product category on category change
    };

    const handleSubcategoryChange = (e) => {
        const subcategory = e.target.value;
        dispatch(setSubCategory(subcategory)); // Reset product category on subcategory change
        dispatch(setSubSubCategory("")); // Reset product category on subcategory change
    };

    const handleItemChange = (e) => {
        const item = e.target.value;
        dispatch(setSubSubCategory(item)); // Set product category
    };

    const getSubcategories = () => {
        const selectedCategory = categories.find((cat) => cat._id === category);
        return selectedCategory ? selectedCategory.subCategories : [];
    };
    
    const getItems = () => {
        const selectedSubcategory = getSubcategories().find((subCat) => subCat._id === subcategory);
        return selectedSubcategory ? selectedSubcategory.subSubCategories : [];
    };
    

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 mb-4">
            <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
                <h3 className="text-lg font-medium dark:text-gray-200">Category</h3>
            </div>
            <div className="p-4">
                {/* Category Listbox */}
                <div className="">
                    <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                        Category
                    </label>
                    <select
                        id="categoryList"
                        value={category || ""}
                        onChange={handleCategoryChange}
                        className="mt-1 inputStyled"
                    >
                        <option value="" disabled>Select a category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Subcategory Listbox */}
                {category && (
                    <div className="my-4">
                        <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                            Subcategory
                        </label>
                        <select
                            id="subcategoryList"
                            value={subcategory || ""}
                            onChange={handleSubcategoryChange}
                            className="mt-1 inputStyled"
                        >
                            <option value="" disabled>Select a subcategory</option>
                            {getSubcategories().map((subcat) => (
                                <option key={subcat._id} value={subcat._id}>
                                    {subcat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Items Listbox */}
                {subcategory && (
                    <div className="">
                        <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                            Item
                        </label>
                        <select
                            id="itemList"
                            value={subsubcategory || ""}
                            onChange={handleItemChange}
                            className="mt-1 inputStyled"
                        >
                            <option value="" disabled>Select an item</option>
                            {getItems().map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <Link to="/dashboard/categories" className="text-sm text-orange-400 hover:text-orange-600 cursor-pointer">
                    Add category
                </Link>

               
            </div>
        </div>
    );
};

export default CategorySelector;
