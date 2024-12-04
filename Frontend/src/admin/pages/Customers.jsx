import React, { useState, useEffect } from "react";
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
  fetchCustomers,
  addCustomer,
  deleteCustomer,
  updateCustomer,
} from "../../redux/slices/customerSlice";
import {
  TextField, 
  Button, 
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";

import Pagination from "@mui/material/Pagination";

const Customers = () => { 
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItems, setNewItems] = useState({
    customer_name: "",
    cell_no: "",
  });
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [editingCustomerName, setEditingCustomerName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "customer_name",
    direction: "asc",
  });

  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers?.data || []);
  const status = useSelector((state) => state.customers.status);
  const totalPages = useSelector((state) => state.customers.totalPages);
  const currentPage = useSelector((state) => state.customers.currentPage);
  const [loading, setLoading] = useState(false);

  // Fetch customers with pagination and search

  useEffect(() => {
    if (status === "idle") {
      setLoading(true);
      dispatch(
        fetchCustomers({ page: currentPage || 1, search: searchQuery })
      ).finally(() => setLoading(false));
    }
    console.log("all customers  :", customers);
  }, [status, dispatch, currentPage, searchQuery]);

  const handlePageChange = (event, page) => {
    setLoading(true);
    dispatch(fetchCustomers({ page, search: searchQuery })).finally(() =>
      setLoading(false)
    );
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItems({ ...newItems, [name]: value });
  };

  const handleSearchSubmit = () => {
    dispatch(fetchCustomers({ page: 1, search: searchQuery }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  const handleEdit = (customerId, customerName) => {
    setEditingCustomerId(customerId);
    setEditingCustomerName(customerName);
  };
  // Filter packs based on search query
  const sortedCustomers = [...customers] // Create a shallow copy to prevent direct mutation
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
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

  // * All CRUD Functions *
  // Add Package Function
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { customer_name, cell_no } = newItems;

      // Passing parameters as a single object
      await dispatch(
        addCustomer({
          customer_name,
          cell_no,
        })
      ).unwrap();

      dispatch(fetchCustomers(currentPage)); // Refresh the Customer list
      setNewItems("");
      setShowAddForm(false);
      toast.success("Package Created Successfully!");
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error("Error adding customer.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Package Function
  const handleDelete = async (customerId) => {
    console.log("Deleting customer with ID: ", customerId);
    setLoading(true);
    try {
      await dispatch(deleteCustomer(customerId)).unwrap();
      dispatch(fetchCustomers());
      toast.success("Package Deleted Successfully!");
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast.error("Error deleting customer.");
    } finally {
      setLoading(false);
    }
  };
  // update customer function
  const handleUpdatePackage = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateCustomer({
          id: editingCustomerId,
          customer_name: editingCustomerName,
        })
      ).unwrap();
      dispatch(fetchCustomers(currentPage));
      toast.success("Package Updated Successfully!");
      setEditingCustomerId(null); // Reset editing state
    } catch (error) {
      console.error("Failed to update customer:", error);
      toast.error("Error updating customer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">All Customers </h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="gap-5 flex">
          <TextField
            variant="outlined"
            placeholder="Search Customer"
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
          Add New Customer
        </Button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10 relative">
            <h1 className="text-lg font-semibold mb-5">Add New Customer</h1>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6" onSubmit={handleAddCustomer}>
              <div className="w-full">
                <TextField
                  fullWidth
                  label="Custtmer Name"
                  variant="outlined"
                  name="customer_name"
                  value={newItems.customer_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full">
                <TextField
                  fullWidth
                  label="Cell No #"
                  variant="outlined"
                  name="cell_no"
                  value={newItems.cell_no}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="pt-8 flex justify-end gap-7">
                <Button
                  sx={{
                    color: "red",
                  }}
                  color="secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#1abc9c",
                    "&:hover": {
                      backgroundColor: "#16a085", // Optional: Adjust hover color for consistency
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
        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-4 bg-[#e0f2e9] text-center text-sm md:text-base">
              {/* Sortable S.No Column */}
              <div className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center">
                S.No{" "}
              </div>

              {/* Sortable Name Column */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("customer_name")}
              >
                Title{" "}
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

              {/* Sortable Added On Column */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("createdAt")}
              >
                Added On{" "}
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

              <div className="py-3 text-gray-800 font-semibold">Actions</div>
            </div>

            {/* Data Rows */}
            {sortedCustomers && sortedCustomers.length > 0 ? (
              sortedCustomers.map((customer, index) => (
                <div
                  key={customer._id || index}
                  className="grid grid-cols-4 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100"
                >
                  <div className="py-3 text-center">{index + 1}</div>
                  <div className="py-3 text-center">
                    {editingCustomerId === customer._id ? (
                      <input
                        type="text"
                        value={editingCustomerName}
                        onChange={(e) => setEditingCustomerName(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      customer.customer_name
                    )}
                  </div>
                  <div className="py-3 text-center">
                    {new Date(customer.createdAt).toLocaleDateString("en-GB")}
                  </div>
                  <div className="py-3 text-center flex justify-center">
                    {editingCustomerId === customer._id ? (
                      <>
                        <button
                          className="mx-2 text-green-500 hover:text-green-700"
                          onClick={handleUpdatePackage}
                        >
                          <FaSave />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => setEditingCustomerId(null)}
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="mx-2 text-blue-500 hover:text-blue-700"
                          onClick={() =>
                            handleEdit(customer._id, customer.customer_name)
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(customer._id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">No Customer Found</div>
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

export default Customers;
