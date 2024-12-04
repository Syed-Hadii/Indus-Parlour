import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import {
  fetchBooking,
  addBooking,
  deleteBooking,
  updateBooking,
} from "../../redux/slices/bookingSlice";
import { fetchAllCustomers } from "../../redux/slices/customerSlice";
import { fetchAllPackages } from "../../redux/slices/packageSlice";
import { fetchAllServices } from "../../redux/slices/ServiceSlices/newServiceSlice";
import Modal from "react-modal";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  IconButton,
  Autocomplete,
  Chip,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/logo.png";
import Pagination from "@mui/material/Pagination";

const Bookings = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItems, setNewItems] = useState({
    booking_date: "",
    booking_service_type: "",
    booking_services: [],
    booking_packages: [],
    booking_customer: "",
    booking_payment_type: "",
    booking_advance: "",
    booking_discount: "",
    booking_appointment_time: "",
  });
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editingCustomerName, setEditingCustomerName] = useState("");
  const [editingService, setEditingService] = useState("");
  const [editingPackages, setEditingPackages] = useState("");
  const [editingPayment_type, setEditingPayment_type] = useState("");
  const [editingAdvance, setEditingAdvance] = useState("");
  const [editingBookingTime, setEditingBookingTime] = useState("");
  const [editingDiscount, setEditingDiscount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "customer_name",
    direction: "asc",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [recieptDetails, setRecieptDetails] = useState(null);

  const dispatch = useDispatch();
  const services = useSelector((state) => state.services?.data || []);
  const packages = useSelector((state) => state.packages?.data || []);
  const customers = useSelector((state) => state.customers?.data || []);
  const bookings = useSelector((state) => state.bookings?.data || []);

  const status = useSelector((state) => state.bookings.status);
  const totalPages = useSelector((state) => state.bookings.totalPages);
  const currentPage = useSelector((state) => state.bookings.currentPage);
  const [loading, setLoading] = useState(false);

  // Fetch bookings with pagination and search
  useEffect(() => {
    if (services.length === 0) {
      dispatch(fetchAllServices());
    }
    // console.log("Services fetched: ", services);

    if (customers.length === 0) {
      dispatch(fetchAllCustomers());
    }
    // console.log("customers fetched: ", customers);
    if (packages.length === 0) {
      dispatch(fetchAllPackages());
    }
    // console.log("packages fetched: ", packages);
  }, [services.length, customers.length, packages.length, dispatch]);

  useEffect(() => {
    if (status === "idle") {
      setLoading(true);
      dispatch(
        fetchBooking({ page: currentPage || 1, search: searchQuery })
      ).finally(() => setLoading(false));
    }
    console.log("Component bookings state:", bookings); // Debugging
    // console.log("Component bookings Se:", bookings.booking_services); // Debugging
  }, [status, dispatch, currentPage, searchQuery]);

  const handlePageChange = (event, page) => {
    setLoading(true);
    dispatch(fetchBooking({ page, search: searchQuery })).finally(() =>
      setLoading(false)
    );
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItems({
      ...newItems,
      [name]: value,
    });
  };

  const handleSearchSubmit = () => {
    dispatch(fetchBooking({ page: 1, search: searchQuery }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  const handleEdit = (
    booking_Id,
    customer,
    services,
    packages,
    pay_type,
    advance,
    booking_time,
    discount
  ) => {
    setEditingBookingId(booking_Id);
    setEditingCustomerName(customer);
    setEditingService(services);
    setEditingPackages(packages);
    setEditingPayment_type(pay_type);
    setEditingAdvance(advance);
    setEditingBookingTime(booking_time);
    setEditingDiscount(discount);
  };
  // Filter packs based on search query
  const sortedBookings = [...bookings] // Create a shallow copy to prevent direct mutation
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;

      // Log the individual booking's _id
      // console.log("Sorted Booking ID:", a._id, b._id);
      return 0;
    });

  // Handle sorting when clicking on column headers
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  const formClose = () => {
    setShowAddForm(false);
    setNewItems({
      booking_date: "",
      booking_service_type: "",
      booking_services: [],
      booking_packages: [],
      booking_customer: "",
      booking_payment_type: "",
      booking_advance: "",
      booking_discount: "",
      booking_appointment_time: "",
    });
  };
  // Reciept Generating
  const closeModal = () => setIsModalOpen(false);

  const handlePrint = () => {
    const printContent = document.getElementById("printArea").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore original content
  };
  // * All CRUD Functions *
  // Add Package Function
  const handleAddBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
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
      } = newItems;

      // Log the newItems object to see the values before sending them
      console.log("Booking Data:", newItems);
      setRecieptDetails(newItems); // Update recieptDetails state with the newItems data
      // setIsModalOpen(true); 

      // Passing parameters as a single object
      await dispatch(
        addBooking({
          booking_date,
          booking_service_type,
          booking_services,
          booking_packages,
          booking_customer,
          booking_payment_type,
          booking_advance,
          booking_discount,
          booking_appointment_time,
        })
      ).unwrap();

      dispatch(fetchBooking(currentPage)); // Refresh the Booking list
      formClose();
      toast.success("Package Created Successfully!");
    } catch (error) {
      console.error("Error adding booking:", error);
      toast.error("Error adding booking.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Package Function
  const handleDelete = async (bookingId) => {
    console.log("Deleting booking with ID: ", bookingId);
    setLoading(true);
    try {
      await dispatch(deleteBooking(bookingId)).unwrap();
      dispatch(fetchBooking());
      toast.success("Package Deleted Successfully!");
    } catch (error) {
      console.error("Failed to delete booking:", error);
      toast.error("Error deleting booking.");
    } finally {
      setLoading(false);
    }
  };
  // update booking function
  const handleUpdatePackage = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateBooking({
          id: editingBookingId,
          booking_name: editingCustomerName,
        })
      ).unwrap();
      dispatch(fetchBooking(currentPage));
      toast.success("Package Updated Successfully!");
      setEditingBookingId(null); // Reset editing state
    } catch (error) {
      console.error("Failed to update booking:", error);
      toast.error("Error updating booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">All Bookings </h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="gap-5 flex">
          <TextField
            variant="outlined"
            placeholder="Search Booking"
            size="small"
            className="w-72"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress} // Trigger search on Enter
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearchSubmit}>
                  <FaSearch className="text-gray-500" />
                </IconButton>
              ),
            }}
          />
        </div>
        <Button
          variant="contained"
          startIcon={<FaPlus />}
          onClick={() => setShowAddForm(true)}
          sx={{
            backgroundColor: "#1abc9c",
            "&:hover": {
              backgroundColor: "#16a085",
            },
          }}
        >
          Add New Booking
        </Button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-3 relative max-h-[95vh] overflow-y-auto">
            <div className="border flex justify-between items-center p-5">
              <h1 className="text-lg font-semibold mb-0 mx-auto">
                Book Appointment
              </h1>
              <FaTimes
                className="text-end cursor-pointer"
                onClick={formClose}
              />
            </div>

            <hr className="mb-6 border-gray-400" />

            <form className="space-y-6 mt-5" onSubmit={handleAddBooking}>
              {/* Date Picker */}

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Booking Date"
                  value={new Date(newItems.booking_date)}
                  onChange={(date) => {
                    handleChange({
                      target: { name: "booking_date", value: date },
                    });
                  }}
                  slots={{
                    textField: (params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3, // Smooth rounded corners
                            backgroundColor: "#f5f5f5", // Light background
                            "& fieldset": {
                              borderColor: "#4caf50", // Initial border color
                            },
                            "&:hover fieldset": {
                              borderColor: "#66bb6a", // Hover border color
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#2e7d32", // Focused border color
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#4caf50", // Label color
                            fontWeight: "bold",
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#2e7d32", // Focused label color
                          },
                          "& .MuiOutlinedInput-input": {
                            fontSize: "1rem", // Larger font for a modern look
                            padding: "12px 14px", // Comfortable padding
                          },
                        }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiPaper-root": {
                      borderRadius: 3, // Smooth dropdown corners
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for the dropdown
                    },
                    "& .MuiPickersDay-root": {
                      fontWeight: "bold", // Bolder font for days
                      color: "#4caf50", // Primary green color
                      "&.Mui-selected": {
                        backgroundColor: "#4caf50", // Selected day background
                        color: "#fff", // Selected day text color
                      },
                      "&.MuiPickersDay-today": {
                        border: "1px solid #4caf50", // Highlight today
                      },
                      "&:hover": {
                        backgroundColor: "#66bb6a", // Hover effect for days
                      },
                    },
                  }}
                />
              </LocalizationProvider>

              {/* Service Type (Dropdown) */}
              <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                  label="Service Type"
                  name="booking_service_type"
                  value={newItems.booking_service_type}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Regular">Regular</MenuItem>
                  <MenuItem value="Bridal">Bridal</MenuItem>
                </Select>
              </FormControl>

              {/* Services */}
              <Autocomplete
                multiple
                options={services} // Pass the full array of services
                getOptionLabel={(option) => option.service_title} // Display service title
                value={services.filter((service) =>
                  newItems.booking_services.includes(service._id)
                )} // Filter selected services
                onChange={(event, newValue) => {
                  setNewItems((prev) => ({
                    ...prev,
                    booking_services: newValue.map((item) => item._id), // Map selected services to IDs
                  }));
                }}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => {
                    // Destructure key to prevent duplication in spread props
                    const { key, ...rest } = getTagProps({ index });
                    return (
                      <Chip
                        key={option._id} // Use our own explicit key
                        label={option.service_title}
                        {...rest} // Spread the remaining props without the key
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Services"
                    placeholder="Select Services"
                  />
                )}
                sx={{
                  "& .MuiAutocomplete-popupIndicator": {
                    color: "gray",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                  "& .MuiChip-root": {
                    backgroundColor: "#e0f7fa",
                    color: "#00796b",
                  },
                }}
              />
              {/* Packages */}
              <Autocomplete
                multiple
                options={packages} // Pass the full array of packages
                getOptionLabel={(option) => option.package_title} // Display package title
                value={packages.filter((pkg) =>
                  newItems.booking_packages.includes(pkg._id)
                )} // Filter selected packages
                onChange={(event, newValue) => {
                  setNewItems((prev) => ({
                    ...prev,
                    booking_packages: newValue.map((item) => item._id), // Map selected packages to IDs
                  }));
                }}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => {
                    // Destructure key to prevent duplication in spread props
                    const { key, ...rest } = getTagProps({ index });
                    return (
                      <Chip
                        key={option._id} // Use our own explicit key
                        label={option.package_title}
                        {...rest} // Spread the remaining props without the key
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Packages"
                    placeholder="Select Packages"
                  />
                )}
                sx={{
                  "& .MuiAutocomplete-popupIndicator": {
                    color: "gray",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                  "& .MuiChip-root": {
                    backgroundColor: "#e0f7fa",
                    color: "#00796b",
                  },
                }}
              />
              {/* Customers */}
              <FormControl fullWidth>
                <InputLabel>Customer</InputLabel>
                <Select
                  label="Customer"
                  name="booking_customer"
                  value={newItems.booking_customer}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="">
                    <em>Select Customer </em>
                  </MenuItem>
                  {customers.map((customer, index) => (
                    <MenuItem key={customer._id || index} value={customer._id}>
                      {customer.customer_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Payment Type */}
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  label="Payment Method"
                  name="booking_payment_type"
                  value={newItems.booking_payment_type}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Card ">Card</MenuItem>
                </Select>
              </FormControl>

              {/* Advance */}
              <TextField
                fullWidth
                label="Advance"
                variant="outlined"
                name="booking_advance"
                type="number"
                value={newItems.booking_advance}
                onChange={handleChange}
                required
              />

              {/* Discount */}
              <TextField
                fullWidth
                label="Discount"
                variant="outlined"
                name="booking_discount"
                type="number"
                value={newItems.booking_discount}
                onChange={handleChange}
              />

              {/* Appointment Time */}
              <TextField
                fullWidth
                label="Appointment Time"
                variant="outlined"
                type="text" // Ensure this is a valid string
                name="booking_appointment_time"
                value={newItems.booking_appointment_time}
                onChange={handleChange}
                required
              />

              <div className="pt-8 flex justify-end gap-7">
                <Button
                  sx={{ color: "red" }}
                  color="secondary"
                  onClick={formClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#1abc9c",
                    "&:hover": {
                      backgroundColor: "#16a085",
                    },
                  }}
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <RotatingLines width="50" strokeColor="#1abc9c" />
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[1600px] bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-12 bg-[#e0f2e9] text-center text-sm md:text-base">
              {/* Sortable Name Column */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("customer_name")}
              >
                Customer Name{" "}
                {sortConfig.key === "customer_name" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("service")}
              >
                Service{" "}
                {sortConfig.key === "service" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("service_total")}
              >
                Service Total{" "}
                {sortConfig.key === "customer_name" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("packages")}
              >
                Packages{" "}
                {sortConfig.key === "packages" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("package_all")}
              >
                Package All{" "}
                {sortConfig.key === "package_all" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("payment_type")}
              >
                Payment Type{" "}
                {sortConfig.key === "payment_type" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("advance")}
              >
                Advance{" "}
                {sortConfig.key === "advance" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("booking_date")}
              >
                Booking Date{" "}
                {sortConfig.key === "booking_date" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("booking_time")}
              >
                Booking Time{" "}
                {sortConfig.key === "booking_time" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("discount")}
              >
                Discount{" "}
                {sortConfig.key === "discount" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("createdAt")}
              >
                Add Date{" "}
                {sortConfig.key === "createdAt" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>

              <div className="py-3 text-gray-800 font-semibold flex justify-center items-center">
                Actions
              </div>
            </div>

            {/* Data Rows */}
            {sortedBookings && sortedBookings.length > 0 ? (
              sortedBookings.map((booking, index) => (
                <div
                  key={booking?._id || index}
                  className="grid grid-cols-12 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100"
                >
                  <div className="py-3 text-center overflow-hidden">
                    {editingBookingId === booking?._id ? (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Customer Name</InputLabel>
                        <Select
                          value={editingCustomerName || ""}
                          name="customer_name"
                          onChange={(e) =>
                            setEditingCustomerName(e.target.value)
                          }
                          label="Customer Name"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                textAlign: "left",
                                maxHeight: "150px",
                                overflowY: "auto",
                              },
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>Select Customer</em>
                          </MenuItem>
                          {Array.isArray(customers) && customers.length > 0 ? (
                            customers.map((customer) => (
                              <MenuItem
                                key={customer?._id || "fallback-key"}
                                value={customer?._id || ""}
                              >
                                {customer?.customer_name || "Unknown Customer"}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No customers available</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    ) : (
                      booking?.booking_customer?.customer_name ||
                      "Unknown Customer"
                    )}
                  </div>

                  {/* Services */}
                  <div className="py-3 text-center overflow-hidden">
                    {editingBookingId === booking?._id ? (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Service</InputLabel>
                        <Select
                          value={editingService || ""}
                          name="service_name"
                          onChange={(e) => setEditingService(e.target.value)}
                          label="Service"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                textAlign: "left",
                                maxHeight: "150px", // Reduced the height of the dropdown
                                overflowY: "auto", // Ensures scrolling if the items exceed the max height
                              },
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>Select Service</em>
                          </MenuItem>
                          {Array.isArray(services) && services.length > 0 ? (
                            services.map((service) => (
                              <MenuItem
                                key={service?._id || "fallback-key"}
                                value={service?._id || ""}
                              >
                                {service?.service_title || "Unknown Service"}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No services available</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    ) : Array.isArray(booking?.booking_services) &&
                      booking.booking_services.length > 0 ? (
                      booking.booking_services.map((service) => (
                        <div key={service?._id || "fallback-key"}>
                          {service?.service_title || "Unknown Service"}
                        </div>
                      ))
                    ) : (
                      <div>No services available</div>
                    )}
                  </div>

                  {/* Service Price */}
                  <div className="py-3 text-center">
                    {booking?.booking_services?.length > 0
                      ? booking.booking_services.map((service) => (
                          <div key={service._id}>
                            {service.service_price || "No Price"}
                          </div>
                        ))
                      : "No Services"}
                  </div>
                  {/* Packages */}
                  <div className="py-3 text-center overflow-hidden">
                    {editingBookingId === booking?._id ? (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Package</InputLabel>
                        <Select
                          value={editingPackages || ""}
                          name="package_title"
                          onChange={(e) => setEditingPackages(e.target.value)}
                          label="Package"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                textAlign: "left",
                                maxHeight: "150px", // Reduced the height of the dropdown
                                overflowY: "auto", // Ensures scrolling if the items exceed the max height
                              },
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>Select Package</em>
                          </MenuItem>
                          {Array.isArray(packages) && packages.length > 0 ? (
                            packages.map((pkg) => (
                              <MenuItem
                                key={pkg?._id || "fallback-key"}
                                value={pkg?._id || ""}
                              >
                                {pkg?.package_title || "Unknown Package"}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No packages available</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    ) : Array.isArray(booking?.booking_packages) &&
                      booking.booking_packages.length > 0 ? (
                      booking.booking_packages.map((pkg) => (
                        <div key={pkg?._id || "fallback-key"}>
                          {pkg?.package_title || "Unknown Package"}
                        </div>
                      ))
                    ) : (
                      <div>No packages available</div>
                    )}
                  </div>

                  {/* Package Price */}
                  <div className="py-3 text-center">
                    {booking?.booking_packages?.length > 0
                      ? booking.booking_packages.map((pkg) => (
                          <div key={pkg._id}>
                            {pkg.package_price || "No Price"}
                          </div>
                        ))
                      : "No Packages"}
                  </div>
                  {/* Payment Method */}
                  <div className="py-3 text-center overflow-hidden">
                    {editingBookingId === booking?._id ? (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Payment Method</InputLabel>
                        <Select
                          value={editingPayment_type || ""}
                          name="booking_payment_type"
                          onChange={(e) =>
                            setEditingPayment_type(e.target.value)
                          }
                          label="Payment Method"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                textAlign: "left",
                                maxHeight: "150px", // Reduced the height of the dropdown
                                overflowY: "auto", // Ensures scrolling if the items exceed the max height
                              },
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>Select Method</em>
                          </MenuItem>
                          <MenuItem value="Cash">Cash</MenuItem>
                          <MenuItem value="Card">Card</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      booking?.booking_payment_type || "No Method"
                    )}
                  </div>

                  {/* Advance */}
                  <div className="py-3 text-center">
                    {editingBookingId === booking?._id ? (
                      <input
                        type="text"
                        value={editingAdvance || ""}
                        onChange={(e) => setEditingAdvance(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                        placeholder="Enter advance amount"
                      />
                    ) : (
                      booking?.booking_advance || "No Advance"
                    )}
                  </div>

                  {/* Booking Date */}
                  <div className="py-3 text-center">
                    {booking?.booking_date
                      ? new Date(booking.booking_date).toLocaleDateString(
                          "en-GB"
                        )
                      : "No Booking Date"}
                  </div>

                  {/* Booking Time */}
                  <div className="py-3 text-center">
                    {editingBookingId === booking?._id ? (
                      <input
                        type="text"
                        value={editingBookingTime || ""}
                        onChange={(e) => setEditingBookingTime(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                        placeholder="Enter booking time"
                      />
                    ) : (
                      booking?.booking_appointment_time || "No Time"
                    )}
                  </div>

                  {/* Discount */}
                  <div className="py-3 text-center">
                    {editingBookingId === booking?._id ? (
                      <input
                        type="text"
                        value={editingDiscount || ""}
                        name="booking_discount"
                        onChange={(e) => setEditingDiscount(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                        placeholder="Enter discount"
                      />
                    ) : (
                      booking?.booking_discount || "No Discount"
                    )}
                  </div>

                  {/* Created Date */}
                  <div className="py-3 text-center">
                    {booking?.createdAt
                      ? new Date(booking.createdAt).toLocaleDateString("en-GB")
                      : "No Created Date"}
                  </div>

                  {/* Action Buttons */}
                  <div className="py-3 text-center flex justify-center">
                    {editingBookingId === booking?._id ? (
                      <>
                        <button
                          className="mx-2 text-green-500 hover:text-green-700"
                          onClick={handleUpdatePackage}
                        >
                          <FaSave />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => setEditingBookingId(null)}
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="mx-2 text-blue-500 hover:text-blue-700"
                          onClick={() => {
                            if (
                              booking?._id &&
                              booking.booking_customer?.customer_name
                            ) {
                              handleEdit(
                                booking._id,
                                booking.booking_customer.customer_name,
                                booking.booking_services?.[0]?.service_title ||
                                  "No Service",
                                booking.booking_packages?.[0]?.package_title ||
                                  "No Package",
                                booking.booking_payment_type ||
                                  "No Payment Type",
                                booking.booking_advance || 0,
                                booking.booking_appointment_time || "No Time",
                                booking.booking_discount || 0
                              );
                            }
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(booking?._id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">No Bookings Found</div>
            )}
          </div>
        </div>
      )}
      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={currentPage || 1}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
      {/* Modal for Reciept */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        className="p-2 pt-2 bg-white mt-16 border rounded shadow-lg w-[355px] mx-auto z-[1000] max-h-[90vh] overflow-y-auto"
      >
        {/* Booking Details */}
        {recieptDetails && (
          <div className="mt-4" id="printArea">
            {/* Logo and Address */}
            <div className="h-[121px] w-full max-w-[322px] flex justify-between mx-auto">
              <div className="w-[115px] h-[120px]">
                <img src={logo} alt="Logo" />
              </div>
              <div className="w-[207px] text-center flex flex-col justify-center items-center">
                <h1 className="underline text-[19.2px] font-[300] leading-relaxed mb-1">
                  INDUS BEAUTY PARLOUR
                </h1>
                <p className="text-[11.2px] font-[600] leading-relaxed">
                  HOTEL INDUS CHAMBERS
                </p>
                <p className="text-[11.2px] leading-relaxed">
                  THANDI SARAK, HYDERABAD
                </p>
              </div>
            </div>

            {/* Contact and Details */}
            <div className="flex flex-col justify-between border-b items-center mb-4 gap-3">
              <p className="h-[16px] w-[322px] bg-[#F4E072] text-[12px] font-[600] flex justify-center items-center">
                Ph: 022-2730194 Cell: 0300-3014217 | 0318-3688110
              </p>
              <h2 className="h-[20px] w-[322px] bg-[#F4E072] text-[16px] font-[700] flex justify-center items-center">
                Booking Details
              </h2>
              <div className="w-[322px] h-[19px] flex justify-between px-4 text-[12px] bg-[#F4E072]">
                <p>
                  Receipt no: <strong className="underline">0102</strong>{" "}
                </p>
                <p className="underline">
                  Date: <strong>10-02-2006</strong>{" "}
                </p>
              </div>
              <h1 className="flex text-[14px] mt-4 -mb-5">
                <p>Client : </p>
                <p className="font-[600] underline">
                  {" "}
                  {recieptDetails.booking_customer}
                </p>
              </h1>
              <br />
            </div>
            <div className="flex items-center justify-between px-2">
              <p className="font-[500] text-[16px] py-2 text-[#212529]">Item</p>
              <p className="font-[500] text-[16px] py-2 text-[#212529]">
                Price
              </p>
            </div>
            {/* Services and Packages */}
            <Grid container spacing={2} className="w-[330px] mx-auto">
              {/* Services Section */}
              <Grid item xs={12}>
                {recieptDetails.booking_services.map((service, index) => (
                  <Paper
                    key={index}
                    className="p-1 mb-2 w-full"
                    style={{ overflowX: "hidden" }}
                  >
                    <Grid
                      container
                      justifyContent="space-between"
                      className="w-full"
                    >
                      <p className="text-[11px] font-[600] w-2/3 truncate">
                        {service} - (Service)
                      </p>
                      <p className="text-[12px] font-[600] w-1/3 text-right">
                        PKR 5000
                      </p>
                    </Grid>
                  </Paper>
                ))}
              </Grid>

              {/* Packages Section */}
              <Grid item xs={12}>
                {recieptDetails.booking_packages.map((packageItem, index) => (
                  <Paper
                    key={index}
                    className="p-1 mb-2 w-full"
                    style={{ overflowX: "hidden" }}
                  >
                    <Grid
                      container
                      justifyContent="space-between"
                      className="w-full"
                    >
                      <p className="text-[11px] font-[600] w-2/3 truncate">
                        {packageItem} - (Package)
                      </p>
                      <p className="text-[12px] font-[600] w-1/3 text-right">
                        PKR 15000
                      </p>
                    </Grid>
                  </Paper>
                ))}
              </Grid>

              {/* Date Section */}
              <Grid item xs={12} className="w-full">
                <h1 className="flex justify-between font-[700] text-[14px]">
                  <p>Date:</p>
                  <p>
                    {new Date(recieptDetails.booking_date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </p>
                </h1>
                <h1 className="flex justify-between text-[14px]">
                  <p>Time:</p>
                  <p>{recieptDetails.booking_appointment_time}</p>
                </h1>

                <h1 className="flex justify-between text-[12px]">
                  <p>Total Amount:</p>
                  <p className="font-[600]">PKR 10000</p>
                </h1>
                <h1 className="flex justify-between text-[12px]">
                  <p>Discount:</p>
                  <p className="font-[600]">
                    {recieptDetails.booking_discount}%
                  </p>
                </h1>
                <h1 className="flex justify-between text-[12px]">
                  <p>Advance:</p>
                  <p className="font-[600]">
                    PKR {recieptDetails.booking_advance}
                  </p>
                </h1>
                <h1 className="flex justify-between text-[12px]">
                  <p>Due Amount:</p>
                  <p className="font-[600]">PKR 18000</p>
                </h1>
              </Grid>
            </Grid>

            <h1 className="text-center text-[16px] font-[600] text-[#FF0000] mt-3 border-b border-black pb-0.5 w-[90%] mx-auto">
              Advance is Not Refundable
            </h1>
            <p className="text-[11px] font-[700] text-center px-10 mt-4">
              Indus Beauty Parlour. All rights reserved. Design by Gexton
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-12">
          <div className="flex w-full justify-end gap-5">
            <Button
              variant="outlined"
              color="error"
              onClick={closeModal}
              className="flex items-center gap-2"
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handlePrint}
              className="px-4 py-2"
            >
              Print
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Bookings;
