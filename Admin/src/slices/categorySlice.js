import { createSlice } from "@reduxjs/toolkit";
import API from "../utils/api";
import handleAsyncCases from "../utils/handleAsync";
import createThunk from "../utils/createThunk";

const initialState = {
  categories: [],
  isLoading: false,
  error: null,
  message: null
};


export const uploadImage = createThunk("categories/uploadImage", (file) => {
    const formData = new FormData();
    formData.append("image", file);

    return API.post("/categories/upload", formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
  }, true
);
// Async thunk to delete an image from Cloudinary
export const deleteImage = createThunk('categories/deleteImage', (imageUrl) => API.delete(`/categories/delete-image/${imageUrl}`));

const constructUrl = (type, id) => {
  switch (type) {
    case 'category':
      return `/categories/main-category/${id}`;
    case 'sub-category':
      return `/categories/sub-category/${id}`;
    case 'sub-sub-category':
      return `/categories/sub-sub-category/${id}`;
    default:
      return '';
  }
};

export const fetchCategories = createThunk("categories/fetchCategories", () => API.get("/categories"), true);

export const addCategory = createThunk( "categories/addCategory", ({ newCategory, selectedCategory, selectedSubcategory, image }) => {
    const data = { name: newCategory };
    let url = selectedCategory
      ? selectedSubcategory
        ? "/categories/sub-sub-category"
        : "/categories/sub-category"
      : "/categories/main-category";

    if (selectedCategory) data.categoryId = selectedCategory;
    if (selectedSubcategory) data.subCategoryId = selectedSubcategory;

    if (image) data.image = image
    return API.post(url, data);
  }
);

export const editCategory = createThunk('categories/editCategory', ({ type, id, name }) => {
    const url = constructUrl(type, id);  // Using the helper function
    return API.put(url, { name });
  }
);

export const deleteCategory = createThunk('categories/deleteCategory', ({ type, id }) => {
    const url = constructUrl(type, id);  // Using the helper function
    return API.delete(url);
  }
);

const updateCategoryState = (state, { type, id, data }) => {

  if (type === 'category') {
    const index = state.categories.findIndex(cat => cat._id === id);
    if (index !== -1) state.categories[index] = data;
  } else if (type === 'sub-category') {
    state.categories.forEach(cat => {
      const subCatIndex = cat.subCategories.findIndex(subCat => subCat._id === id);
      if (subCatIndex !== -1) cat.subCategories[subCatIndex] = data;
    });
  } else if (type === 'sub-sub-category') {
    state.categories.forEach(cat => {
      cat.subCategories.forEach(subCat => {
        const subSubCatIndex = subCat.subSubCategories.findIndex(subSubCat => subSubCat._id === id);
        if (subSubCatIndex !== -1) subCat.subSubCategories[subSubCatIndex] = data;
      });
    });
  }
};


const deleteCategoryFromState = (state, { type, id }) => {
  if (type === 'category') {
    state.categories = state.categories.filter(cat => cat._id !== id);
  } else if (type === 'sub-category') {
    state.categories.forEach(cat => {
      cat.subCategories = cat.subCategories.filter(subCat => subCat._id !== id);
    });
  } else if (type === 'sub-sub-category') {
    state.categories.forEach(cat => {
      cat.subCategories.forEach(subCat => {
        subCat.subSubCategories = subCat.subSubCategories.filter(subSubCat => subSubCat._id !== id);
      });
    });
  }
};


const addToNestedStructure = (categories, newCategory, selectedCategory, selectedSubcategory) => {
  if (!selectedCategory) {
    // Adding a main category
    return [...categories, newCategory];
  }

  if (!selectedSubcategory) {
    // Adding a subcategory to the selected category
    return categories.map(category => {
      if (category._id === selectedCategory) {
        return {
          ...category,
          subCategories: [...category.subCategories, newCategory]
        };
      }
      return category;
    });
  }

  // Adding a sub-subcategory to the selected subcategory
  return categories.map(category => {
    if (category._id === selectedCategory) {
      return {
        ...category,
        subCategories: category.subCategories.map(subCategory => {
          if (subCategory._id === selectedSubcategory) {
            return {
              ...subCategory,
              subSubCategories: [...subCategory.subSubCategories, newCategory]
            };
          }
          return subCategory;
        })
      };
    }
    return category;
  });
};


const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    handleAsyncCases(builder, fetchCategories, (state, action) => {
      state.categories = action.payload;
    });

    handleAsyncCases(builder, addCategory, (state, action) => {
      const { newCategory, selectedCategory, selectedSubcategory } = action.meta.arg;
      state.categories = addToNestedStructure(state.categories, action.payload, selectedCategory, selectedSubcategory);
    });

    handleAsyncCases(builder, editCategory, (state, action) => {
      const {type, id} = action.meta.arg
      updateCategoryState(state, {type, id, data:action.payload});
    });

    handleAsyncCases(builder, deleteCategory, (state, action) => {
      const { id, type } = action.meta.arg
      deleteCategoryFromState(state, { type, id });
    });

    handleAsyncCases(builder, uploadImage);
    handleAsyncCases(builder, deleteImage);

  }
});
export const { resetError, resetMessage } = categorySlice.actions;
export default categorySlice.reducer;