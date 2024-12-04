// store/slices/unitsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:3003";

// Thunk to fetch paginated new_purchases with optional search parameter
export const fetchPurchase = createAsyncThunk(
  "new_purchases/fetchPurchase",
  async ({ page = 1, search = "" }) => {
    const response = await axios.get(
      `${url}/purchase/get_purchase?page=${page}&search=${search}`
    );
    console.log(" Paginated services", response.data);
    return { ...response.data, page };
  }
);
// thunk to fetch all Categories
export const fetchAllPurchases = createAsyncThunk(
  "new_purchases/fetchAllPurchases",
  async () => {
    const response = await axios.get(`${url}/purchase/get_purchase?all=true`);
    console.log("All purchases", response.data);

    return response.data.purchases;
  }
);

// Thunk to add a new category
export const addPurchase = createAsyncThunk(
  "new_purchases/addPurchase",
  async (newPurchaseData, { rejectWithValue }) => {
    // Wrap parameters in a single object
    const {
      purchase_product,
      purchase_quantity,
      purchase_price,
      purchase_usage,
    } = newPurchaseData;
    try {
      const response = await axios.post(`${url}/purchase/add_purchase`, {
        purchase_product,
        purchase_quantity,
        purchase_price,
        purchase_usage,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete a category by ID
export const deletePurchase = createAsyncThunk(
  "new_purchases/deletePurchase",
  async (purchaseId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/purchase/delete_purchase`, {
        data: { _id: purchaseId },
      });

      return { purchaseId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update a category by ID
export const updatePurchase = createAsyncThunk(
  "new_purchases/updatePurchase",
  async (
    { id, purchase_product, purchase_quantity, purchase_price },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`${url}/purchase/update_purchase`, {
        id,
        purchase_product,
        purchase_quantity,
        purchase_price,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const purchaseSlice = createSlice({
  name: "new_purchases",
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
      .addCase(fetchPurchase.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPurchase.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.purchases;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalPurchases;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchPurchase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // fetch all new_purchases
      .addCase(fetchAllPurchases.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllPurchases.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // Store all new_purchases
      })
      .addCase(fetchAllPurchases.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add new purchase
      .addCase(addPurchase.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.status = "idle"; // Reset status to idle after successful add
        state.error = null; // Clear any previous error
      })
      .addCase(addPurchase.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPurchase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error occurred"; // Updated error handling
      })
      // delete category
      .addCase(deletePurchase.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (category) => category._id !== action.payload.purchaseId
        );
      })
      .addCase(deletePurchase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })

      // Update category
      .addCase(updatePurchase.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePurchase.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (category) => category._id === action.payload.data._id
        );
        if (index !== -1) {
          state.data[index] = action.payload.data; // Update the category in state
        }
      })
      .addCase(updatePurchase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = purchaseSlice.actions;
export default purchaseSlice.reducer;
