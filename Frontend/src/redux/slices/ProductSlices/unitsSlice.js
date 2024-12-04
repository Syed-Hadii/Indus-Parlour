// store/slices/unitsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:3003";

 

/// Thunk to fetch paginated units with optional search parameter
export const fetchUnits = createAsyncThunk(
  "units/fetchUnits",
  async ({ page = 1, search = "" }) => {
    try {
      const response = await axios.get(
        `${url}/product/get_unit?page=${page}&search=${search}`
      ); 

      return { ...response.data, page }; // Return response data with the page
    } catch (error) {
      console.error("Error fetching units:", error);
      throw error; // Rethrow to handle it in the calling function if needed
    }
  }
);


// thunk to fetch all units
export const fetchAllUnits = createAsyncThunk("units/fetchAllUnits", async () => {
  const response = await axios.get(`${url}/product/get_unit?all=true`); 
  return response.data;

});
 
// Thunk to add a new unit
export const addUnit = createAsyncThunk(
  "units/addUnit",
  async (newUnit, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/product/add_unit`, {
        unit_name: newUnit,  
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete a unit by ID
export const deleteUnit = createAsyncThunk(
  "units/deleteUnit",
  async (unitId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/product/delete_unit`, {
        data: { _id: unitId },
      });

      return { unitId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update a unit by ID
export const updateUnit = createAsyncThunk(
  "units/updateUnit",
  async ({ id, unit_name }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/product/update_unit`, {
        id,
        unit_name,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const unitsSlice = createSlice({
  name: "units",
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
      // Fetch Paginated Units
      .addCase(fetchUnits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUnits.fulfilled, (state, action) => { 
        state.status = "succeeded";
        state.data = action.payload.units;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalUnits;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // fetch all units
      .addCase(fetchAllUnits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUnits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.units;
      })
      .addCase(fetchAllUnits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // add new unit
      .addCase(addUnit.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(addUnit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addUnit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // delete unit
      .addCase(deleteUnit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUnit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (unit) => unit._id !== action.payload.unitId
        );
      })
      .addCase(deleteUnit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })

      // Update unit
      .addCase(updateUnit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUnit.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (unit) => unit._id === action.payload.data._id
        );
        if (index !== -1) {
          state.data[index] = action.payload.data;
        }
      })
      .addCase(updateUnit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = unitsSlice.actions;
export default unitsSlice.reducer;
