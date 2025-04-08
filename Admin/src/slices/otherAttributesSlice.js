import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  otherAttributes: [],
};

const otherAttributesSlice = createSlice({
  name: 'otherAttributes',
  initialState,
  reducers: {
    addAttribute: (state) => {
      // Adding a new attribute with only name and value fields
      state.otherAttributes.push({ name: "", value: "" });
    },
    removeAttribute: (state, action) => {
      state.otherAttributes = state.otherAttributes.filter((_, index) => index !== action.payload);
    },
    updateAttribute: (state, action) => {
      const { index, field, value } = action.payload;
      state.otherAttributes[index][field] = value;
    },
    insertOtherAttributes:(state, action)=>{
      state.otherAttributes = action.payload
    },
    resetOtherAttributes: ()=> initialState,
  },

});

export const {
  addAttribute,
  removeAttribute,
  updateAttribute,
  resetOtherAttributes,
  insertOtherAttributes
} = otherAttributesSlice.actions;

export default otherAttributesSlice.reducer;
