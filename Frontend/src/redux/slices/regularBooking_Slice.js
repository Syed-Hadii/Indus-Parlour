// store/slices/unitsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:3003";

// Thunk to fetch paginated regularBooking with optional search parameter
export const fetch_regularBooking = createAsyncThunk(
  "regularBooking/fetchregularBooking",
  async ({ page = 1, search = "" }) => {
    const response = await axios.get(
      `${url}/regular_booking/get_regularbooking?page=${page}&search=${search}`
    );
    // console.log("All Paginated regularBooking", response.data);
    return { ...response.data, page };
  }
);
// thunk to fetch all regularBooking
export const fetchAll_regularBooking = createAsyncThunk(
  "regularBooking/fetchAllregularBooking",
  async () => {
    const response = await axios.get(
      `${url}/regular_booking/get_regularbooking?all=true`
    );
    console.log("all regularBooking data:", response.data);

    return response.data;
  }
);

// Thunk to add a new regularBooking
export const add_regularBooking = createAsyncThunk(
  "regularBooking/addregularBooking",
  async (newServiceData, { rejectWithValue }) => {
    const {
      regular_packages,
      package_services_n_staff,
      regular_customer,
      services_n_staff, // Updated: Services and staff are now inside an array of objects
      regular_payment_type,
      regular_discount,
      regular_recieve_amount,
      regular_appointment_time,
    } = newServiceData;
    console.log("New Service Data:", newServiceData);
    try {
      const response = await axios.post(
        `${url}/regular_booking/add_regularbooking`,
        {
          regular_packages,
          package_services_n_staff,
          regular_customer,
          services_n_staff, // Updated: Passing services and staff as an array of objects
          regular_payment_type,
          regular_discount,
          regular_recieve_amount,
          regular_appointment_time,
        }
      );
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding regular booking:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete a regularBooking by ID
export const remove_regularBooking = createAsyncThunk(
  "regularBooking/deleteregularBooking",
  async (regularBookingId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${url}/regular_booking/delete_regularbooking`,
        {
          data: { _id: regularBookingId },
        }
      );

      return { regularBookingId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update a regularBooking by ID
export const update_regularBooking = createAsyncThunk(
  "regularBooking/updateregularBooking",
  async (
    {
      id,
      regular_packages, 
      regular_customer,
      services_n_staff,
      regular_payment_type,
      regular_discount,
      regular_recieve_amount,
      regular_appointment_time,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${url}/regular_booking/update_regularbooking`,
        {
          id,
          regular_packages, 
          regular_customer,
          services_n_staff,
          regular_payment_type,
          regular_discount,
          regular_recieve_amount,
          regular_appointment_time,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const regular_BookingSlice = createSlice({
  name: "regularBookings",
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
      .addCase(fetch_regularBooking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetch_regularBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Correctly map `regular_bookings` to `state.data`
        state.data = action.payload.regular_bookings; // Fix this line
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalRegular_Bookings; // Ensure consistent naming
        state.currentPage = action.payload.page;
      })
      .addCase(fetch_regularBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // fetch all regularBooking
      .addCase(fetchAll_regularBooking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAll_regularBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // Store all regularBooking
      })
      .addCase(fetchAll_regularBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // add new regularBooking

      .addCase(add_regularBooking.pending, (state) => {
        state.status = "loading"; // Optional: handle loading state
      })
      .addCase(add_regularBooking.fulfilled, (state, action) => {
        console.log("Fulfilled payload:", action.payload);
        if (!Array.isArray(state.data)) {
          state.data = []; // Reset to an empty array if undefined
        }
        state.data.push(action.payload.regularBookings); // Add the new regularBooking to the state
      })
      .addCase(add_regularBooking.rejected, (state, action) => {
        state.status = "failed"; // Optional: handle error state
        state.error = action.error.message; // Save error message
      })
      // delete regularBooking
      .addCase(remove_regularBooking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(remove_regularBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (regularBooking) =>
            regularBooking._id !== action.payload.regularBookingId
        );
      })
      .addCase(remove_regularBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })

      // Update regularBooking
      .addCase(update_regularBooking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(update_regularBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (regularBooking) => regularBooking._id === action.payload.data._id
        );
        if (index !== -1) {
          state.data[index] = action.payload.data; // Update the regularBooking in state
        }
      })
      .addCase(update_regularBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = regular_BookingSlice.actions;
export default regular_BookingSlice.reducer;
