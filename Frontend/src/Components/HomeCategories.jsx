
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const HomeCategories = () => {
    const { categories } = useSelector((state) => state.products);

    // State for items per page and current index
    const [itemsPerPage, setItemsPerPage] = useState(4); // Default value for small screens
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Set items per page based on screen width
    const updateItemsPerPage = () => {
        if (window.innerWidth >= 1024) setItemsPerPage(8); // Large screens
        else if (window.innerWidth >= 768) setItemsPerPage(5); // Medium screens
        else setItemsPerPage(3); // Small screens
    };

    // Event listener for screen resize
    useEffect(() => {
        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);
        return () => window.removeEventListener("resize", updateItemsPerPage);
    }, []);


    const handleTransitionEnd = () => {
        setIsTransitioning(false);
    };

    useEffect(() => {
        if (isTransitioning) {
            const timer = setTimeout(() => {
                handleTransitionEnd();
            }, 500); // transition duration
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    const nextSlide = () => {
        if (!isTransitioning && currentIndex < categories.length - itemsPerPage) {
            setCurrentIndex((prev) => prev + 1);
            setIsTransitioning(true);
        }
    };

    const prevSlide = () => {
        if (!isTransitioning && currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setIsTransitioning(true);
        }
    };

    return (
        <div className="container mx-auto mt-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 font-dosis">Browse By Categories</h2>
                </div>
                {categories.length > itemsPerPage && (
                    <div className="flex gap-2">
                        <button
                            disabled={currentIndex === 0}
                            className={`shadow-md p-2 border border-gray-200 rounded-full focus:outline-none hover:bg-gray-200 ${
                                currentIndex === 0 ? "cursor-not-allowed bg-gray-200" : "bg-white"
                            }`}
                            onClick={prevSlide}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-6 h-6 text-gray-700"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            disabled={currentIndex >= categories.length - itemsPerPage}
                            className={`shadow-md p-2 border border-gray-200 rounded-full focus:outline-none hover:bg-gray-200 ${
                                currentIndex >= categories.length - itemsPerPage ? "cursor-not-allowed bg-gray-200" : "bg-white"
                            }`}
                            onClick={nextSlide}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-6 h-6 text-gray-700"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
            <div className="relative w-full mt-4">
                <div className="overflow-hidden">
                    <div
                        className={`flex transition-transform duration-500 ${isTransitioning ? "" : "transition-none"}`}
                        style={{
                            transform: `translateX(-${(currentIndex * 100) / itemsPerPage}%)`,
                        }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {categories.map((category, index) => (
                            <Link
                                to={`/products?category=${category._id}`}
                                key={index}
                                className="w-full p-4 flex-shrink-0"
                                style={{ maxWidth: `${100 / itemsPerPage}%` }}
                            >
                                <div className="p-5 w-28 h-28 flex items-center justify-center rounded-full border border-orange-300 bg-orange-100">
                                    <img
                                        loading="lazy"
                                        src={category.image}
                                        alt={category.name}
                                        className="  object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                                    />
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="text-gray-700 font-semibold text-sm line-clamp-2 mb-2">{category.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeCategories;
