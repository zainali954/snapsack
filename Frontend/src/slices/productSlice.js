import { createSlice } from "@reduxjs/toolkit";
import API from "../utils/api";
import createThunk from "../utils/createThunk";
import handleAsyncCases from "../utils/handleAsync";

const initialState = {
  featuredProducts: [],
  products: [],
  relatedProducts: [],
  categories: [],
  brands: [],
  offers:[],
  isLoading: false,
};

export const fetchProducts = createThunk("products/fetchProducts", (search) => {
  const query = search ? `/products${search}` : "/products";
  return API.get(query);
}, true);
export const fetchFeaturedProducts = createThunk("products/fetured", ()=> API.get("/products/featured"), true);
export const fetchRelatedProducts = createThunk("products/fetchRelatedProducts", (id)=> API.get(`/products/related-products/${id}`), true);
export const fetchCategories = createThunk("categories/fetchCategories", ()=> API.get("/categories"), true);
export const fetchBrands = createThunk("brands/fetchBrands", ()=> API.get("/brands"), true);
export const fetchOffers = createThunk("Offers/fetchOffers", ()=> API.get("/website/offers"), true);

// Products Slice
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter((product) => product.id !== action.payload);
    },
    resetProductsState: (state) => {
      state.products = [];
      state.categories = [];
      state.brands = [];
      state.featuredProducts = [];
    },
  },
  extraReducers: (builder) => {
      // Fetch Products
      handleAsyncCases(builder, fetchProducts, (state, action) => {
        state.products = action.payload;
      });
      // Fetch Feaured Products
      handleAsyncCases(builder, fetchFeaturedProducts, (state, action) => {
        state.featuredProducts = action.payload;
      });

      // Fetch Categories
      handleAsyncCases(builder, fetchCategories, (state, action) => {
        state.categories = action.payload;
      });
      
      // Fetch Brands
      handleAsyncCases(builder, fetchBrands, (state, action) => {
        state.brands = action.payload;
      });

       // Fetch related products
       handleAsyncCases(builder, fetchRelatedProducts, (state, action) => {
        state.relatedProducts = action.payload;
      });

      handleAsyncCases(builder, fetchOffers, (state, action) => {
        state.offers = action.payload;
      });
  },
});

export const { setProducts, addProduct, removeProduct, resetProductsState } = productsSlice.actions;
export default productsSlice.reducer;