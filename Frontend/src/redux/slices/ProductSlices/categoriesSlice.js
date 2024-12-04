// store/slices/unitsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:3003";

// Thunk to fetch paginated categories with optional search parameter
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async ({ page = 1, search = "" }) => {
    const response = await axios.get(
      `${url}/product/get_category?page=${page}&search=${search}`
    );
    console.log("All Paginated Categories",response.data);
    return { ...response.data, page };
  }
);
// thunk to fetch all Categories
export const fetchAllCategories = createAsyncThunk(
  "categories/fetchAllCategories",
  async () => {
    const response = await axios.get(`${url}/product/get_category?all=true`);
   console.log("All Cates",response.data);
   
    return response.data.categories;
    
  }
);

// Thunk to add a new category
export const addCategory = createAsyncThunk(
  "categories/addCategories",
  async (newCategory, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/product/add_category`, {
        category_name: newCategory, // Send category name, not categoryId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete a category by ID
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/product/delete_category`, {
        data: { _id: categoryId },
      });

      return { categoryId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update a category by ID
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, category_name }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/product/update_category`, {
        id,
        category_name,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    data: [],
    status: "idle",
    error: null,
    totalPages: 1,
    totalItems: 0,
    currentPage: 1,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.categories;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalCategories;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // fetch all categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // Store all categories
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // add new category
      .addCase(addCategory.fulfilled, (state, action) => {
        state.data.push(action.payload); // Add the new category to the state
      })
      .addCase(addCategory.pending, (state) => {
        state.status = "loading"; // Optional: handle loading state
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.status = "failed"; // Optional: handle error state
        state.error = action.error.message; // Save error message
      })
      // delete category
      .addCase(deleteCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (category) => category._id !== action.payload.categoryId
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })

      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (category) => category._id === action.payload.data._id
        );
        if (index !== -1) {
          state.data[index] = action.payload.data; // Update the category in state
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = categoriesSlice.actions;
export default categoriesSlice.reducer;
