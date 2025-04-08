import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ProductItem from "./ProductItem";
import ScrollAnimation from "./ScrollRevealAnimation";

const ProductCarousel = () => {
    const { featuredProducts } = useSelector(state => state.products);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const itemsPerPage = window.innerWidth < 640 ? 1 : 5; // Adjust for mobile responsiveness

    const handleTransitionEnd = () => {
        setIsTransitioning(false);
    };

    useEffect(() => {
        if (isTransitioning) {
            const timer = setTimeout(() => {
                handleTransitionEnd();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    const nextSlide = () => {
        if (!isTransitioning && currentIndex < featuredProducts.length - itemsPerPage) {
            setCurrentIndex(prev => prev + 1);
            setIsTransitioning(true);
        }
    };

    const prevSlide = () => {
        if (!isTransitioning && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setIsTransitioning(true);
        }
    };

    return (
        <div className="container mx-auto mt-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 font-dosis">Best Selling Products</h2>
                <Link to={'/products'} className="rounded-full px-4 py-2 border border-gray-300 text-sm text-gray-400 hover:text-gray-600">
                    View All
                </Link>
            </div>
            <div className="relative w-full mt-4 border border-gray-100 overflow-hidden">
                <div className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${(currentIndex * 100) / itemsPerPage}%)` }}
                    onTransitionEnd={handleTransitionEnd}>
                    {featuredProducts.map((product, index) => (
                        <div key={product._id} className="flex-shrink-0 w-full sm:w-1/5">
                            <ScrollAnimation>
                                <ProductItem key={product._id} product={product} />
                            </ScrollAnimation>
                        </div>
                    ))}
                </div>
                <button className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white shadow-lg p-2 rounded-full focus:outline-none hover:bg-gray-200" onClick={prevSlide}>
                    &#8592;
                </button>
                <button className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white shadow-lg p-2 rounded-full focus:outline-none hover:bg-gray-200" onClick={nextSlide}>
                    &#8594;
                </button>
            </div>
        </div>
    );
};

export default ProductCarousel;
