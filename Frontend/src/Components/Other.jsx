import React from 'react';

const OtherAttributes = ({ attributes }) => {
    return (
        <div className="p-4 sm:p-6 bg-white border border-gray-200 mt-4 sm:mt-6 rounded-lg">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                General Product Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {attributes?.map((attribute, index) => (
                    <div key={index} className="p-3 sm:p-4 bg-gray-100 border border-gray-200 rounded-md">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700">{attribute.name}</h3>
                        <p className="text-sm sm:text-base text-gray-600">{attribute.value}</p>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default OtherAttributes;
