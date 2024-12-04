import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:3003";

// Thunk to fetch paginated Variations with optional search parameter
export const fetchVariations = createAsyncThunk(
  "variations/fetchVariations",
  async ({ page = 1, search = "" }) => {
    try {
      const response = await axios.get(
        `${url}/product/get_variation?page=${page}&search=${search}`
      ); 

      return { ...response.data, page }; // Return response data with the page
    } catch (error) {
      console.error("Error fetching variations:", error);
      throw error; // Rethrow to handle it in the calling function if needed
    }
  }
);
// Thunk to fetch all Variations
export const fetchAllVariations = createAsyncThunk(
  "variations/fetchAllVariations",
  async () => {
    const response = await axios.get(`${url}/product/get_variation?all=true`);
    console.log("all variations..:", response.data.variations); // Check if data is correct
    
    return response.data; // Make sure this is the correct property
  }
);


// Thunk to add a new Variation
export const addVariation = createAsyncThunk(
  "variations/addVariation",
  async (
    { variation_name, unit_id, quantity, usage, price },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${url}/product/add_variation`, {
        variation_name: variation_name,
        unit_id: unit_id,
        quantity: quantity,
        usage: usage,
        price: price,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete a Variation by ID
export const deleteVariation = createAsyncThunk(
  "variations/deleteVariation",
  async (variationId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/product/delete_variation`, {
        data: { _id: variationId },
      });
      return { variationId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update a Variation by ID
export const updateVariation = createAsyncThunk(
  "variations/updateVariation",
  async (
    { id, variation_name, unit_id, quantity, usage, price  },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`${url}/product/update_variation`, {
        id,
        variation_name,
        unit_id,
        quantity,
        usage,
        price,
      });
      return response.data;
    } catch (error) {
      // Safely handle cases where error.response or error.response.data might be undefined
      const errorMessage =
        error.response?.data?.message || "Failed to update variation";
      return rejectWithValue(errorMessage);
    }
  }
);

const variationsSlice = createSlice({
  name: "variations",
  initialState: {
    data: [], // Keep an array for Variations data
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
      // Fetch Paginated Variations
      .addCase(fetchVariations.pending, (state) => { 
        state.status = "loading";
      })
      .addCase(fetchVariations.fulfilled, (state, action) => { 
        state.status = "succeeded";
        state.data = [...action.payload.variations]; // Ensure a new array is returned for the state
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalVariations;
        state.currentPage = action.payload.currentPage; 
      })
      .addCase(fetchVariations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch all Variations
      .addCase(fetchAllVariations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllVariations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = [...action.payload.variations]; // Ensure a new array is returned for the state
      })
      .addCase(fetchAllVariations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add new Variation
      .addCase(addVariation.fulfilled, (state, action) => {
        state.data = [...state.data, action.payload]; // Add to state with a new array
      })
      .addCase(addVariation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addVariation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Delete Variation
      .addCase(deleteVariation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteVariation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (variation) => variation._id !== action.payload.variationId
        );
      })
      .addCase(deleteVariation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update Variation
      .addCase(updateVariation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateVariation.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (variation) => variation._id === action.payload.data._id
        );
        if (index !== -1) {
          state.data = [
            ...state.data.slice(0, index),
            action.payload.data,
            ...state.data.slice(index + 1),
          ]; // Create a new array to avoid mutating the existing array
        }
      })
      .addCase(updateVariation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = variationsSlice.actions;
export default variationsSlice.reducer;
