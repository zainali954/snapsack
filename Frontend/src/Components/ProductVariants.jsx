import React, { useEffect, useState } from "react";
import QuantityDrop from "./QuantityDrop";

const ProductVariants = ({ priceDependentAttributes, selectedVariant, setSelectedVariant, basePrice, currency, quantity, setQuantity }) => {
    useEffect(() => {
        setSelectedVariant(priceDependentAttributes.length ? priceDependentAttributes[0] : null)
    }, [])
    

    const handleVariantClick = (variant) => {
        setSelectedVariant(variant);
    };


    return (
        <div className="space-y-6 mt-4">
            {/* **Availability Section** */}
            {selectedVariant && (
                <h4 className="text-lg font-semibold text-gray-800">
                    Availability: <span className="text-orange-600">{selectedVariant.inventory} in stock</span>
                </h4>
            )}

            {priceDependentAttributes.length > 0 && (
                <>
                    <h4 className="text-xl font-semibold text-gray-800">Select Variant </h4>

                    {/* **Grid for Variants** */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {priceDependentAttributes.map((variant, index) => (
                            <div
                                key={index}
                                className={`relative border p-3 rounded-lg cursor-pointer transition-all duration-200
              ${selectedVariant === variant ? "border-orange-500 bg-orange-100" : "border-gray-300 hover:border-orange-500"}
            `}
                                onClick={() => handleVariantClick(variant)}
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
                    {currency === 'USD' ? '$' : currency} {
                        priceDependentAttributes.length > 0 && selectedVariant
                            ? quantity * selectedVariant.price
                            : quantity * basePrice
                    }
                </div>
                <QuantityDrop quantity={quantity} setQuantity={setQuantity} />
            
            </div>
        </div>
    );
};

export default ProductVariants;
