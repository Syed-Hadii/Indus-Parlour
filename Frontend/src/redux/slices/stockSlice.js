// store/slices/unitsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:3003";

// Thunk to fetch paginated stocks with optional search parameter
export const fetchStock = createAsyncThunk(
  "stocks/fetchStock",
  async ({ page = 1, search = "" }) => {
    const response = await axios.get(
      `${url}/stock/get_stock?page=${page}&search=${search}`
    );
    console.log("All Paginated services", response.data);
    return { ...response.data, page };
  }
);
// thunk to fetch all Categories
export const fetchAllStocks = createAsyncThunk(
  "stocks/fetchAllStocks",
  async () => {
    const response = await axios.get(`${url}/stock/get_stock?all=true`);
    console.log("paginated stocks", response.data);

    return response.data.stocks;
  }
);

// Thunk to add a new category
export const addStock = createAsyncThunk(
  "stocks/addStock",
  async (newStockData, { rejectWithValue }) => {
    // Wrap parameters in a single object
    const {
      stock_product,
      stock_quantity, 
      stock_usage,
    } = newStockData;
    try {
      const response = await axios.post(`${url}/stock/add_stock`, {
        stock_product,
        stock_quantity, 
        stock_usage,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete a category by ID
export const deleteStock = createAsyncThunk(
  "stocks/deleteStock",
  async (stockId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/stock/delete_stock`, {
        data: { _id: stockId },
      });

      return { stockId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update a category by ID
export const updateStock = createAsyncThunk(
  "stocks/updateStock",
  async (
    { id, stock_product, stock_quantity, stock_usage},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`${url}/stock/update_stock`, {
        id,
        stock_product,
        stock_quantity,
        stock_usage,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const stockSlice = createSlice({
  name: "stocks",
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
      .addCase(fetchStock.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStock.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.stocks;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalStocks;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchStock.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // fetch all stocks
      .addCase(fetchAllStocks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllStocks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // Store all stocks
      })
      .addCase(fetchAllStocks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add new stock
      .addCase(addStock.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.status = "idle"; // Reset status to idle after successful add
        state.error = null; // Clear any previous error
      })
      .addCase(addStock.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addStock.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error occurred"; // Updated error handling
      })
      // delete category
      .addCase(deleteStock.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteStock.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (category) => category._id !== action.payload.stockId
        );
      })
      .addCase(deleteStock.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })

      // Update category
      .addCase(updateStock.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (category) => category._id === action.payload.data._id
        );
        if (index !== -1) {
          state.data[index] = action.payload.data; // Update the category in state
        }
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = stockSlice.actions;
export default stockSlice.reducer;
