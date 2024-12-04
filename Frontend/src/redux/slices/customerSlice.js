// store/slices/unitsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:3003";

// Thunk to fetch paginated customers with optional search parameter
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async ({ page = 1, search = "" }) => {
    const response = await axios.get(
      `${url}/customer/get_customer?page=${page}&search=${search}`
    );
    console.log("All Paginated customer Customers", response.data);
    return { ...response.data, page };
  }
);
// thunk to fetch all Customers
export const fetchAllCustomers = createAsyncThunk(
  "customers/fetchAllCustomers",
  async () => {
    const response = await axios.get(`${url}/customer/get_customer?all=true`); 

    return response.data.customers;
  }
);

// Thunk to add a new customer
export const addCustomer = createAsyncThunk(
  "customers/addCustomers",
    async (newServiceData, { rejectWithValue }) => {
       const { customer_name, cell_no } = newServiceData;
    try {
      const response = await axios.post(`${url}/customer/add_customer`, {
        customer_name,
        cell_no,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete a customer by ID
export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/customer/delete_customer`, {
        data: { _id: customerId },
      });

      return { customerId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update a customer by ID
export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async ({ id, customer_name }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/customer/update_customer`, {
        id,
        customer_name,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const customersSlice = createSlice({
  name: "customers",
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
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.customers;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalCustomers;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // fetch all customers
      .addCase(fetchAllCustomers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // Store all customers
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // add new customer
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.data.push(action.payload); // Add the new customer to the state
      })
      .addCase(addCustomer.pending, (state) => {
        state.status = "loading"; // Optional: handle loading state
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.status = "failed"; // Optional: handle error state
        state.error = action.error.message; // Save error message
      })
      // delete customer
      .addCase(deleteCustomer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (customer) => customer._id !== action.payload.customerId
        );
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })

      // Update customer
      .addCase(updateCustomer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (customer) => customer._id === action.payload.data._id
        );
        if (index !== -1) {
          state.data[index] = action.payload.data; // Update the customer in state
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = customersSlice.actions;
export default customersSlice.reducer;
