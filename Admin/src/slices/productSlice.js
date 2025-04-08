import {  createSlice } from '@reduxjs/toolkit';
import API from '../utils/api';
import createThunk from '../utils/createThunk';
import handleAsyncCases from '../utils/handleAsync';
const initialState = {
  isLoading: false,
  message: "",
  error: "",
  products: [],
  searchedProducts: [],
  stats: {},
  attributes: [],
  name: "",
  description: "",
  basePrice: "",
  currency: "PKR",
  category: "",
  subcategory: null,
  subsubcategory: null,
  brand: "",
  shippingDetails: {
    weight: "",
    weightUnit: "kg",
    height: "",
    heightUnit: "cm",
    length: "",
    lengthUnit: "cm",
    width: "",
    widthUnit: "cm",
    option: "Standard",
    available_in: [],
  },
  countries: ["US", "UK", "Pakistan", "India", "Canada"],
  tags: [],
  manufacturerName: "",
  manufacturerContact: "",
  images: [],
  productToEdit: false, // if true indicating editing can be done

};

export const addProduct = createThunk("products/addProduct", (formData) => API.post('/products/new', formData, {
  headers: { "Content-Type": "multipart/form-data" }
}));
export const editProduct = createThunk("products/editProduct", ({ id, formData }) => API.put(`/products/edit/${id}`, formData, {
  headers: { "Content-Type": "multipart/form-data" }
}));
export const deleteProduct = createThunk("products/deleteProduct", (id) => API.delete(`/products/${id}`));
export const deleteProductImage = createThunk("products/deleteImage",
  ({ productId, imageUrl }) => API.delete(`/products/delete-image/${productId}`, {
    data: { imageUrl },
  }));
export const fetchProducts = createThunk("products/fetchProducts", () => API.get("/products"), true);
export const refreshProducts = createThunk("products/refreshProducts", () => API.get("/products"));
export const searchProducts = createThunk("products/searchProducts", ({ type, value }) => API.get(`/products/search?type=${type}&value=${value}`));
export const fetchStats = createThunk("products/fetchStats", () => API.get(`/products/stats`), true);
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
      state.error = null;
    },
    setName: (state, action) => {
      state.name = action.payload;
      state.formDirty = true;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
      state.formDirty = true;
    },
    setBasePrice: (state, action) => {
      state.basePrice = action.payload;
      state.formDirty = true;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
      state.formDirty = true;
    },
    setBrand: (state, action) => {
      state.brand = action.payload;
      state.formDirty = true;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
      state.formDirty = true;
    },
    setSubCategory: (state, action) => {
      state.subcategory = action.payload;
      state.formDirty = true;
    },
    setSubSubCategory: (state, action) => {
      state.subsubcategory = action.payload;
      state.formDirty = true;
    },
    setShippingDetails: (state, action) => {
      state.shippingDetails = { ...state.shippingDetails, ...action.payload };
      state.formDirty = true;
    },
    setCountries: (state, action) => {
      state.countries = action.payload;
      state.formDirty = true;
    },

    addTag: (state, action) => {
      state.tags = [...state.tags, action.payload];
      state.formDirty = true;
    },
    insertTags: (state, action) => {
      state.tags = action.payload
    },

    removeTag: (state, action) => {
      state.tags = state.tags.filter((_, i) => i !== action.payload);
    },
    setManufacturerName: (state, action) => {
      state.manufacturerName = action.payload;
      state.formDirty = true;
    },
    setManufacturerContact: (state, action) => {
      state.manufacturerContact = action.payload;
      state.formDirty = true;
    },
    setImages: (state, action) => {
      state.images = action.payload
    },
    setProductToEdit: (state, action) => {
      state.productToEdit = action.payload
    },
    resetProduct: (state) => {
      return {
        ...initialState,
        products: state.products, // Preserve products list
      };
    },

    resetSearchedProducts: (state) => {
      state.searchedProducts = []
    }

  },
  extraReducers: (builder) => {
    handleAsyncCases(builder, fetchProducts, (state, action) => {
      state.products = action.payload;
    });

    handleAsyncCases(builder, refreshProducts, (state, action) => {
      state.products = action.payload;
    });
    handleAsyncCases(builder, searchProducts, (state, action) => {
      state.searchedProducts = action.payload;
    });
    handleAsyncCases(builder, fetchStats, (state, action) => {
      state.stats = action.payload;
    });
    handleAsyncCases(builder, addProduct, (state, action) => {
      state.products = [...state.products, action.payload];
    });
    handleAsyncCases(builder, editProduct, (state, action) => {
      const productIndex = state.products.findIndex((p) => p._id === action.payload._id);

        if (productIndex !== -1) {
          // Update existing product
          state.products = state.products.map((product, index) =>
            index === productIndex ? action.payload.data : product
          );
        } else {
          // Add new product without mutating state
          state.products = [...state.products, action.payload.data];
        }
    });
    handleAsyncCases(builder, deleteProduct, (state, action) => {
      state.products = state.products.filter((p) => p._id !== action.meta.arg)
    });
    handleAsyncCases(builder, deleteProductImage, (state, action) => {
      const { productId, imageUrl } = action.meta.arg;
      const updatedProduct = action.payload;

      state.images = state.images.filter((img) => img !== imageUrl);

      const productIndex = state.products.findIndex((p) => p._id === updatedProduct._id);
      if (productIndex !== -1) {
        state.products[productIndex] = updatedProduct;
      }
    });
  }
});

export const { setName, setDescription, setBasePrice, setCurrency, setCategory, setSubCategory, setSubSubCategory,
  setShippingDetails, setCountries, addTag, removeTag, setManufacturerContact, setManufacturerName,
  setBrand, resetMessage, resetProduct, setImages, insertTags,
  formDirty, productToEdit, setProductToEdit, resetSearchedProducts } = productSlice.actions;
export default productSlice.reducer;
