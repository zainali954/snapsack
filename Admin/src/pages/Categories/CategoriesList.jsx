import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCategory, deleteCategory, deleteImage, editCategory, resetError, resetMessage, uploadImage } from '../../slices/categorySlice';
import { Delete02Icon, PencilEdit02Icon } from 'hugeicons-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const CategoriesList = () => {
    const { categories, message, error } = useSelector((state) => state.categories);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [selectedSubSubcategory, setSelectedSubSubcategory] = useState(null);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const dispatch = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();

        let imageUrl = null;

        try {
            // step-1 image upload
            if (selectedImage) {
                imageUrl = await dispatch(uploadImage(selectedImage)).unwrap()
            }
            // step-1 create Category
            const response = await dispatch(
                addCategory({
                    newCategory,
                    selectedCategory: selectedCategory?.id,
                    selectedSubcategory: selectedSubcategory?.id,
                    image: imageUrl,
                })
            ).unwrap();

            setNewCategory('');
            setSelectedImage(null);
        } catch (error) {
            console.error('Category creation failed:', error);

            // ❌ Rollback: if category create fails then delte the image
            if (imageUrl) {
                dispatch(deleteImage({ imageUrl }))
                setSelectedImage(null);
            }

            toast.error(error.message || 'Failed to add category');
        }
    };

    const handleEdit = (type, id, name) => {
        setNewCategory(name);
        setEditingCategory({ type, id });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault()
        dispatch(editCategory({...editingCategory, name:newCategory}))
    };
    const handleCancelEdit = (event) => {
        setEditingCategory(null);
        setNewCategory('');
    };

    const handleDelete = (type, id) => {
        const confirm = window.confirm("Are you sure you want to delete this category?")
        if (confirm) {
            dispatch(deleteCategory({ type, id }))
        }
    };


    useEffect(() => {
        if (message) {
            toast.success(message);
            dispatch(resetMessage());
        }
        if (error) {
            toast.error(error);
            dispatch(resetError());
        }
    }, [message, error, dispatch]);
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-900">
            <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
                <h3 className="text-lg font-semibold dark:text-gray-200">
                    Manage Categories
                </h3>
            </div>
            <div className="flex flex-col items-center p-4">
                <div className="flex flex-row space-x-4 w-full">
                    {/* Category Selection */}
                    <div className="w-1/3 border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 p-4">
                        <label className="block font-medium text-base text-gray-900 dark:text-gray-300">Parent Category</label>
                        {categories.length > 0 ? (
                            categories.map((category, index) => (
                                <div key={index}>
                                    <input
                                        type="radio"
                                        name="category"
                                        value={category.name}
                                        onChange={() => {
                                            setSelectedCategory({ id: category._id, name: category.name });
                                            setSelectedSubcategory('');
                                            setSelectedSubSubcategory('');
                                        }}
                                        className="mr-2"
                                    />
                                    <label className='dark:text-gray-300 text-base'>{category.name}</label>
                                    <button onClick={() => handleEdit('category', category?._id || '', category?.name || '')} className="ml-2 text-blue-500"><PencilEdit02Icon size={15} /></button>
                                    <button onClick={() => handleDelete("category", category._id)} className="ml-2 text-red-500"><Delete02Icon size={15} /></button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No categories available</p>
                        )}
                    </div>

                    {/* Subcategory Selection */}
                    <div className="w-1/3 border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 p-4">
                        {selectedCategory && categories.find(cat => cat.name === selectedCategory.name)?.subCategories.length > 0 ? (
                            <>
                                <label className="block font-medium text-base text-gray-900 dark:text-gray-300">Subcategory</label>
                                {categories.find(cat => cat.name === selectedCategory.name).subCategories.map((subCat, index) => (
                                    <div key={index}>
                                        <input
                                            type="radio"
                                            name="subcategory"
                                            value={subCat.name}
                                            onChange={() => {
                                                setSelectedSubcategory({ id: subCat?._id || '', name: subCat?.name || '' });
                                                setSelectedSubSubcategory('');
                                            }}
                                            className="mr-2"
                                        />
                                        <label className='dark:text-gray-300 text-base'>{subCat.name}</label>
                                        <button onClick={() => handleEdit('sub-category', subCat._id, subCat.name)} className="ml-2 text-blue-500"><PencilEdit02Icon size={15} /></button>
                                        <button onClick={() => handleDelete('sub-category', subCat._id)} className="ml-2 text-red-500"><Delete02Icon size={15} /></button>
                                    </div>
                                ))}
                            </>
                        ) : null}
                    </div>

                    {/* Sub-Subcategory Selection */}
                    <div className="w-1/3 border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 p-4">
                        {selectedSubcategory && categories.find(cat => cat.name === selectedCategory.name)?.subCategories.find(subCat => subCat.name === selectedSubcategory.name)?.subSubCategories.length > 0 ? (
                            <>
                                <label className="block font-medium text-base text-gray-900 dark:text-gray-300">Sub-Subcategory</label>
                                {categories.find(cat => cat.name === selectedCategory.name).subCategories.find(subCat => subCat.name === selectedSubcategory.name).subSubCategories.map((subSubCat, index) => (
                                    <div key={index}>
                                        <input
                                            type="radio"
                                            name="subSubcategory"
                                            value={subSubCat.name}
                                            onChange={() => setSelectedSubSubcategory({ id: subSubCat?._id || '', name: subSubCat?.name || '' })}
                                            className="mr-2"
                                        />
                                        <label className='dark:text-gray-300 text-base'>{subSubCat.name}</label>
                                        <button onClick={() => handleEdit('sub-sub-category', subSubCat._id, subSubCat.name)} className="ml-2 text-blue-500"><PencilEdit02Icon size={14} /></button>
                                        <button onClick={() => handleDelete('sub-sub-category', subSubCat._id)} className="ml-2 text-red-500"><Delete02Icon size={14} /></button>
                                    </div>
                                ))}
                            </>
                        ) : null}
                    </div>
                </div>

                {/* for editing */}
                {editingCategory ? (
                    <div className="w-full max-w-md mt-8 p-6  bg-white dark:bg-zinc-800 border dark:border-zinc-700">
                        <form onSubmit={handleEditSubmit} className="">
                            <label className="block font-medium text-sm text-gray-900 dark:text-gray-300">
                                Rename
                            </label>
                            <input
                                type="text"
                                name="newCategory"
                                placeholder='Name..'
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="mt-1 w-full px-4 py-2 text-sm dark:text-gray-200 border bg-gray-50 border-gray-200 rounded-sm dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <button
                                type="submit"
                                className="mt-4 w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-md shadow-sm hover:bg-orange-600 transition-all"
                            >
                                Submit
                            </button>
                        </form>
                        <button
                            onClick={handleCancelEdit}
                            className="mt-2 w-full px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-sm hover:bg-gray-600 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="w-full max-w-md mt-8">
                        <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-zinc-800 border dark:border-zinc-700">
                            <label className="block font-medium text-sm text-gray-900 dark:text-gray-300">
                                {selectedCategory === null
                                    ? 'Add Root Category'
                                    : !selectedSubcategory
                                        ? `Add Subcategory to ${selectedCategory?.name}`
                                        : `Add Sub-Subcategory to ${selectedSubcategory?.name}`}
                            </label>
                            {selectedCategory === null && (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setSelectedImage(e.target.files[0])}
                                    className="mt-2 w-full text-sm text-gray-900 dark:text-gray-300"
                                />
                            )}

                            <input
                                type="text"
                                name="newCategory"
                                placeholder='Name..'
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="mt-1 w-full px-4 py-2 text-sm dark:text-gray-200 border bg-gray-50 border-gray-200 rounded-sm dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <button
                                type="submit"
                                className="mt-4 w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-md shadow-sm hover:bg-orange-600 transition-all"
                            >
                                Submit
                            </button>
                        </form>
                    </div>

                )}
            </div>
        </div>
    );
};

export default CategoriesList;