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
  fetch_regularBooking,
  add_regularBooking,
  remove_regularBooking,
  update_regularBooking,
} from "../../redux/slices/regularBooking_Slice";
import { fetchAllPackages } from "../../redux/slices/packageSlice";
import { fetchAllCustomers } from "../../redux/slices/customerSlice";
import { fetchAllServices } from "../../redux/slices/ServiceSlices/newServiceSlice";
import { fetchAllStaffs } from "../../redux/slices/staffSlice";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";

import Pagination from "@mui/material/Pagination";

const RegularBooking = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddSalesForm, setshowAddSalesForm] = useState(false);
  const [newItems, setNewItems] = useState({
    regular_packages: "",
    package_services_n_staff: [
      {
        package_services: "",
        package_staff: "",
      },
    ],
    regular_customer: "",
    services_n_staff: [
      {
        regular_services: "",
        regular_staff: "",
      },
    ],
    regular_payment_type: "",
    regular_discount: "",
    regular_recieve_amount: "",
    regular_appointment_time: "",
  });

  const [editingRegularBookingId, setEditingRegularBookingId] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState("");
  const [editingService, setEditingService] = useState("");
  const [editingPackage, setEditingPackage] = useState("");
  const [editingPayment_type, setEditingPayment_type] = useState("");
  const [editingService_Staff, setEditingService_Staff] = useState("");
  const [editingAppointTime, setEditingAppointTime] = useState("");
  const [editingDiscount, setEditingDiscount] = useState("");
  const [editingReceive, setEditingReceive] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "regular_customer",
    direction: "asc",
  });

  const dispatch = useDispatch();
  const packages = useSelector((state) => state.packages?.data || []);
  const customers = useSelector((state) => state.customers?.data || []);
  const services = useSelector((state) => state.services?.data || []);
  const staffs = useSelector((state) => state.staffs?.data || []);
  const regular_bookings = useSelector(
    (state) => state.regularBookings?.data || []
  );
  const status = useSelector((state) => state.regularBookings.status);
  const totalPages = useSelector((state) => state.regularBookings.totalPages);
  const currentPage = useSelector((state) => state.regularBookings.currentPage);
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
    if (staffs.length === 0) {
      dispatch(fetchAllStaffs());
    }
    // console.log("staffs fetched: ", staffs);
  }, [
    services.length,
    customers.length,
    packages.length,
    staffs.length,
    dispatch,
    services,
    customers,
    packages,
    staffs,
  ]);

  useEffect(() => {
    if (status === "idle") {
      setLoading(true);
      dispatch(
        fetch_regularBooking({ page: currentPage || 1, search: searchQuery })
      ).finally(() => setLoading(false));
    }
    console.log("Component regularBookings state:", regular_bookings); // Debugging
  }, [status, dispatch, currentPage, searchQuery, regular_bookings]);
  // -----
  // aLL Calculations
  // Calculate total for all bookings
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

      const packagePrice = item?.regular_packages?.package_price || 0;

      let servicePrices = 0;
      let packageServicePrices = 0;

      if (Array.isArray(item.services_n_staff)) {
        servicePrices = item.services_n_staff.reduce((total, service) => {
          const serviceItemPrice =
            service?.regular_services?.service_price || 0;
          return total + serviceItemPrice;
        }, 0);
      }

      if (Array.isArray(item.package_services_n_staff)) {
        packageServicePrices = item.package_services_n_staff.reduce(
          (total, service) => {
            const serviceItemPrice =
              service?.package_services?.service_price || 0;
            return total + serviceItemPrice;
          },
          0
        );
      }

      const discount = parseFloat(item?.regular_discount || 0);
      const receivedAmount = parseFloat(item?.regular_recieve_amount || 0);

      const total = Math.round(
        packagePrice + servicePrices + packageServicePrices
      );

      const afterDiscount = Math.round(total - total * (discount / 100));

      const dueAmount = Math.round(afterDiscount - receivedAmount);

      return {
        ...item,
        servicePrices,
        packageServicePrices,
        total,
        afterDiscount,
        dueAmount,
      };
    });
  };

  const processedData = calculateFields(regular_bookings);

  // -----
  const handlePageChange = (event, page) => {
    setLoading(true);
    dispatch(fetch_regularBooking({ page, search: searchQuery })).finally(() =>
      setLoading(false)
    );
  };
  // Assuming newItems is an object holding all form field values
  const handleChange = (index, event) => {
    const { name, value } = event.target;

    // If the event is for dynamically added service and staff pair
    if (index !== undefined) {
      const updatedServicesAndStaff = [...newItems.services_n_staff];
      updatedServicesAndStaff[index] = {
        ...updatedServicesAndStaff[index],
        [name]: value, // Update the specific field
      };

      setNewItems((prev) => ({
        ...prev,
        services_n_staff: updatedServicesAndStaff,
      }));
    } else {
      // For other fields that are not dynamically added
      setNewItems((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handlePackageChange = (e) => {
    const selectedPackageId = e.target.value;

    console.log("Selected Package ID:", selectedPackageId);

    const selectedPackage = packages.find(
      (pkg) => pkg._id === selectedPackageId
    );

    console.log("Selected Package Data:", selectedPackage);

    if (!selectedPackage) {
      console.error("Selected package not found.");
      return;
    }

    const services = selectedPackage.services.map((service) => ({
      package_services: service._id,
      package_staff: "", // Initialize staff dropdown as empty
    }));

    console.log("Extracted Services for Selected Package:", services);

    setNewItems((prevState) => ({
      ...prevState,
      regular_packages: selectedPackageId,
      package_services_n_staff: services,
    }));

    console.log("Updated State (newItems):", {
      regular_packages: selectedPackageId,
      package_services_n_staff: services,
    });
  };
  // Add a new row of service and staff fields
  const handleAddField = () => {
    setNewItems({
      ...newItems,
      services_n_staff: [
        ...newItems.services_n_staff, // Keep existing fields
        { regular_services: "", regular_staff: "" }, // Add an empty new field
      ],
    });
  };

  // Remove a specific service and staff row
  const delete_regularBooking = (index) => {
    const updatedServices = newItems.services_n_staff.filter(
      (_, i) => i !== index
    );
    setNewItems({
      ...newItems,
      services_n_staff: updatedServices, // Remove the field at the specific index
    });
  };

  const handleSearchSubmit = () => {
    dispatch(fetch_regularBooking({ page: 1, search: searchQuery }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  const handleEdit = (
    booking_Id,
    customer,
    packages,
    service_n_staff,
    pay_type,
    appoint_time,
    discount,
    recieve
  ) => {
    setEditingRegularBookingId(booking_Id);
    setEditingCustomer(customer);
    setEditingPackage(packages);
    setEditingPayment_type(pay_type);
    setEditingService_Staff(service_n_staff);
    setEditingAppointTime(appoint_time);
    setEditingDiscount(discount);
    setEditingReceive(recieve);
  };
  // Filter packs based on search query
 const getNestedValue = (obj, keyPath) => {
   return keyPath.split(".").reduce((acc, key) => {
     if (Array.isArray(acc) && key.includes("[")) {
       const [arrKey, index] = key.split(/[\[\]]/).filter(Boolean);
       return acc[arrKey] ? acc[arrKey][index] : undefined;
     }
     return acc?.[key];
   }, obj);
 };

 const sortedRegularBookings = [...processedData].sort((a, b) => {
   const valueA = getNestedValue(a, sortConfig.key);
   const valueB = getNestedValue(b, sortConfig.key);

   if (valueA === undefined || valueA === null) return 1;
   if (valueB === undefined || valueB === null) return -1;

   if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
   if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;

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
    setshowAddSalesForm(false);
    setNewItems({
      regular_packages: "",
      package_services_n_staff: [
        {
          package_services: "",
          package_staff: "",
        },
      ],
      regular_customer: "",
      services_n_staff: [
        {
          regular_services: "",
          regular_staff: "",
        },
      ],
      regular_payment_type: "",
      regular_discount: "",
      regular_recieve_amount: "",
      regular_appointment_time: "",
    });
  };
  // * All CRUD Functions *
  // Add Package Function
  const handleAddRegularBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        regular_packages,
        package_services_n_staff,
        regular_customer,
        services_n_staff, // Updated
        regular_payment_type,
        regular_discount,
        regular_recieve_amount,
        regular_appointment_time,
      } = newItems;

      // Dispatching updated structure
      await dispatch(
        add_regularBooking({
          regular_packages,
          package_services_n_staff,
          regular_customer,
          services_n_staff, // Passing the array of objects
          regular_payment_type,
          regular_discount,
          regular_recieve_amount,
          regular_appointment_time,
        })
      ).unwrap();

      dispatch(fetch_regularBooking(currentPage)); // Refresh the RegularBooking list
      formClose();
      toast.success("Booking Created Successfully!");
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
      await dispatch(remove_regularBooking(bookingId)).unwrap();
      dispatch(fetch_regularBooking());
      toast.success("Package Deleted Successfully!");
    } catch (error) {
      console.error("Failed to delete booking:", error);
      toast.error("Error deleting booking.");
    } finally {
      setLoading(false);
    }
  };
  // update booking function
  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Extract all required newItemss from the editing state or form
      await dispatch(
        update_regularBooking({
          id: editingRegularBookingId, // ID of the booking to update
          regular_customer: editingCustomer,
          regular_packages: editingPackage,
          services_n_staff: editingService_Staff, // Array of objects
          regular_payment_type: editingPayment_type,
          regular_appointment_time: editingAppointTime,
          regular_discount: editingDiscount,
          regular_recieve_amount: editingReceive,
        })
      ).unwrap();

      // Refetch updated booking list
      dispatch(fetch_regularBooking(currentPage));

      // Success message
      toast.success("Package Updated Successfully!");

      // Reset editing state
      setEditingRegularBookingId(null);
      setEditingPackage(null);
    } catch (error) {
      console.error("Failed to update booking:", error);
      toast.error("Error updating booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">
        All Regular Bookings{" "}
      </h1>
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
          onClick={() => setshowAddSalesForm(true)}
          sx={{
            backgroundColor: "#1abc9c",
            "&:hover": {
              backgroundColor: "#16a085",
            },
          }}
        >
          Add New Regular Booking
        </Button>
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
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10 relative max-h-[80vh] overflow-y-auto">
            <div className="border flex justify-between items-center p-5">
              <h1 className="text-lg font-semibold mb-0 mx-auto">
                Add New Sales Booking
              </h1>
              <FaTimes
                className="text-end cursor-pointer"
                onClick={formClose}
              />
            </div>

            <hr className="mb-6 border-gray-400" />

            <form className="space-y-6 mt-5">
              {/* Services */}
              <TextField
                fullWidth
                label="Reciept Number"
                variant="outlined"
                name="service"
                value={newItems.service}
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
      {showAddSalesForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[750px] h-auto mt-10 relative max-h-[85vh] overflow-y-auto">
            <div className="border bg-[#2c3e50] text-[#ecf0f1] flex justify-between items-center p-5">
              <h1 className="text-xl font-semibold mb-0 mx-auto">Add Sales</h1>
              <FaTimes
                className="text-end cursor-pointer"
                onClick={formClose}
              />
            </div>

            <hr className="mb-6 border-gray-400" />

            <form className="space-y-6 mt-5" onSubmit={handleAddRegularBooking}>
              <FormControl fullWidth>
                <InputLabel>Packages</InputLabel>
                <Select
                  label="Packages"
                  name="regular_packages"
                  value={newItems.regular_packages}
                  onChange={handlePackageChange} // Call the package change handler
                  required
                >
                  {packages.map((packageItem) => (
                    <MenuItem key={packageItem._id} value={packageItem._id}>
                      {packageItem.package_title} - PKR{" "}
                      {packageItem.package_price}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Conditionally Render Rows */}
              {newItems.regular_packages &&
              newItems.package_services_n_staff &&
              newItems.package_services_n_staff.length > 0
                ? newItems.package_services_n_staff.map((item, index) => (
                    <div key={index} className="row flex justify-between">
                      <div className="w-[48%]">
                        {/* Service Dropdown */}
                        <FormControl fullWidth>
                          <InputLabel>Service</InputLabel>
                          <Select
                            value={item.package_services} // This should be the service._id, not service.service_title
                            onChange={(e) => {
                              const updatedServices = [
                                ...newItems.package_services_n_staff,
                              ];
                              updatedServices[index].package_services =
                                e.target.value; // Set _id here, not service_title
                              setNewItems((prevState) => ({
                                ...prevState,
                                package_services_n_staff: updatedServices,
                              }));
                              console.log(
                                "Updated Services After Change:",
                                updatedServices
                              );
                            }}
                          >
                            {/* Populate services dropdown */}
                            {packages
                              .find(
                                (pkg) => pkg._id === newItems.regular_packages
                              )
                              ?.services.map((service) => (
                                <MenuItem key={service._id} value={service._id}>
                                  {" "}
                                  {/* Set value to service._id */}
                                  {service.service_title}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </div>

                      <div className="w-[48%]">
                        {/* Staff Dropdown */}
                        <FormControl fullWidth>
                          <InputLabel>Staff</InputLabel>
                          <Select
                            value={item.package_staff}
                            onChange={(e) => {
                              const updatedStaff = [
                                ...newItems.package_services_n_staff,
                              ];
                              updatedStaff[index].package_staff =
                                e.target.value;
                              setNewItems((prevState) => ({
                                ...prevState,
                                package_services_n_staff: updatedStaff,
                              }));
                              console.log(
                                "Updated Staff After Change:",
                                updatedStaff
                              );
                            }}
                          >
                            {staffs.map((staff) => (
                              <MenuItem key={staff._id} value={staff._id}>
                                {staff.staff_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  ))
                : console.log(
                    "No services available for the selected package."
                  )}

              {/* Customers (Dropdown) */}
              <FormControl fullWidth>
                <InputLabel>Customers</InputLabel>
                <Select
                  label="Customers"
                  name="regular_customer"
                  value={newItems.regular_customer}
                  onChange={(e) => handleChange(undefined, e)}
                  required
                >
                  {customers.map((customer, index) => (
                    <MenuItem key={customer._id || index} value={customer._id}>
                      {customer.customer_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Services and Staff (Dynamically Added) */}
              {newItems.services_n_staff.map((field, index) => (
                <div key={index} className="flex items-center mb-4 gap-6">
                  {/* Select Service (Dropdown) */}
                  <FormControl className="w-[43%] mr-4">
                    <InputLabel>Service</InputLabel>
                    <Select
                      label="Service"
                      name="regular_services"
                      value={field.regular_services}
                      onChange={(e) => handleChange(index, e)} // Pass index to handleChange
                      required
                    >
                      {services.map((service, index) => (
                        <MenuItem
                          key={service._id || index}
                          value={service._id}
                        >
                          {service.service_title} - PKR {service.service_price}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Select Staff (Dropdown) */}
                  <FormControl className="w-[43%] mr-4">
                    <InputLabel>Staff</InputLabel>
                    <Select
                      label="Staff"
                      name="regular_staff"
                      value={field.regular_staff}
                      onChange={(e) => handleChange(index, e)} // Pass index to handleChange
                      required
                    >
                      {staffs.map((staff, index) => (
                        <MenuItem key={staff._id || index} value={staff._id}>
                          {staff.staff_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Remove Button */}
                  <IconButton
                    onClick={() => delete_regularBooking(index)} // Pass index to delete function
                    color="secondary"
                  >
                    <FaTimes />
                  </IconButton>
                </div>
              ))}

              {/* Add Row Button */}
              <IconButton
                sx={{
                  backgroundColor: "#1abc9c",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#16a085",
                  },
                }}
                onClick={handleAddField}
              >
                <FaPlus />
              </IconButton>

              {/* Payment Type (Dropdown) */}
              <FormControl fullWidth>
                <InputLabel>Payment Type</InputLabel>
                <Select
                  label="Payment Type"
                  name="regular_payment_type"
                  value={newItems.regular_payment_type}
                  onChange={(e) => handleChange(undefined, e)}
                  required
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                </Select>
              </FormControl>

              {/* Receipt Amount */}
              <TextField
                fullWidth
                label="Receipt Amount"
                variant="outlined"
                name="regular_recieve_amount"
                value={newItems.regular_recieve_amount}
                onChange={(e) => handleChange(undefined, e)}
                required
              />

              {/* Discount */}
              <TextField
                fullWidth
                label="Discount"
                variant="outlined"
                name="regular_discount"
                value={newItems.regular_discount}
                onChange={(e) => handleChange(undefined, e)}
              />

              {/* Appointment Time */}
              <TextField
                fullWidth
                label="Appointment Time"
                variant="outlined"
                name="regular_appointment_time"
                value={newItems.regular_appointment_time}
                onChange={(e) => handleChange(undefined, e)}
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
          <div className="min-w-[1800px] bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-14 bg-[#e0f2e9] text-center text-sm md:text-base">
              {/* Sortable Name Column */}
              {/* Cusotmer Name */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("regular_customer")}
              >
                Customer Name{" "}
                {sortConfig.key === "regular_customer" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              {/* Service */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("package_services")}
              >
                Service{" "}
                {sortConfig.key === "package_services" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              {/* Service Total */}
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
              {/* Package */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("package_title")}
              >
                Packages{" "}
                {sortConfig.key === "package_title" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              {/* Package Total */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("package_all")}
              >
                Package Total{" "}
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
              {/* Pay Type */}
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
              {/* Staff Name */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("staff_name")}
              >
                Staff Name{" "}
                {sortConfig.key === "staff_name" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              {/* Appointment Time */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("appointment_date")}
              >
                Appointment Time{" "}
                {sortConfig.key === "appointment_date" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              {/* Discount */}
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
              {/* Recieve */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("recieve")}
              >
                Recieve{" "}
                {sortConfig.key === "recieve" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              {/* Total */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("total")}
              >
                Total{" "}
                {sortConfig.key === "total" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              {/* After Discount */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("after_discount")}
              >
                After Discount{" "}
                {sortConfig.key === "after_discount" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>
              {/* Due Amount  */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("due_amount")}
              >
                Due Amount{" "}
                {sortConfig.key === "due_amount" ? (
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
            {sortedRegularBookings && sortedRegularBookings.length > 0 ? (
              sortedRegularBookings
                .filter((booking) => booking)
                .map((booking, index) => (
                  <div
                    key={booking._id || index}
                    className="grid grid-cols-14 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100"
                  >
                    {/* customner name */}
                    <div className="py-3 text-center overflow-hidden">
                      {editingRegularBookingId === booking._id ? (
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Customer Name</InputLabel>
                          <Select
                            value={editingCustomer || ""}
                            name="customer_name"
                            onChange={(e) => setEditingCustomer(e.target.value)}
                            label="Customer Name"
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
                              <em>Select Customer</em>
                            </MenuItem>
                            {customers.map((customer) => (
                              <MenuItem key={customer._id} value={customer._id}>
                                {customer.customer_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        booking?.regular_customer?.customer_name ||
                        "No Customer Name" // Handle undefined `regular_customer`
                      )}
                    </div>

                    {/* services */}
                    <div className="py-3 text-center overflow-hidden">
                      {editingRegularBookingId === booking._id ? (
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
                            {services.map((service) => (
                              <MenuItem key={service._id} value={service._id}>
                                {service.service_title}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : // Check if `services_n_staff` exists and is an array
                      Array.isArray(booking.services_n_staff) ? (
                        booking.services_n_staff.map((staff, index) => (
                          <div key={index}>
                            {staff.regular_services?.service_title ||
                              "No service title available"}
                          </div>
                        ))
                      ) : (
                        <div>No services available</div> // Fallback message
                      )}
                    </div>

                    {/* service price */}
                    <div className="py-3 text-center">
                      {Array.isArray(booking.services_n_staff) ? (
                        booking.services_n_staff.map((staff, index) => (
                          <div key={index}>
                            {staff.regular_services?.service_price
                              ? `${staff.regular_services.service_price}`
                              : "No service price available"}
                          </div>
                        ))
                      ) : (
                        <div>No services available</div> // Fallback message
                      )}
                    </div>

                    {/* Packages */}
                    <div className="py-3 text-center overflow-hidden">
                      {editingRegularBookingId === booking._id ? (
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Package</InputLabel>
                          <Select
                            value={editingPackage || ""}
                            name="package_title"
                            onChange={(e) => setEditingPackage(e.target.value)}
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
                            {/* Map through packages to create MenuItem for each */}
                            {Array.isArray(packages) && packages.length > 0 ? (
                              packages.map((pakage) => (
                                <MenuItem key={pakage._id} value={pakage._id}>
                                  {pakage.package_title || "Untitled Package"}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>
                                No packages available
                              </MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      ) : (
                        booking.regular_packages?.package_title ||
                        "No package selected"
                      )}
                    </div>

                    {/* Package Price */}
                    <div className="py-3 text-center">
                      {booking.regular_packages?.package_price !== undefined
                        ? booking.regular_packages.package_price
                        : "No package price available"}
                    </div>

                    {/* Payment Method */}
                    <div className="py-3 text-center overflow-hidden">
                      {editingRegularBookingId === booking._id ? (
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
                        booking.regular_payment_type ||
                        "No payment method selected"
                      )}
                    </div>

                    {/* Staff */}
                    <div className="py-3 text-center overflow-hidden">
                      {editingRegularBookingId === booking._id ? (
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Staff</InputLabel>
                          <Select
                            value={editingService_Staff || ""}
                            name="package_title"
                            onChange={(e) =>
                              setEditingService_Staff(e.target.value)
                            }
                            label="Staff"
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
                              <em>Select Staff</em>
                            </MenuItem>
                            {/* Map through staffs to create MenuItem for each */}
                            {Array.isArray(staffs) && staffs.length > 0 ? (
                              staffs.map((staff) => (
                                <MenuItem key={staff._id} value={staff._id}>
                                  {staff.staff_name || "Unnamed Staff"}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>No staff available</MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      ) : (
                        <div>
                          {Array.isArray(booking.services_n_staff) &&
                          booking.services_n_staff.length > 0
                            ? booking.services_n_staff.map(
                                (staffEntry, index) => (
                                  <div key={index}>
                                    {staffEntry.regular_staff?.staff_name ||
                                      "No staff name available"}
                                  </div>
                                )
                              )
                            : "No staff assigned"}
                        </div>
                      )}
                    </div>

                    {/* Appointment Time */}
                    <div className="py-3 text-center">
                      {editingRegularBookingId === booking._id ? (
                        <input
                          type="text"
                          value={editingAppointTime || ""}
                          onChange={(e) =>
                            setEditingAppointTime(e.target.value)
                          }
                          className="w-full bg-blue-100 text-center"
                        />
                      ) : (
                        booking.regular_appointment_time ||
                        "No appointment time set"
                      )}
                    </div>

                    {/* Discount */}
                    <div className="py-3 text-center">
                      {editingRegularBookingId === booking._id ? (
                        <input
                          type="text"
                          value={editingDiscount || ""}
                          name="booking_discount"
                          onChange={(e) => setEditingDiscount(e.target.value)}
                          className="w-full bg-blue-100 text-center"
                        />
                      ) : booking.regular_discount !== undefined ? (
                        booking.regular_discount
                      ) : (
                        "No discount applied"
                      )}
                    </div>

                    {/* Receive */}
                    <div className="py-3 text-center">
                      {editingRegularBookingId === booking._id ? (
                        <input
                          type="text"
                          value={editingReceive || ""}
                          name="booking_recieve"
                          onChange={(e) => setEditingReceive(e.target.value)}
                          className="w-full bg-blue-100 text-center"
                        />
                      ) : booking.regular_recieve_amount !== undefined ? (
                        booking.regular_recieve_amount
                      ) : (
                        "No amount received"
                      )}
                    </div>

                    {/* Total */}
                    <div className="py-3 text-center">
                      {booking.total !== undefined
                        ? booking.total
                        : "No total calculated"}
                    </div>

                    {/* After Discount */}
                    <div className="py-3 text-center">
                      {booking.afterDiscount !== undefined
                        ? booking.afterDiscount
                        : "No after discount value"}
                    </div>

                    {/* Due Amount */}
                    <div className="py-3 text-center">
                      {booking.dueAmount !== undefined
                        ? booking.dueAmount
                        : "No due amount"}
                    </div>

                    {/* Action btns */}
                    <div className="py-3 text-center flex justify-center">
                      {editingRegularBookingId === booking._id ? (
                        <>
                          <button
                            className="mx-2 text-green-500 hover:text-green-700"
                            onClick={handleUpdate}
                          >
                            <FaSave />
                          </button>
                          <button
                            className="mx-2 text-red-500 hover:text-red-700"
                            onClick={() => setEditingRegularBookingId(null)}
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="mx-2 text-blue-500 hover:text-blue-700"
                            onClick={() =>
                              handleEdit(
                                booking._id,
                                booking.regular_customer.customer_name,
                                booking.package_services,
                                booking.regular_packages.package_title,
                                booking.regular_payment_type,
                                booking.regular_appointment_time,
                                booking.regular_discount,
                                booking.regular_recieve_amount
                              )
                            }
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="mx-2 text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(booking._id)}
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-5">No Regular Bookings Found</div>
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
    </div>
  );
};

export default RegularBooking;
