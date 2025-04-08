import { createSlice } from '@reduxjs/toolkit';
import API from '../utils/api';
import createThunk from '../utils/createThunk';
import handleAsyncCases from '../utils/handleAsync';

const initialState = {
    visualAttributes: [],
    image: null,
    isLoading: false,
    message: null,
    error: null,
}
export const uploadImage = createThunk('visualAttributes/uploadImage', ({ file, index }) => {
    const formDataObject = new FormData();
    formDataObject.append('image', file);
    return API.post('/products/visual/image', formDataObject)
});
export const removeImage = createThunk('visualAttributes/removeImage', ({ imageUrl, index }) => API.delete("/products/visual/image", { data: { imageUrl } }));

const visualAttributesSlice = createSlice({
    name: 'visualAttributes',
    initialState,
    reducers: {
        addVisualAttribute: (state) => {
            state.visualAttributes.push({ name: "", value: "", imageUrl: "" });
        },
        removeVisualAttribute: (state, action) => {
            state.visualAttributes.splice(action.payload, 1);
        },
        updateVisualAttribute: (state, action) => {
            const { index, field, value } = action.payload;
            state.visualAttributes[index][field] = value;
        },
        resetState: (state) => {
            state.message = null,
                state.error = null
        },
        insertVisualAttributes: (state, action) => {
            state.visualAttributes = action.payload
        },
        resetVisualAttributes: () => initialState,
    },
    extraReducers: (builder) => {

        handleAsyncCases(builder, uploadImage, (state, action) => {
            const { index } = action.meta.arg
            state.visualAttributes[index].imageUrl = action.payload;
        });

        handleAsyncCases(builder, removeImage, (state, action) => {
            const { index } = action.meta.arg
            state.visualAttributes[index].imageUrl = "";
        });
    },
});

export const { addVisualAttribute, removeVisualAttribute, updateVisualAttribute, resetState, resetVisualAttributes, insertVisualAttributes } = visualAttributesSlice.actions;
export default visualAttributesSlice.reducer;