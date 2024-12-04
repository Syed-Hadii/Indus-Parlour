// store/slices/unitsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:3003";

// Thunk to fetch paginated expenses with optional search parameter
export const fetchExpense = createAsyncThunk(
  "expenses/fetchExpense",
  async ({ page = 1, search = "" }) => {
    const response = await axios.get(
      `${url}/expense/get_expense?page=${page}&search=${search}`
    );
    console.log("All Paginated services", response.data);
    return { ...response.data, page };
  }
);
// thunk to fetch all Categories
export const fetchAllExpenses = createAsyncThunk(
  "expenses/fetchAllExpenses",
  async () => {
    const response = await axios.get(`${url}/expense/get_expense?all=true`);
    console.log("paginated expenses", response.data);

    return response.data.expenses;
  }
);

// Thunk to add a new category
export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (newExpenseData, { rejectWithValue }) => {
    // Wrap parameters in a single object
    const { expense_purpose, expense_amount } = newExpenseData;
    try {
      const response = await axios.post(`${url}/expense/add_expense`, {
        expense_purpose,
        expense_amount, 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete a category by ID
export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (expenseId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/expense/delete_expense`, {
        data: { _id: expenseId },
      });

      return { expenseId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update a category by ID
export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({ id, expense_purpose, expense_amount }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/expense/update_expense`, {
        id,
        expense_purpose,
        expense_amount,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const expenseSlice = createSlice({
  name: "expenses",
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
      .addCase(fetchExpense.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpense.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.expenses;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalExpenses;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchExpense.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // fetch all expenses
      .addCase(fetchAllExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // Store all expenses
      })
      .addCase(fetchAllExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add new expense
      .addCase(addExpense.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.status = "idle"; // Reset status to idle after successful add
        state.error = null; // Clear any previous error
      })
      .addCase(addExpense.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error occurred"; // Updated error handling
      })
      // delete category
      .addCase(deleteExpense.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (category) => category._id !== action.payload.expenseId
        );
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })

      // Update category
      .addCase(updateExpense.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (category) => category._id === action.payload.data._id
        );
        if (index !== -1) {
          state.data[index] = action.payload.data; // Update the category in state
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = expenseSlice.actions;
export default expenseSlice.reducer;
