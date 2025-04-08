import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  addAttribute, 
  removeAttribute, 
  addVariant, 
  removeVariant, 
  updateAttribute, 
  updateVariant 
} from "../../slices/PriceDependentSlice";
import { Cancel01Icon, Delete02Icon } from "hugeicons-react";

const PriceDependentAttributes = () => {
  const dispatch = useDispatch();
  const {priceDependentAttributes} = useSelector((state) => state.priceDependentAttributes);

  return (
    <div className="bg-white mb-4 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
      <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
        <h3 className="text-lg font-semibold dark:text-gray-200">Price-Dependent Attributes</h3>
      </div>
      <div className="p-4">
        {priceDependentAttributes.map((attribute, index) => (
          <div key={index} className="relative mb-4 p-4 border border-gray-200 dark:border-zinc-700 rounded-sm">
            {/* Remove Attribute */}
            <button type="button"
              onClick={() => dispatch(removeAttribute(index))}
              className="absolute top-2 right-2 cancelBtn"
            >
              <Cancel01Icon size={16} />
            </button>

            {/* Variants */}
            <h3 className="block font-medium text-sm text-gray-900 dark:text-gray-300 mb-2">Variants</h3>
            {attribute.variants.map((variant, varIndex) => (
              <div key={varIndex} className="relative mb-4 flex gap-2 items-center">
                <div className="w-1/2">
                  <input
                    type="text"
                    placeholder="Variant Name"
                    value={variant.variantName}
                    onChange={(e) => dispatch(updateVariant({ attrIndex: index, varIndex, key: "variantName", value: e.target.value }))}
                    className="inputStyled"
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    placeholder="Value"
                    value={variant.value}
                    onChange={(e) => dispatch(updateVariant({ attrIndex: index, varIndex, key: "value", value: e.target.value }))}
                    className="inputStyled"
                  />
                </div>

                {/* Remove Variant */}
                <button type="button"
                  onClick={() => dispatch(removeVariant({ attrIndex: index, varIndex }))}
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm shadow-md transition-all flex items-center"
                >
                  <Delete02Icon size={20} />
                  <div className="hidden ml-2 md:block">Remove</div>
                </button>
              </div>
            ))}

            <button type="button"
              onClick={() => dispatch(addVariant({ index }))}
              className="text-orange-500 hover:underline text-sm"
            >
              + Add Variant
            </button>

            {/* Inventory */}
            <div className="mt-4">
              <label className="block font-medium text-sm text-gray-900 dark:text-gray-300">Inventory</label>
              <input
                type="text"
                placeholder="e.g., 100 pieces"
                value={attribute.inventory}
                onChange={(e) => dispatch(updateAttribute({ index, key: "inventory", value: e.target.value }))}
                className="mt-1 inputStyled"
              />
            </div>

            {/* Price Impact */}
            <div className="mt-4">
              <label className="block font-medium text-sm text-gray-900 dark:text-gray-300">Price Impact</label>
              <input
                type="text"
                placeholder="e.g., 12000 PKR"
                value={attribute.price}
                onChange={(e) => dispatch(updateAttribute({ index, key: "price", value: e.target.value }))}
                className="mt-1 inputStyled"
              />
            </div>
          </div>
        ))}

        <button type="button"
          onClick={() => dispatch(addAttribute())}
          className="buttonStyled"
        >
          + Add Attribute
        </button>
      </div>
    </div>
  );
};

export default PriceDependentAttributes;
