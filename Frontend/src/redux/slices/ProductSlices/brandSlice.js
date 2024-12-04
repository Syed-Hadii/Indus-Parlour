import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:3003";

// Thunk to fetch paginated brands with optional search parameter
export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async ({ page = 1, search = "" }) => {
    try {
      const response = await axios.get(
        `${url}/product/get_brand?page=${page}&search=${search}`
      );
      console.log("Fetched data:", response.data); // Log the entire response data

      return { ...response.data, page }; // Return response data with the page
    } catch (error) {
      console.error("Error fetching brands:", error);
      throw error; // Rethrow to handle it in the calling function if needed
    }
  }
);

// Thunk to fetch all brands
export const fetchAllBrands = createAsyncThunk(
  "brands/fetchAllBrands",
  async () => {
    const response = await axios.get(`${url}/product/get_brand?all=true`);
    console.log("all brnads:", response.data.brands);
    
    return response.data.brands;
  }
);

// Thunk to add a new brand
export const addBrand = createAsyncThunk(
  "brands/addBrand",
  async ({ category_id, brand_name }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/product/add_brand`, {
        category_id: category_id,
        brand_name: brand_name,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete a brand by ID
export const deleteBrand = createAsyncThunk(
  "brands/deleteBrand",
  async (brandId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/product/delete_brand`, {
        data: { id: brandId },
      });
      return { brandId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update a brand by ID
export const updateBrand = createAsyncThunk(
  "brands/updateBrand",
  async ({ id, brand_name }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/product/update_brand`, {
        id,
        brand_name,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const brandsSlice = createSlice({
  name: "brands",
  initialState: {
    data: [], // Keep an array for brands data
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
      // Fetch Paginated Brands
      .addCase(fetchBrands.pending, (state) => {
        console.log("Fetching brands: pending");
        state.status = "loading";
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        console.log("Brands fetched successfully:", action.payload.brands);
        state.status = "succeeded";
        state.data = [...action.payload.brands]; // Ensure a new array is returned for the state
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalBrands;
        state.currentPage = action.payload.currentPage;
        console.log("Updated state after fetching brands:", {
          data: state.data,
          totalPages: state.totalPages,
          totalItems: state.totalItems,
          currentPage: state.currentPage,
        });
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch all brands
      .addCase(fetchAllBrands.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllBrands.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = [...action.payload]; // Ensure a new array is returned for the state
      })
      .addCase(fetchAllBrands.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add new brand
      .addCase(addBrand.fulfilled, (state, action) => {
        state.data = [...state.data, action.payload]; // Add to state with a new array
      })
      .addCase(addBrand.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Delete brand
      .addCase(deleteBrand.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (brand) => brand._id !== action.payload.brandId
        );
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      // Update brand
      .addCase(updateBrand.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (brand) => brand._id === action.payload.data._id
        );
        if (index !== -1) {
          state.data = [
            ...state.data.slice(0, index),
            action.payload.data,
            ...state.data.slice(index + 1),
          ]; // Create a new array to avoid mutating the existing array
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = brandsSlice.actions;
export default brandsSlice.reducer;
