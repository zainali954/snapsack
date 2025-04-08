import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    priceDependentAttributes: [],
};

const priceDependentAttributesSlice = createSlice({
  name: "attributes",
  initialState,
  reducers: {
    addAttribute: (state) => {
      state.priceDependentAttributes = [
        ...state.priceDependentAttributes,
        { price: "", inventory: "", variants: [{ variantName: "", value: "" }] },
      ];
    },
    removeAttribute: (state, action) => {
      state.priceDependentAttributes = state.priceDependentAttributes.filter((_, index) => index !== action.payload);
    },
    addVariant: (state, action) => {
      const { index } = action.payload;
      state.priceDependentAttributes = state.priceDependentAttributes.map((attr, i) =>
        i === index
          ? { ...attr, variants: [...attr.variants, { variantName: "", value: "" }] }
          : attr
      );
    },
    removeVariant: (state, action) => {
      const { attrIndex, varIndex } = action.payload;
      state.priceDependentAttributes = state.priceDependentAttributes.map((attr, i) =>
        i === attrIndex
          ? { ...attr, variants: attr.variants.filter((_, vIndex) => vIndex !== varIndex) }
          : attr
      );
    },
    updateAttribute: (state, action) => {
      const { index, key, value } = action.payload;
      state.priceDependentAttributes = state.priceDependentAttributes.map((attr, i) =>
        i === index ? { ...attr, [key]: value } : attr
      );
    },
    updateVariant: (state, action) => {
      const { attrIndex, varIndex, key, value } = action.payload;
      state.priceDependentAttributes = state.priceDependentAttributes.map((attr, i) =>
        i === attrIndex
          ? {
              ...attr,
              variants: attr.variants.map((variant, vIndex) =>
                vIndex === varIndex ? { ...variant, [key]: value } : variant
              ),
            }
          : attr
      );
    },
    insertPriceDependentAttributes : (state, action) => {
      state.priceDependentAttributes = action.payload
    },
    resetPriceDependentAttributes: () => initialState, // **NEW: Reset reducer**
  },
});

export const {
  addAttribute,
  removeAttribute,
  addVariant,
  removeVariant,
  updateAttribute,
  updateVariant,
  resetPriceDependentAttributes,
  insertPriceDependentAttributes,
} = priceDependentAttributesSlice.actions;

export default priceDependentAttributesSlice.reducer;
