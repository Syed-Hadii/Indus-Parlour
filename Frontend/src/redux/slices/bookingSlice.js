// store/slices/unitsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:3003";

// Thunk to fetch paginated booking with optional search parameter
export const fetchBooking = createAsyncThunk(
  "booking/fetchBooking",
  async ({ page = 1, search = "" }) => {
    const response = await axios.get(
      `${url}/booking/get_booking?page=${page}&search=${search}`
    );
    // console.log("All Paginated Booking", response.data);
    return { ...response.data, page };
  }
);
// thunk to fetch all Booking
export const fetchAllBooking = createAsyncThunk(
  "booking/fetchAllBooking",
  async () => {
    const response = await axios.get(`${url}/booking/get_booking?all=true`);
    // console.log("all booking data:", response.data);

    return response.data;
  }
);

// Thunk to add a new booking
export const addBooking = createAsyncThunk(
  "booking/addBooking",
  async (newServiceData, { rejectWithValue }) => {
    const {
      booking_date,
      booking_service_type,
      booking_services,
      booking_packages,
      booking_customer,
      booking_payment_type,
      booking_advance,
      booking_discount,
      booking_appointment_time,
    } = newServiceData;
    //  console.log("New Service Data:", newServiceData);
    try {
      const response = await axios.post(`${url}/booking/add_booking`, {
        booking_date,
        booking_service_type,
        booking_services,
        booking_packages,
        booking_customer,
        booking_payment_type,
        booking_advance,
        booking_discount,
        booking_appointment_time,
      });
      // console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to delete a booking by ID
export const deleteBooking = createAsyncThunk(
  "booking/deleteBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${url}/booking/delete_booking`, {
        data: { _id: bookingId },
      });

      return { bookingId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update a booking by ID
export const updateBooking = createAsyncThunk(
  "booking/updateBooking",
  async (
    {
      id, 
      bookin_service_type,
      booking_services,
      booking_packages,
      booking_customer,
      booking_payment_type,
      booking_advance,
      booking_discount,
      booking_appointment_time,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`${url}/booking/update_booking`, {
        id, 
        bookin_service_type,
        booking_services,
        booking_packages,
        booking_customer,
        booking_payment_type,
        booking_advance,
        booking_discount,
        booking_appointment_time,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const bookingSlice = createSlice({
  name: "bookings",
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
      .addCase(fetchBooking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.bookings;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalBooking;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // fetch all booking
      .addCase(fetchAllBooking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // Store all booking
      })
      .addCase(fetchAllBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // add new booking

      .addCase(addBooking.pending, (state) => {
        state.status = "loading"; // Optional: handle loading state
      })
      .addCase(addBooking.fulfilled, (state, action) => {
        // console.log("Fulfilled payload:", action.payload);
         if (!Array.isArray(state.data)) {
           state.data = []; // Reset to an empty array if undefined
         }
        state.data.push(action.payload.bookings); // Add the new booking to the state
      })
      .addCase(addBooking.rejected, (state, action) => {
        state.status = "failed"; // Optional: handle error state
        state.error = action.error.message; // Save error message
      })
      // delete booking
      .addCase(deleteBooking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter(
          (booking) => booking._id !== action.payload.bookingId
        );
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })

      // Update booking
      .addCase(updateBooking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (booking) => booking._id === action.payload.data._id
        );
        if (index !== -1) {
          state.data[index] = action.payload.data; // Update the booking in state
        }
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = bookingSlice.actions;
export default bookingSlice.reducer;