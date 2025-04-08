import React, { useState } from "react";
import Reviews from "./Reviews";
import OtherAttributes from "./Other";

const Tabs = ({ specs }) => {
  const [activeTab, setActiveTab] = useState("ProductDetails"); // Active tab state

  return (
    <div className="tabs-container">
      {/* Tab Buttons */}
      <ul className="flex flex-wrap text-xs sm:text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="me-2">
          <button
            onClick={() => setActiveTab("ProductDetails")}
            className={`inline-block px-3 sm:px-4 py-2 sm:py-3 rounded-full transition ${
              activeTab === "ProductDetails"
                ? "text-orange-600 bg-white dark:bg-gray-800 dark:text-orange-500"
                : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Product Details
          </button>
        </li>

        <li className="me-2">
          <button
            onClick={() => setActiveTab("Reviews")}
            className={`inline-block px-3 sm:px-4 py-2 sm:py-3 rounded-full transition ${
              activeTab === "Reviews"
                ? "text-orange-600 bg-white dark:bg-gray-800 dark:text-orange-500"
                : "hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Reviews
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="mt-4 p-2 sm:p-4 bg-gray-100 dark:bg-gray-800">
        {/* Description Tab Content */}
        <div className={`${activeTab === "ProductDetails" ? "block" : "hidden"}`}>
          <div className="mt-4 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Product Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Manufacturer Details */}
              <div className="p-2 sm:p-4 bg-gray-100 border border-gray-200 rounded-md">
                <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                  Manufacturer Details
                </h4>
                <p className="text-sm sm:text-base text-gray-600">
                  <strong>Name:</strong> {specs.manufacturerName}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  <strong>Contact:</strong> {specs.manufacturerContact}
                </p>
              </div>

              {/* Shipping Details */}
              <div className="p-2 sm:p-4 bg-gray-100 border border-gray-200 rounded-md">
                <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                  Shipping Details
                </h4>
                <p className="text-sm sm:text-base text-gray-600">
                  <strong>Weight:</strong> {specs.shippingDetails.weight}{" "}
                  {specs.shippingDetails.weightUnit}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  <strong>Dimensions:</strong> {specs.shippingDetails.height}{" "}
                  {specs.shippingDetails.heightUnit} x {specs.shippingDetails.length}{" "}
                  {specs.shippingDetails.lengthUnit} x {specs.shippingDetails.width}{" "}
                  {specs.shippingDetails.widthUnit}
                </p>
              </div>

              {/* Warranty Information */}
              <div className="p-2 sm:p-4 bg-gray-100 border border-gray-200 rounded-md">
                <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                  Warranty Information
                </h4>
                <p className="text-sm sm:text-base text-gray-600">
                  {specs.warrantyInformation}
                </p>
              </div>

              {/* Product Brand */}
              <div className="p-2 sm:p-4 bg-gray-100 border border-gray-200 rounded-md">
                <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                  Product Brand
                </h4>
                <p className="text-sm sm:text-base text-gray-600">{specs.brand?.name}</p>
              </div>

              {/* Product Category */}
              <div className="p-2 sm:p-4 bg-gray-100 border border-gray-200 rounded-md">
                <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                  Product Category
                </h4>
                <p className="text-sm sm:text-base text-gray-600">{specs.category?.name}</p>
              </div>
            </div>
          </div>
          <OtherAttributes attributes={specs.otherAttributes} />
        </div>

        {/* Reviews Tab Content */}
        <div className={`${activeTab === "Reviews" ? "block" : "hidden"}`}>
          <Reviews />
        </div>
      </div>
    </div>
  );
};

export default Tabs;
