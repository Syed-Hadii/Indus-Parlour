// store/slices/unitsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:3003";

// Thunk to fetch paginated staffs with optional search parameter
export const fetchStaff = createAsyncThunk(
  "staffs/fetchStaff",
  async ({ page = 1, search = "" }) => {
    const response = await axios.get(
      `${url}/staff/get_staff?page=${page}&search=${search}`
    );
    // console.log("All Paginated staff", response.data);
    return { ...response.data, page };
  }
);
// thunk to fetch all Categories
export const fetchAllStaffs = createAsyncThunk(
  "staffs/fetchAllStaffs",
  async () => {
    const response = await axios.get(`${url}/staff/get_staff?all=true`);
    // console.log("paginated staffs", response.data);

    return response.data.staffs;
  }
);

// Thunk to add a new category
export const addStaff = createAsyncThunk(
  "staffs/addStaff",
  async (newStaffData, { rejectWithValue }) => {
    // Wrap parameters in a single object
    const {
      staff_name,
      staff_designation,
      staff_start_time,
      staff_end_time,
      staff_salary,
      staff_join_date,
      staff_cell,
    } = newStaffData;
    try {
      const response = await axios.post(`${url}/staff/add_staff`, {
        staff_name,
        staff_designation,
        staff_start_time,
        staff_end_time,
        staff_salary,
        staff_join_date,
        staff_cell,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete a category by ID
export const deleteStaff = createAsyncThunk(
  "staffs/deleteStaff",
  async (staffId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/staff/delete_staff`, {
        data: { _id: staffId },
      });

      return { staffId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update a category by ID
export const updateStaff = createAsyncThunk(
  "staffs/updateStaff",
  async (
    {
      _id,
      staff_name,
      staff_designation,
      staff_start_time,
      staff_end_time,
      staff_salary,
      staff_cell,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`${url}/staff/update_staff`, {
        id:_id,
        staff_name,
        staff_designation,
        staff_start_time,
        staff_end_time,
        staff_salary,
        staff_cell,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const staffSlice = createSlice({
  name: "staffs",
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
      .addCase(fetchStaff.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.staffs;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalStaffs;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // fetch all staffs
      .addCase(fetchAllStaffs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllStaffs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // Store all staffs
      })
      .addCase(fetchAllStaffs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add new staff
      .addCase(addStaff.fulfilled, (state, action) => {
        // Ensure state.data is initialized as an empty array if it's undefined
        if (!Array.isArray(state.data)) state.data = []; // Ensure `state.data` is an array
        state.data.push(action.payload); // Push the new staff data
        state.status = "idle";
        state.error = null;
      })

      .addCase(addStaff.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addStaff.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error occurred"; // Updated error handling
      })
      // delete category
      .addCase(deleteStaff.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (category) => category._id !== action.payload.staffId
        );
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })

      // Update category
      .addCase(updateStaff.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (category) => category._id === action.payload.data.id
        );
        if (index !== -1) {
          state.data[index] = action.payload.data; // Update the category in state
        }
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = staffSlice.actions;
export default staffSlice.reducer;
