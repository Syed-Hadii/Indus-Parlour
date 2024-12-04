// store/slices/unitsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:3003";

// Thunk to fetch paginated services with optional search parameter
export const fetchService = createAsyncThunk(
  "services/fetchService",
  async ({ page = 1, search = "" }) => {
    const response = await axios.get(
      `${url}/service/get_service?page=${page}&search=${search}`
    );
    console.log("All Paginated services", response.data);
    return { ...response.data, page };
  }
);
// thunk to fetch all Categories
export const fetchAllServices = createAsyncThunk(
  "services/fetchAllServices",
  async () => {
    const response = await axios.get(`${url}/service/get_service?all=true`);  
    return response.data.services;
  }
);

// Thunk to add a new category
export const addService = createAsyncThunk(
  "services/addService",
  async (newServiceData, { rejectWithValue }) => {
    // Wrap parameters in a single object
    const {
      service_title,
      service_category,
      service_price,
      service_product,
      product_usage,
    } = newServiceData;
    try {
      const response = await axios.post(`${url}/service/add_service`, {
        service_title,
        service_category,
        service_price,
        service_product,
        product_usage,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
 

// Thunk to delete a category by ID
export const deleteService = createAsyncThunk(
  "services/deleteService",
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/service/delete_service`, {
        data: { _id: serviceId },
      });

      return { serviceId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update a category by ID
export const updateService = createAsyncThunk(
  "services/updateService",
  async ({ id, service_title, product_usage }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/service/update_service`, {
        id,
        service_title, 
        product_usage,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const new_serviceSlice = createSlice({
  name: "services",
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
      .addCase(fetchService.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchService.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.services;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalServices;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchService.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // fetch all services
      .addCase(fetchAllServices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllServices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // Store all services
      })
      .addCase(fetchAllServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
       // Add new service
      .addCase(addService.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.status = "idle"; // Reset status to idle after successful add
        state.error = null; // Clear any previous error
      })
      .addCase(addService.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addService.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error occurred"; // Updated error handling
      })
      // delete category
      .addCase(deleteService.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (category) => category._id !== action.payload.serviceId
        );
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })

      // Update category
      .addCase(updateService.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (category) => category._id === action.payload.data._id
        );
        if (index !== -1) {
          state.data[index] = action.payload.data; // Update the category in state
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = new_serviceSlice.actions;
export default new_serviceSlice.reducer;
