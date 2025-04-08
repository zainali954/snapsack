import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductItem from "./ProductItem";
import ScrollAnimation from "./ScrollRevealAnimation";

const NewProductsShowcase = () => {
    const { products } = useSelector(state => state.products)

    return (
        <div className="container mx-auto mt-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="uppercase text-xl font-bold text-gray-800 font-dosis">Our Products</h2>
                    <p className="text-sm font-medium text-gray-500">Explore our products..</p>
                </div>
                <Link to={'/products'} className="rounded-full px-4 py-2 border border-gray-300 text-sm text-gray-400 hover:text-gray-600">
                    View All
                </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5  mt-4 border border-b-0 border-r-0 border-gray-200 mb-8">
                {products?.slice(0, 10).map((product, index) => (
                <ScrollAnimation key={`new-${product._id}+${index}`}>
                    <ProductItem  product={product} />
                </ScrollAnimation>
                ))}
            </div>
        </div>
    );
};

export default NewProductsShowcase;
