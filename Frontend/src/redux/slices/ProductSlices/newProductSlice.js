import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:3003";

// Thunk to fetch paginated Products with optional search parameter
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1, search = "" }) => {
    try {
      const response = await axios.get(
        `${url}/product/get_product?page=${page}&search=${search}`
      );
console.log("Paginated Products:", response.data);

      return { ...response.data, page }; // Return response data with the page
    } catch (error) {
      console.error("Error fetching Products:", error);
      throw error; // Rethrow to handle it in the calling function if needed
    }
  }
);

// Thunk to fetch all products
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async () => {
    const response = await axios.get(`${url}/product/get_product?all=true`);
    console.log("all Products:", response.data)
    return response.data.products;
  }
);

// Thunk to add a new Product
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (
    {   category_id, brand_id, product_name, variation_id },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${url}/product/add_product`, {
        category_id: category_id,
        brand_id: brand_id,
        product_name: product_name,
        variation_id: variation_id, 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete a Product by ID
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/product/delete_product`, {
        data: { _id: productId },
      });
      return { productId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update a Product by ID
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (
    { id,   brand_id, product_name, variation_id },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`${url}/product/update_product`, {
        id, 
        brand_id,
        product_name,
        variation_id,
      });
      return response.data;
    } catch (error) {
      // Safely handle cases where error.response or error.response.data might be undefined
      const errorMessage =
        error.response?.data?.message || "Failed to update Product";
      return rejectWithValue(errorMessage);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    data: [], // Keep an array for Products data
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
      // Fetch Paginated Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.product; // Ensure a new array is returned for the state
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalProducts;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch all Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = [...action.payload]; // Ensure a new array is returned for the state
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add new Product
      .addCase(addProduct.fulfilled, (state, action) => {
        state.data = [...state.data, action.payload]; // Add to state with a new array
      })
      .addCase(addProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (product) => product._id !== action.payload.productId
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (product) => product._id === action.payload.data._id
        );
        if (index !== -1) {
          state.data = [
            ...state.data.slice(0, index),
            action.payload.data,
            ...state.data.slice(index + 1),
          ]; // Create a new array to avoid mutating the existing array
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = productsSlice.actions;
export default productsSlice.reducer;
