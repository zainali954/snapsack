import React from 'react';
import { BiHeart } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToWishlist } from '../slices/wishlistSlice';
import { toast } from 'react-toastify';

const ProductItem = ({ singleView, product }) => {
    const {user} = useSelector(state => state.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const handleNavigate = (id) => {
        navigate(`/product/${id}`);
    };

    const HandleAddToWishlist = (id) => {
        if (!user) {
            toast.warn("Please log in to add items to your wishlist.");
            return;
        }
        dispatch(addToWishlist(id));
    }
    return (
        <>
            {singleView ? (
                // Single View Layout (Image Left, Content Right)
                <div
                    className="relative bg-white hover:bg-orange-50 p-4 border border-l-0 border-t-0 border-gray-200 flex items-center gap-4 cursor-pointer"
                    
                >
                    {/* Image Section */}
                    <div onClick={() => handleNavigate(product?._id)} className="relative overflow-hidden rounded-md w-40 h-40 flex-shrink-0">
                        <img
                            loading="lazy"
                            src={product?.images[0]}
                            alt={product?.name}
                            className="w-full h-full aspect-square object-cover transition-all duration-300 ease-in-out"
                        />
                    </div>

                    {/* Product Details */}
                    <div className=" flex-1">
                        <h3 className="text-gray-700 font-semibold text-base mb-2 hover:text-red-500">
                            {product?.name}
                        </h3>

                        {/* Price Display */}
                        <div className="mt-2">
                            {product?.priceDependentAttributes?.length > 0 ? (
                                <div>
                                    <h4 className="text-gray-600 text-sm font-medium">From:</h4>
                                    <p className="text-red-500 text-lg font-semibold">
                                        {product?.currency} {product?.basePrice}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-red-500 text-lg font-semibold">
                                    {product?.currency} {product?.basePrice}
                                </p>
                            )}
                        </div>


                        {/* Wishlist Button (Inside Content) */}
                        <button onClick={() => HandleAddToWishlist(product._id)} className=" w-full bg-red-100 mt-12 flex hover:bg-red-200 items-center justify-center gap-2 py-2 px-4 text-sm transition-all">
                            <BiHeart /> Add to Wishlist
                        </button>
                    </div>
                </div>
            ) : (
                // Default Grid View Layout
                <div className="relative bg-white hover:bg-orange-50 p-4 border border-l-0 border-t-0 border-gray-200 group cursor-pointer overflow-hidden">
                    <div >
                        {/* Image Section */}
                        <div onClick={() => handleNavigate(product?._id)}  className="relative overflow-hidden rounded-md">
                            <img
                                loading="lazy"
                                src={product?.images[0]}
                                alt={product?.name}
                                className="w-full h-full aspect-square object-cover group-hover:scale-110 transition-all duration-300 ease-in-out"
                            />
                        </div>

                        {/* Product Details */}
                        <div className="p-4">
                            <h3 className="text-gray-700 font-semibold text-sm line-clamp-2 mb-2 group-hover:text-red-500">
                                {product?.name}
                            </h3>

                            {/* Price Display */}
                            <div className="mt-2">
                                {product?.priceDependentAttributes?.length > 0 ? (
                                    <div className='flex items-center gap-2'>
                                        <h4 className="text-gray-600 text-sm font-medium">From:</h4>
                                        <p className="text-red-500 text-lg font-semibold">
                                            {product?.currency} {product?.basePrice}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-red-500 text-lg font-semibold">
                                        {product?.currency} {product?.basePrice}
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Wishlist Button (Visible on Hover) */}
                    <button onClick={() => HandleAddToWishlist(product._id)} className="absolute bottom-0 left-0 w-full bg-red-100 hidden group-hover:flex hover:bg-red-200 items-center justify-center gap-2 py-2 px-4 text-sm transition-all">
                        <BiHeart /> Add to Wishlist
                    </button>
                </div>
            )}
        </>
    );
};

export default ProductItem;
