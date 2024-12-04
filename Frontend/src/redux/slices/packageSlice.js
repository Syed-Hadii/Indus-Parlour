// store/slices/unitsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:3003";

// Thunk to fetch paginated new_packages with optional search parameter
export const fetchPackage = createAsyncThunk(
  "new_packages/fetchPackage",
  async ({ page = 1, search = "" }) => {
    const response = await axios.get(
      `${url}/package/get_package?page=${page}&search=${search}`
    );
    console.log("All Paginated services", response.data);
    return { ...response.data, page };
  }
);
// thunk to fetch all Categories
export const fetchAllPackages = createAsyncThunk(
  "new_packages/fetchAllPackages",
  async () => {
    const response = await axios.get(`${url}/package/get_package?all=true`); 

    return response.data.packages;
  }
);

// Thunk to add a new category
export const addPackage = createAsyncThunk(
  "new_packages/addPackage",
  async (newServiceData, { rejectWithValue }) => {
    // Wrap parameters in a single object
    const {
      package_title,
      package_price,
      services
    } = newServiceData;
    try {
      const response = await axios.post(`${url}/package/add_package`, {
        package_title,
        package_price,
        services,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete a category by ID
export const deletePackage = createAsyncThunk(
  "new_packages/deletePackage",
  async (packageId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/package/delete_package`, {
        data: { _id: packageId },
      });

      return { packageId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update a category by ID
export const updatePackage = createAsyncThunk(
  "new_packages/updatePackage",
  async ({ id, package_title }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/package/update_package`, {
        id,
        package_title,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const packageSlice = createSlice({
  name: "new_packages",
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
      .addCase(fetchPackage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPackage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.packages;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalPackages;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchPackage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // fetch all new_packages
      .addCase(fetchAllPackages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllPackages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // Store all new_packages
      })
      .addCase(fetchAllPackages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add new package
      .addCase(addPackage.fulfilled, (state, action) => {
        state.data.push(action.payload);
        state.status = "idle"; // Reset status to idle after successful add
        state.error = null; // Clear any previous error
      })
      .addCase(addPackage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPackage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error occurred"; // Updated error handling
      })
      // delete category
      .addCase(deletePackage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (category) => category._id !== action.payload.packageId
        );
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })

      // Update category
      .addCase(updatePackage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (category) => category._id === action.payload.data._id
        );
        if (index !== -1) {
          state.data[index] = action.payload.data; // Update the category in state
        }
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = packageSlice.actions;
export default packageSlice.reducer;
