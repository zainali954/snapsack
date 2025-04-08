import React from "react";

const ProductTable = ({ productData }) => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-orange-500 mb-4">Product Details</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 dark:bg-zinc-800">
            <th className="border p-2">Field</th>
            <th className="border p-2">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Product Name</td>
            <td className="border p-2">{productData.name}</td>
          </tr>
          <tr>
            <td className="border p-2">Description</td>
            <td className="border p-2">{productData.description}</td>
          </tr>
          <tr>
            <td className="border p-2">Category</td>
            <td className="border p-2">{productData.productCategory}</td>
          </tr>
          <tr>
            <td className="border p-2">Base Price</td>
            <td className="border p-2">{productData.basePrice} {productData.currency}</td>
          </tr>
          <tr>
            <td className="border p-2">Manufacturer</td>
            <td className="border p-2">{productData.manufacturerName}</td>
          </tr>
          <tr>
            <td className="border p-2">Stock Count</td>
            <td className="border p-2">{productData.countOfStock}</td>
          </tr>
        </tbody>
      </table>

      {/* Variants Table */}
      <h3 className="text-md font-semibold mt-6">Variants</h3>
      <table className="w-full border-collapse border border-gray-300 mt-2">
        <thead>
          <tr className="bg-gray-100 dark:bg-zinc-800">
            <th className="border p-2">Price</th>
            <th className="border p-2">Inventory</th>
            <th className="border p-2">Variants</th>
          </tr>
        </thead>
        <tbody>
          {productData.priceDependentAttributes.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{item.price}</td>
              <td className="border p-2">{item.inventory}</td>
              <td className="border p-2">
                {item.variants.map((variant) => (
                  <div key={variant._id} className="text-sm">
                    {variant.variantName}: {variant.value}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Visual Attributes Table */}
      <h3 className="text-md font-semibold mt-6">Visual Attributes</h3>
      <table className="w-full border-collapse border border-gray-300 mt-2">
        <thead>
          <tr className="bg-gray-100 dark:bg-zinc-800">
            <th className="border p-2">Name</th>
            <th className="border p-2">Value</th>
            <th className="border p-2">Image</th>
          </tr>
        </thead>
        <tbody>
          {productData.visualAttributes.map((attr) => (
            <tr key={attr._id}>
              <td className="border p-2">{attr.name}</td>
              <td className="border p-2">{attr.value}</td>
              <td className="border p-2">
                <img src={attr.imageUrl} alt={attr.name} className="w-10 h-10 rounded" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
