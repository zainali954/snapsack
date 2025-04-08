import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api";
import createThunk from "../utils/createThunk";
import handleAsyncCases from "../utils/handleAsync";
import { setError, setSuccess } from "./notificationSlice";

export const fetchBrands = createThunk("brands/fetchBrands", () => API.get("/brands"), true);
export const fetchCategories = createThunk("brands/fetchCategories", () => API.get("/categories/nonest"), true);
export const createOrUpdateBrand = createAsyncThunk(
  "brands/createOrUpdateBrand",
  async ({ brandName, categoryId, editingBrand }, { dispatch, rejectWithValue }) => {
    try {
      if (editingBrand) {
        // Update brand
        const response = await API.put(
          `/brands/${editingBrand._id}`,
          { name: brandName, category: categoryId }
        );
        if (response.data?.success) {
          dispatch(setSuccess(response.data.message))
          return response.data;
        } else {
          
          return rejectWithValue(response.data.message || "Unknown error occurred");
        }
      } else {
        // Create brand
        const response = await API.post("/brands", {
          name: brandName,
          category: categoryId,
        });
        if (response.data?.success) {
          dispatch(setSuccess(response.data.message))
          return response.data;
        } else {
          return rejectWithValue(response.data.message || "Unknown error occurred");
        }
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.message || error.message))
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteBrand = createThunk("brands/deleteBrand", (brandId) => API.delete(`/brands/${brandId}`));

const brandsSlice = createSlice({
  name: "brands",
  initialState: {
    brands: [],
    categories: [],
    isLoading: false,
    error: null,
    message: null,
  },
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    handleAsyncCases(builder, fetchBrands, (state, action) => {
      state.brands = action.payload;
    });

    handleAsyncCases(builder, fetchCategories, (state, action) => {
      state.categories = action.payload;
    });


    handleAsyncCases(builder, deleteBrand, (state, action) => {
      state.brands = state.brands.filter((brand) => brand._id !== action.meta.arg);
    });

    handleAsyncCases(builder, createOrUpdateBrand, (state, action) => {
      if (action.meta.arg.editingBrand) {
        state.brands = state.brands.map((brand) =>
          brand._id === action.payload.data._id ? action.payload.data : brand
        );
      } else {
        state.brands = [...state.brands, action.payload.data];
      }
    });
  },
});

export const { resetMessage, resetError } = brandsSlice.actions;

export default brandsSlice.reducer;