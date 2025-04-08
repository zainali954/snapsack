import React from "react";
import {
  setName, setDescription, setBasePrice, setCurrency, setCategory,
  setShippingDetails, insertTags, setManufacturerContact, setManufacturerName,
  setBrand, setImages,
  setSubSubCategory,
  setSubCategory,
} from '../slices/productSlice'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { insertPriceDependentAttributes } from "../slices/PriceDependentSlice";
import { insertVisualAttributes } from "../slices/visualAttributesSlice";
import { insertOtherAttributes } from "../slices/otherAttributesSlice";
import { setProductToEdit } from '../slices/productSlice'

const ProductDetails = ({ Open, setOpen, product }) => {
  if (!Open) return null;

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleEdit = () => {
    if (!product) return;  // Prevent function execution if product is undefined

    dispatch(setName(product.name || ""))
    dispatch(setDescription(product.description || ""))
    dispatch(setShippingDetails(product.shippingDetails || {}))
    dispatch(setBasePrice(product.basePrice || 0))
    dispatch(setCurrency(product.currency || ""))
    dispatch(setCategory(product.category?._id || ""))
    dispatch(setSubCategory(product.subcategory?._id || ""))
    dispatch(setSubSubCategory(product.subsubcategory?._id || ""))
    dispatch(setBrand(product.brand?._id || ""))
    dispatch(setManufacturerContact(product.manufacturerContact || ""))
    dispatch(setManufacturerName(product.manufacturerName || ""))

    dispatch(insertTags(product.tags))

    dispatch(insertPriceDependentAttributes(product.priceDependentAttributes || []))
    dispatch(insertVisualAttributes(product.visualAttributes || []))
    dispatch(insertOtherAttributes(product.otherAttributes || []))
    dispatch(setImages(product.images || []));
    dispatch(setProductToEdit(true))
    // dispatch(setFormDirty())
    navigate(`/dashboard/products/edit-product/${product._id}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-6 rounded-2xl shadow-lg max-h-screen overflow-y-auto w-11/12 sm:w-3/4 lg:w-1/2">
        {!product ? (
          <div className="p-4 text-gray-500 text-center">
            Please select a product to view details.
          </div>
        ) : (
          <>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-3xl text-gray-600 hover:text-red-500"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">{product.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{product.description}</p>
            <p className="text-orange-600 dark:text-orange-400  mb-4">
              {product.category?.name} <span className="text-black dark:text-gray-300">/</span> {product.subcategory?.name} <span className="text-black dark:text-gray-300">/</span> {product.subsubcategory?.name}
            </p>



            {/* Images */}
            <div className="mt-4">
              <h4 className="font-medium text-lg mb-3 dark:text-gray-300">Product Images:</h4>
              <div className="flex gap-3 overflow-x-auto">
                {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <img key={index} src={image} alt={`Product ${index}`} className="w-24 h-24 object-cover rounded-lg border border-gray-300 shadow-sm" />
                  ))
                ) : (
                  <p className="text-gray-500">No images available</p>
                )}

              </div>
            </div>

            {/* Price & Variants */}
            <div className="mt-6">
              <p className="text-lg font-semibold dark:text-gray-300">Base Price: <span className="font-normal">{product?.basePrice} {product?.currency}</span></p>
              <h4 className="font-medium text-lg mt-4 mb-3 dark:text-gray-300">Price Dependent Variants</h4>
              <table className="w-full border border-gray-200  bg-orange-50 dark:bg-zinc-950 dark:border-red-700 text-sm rounded-lg overflow-hidden">
                <thead>
                  <tr className="border-b dark:border-zinc-700 bg-orange-100 dark:bg-zinc-800 dark:text-gray-400">
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Inventory</th>
                    <th className="px-4 py-2 text-left">Variants</th>
                  </tr>
                </thead>
                <tbody>
                  {product.visualAttributes && product.visualAttributes.length > 0 && (
                    product.priceDependentAttributes.map((variant, index) => (
                      <tr key={index} className="border-b text-gray-800 dark:text-gray-400 dark:border-zinc-700 hover:bg-[#f974160a]">
                        <td className="px-4 py-2">{variant.price}</td>
                        <td className="px-4 py-2">{variant.inventory}</td>
                        <td className="px-4 py-2">
                          <div className="space-y-1">
                            {variant.variants.map((v, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="font-medium capitalize">{v.variantName}:</span>
                                <span className="uppercase">{v.value}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )))}
                </tbody>
              </table>
            </div>

            {/* Visual Attributes */}
            {product.visualAttributes.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-lg mb-3 dark:text-gray-300">Visual Attributes</h4>
                <table className="w-full border border-gray-200 bg-orange-50 dark:bg-zinc-950 text-sm rounded-lg overflow-hidden">
                  <thead>
                    <tr className="border-b dark:border-zinc-700 bg-orange-100 dark:bg-zinc-800 dark:text-gray-400">
                      <th className="px-4 py-2 text-left">Attribute Name</th>
                      <th className="px-4 py-2 text-left">Attribute Value</th>
                      <th className="px-4 py-2 text-left">Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.visualAttributes.map((attr, index) => (
                      <tr key={index} className="border-b text-gray-800 dark:text-gray-400 dark:border-zinc-700 hover:bg-[#f974160a]">
                        <td className="px-4 py-2">{attr.name}</td>
                        <td className="px-4 py-2">{attr.value}</td>
                        <td className="px-4 py-2">
                          <img
                            src={attr.imageUrl}
                            alt={`Attr ${index}`}
                            className="w-20 h-20 object-cover rounded-md border border-gray-300 shadow-sm"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Price & Variants */}
            <div className="mt-6">
              <h4 className="font-medium text-lg mt-4 mb-3 dark:text-gray-300">Other Attributes</h4>
              <table className="w-full border border-gray-200 bg-orange-50 dark:bg-zinc-950 text-sm rounded-lg overflow-hidden">
                <thead>
                  <tr className="border-b dark:border-zinc-700 bg-orange-100 dark:bg-zinc-800 dark:text-gray-400">
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {product.otherAttributes && product.otherAttributes.length > 0 && (
                    product.otherAttributes.map((attr, index) => (
                      <tr key={index} className="border-b text-gray-800 dark:text-gray-400 dark:border-zinc-700 hover:bg-[#f974160a]">
                        <td className="px-4 py-2">{index}</td>
                        <td className="px-4 py-2">{attr.name}</td>
                        <td className="px-4 py-2">{attr.value}</td>

                      </tr>
                    )))}
                </tbody>
              </table>
            </div>

            {/* Manufacturer Info */}
            <div className="mt-6 dark:text-gray-300">
              <p className="font-medium">Manufacturer: <span className="font-normal">{product?.manufacturerName}</span></p>
              <p className="font-medium">Contact: <span className="font-normal">{product?.manufacturerContact}</span></p>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mt-6 dark:text-gray-300">
                <h4 className="font-medium mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full border border-orange-300 text-sm dark:bg-orange-900 dark:text-orange-400 dark:border-orange-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Details */}
            {product.shippingDetails && (
              <div className="mt-6 dark:text-gray-300">
                <h4 className="font-medium mb-3">Shipping Details:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><strong>Weight:</strong> {product.shippingDetails.weight} {product.shippingDetails.weightUnit}</p>
                  <p><strong>Height:</strong> {product.shippingDetails.height} {product.shippingDetails.heightUnit}</p>
                  <p><strong>Length:</strong> {product.shippingDetails.length} {product.shippingDetails.lengthUnit}</p>
                  <p><strong>Width:</strong> {product.shippingDetails.width} {product.shippingDetails.widthUnit}</p>
                </div>
              </div>
            )}
          </>
        )}
        {/* Buttons Container */}
        <div className="flex justify-end gap-2 items-center mt-4 border-t border-gray-300 pt-2">
          <button onClick={handleEdit} className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
            Edit Product
          </button>
          <button onClick={() => setOpen(false)} className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
