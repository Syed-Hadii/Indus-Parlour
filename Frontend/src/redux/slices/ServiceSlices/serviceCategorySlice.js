// store/slices/unitsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:3003";

// Thunk to fetch paginated service_categories with optional search parameter
export const fetchServiceCategories = createAsyncThunk(
  "service_categories/fetchServiceCategories",
  async ({ page = 1, search = "" }) => {
    const response = await axios.get(
      `${url}/service/get_category?page=${page}&search=${search}`
    );
    console.log("All Paginated service Categories", response.data);
    return { ...response.data, page };
  }
);
// thunk to fetch all Categories
export const fetchAllServiceCategories = createAsyncThunk(
  "service_categories/fetchAllServiceCategories",
  async () => {
    const response = await axios.get(`${url}/service/get_category?all=true`);
console.log("all service cate:", response.data);

    return response.data.service_categories;
  }
);

// Thunk to add a new category
export const addServiceCategory = createAsyncThunk(
  "service_categories/addCategories",
  async (newCategory, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/service/add_category`, {
        service_category: newCategory, // Send category name, not categoryId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete a category by ID
export const deleteServiceCategory = createAsyncThunk(
  "service_categories/deleteServiceCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/service/delete_category`, {
        data: { _id: categoryId },
      });

      return { categoryId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update a category by ID
export const updateServiceCategory = createAsyncThunk(
  "service_categories/updateServiceCategory",
  async ({ id, service_category }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/service/update_category`, {
        id,
        service_category,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const service_categoriesSlice = createSlice({
  name: "service_categories",
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
      .addCase(fetchServiceCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchServiceCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.categories;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalCategories;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchServiceCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // fetch all service_categories
      .addCase(fetchAllServiceCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllServiceCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // Store all service_categories
      })
      .addCase(fetchAllServiceCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // add new category
      .addCase(addServiceCategory.fulfilled, (state, action) => {
        state.data.push(action.payload); // Add the new category to the state
      })
      .addCase(addServiceCategory.pending, (state) => {
        state.status = "loading"; // Optional: handle loading state
      })
      .addCase(addServiceCategory.rejected, (state, action) => {
        state.status = "failed"; // Optional: handle error state
        state.error = action.error.message; // Save error message
      })
      // delete category
      .addCase(deleteServiceCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteServiceCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (category) => category._id !== action.payload.categoryId
        );
      })
      .addCase(deleteServiceCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })

      // Update category
      .addCase(updateServiceCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateServiceCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (category) => category._id === action.payload.data._id
        );
        if (index !== -1) {
          state.data[index] = action.payload.data; // Update the category in state
        }
      })
      .addCase(updateServiceCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = service_categoriesSlice.actions;
export default service_categoriesSlice.reducer;
