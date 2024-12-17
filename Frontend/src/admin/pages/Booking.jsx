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
  FaPrint
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
  Grid,
  Paper,
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
    booking_type: "",
    booking_services: [{ service: "", service_date: "", service_time: "" }],
    booking_packages: [
      {
        package: "",
        services: [{ service: "", service_date: "", service_time: "" }],
      },
    ],

    booking_customer: "",
    booking_payment_type: "",
    booking_advance: 0,
    booking_discount: 0,
    booking_appointment_time: "",
    receipt_no: "",
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recieptDetails, setRecieptDetails] = useState(null);
  const [processedData, setProcessedData] = useState([]);

  // Redux Code here...
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
    console.log("Component bookings state:", bookings);
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
  // Helper function to access nested fields
  const getNestedValue = (obj, key) => {
    if (!key.includes(".")) return obj[key] || ""; // Direct field access
    return key.split(".").reduce((acc, part) => acc && acc[part], obj) || "";
  };

  // Sorted bookings logic
  const sortedBookings = [...bookings].sort((a, b) => {
    const aValue = getNestedValue(a, sortConfig.key);
    const bValue = getNestedValue(b, sortConfig.key);
    // If values are numbers, ensure proper comparison
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    // Otherwise, use string comparison
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
  console.log("sorted:", sortedBookings);

  // Handle sorting
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
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
  const closeModal = () => {
    setIsModalOpen(false);
    setRecieptDetails(null);
  };

  // Updated handlePrint function to ensure the printed layout matches the modal
  const handlePrint = () => {
    const printContent = document.getElementById("printArea").cloneNode(true); // Clone the modal content
    const printWindow = window.open("", "_blank"); // Open a new print window

    // Prepare HTML for printing
    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Print Receipt</title>
          <style>
              /* Add styles to match the modal design */
              body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  margin: 0;
              }
              .print-container {
                  max-width: 360px;
                  margin: 0 auto;
                  border: 1px solid #ddd;
                  padding: 10px;
                  border-radius: 5px;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              }
              .print-container img {
                  max-width: 100%;
              }
              .text-center {
                  text-align: center;
                  display:flex;
                  flex-direction: column;
              }
                  .text-center h1{ 
                      font-size: larger
                  }
                  .text-center p{
                  font-size:small;
                      font-size: larger
                  }
              .text-right {
                  text-align: right;
              }
              .text-left {
                  text-align: left;
              }
              .underline {
                  text-decoration: underline;
              }
              .font-bold {
                  font-weight: bold;
              }
              .flex {
                  display: flex;
                  justify-content: space-between;
                  align-items: center
              }
              .mt-4 { margin-top: 1rem; }
              .mb-4 { margin-bottom: 1rem; }
          </style>
      </head>
      <body>
          <div class="print-container">
              ${printContent.innerHTML}
          </div>
      </body>
      </html>
    `);

    printWindow.document.close(); 
    printWindow.print(); // Trigger the print
    // printWindow.close(); 
  };

  const handleRowClick = (bookingId) => {
    const clickedBooking = sortedBookings.find(
      (booking) => booking._id === bookingId
    );
    if (clickedBooking) {
      setRecieptDetails(clickedBooking); // Unique data set karo
      console.log("Selected Booking:", clickedBooking); // Debugging
    } else {
      console.error("Booking not found");
    }
  };

  // * All CRUD Functions *
  // Add Package Function
  const handleAddBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        booking_date,
        booking_type,
        booking_services,
        booking_packages,
        booking_customer,
        booking_payment_type,
        booking_advance,
        booking_discount,
        booking_appointment_time,
      } = newItems;

      // Prepare fields specific to Regular bookings
      let appointmentTime = null;
      if (booking_type === "Regular" && booking_appointment_time) {
        const [hours, minutes] = booking_appointment_time.split(":");
        appointmentTime = new Date();
        appointmentTime.setHours(hours, minutes, 0, 0);
      }
      const processedBookingServices =
        booking_services?.map((service) => {
          let serviceTime = null;
          if (service.service_time) {
            const [hours, minutes] = service.service_time.split(":");
            serviceTime = new Date();
            serviceTime.setHours(hours, minutes, 0, 0);
          }
          return {
            service: service.service || service, // Ensure only the service ID is sent
            service_date: service.service_date || null,
            service_time: serviceTime, // Processed service time
          };
        }) || [];

      // Process `service_time` in booking_packages
      const processedBookingPackages =
        booking_packages?.map((pkg) => ({
          package: pkg.package || null,
          services: pkg.services?.map((pkgService) => {
            let serviceTime = null;
            if (pkgService.service_time) {
              const [hours, minutes] = pkgService.service_time.split(":");
              serviceTime = new Date();
              serviceTime.setHours(hours, minutes, 0, 0);
            }
            return {
              service: pkgService.service || null, // Map package service ID correctly
              service_date: pkgService.service_date || null,
              service_time: serviceTime, // Processed service time
            };
          }),
        })) || [];
      // Construct booking data object
      const bookingData = {
        booking_type,
        booking_date,
        booking_customer,
        booking_payment_type,
        booking_advance: booking_advance || 0,
        booking_discount: booking_discount || 0,
        ...(booking_type === "Regular" && {
          booking_appointment_time: appointmentTime,
          booking_services: booking_services.map((service) => ({
            service: service.service || service, // Ensure only the service ID is sent
          })),

          booking_packages: booking_packages.map((pkg) => ({
            package: pkg || null, // Ensure package ID is mapped correctly
          })),
        }),
        ...(booking_type === "Bridal" && {
          booking_services: processedBookingServices,
          booking_packages: processedBookingPackages,
        }),
      };

      console.log("newData:", bookingData); // Debugging line to verify bookingData

      // Dispatch the action
      const response = await dispatch(addBooking(bookingData)).unwrap();

      if (response.success) {
        const receiptData = response.receiptData;
        setRecieptDetails(receiptData); // Assuming `setReceiptDetails` updates the receipt state
        console.log("Receipt Data:", receiptData);
        toast.success("Booking Created Successfully!");
      } else {
        toast.error(response.message || "Failed to create booking.");
      }

      // Refresh bookings and close the form
      dispatch(fetchBooking(currentPage)); // Adjust `currentPage` based on your pagination logic
      formClose();
    } catch (error) {
      console.error("Error adding booking:", error);
      toast.error("Error adding booking.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Package Function
  const handleDelete = async (bookingId) => {
    // console.log("Deleting booking with ID: ", bookingId);
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

  useEffect(() => {
    if (recieptDetails) {
      setIsModalOpen(true);

      // Ensure recieptDetails is in an array format before processing
      const dataToProcess = Array.isArray(recieptDetails)
        ? recieptDetails
        : [recieptDetails];
      const calculatedData = calculateFields(dataToProcess);

      // Update state with processed data
      setProcessedData(calculatedData);

      console.log("Processed Receipt Data:", calculatedData);
    }
  }, [recieptDetails]);

  const calculateFields = (data) => {
    if (!Array.isArray(data)) {
      console.error("Data is not an array:", data);
      return [];
    }

    return data.map((item, index) => {
      if (!item || typeof item !== "object") {
        console.error(`Invalid item at index ${index}:`, item);
        return {}; // Skip invalid entries
      }

      // Initialize prices
      let packagePrice = 0;
      let servicePrice = 0;

      // Calculate package prices
      if (Array.isArray(item.booking_packages)) {
        packagePrice = item.booking_packages.reduce((total, packageItem) => {
          const packageItemPrice = parseFloat(
            packageItem?.package.package_price || 0
          );
          return total + packageItemPrice;
        }, 0);
      }

      // Calculate service prices
      if (Array.isArray(item.booking_services)) {
        servicePrice = item.booking_services.reduce((total, serviceItem) => {
          const serviceItemPrice = parseFloat(
            serviceItem?.service.service_price || 0
          );
          return total + serviceItemPrice;
        }, 0);
      }

      // Extract other values
      const discount = parseFloat(item?.booking_discount || 0);
      const receivedAmount = parseFloat(item?.booking_advance || 0);

      // Total before discount
      const total = Math.round(packagePrice + servicePrice);

      // Total after discount
      const afterDiscount = Math.round(total - total * (discount / 100));

      // Due amount
      const dueAmount = Math.round(afterDiscount - receivedAmount);

      // Return modified item
      return {
        ...item,
        packagePrice,
        servicePrice,
        total,
        afterDiscount,
        dueAmount,
      };
    });
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
            backgroundColor: "#cc9f64",
            "&:hover": {
              backgroundColor: "#b88a57",
            },
          }}
        >
          Add New Booking
        </Button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-3 relative max-h-[95vh] overflow-y-auto">
            <div className=" flex justify-between items-center p-5">
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
              {/* Booking Type Dropdown */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Booking Date"
                  value={new Date(newItems.booking_date)}
                  onChange={(date) =>
                    handleChange({
                      target: { name: "booking_date", value: date },
                    })
                  }
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 1 },
                    width: "590px",
                  }}
                />
              </LocalizationProvider>
              <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                  label="Service Type"
                  name="booking_type"
                  value={newItems.booking_type || ""}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Regular">Regular</MenuItem>
                  <MenuItem value="Bridal">Bridal</MenuItem>
                </Select>
              </FormControl>

              {/*Date and time for Regular Booking */}
              {newItems.booking_type === "Regular" && (
                <>
                  <div className="flex justify-between gap-10">
                    {/* booking date */}

                    {/* appointment time */}
                    <TextField
                      fullWidth
                      label="Appointment Time"
                      variant="outlined"
                      type="time"
                      name="booking_appointment_time"
                      value={newItems.booking_appointment_time}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Packages Dropdown (Multiple Selection) */}
                  <Autocomplete
                    multiple
                    options={packages}
                    getOptionLabel={(option) => option.package_title}
                    value={packages.filter((pkg) =>
                      newItems.booking_packages.includes(pkg._id)
                    )}
                    onChange={(event, newValue) => {
                      setNewItems((prev) => ({
                        ...prev,
                        booking_packages: newValue.map((item) => item._id),
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Packages"
                        placeholder="Select Packages"
                      />
                    )}
                  />

                  {/* Services Dropdown (Multiple Selection) */}
                  <Autocomplete
                    multiple
                    options={services}
                    getOptionLabel={(option) => option.service_title}
                    value={services.filter((service) =>
                      newItems.booking_services.some(
                        (bookingService) =>
                          bookingService.service === service._id
                      )
                    )}
                    onChange={(event, newValue) => {
                      const updatedServices = newValue.map((item) => ({
                        service: item._id, // Only service ID is needed for Regular type
                      }));
                      setNewItems((prev) => ({
                        ...prev,
                        booking_services: updatedServices,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Services"
                        placeholder="Select Services"
                      />
                    )}
                  />
                </>
              )}

              {/* Conditional Fields for Bridal Booking */}
              {newItems.booking_type === "Bridal" && (
                <>
                  <div>
                    {/* Services */}
                    <h3 className="text-left font-semibold mb-2">Services</h3>
                    {newItems.booking_services.map((service, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-4 items-center mb-2"
                      >
                        {/* Service Autocomplete */}
                        <Autocomplete
                          options={services}
                          getOptionLabel={(option) => option.service_title}
                          value={
                            services.find(
                              (item) => item._id === service.service
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            const updatedServices = [
                              ...newItems.booking_services,
                            ];
                            updatedServices[index].service =
                              newValue?._id || ""; // Update service ID
                            setNewItems((prev) => ({
                              ...prev,
                              booking_services: updatedServices,
                            }));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Service"
                              variant="outlined"
                            />
                          )}
                        />

                        {/* Date Picker */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Date"
                            value={service.service_date}
                            onChange={(date) => {
                              const updatedServices = [
                                ...newItems.booking_services,
                              ];
                              updatedServices[index].service_date = date; // Update service date
                              setNewItems((prev) => ({
                                ...prev,
                                booking_services: updatedServices,
                              }));
                            }}
                            textField={{ fullWidth: true }} // Use the textField prop instead of renderInput
                          />
                        </LocalizationProvider>

                        {/* Time Field */}
                        <TextField
                          label="Time"
                          type="time"
                          value={service.service_time}
                          onChange={(e) => {
                            const updatedServices = [
                              ...newItems.booking_services,
                            ];
                            updatedServices[index].service_time =
                              e.target.value; // Update service time
                            setNewItems((prev) => ({
                              ...prev,
                              booking_services: updatedServices,
                            }));
                          }}
                        />

                        {/* Remove Button */}
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 ml-2"
                          onClick={() => {
                            const updatedServices =
                              newItems.booking_services.filter(
                                (_, idx) => idx !== index
                              );
                            setNewItems((prev) => ({
                              ...prev,
                              booking_services: updatedServices,
                            }));
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    {/* Add Service Button */}
                    <button
                      type="button"
                      className="text-blue-500 hover:text-blue-700 mt-2"
                      onClick={() => {
                        setNewItems((prev) => ({
                          ...prev,
                          booking_services: [
                            ...prev.booking_services,
                            {
                              service: "",
                              service_date: null,
                              service_time: "",
                            },
                          ],
                        }));
                      }}
                    >
                      Add Service
                    </button>
                  </div>

                  {/* Packages Dropdown (Single Selection) */}
                  <div>
                    <Autocomplete
                      options={packages}
                      getOptionLabel={(option) => option.package_title}
                      value={
                        packages.find(
                          (pkg) =>
                            pkg._id === newItems.booking_packages[0]?.package
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        setNewItems((prev) => ({
                          ...prev,
                          booking_packages: newValue
                            ? [
                                {
                                  package: newValue._id, // Package ID
                                  services: newValue.services.map(
                                    (service) => ({
                                      service: service._id,
                                      service_date: "", // Empty by default
                                      service_time: "", // Empty by default
                                    })
                                  ),
                                },
                              ]
                            : [],
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Package"
                          placeholder="Select Package"
                        />
                      )}
                    />

                    {/* Conditionally Render Rows for Services */}
                    {newItems.booking_packages[0]?.services &&
                      newItems.booking_packages[0].services.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="row flex justify-between mt-4"
                          >
                            {/* Service Field */}
                            <div className="w-[30%]">
                              <FormControl fullWidth>
                                <InputLabel>Service</InputLabel>
                                <Select
                                  value={item.service}
                                  onChange={(e) => {
                                    const updatedPackages = [
                                      ...newItems.booking_packages,
                                    ];
                                    updatedPackages[0].services[index].service =
                                      e.target.value;
                                    setNewItems((prev) => ({
                                      ...prev,
                                      booking_packages: updatedPackages,
                                    }));
                                  }}
                                >
                                  {packages
                                    .find(
                                      (pkg) =>
                                        pkg._id ===
                                        newItems.booking_packages[0]?.package
                                    )
                                    ?.services.map((service) => (
                                      <MenuItem
                                        key={service._id}
                                        value={service._id}
                                      >
                                        {service.service_title}
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                            </div>

                            {/* Date Field */}
                            <div className="w-[30%]">
                              <TextField
                                type="date"
                                label="Date"
                                InputLabelProps={{ shrink: true }}
                                value={item.service_date || ""} // Ensure it's a valid string or empty
                                onChange={(e) => {
                                  const updatedPackages = [
                                    ...newItems.booking_packages,
                                  ];
                                  updatedPackages[0].services[
                                    index
                                  ].service_date = e.target.value;
                                  setNewItems((prev) => ({
                                    ...prev,
                                    booking_packages: updatedPackages,
                                  }));
                                }}
                                fullWidth
                              />
                            </div>

                            {/* Time Field */}
                            <div className="w-[30%]">
                              <TextField
                                type="time"
                                label="Time"
                                InputLabelProps={{ shrink: true }}
                                value={item.service_time || ""} // Ensure it's a valid time string (HH:mm format)
                                onChange={(e) => {
                                  const updatedPackages = [
                                    ...newItems.booking_packages,
                                  ];
                                  updatedPackages[0].services[
                                    index
                                  ].service_time = e.target.value;
                                  setNewItems((prev) => ({
                                    ...prev,
                                    booking_packages: updatedPackages,
                                  }));
                                }}
                                fullWidth
                              />
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </>
              )}

              {/* Customer Dropdown */}
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
                    <em>Select Customer</em>
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
                  <MenuItem value="Card">Card</MenuItem>
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

              {/* Submit and Cancel Buttons */}
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
                    backgroundColor: "#cc9f64",
                    "&:hover": { backgroundColor: "#b88a57" },
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
          <div className="min-w-[1600px] bg-white border border-[#fcefde] rounded-lg shadow-lg overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-12 bg-[#fcefde] text-gray-800 text-center text-sm md:text-base">
              {/* Sortable Name Column */}
              <div
                className="py-3  font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("booking_customer.customer_name")}
              >
                Customer Name{" "}
                {sortConfig.key === "booking_customer.customer_name" ? (
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
                className="py-3  font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("booking_services.service_title")}
              >
                Service{" "}
                {sortConfig.key === "booking_services.service_title" ? (
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
                className="py-3  font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("booking_services.service_price")}
              >
                Service Total{" "}
                {sortConfig.key === "booking_services.service_price" ? (
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
                className="py-3 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("booking_package.package_title")}
              >
                Packages{" "}
                {sortConfig.key === "booking_package.package_title" ? (
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
                className="py-3 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("package_price")}
              >
                Package Total{" "}
                {sortConfig.key === "package_price" ? (
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
                className="py-3font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("booking_payment_type")}
              >
                Payment Type{" "}
                {sortConfig.key === "booking_payment_type" ? (
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
                className="py-3 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("booking_advance")}
              >
                Advance{" "}
                {sortConfig.key === "booking_advance" ? (
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
                className="py-3 font-semibold cursor-pointer flex justify-center items-center"
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
                className="py-3 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("booking_appointment_time")}
              >
                Booking Time{" "}
                {sortConfig.key === "booking_appointment_time" ? (
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
                className="py-3 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("booking_discount")}
              >
                Discount{" "}
                {sortConfig.key === "booking_discount" ? (
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
                className="py-3 font-semibold cursor-pointer flex justify-center items-center"
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

              <div className="py-3 font-semibold flex justify-center items-center">
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
                          {service?.service?.service_title || "Unknown Service"}
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
                            {service.service.service_price || "No Price"}
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
                          {pkg?.package.package_title || "Unknown Package"}
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
                            {pkg.package.package_price || "No Price"}
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
                      new Date(
                        booking?.booking_appointment_time
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) || "No Time"
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

                        <button
                          className="ml-4"
                          onClick={() => handleRowClick(booking?._id)}
                        >
                          <FaPrint className="text-green-600" />
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
        {processedData && processedData.length > 0 ? (
          processedData.map((recieptDetails, index) => (
            <div className="mt-4" id="printArea" key={index}>
              {/* Header Section */}
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

              {/* Booking Details Header */}
              <div className="flex flex-col justify-between border-b items-center mb-4 gap-3">
                <p className="h-[16px] w-[322px] bg-[#F4E072] text-[12px] font-[600] flex justify-center items-center">
                  Ph: 022-2730194 Cell: 0300-3014217 | 0318-3688110
                </p>
                <h2 className="h-[20px] w-[322px] bg-[#F4E072] text-[16px] font-[700] flex justify-center items-center">
                  Booking Details
                </h2>
                <div className="w-[322px] h-[19px] flex justify-between px-4 text-[12px] bg-[#F4E072]">
                  <p>
                    Receipt no:{" "}
                    <strong className="underline">
                      {recieptDetails.receipt_no}
                    </strong>
                  </p>
                  <p className="underline">
                    Date:{" "}
                    <strong>
                      {new Date().toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </strong>
                  </p>
                </div>
                <h1 className="flex text-[14px] mt-4 -mb-5">
                  <p>Client : </p>
                  <p className="font-[600] underline">
                    {" "}
                    {recieptDetails.booking_customer?.customer_name || "N/A"}
                  </p>
                </h1>
                <br />
              </div>

              {/* Services and Packages */}
              <div className="flex items-center justify-between px-2">
                <p className="font-[500] text-[16px] py-2 text-[#212529]">
                  Item
                </p>
                <p className="font-[500] text-[16px] py-2 text-[#212529]">
                  Price
                </p>
              </div>
              <Grid container spacing={2} className="w-[330px] mx-auto">
                {/* Services */}
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
                          {service.service.service_title} - (Service)
                        </p>
                        <p className="text-[12px] font-[600] w-1/3 text-right">
                          PKR {service.service.service_price}
                        </p>
                      </Grid>
                    </Paper>
                  ))}
                </Grid>

                {/* Packages */}
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
                          {packageItem.package.package_title} - (Package)
                        </p>
                        <p className="text-[12px] font-[600] w-1/3 text-right">
                          PKR {packageItem.package.package_price}
                        </p>
                      </Grid>
                    </Paper>
                  ))}
                </Grid>

                {/* Calculations */}
                <Grid item xs={12} className="w-full">
                  <h1 className="flex justify-between font-[700] text-[14px]">
                    <p className="text-[15px]">Date:</p>
                    <p className="text-[13px]">
                      {" "}
                      {new Date(recieptDetails.booking_date).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}{" "}
                    </p>
                  </h1>
                  <h1 className="flex justify-between font-[700] text-[14px]">
                    <p>Total Amount:</p>
                    <p>PKR {recieptDetails.total || 0}</p>
                  </h1>
                  <h1 className="flex justify-between text-[12px]">
                    <p>Discount:</p>
                    <p className="font-[600]">
                      {recieptDetails.booking_discount || 0}%
                    </p>
                  </h1>
                  <h1 className="flex justify-between text-[12px]">
                    <p>After Discount:</p>
                    <p className="font-[600]">
                      PKR {recieptDetails.afterDiscount || 0}
                    </p>
                  </h1>
                  <h1 className="flex justify-between text-[12px]">
                    <p>Advance:</p>
                    <p className="font-[600]">
                      PKR {recieptDetails.booking_advance || 0}
                    </p>
                  </h1>
                  <h1 className="flex justify-between text-[12px]">
                    <p>Due Amount:</p>
                    <p className="font-[600]">
                      PKR {recieptDetails.dueAmount || 0}
                    </p>
                  </h1>
                </Grid>
              </Grid>

              {/* Footer */}
              <h1 className="text-center text-[16px] font-[600] text-[#FF0000] mt-3 border-b border-black pb-0.5 w-[90%] mx-auto">
                Advance is Not Refundable
              </h1>
              <p className="text-[11px] font-[700] text-center px-10 mt-4">
                Indus Beauty Parlour. All rights reserved. Design by Gexton
              </p>
            </div>
          ))
        ) : (
          <p>No receipt details available.</p>
        )}

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
