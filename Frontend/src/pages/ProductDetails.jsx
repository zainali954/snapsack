import React, { useEffect, useMemo, useState } from 'react'
import ImagerZoom from '../Components/ImagerZoom'
import QuantityDrop from '../Components/QuantityDrop'
import { BiHeart } from 'react-icons/bi';
import Tabs from '../Components/Tabs';
import RelatedProducts from '../Components/RelatedProducts';
import { useNavigate, useParams } from 'react-router-dom';
import { addToCart } from '../slices/cartSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchRelatedProducts } from '../slices/productSlice';
import { setOrderItems, setOrderPrice, setType } from '../slices/orderSlice';
import { addToWishlist } from '../slices/wishlistSlice';
import ScrollAnimation from '../Components/ScrollRevealAnimation';
import API from '../utils/api';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedVisualVariants, setSelectedVisualVariantss] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const fetchProduct = async () => {
        try {
            const response = await API.get(`/products/${id}`);
            setProduct(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load Product details.")
            console.error("Failed to fetch product:", error);
        }
    };


    useEffect(() => {
        fetchProduct()
    }, [id]);

    useEffect(() => {
        if (product?._id) {
            dispatch(fetchRelatedProducts(product._id))
        }
    }, [product])

    let specs
    if (product) {
        specs = {
            manufacturerName: product.manufacturerName,
            manufacturerContact: product.manufacturerContact,
            warrantyInformation: product.warrantyInformation,
            shippingDetails: product.shippingDetails,
            brand: product.brand,
            category: product.category,
            description: product.description,
            otherAttributes: product.otherAttributes
        }
    }

    const groupedAttributes = useMemo(() => {
        return product?.visualAttributes?.reduce((acc, attr) => {
            if (!acc[attr.name]) acc[attr.name] = [];
            acc[attr.name].push(attr);
            return acc;
        }, {}) || {};
    }, [product]);

    const handleAddToCart = (id) => {
        if (product?.priceDependentAttributes?.length > 0 && !selectedVariant) {
            return toast.error("Please select a variant before adding to cart.");
        }

        if (product?.visualAttributes?.length > 0 && !selectedVisualVariants.length) {
            return toast.error("Please select a visual attribute before adding to cart.");
        }

        dispatch(addToCart({
            productId: id,
            quantity,
            variant: selectedVariant?._id,
            visualAttributes: selectedVisualVariants
        }));
    };

    const handleBuy = () => {
        if (product?.priceDependentAttributes?.length > 0 && !selectedVariant) {
            return toast.error("Please select a variant before placing the order.");
        }

        if (product?.visualAttributes?.length > 0 && !selectedVisualVariants.length) {
            return toast.error("Please select a visual attribute before placing the order.");
        }

        let productPrice
        if (selectedVariant) {
            productPrice = selectedVariant.price * quantity
        } else {
            productPrice = product.basePrice * quantity
        }
        dispatch(setOrderItems([{ product, variant: selectedVariant?._id, visualAttributes: selectedVisualVariants, quantity, price: productPrice }]))
        dispatch(setOrderPrice(productPrice))
        dispatch(setType('buynow'))
        navigate('/checkout')
    }

    const HandleAddToWishlist = () => {
        dispatch(addToWishlist({ id }))
    }


    if (!product) return <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-500">No product found</div>;

    return (
        <div className="bg-white w-full mt-6 container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                {/* Carousel Section */}
                <div className="lg:col-span-2">
                    <ImagerZoom images={product.images} large={true} setVisualImage={setSelectedImage} visualImage={selectedImage} />
                </div>

                {/* Product Details */}
                <div className="lg:col-span-3">
                    <h3 className="text-2xl font-semibold">{product?.name}</h3>


                    <div className="flex flex-wrap gap-4 items-center mt-2 text-gray-600 text-sm">

                        <p className="flex items-center space-x-1">
                            <span className="text-yellow-500 text-lg">★</span>
                            <span>4.9 Ratings</span>
                        </p>
                        <div className="w-1 h-1 rounded-full bg-gray-700 hidden sm:block"></div>

                        <p className="flex items-center space-x-1">
                            <span>2.3k+</span> <span>Reviews</span>
                        </p>
                        <div className="w-1 h-1 rounded-full bg-gray-700 hidden sm:block"></div>


                        <p className="flex items-center space-x-1">
                            <span>2.9k+</span> <span>Sold</span>
                        </p>

                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {product?.tags?.map((tag, index) => (
                            <div key={index} className="px-4 py-2 text-xs bg-gray-200 text-gray-700 rounded-full mb-2 transition-all duration-200 hover:bg-orange-500 hover:text-white">
                                {tag}
                            </div>
                        ))}
                    </div>

                    <p className="text-base text-gray-700 mt-4">{product.description}</p>

                    <div className="space-y-6 mt-4">
                        {Object.entries(groupedAttributes).map(([groupName, attributes]) => (
                            <div key={groupName}>
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">{groupName}</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-2">
                                    {attributes?.map((attr, index) => (
                                        <div
                                            key={index}
                                            className={`border rounded-lg ${attr.imageUrl === selectedImage ? "border-orange-500" : "border-gray-200"}  
                                    flex flex-col items-center bg-white overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105`}
                                            onClick={() => {
                                                setSelectedVisualVariantss(prev => {
                                                    //first clone the selected variants
                                                    let updatedVariants = [...prev];

                                                    // check that selected variant group already exists or not
                                                    const existingIndex = updatedVariants.findIndex(vid =>
                                                        product.visualAttributes.find(attr => attr._id === vid)?.name === attr.name
                                                    );

                                                    if (existingIndex !== -1) {
                                                        // if exists than update that variant
                                                        updatedVariants[existingIndex] = attr._id;
                                                    } else {
                                                        // Otherwise, add new variant
                                                        updatedVariants.push(attr._id);
                                                    }

                                                    return updatedVariants;
                                                });

                                                setSelectedImage(attr.imageUrl);
                                            }}

                                        >
                                            <div className="w-full h-20 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${attr.imageUrl})` }}></div>
                                            <div className="p-2 text-center font-medium text-sm text-gray-700">{attr.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 mb-4">
                        <div>
                            {selectedVariant &&  selectedVariant.inventory < 20 &&(
                                <h4 className="text-lg font-semibold text-gray-800">
                                    Availability: <span className="text-orange-600">{selectedVariant.inventory} in stock</span>
                                </h4>
                            )}
                            {product.priceDependentAttributes?.length > 0 && (
                                <>
                                    <h4 className="text-xl font-semibold text-gray-800 my-2">Select Variant </h4>

                                    {/* **Grid for Variants** */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                                        {product?.priceDependentAttributes.map((variant, index) => (
                                            <div
                                                key={index}
                                                className={`relative border p-3 rounded-lg cursor-pointer transition-all duration-200
              ${selectedVariant === variant ? "border-orange-500 bg-orange-100" : "border-gray-300 hover:border-orange-500"}
            `}
                                                onClick={() => setSelectedVariant(variant)}
                                            >
                                                {/* **Variant Info** */}
                                                <div className="text-center mt-1">
                                                    {variant.variants.map((v, idx) => (
                                                        <p key={idx} className="text-gray-800 text-sm font-medium">{v.value}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* **Price Display** */}
                            <div className="flex flex-col md:flex-row items-baseline gap-4 ">
                                <div className="text-3xl font-bold text-black mt-4">
                                    {product.currency === 'USD' ? '$' : product.currency} {
                                        product?.priceDependentAttributes?.length > 0 && selectedVariant
                                            ? quantity * selectedVariant.price
                                            : quantity * product.basePrice
                                    }
                                </div>
                                <div className="flex flex-col md:flex-row gap-2 items-center md:items-baseline w-full">
                                    {/* Quantity Selector */}
                                    <QuantityDrop quantity={quantity} setQuantity={setQuantity} />

                                    {/* Buttons Container */}
                                    <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product._id)}
                                            className="px-6 py-2 sm:px-12 sm:py-3 w-full sm:w-auto rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base"
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={handleBuy}
                                            className="px-6 py-2 sm:px-12 sm:py-3 w-full sm:w-auto rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base"
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Bottom Buttons */}
                    <div className="mt-12">
                        <button className="flex items-center gap-1 py-2 px-4 rounded-full border border-gray-200 hover:bg-gray-200 text-gray-900 text-xs">
                            <BiHeart size={18} />
                            <span onClick={HandleAddToWishlist} className="uppercase">Add to Wishlist</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs and Related Products */}
            <div className="mt-10 p-2 md:p-6 rounded-2xl bg-gray-100">
                <ScrollAnimation>
                    <Tabs specs={specs} />
                </ScrollAnimation>
            </div>

            <RelatedProducts />
        </div>
    )
}

export default ProductDetails