import  { useState, useEffect } from "react";
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
  fetchService,
  addService,
  deleteService,
  updateService,
} from "../../../redux/slices/ServiceSlices/newServiceSlice";
import { fetchAllServiceCategories } from "../../../redux/slices/ServiceSlices/serviceCategorySlice";
import { fetchAllProducts } from "../../../redux/slices/ProductSlices/newProductSlice";
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

const NewServices = () => { 
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItems, setNewItems] = useState({
    service_title: "",
    service_category: "",
    service_price: "",
    service_product: "",
    product_usage: "",
  });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editingServiceName, setEditingServiceName] = useState("");
  const [editingProductUsage, setEditingProductUsage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "service_title",
    direction: "asc",
  });

  const dispatch = useDispatch();
  const categories = useSelector((cate) => cate.service_categories?.data || []);
  const products = useSelector((prod) => prod.products?.data || []);
  const services = useSelector((state) => state.services?.data || []);
  const status = useSelector((state) => state.services.status);
  const totalPages = useSelector((state) => state.services.totalPages);
  const currentPage = useSelector((state) => state.services.currentPage);
  const [loading, setLoading] = useState(false);

  //  All Functions are below:
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchAllServiceCategories());
    }
    if (products.length === 0) {
      dispatch(fetchAllProducts());
    }
  }, [categories.length, products.length, dispatch]);
  // Fetch services with pagination and search

  useEffect(() => {
    if (status === "idle") {
      setLoading(true);
      dispatch(
        fetchService({ page: currentPage || 1, search: searchQuery })
      ).finally(() => setLoading(false));
    }
  }, [status, dispatch, currentPage, searchQuery]);

  const handlePageChange = (event, page) => {
    setLoading(true);
    dispatch(fetchService({ page, search: searchQuery })).finally(() =>
      setLoading(false)
    );
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItems({ ...newItems, [name]: value });
  };

  const handleSearchSubmit = () => {
    dispatch(fetchService({ page: 1, search: searchQuery }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  const handleEdit = (serviceId, serviceName, serviceUsage) => {
    setEditingServiceId(serviceId);
    setEditingServiceName(serviceName);
    setEditingProductUsage(serviceUsage);
  };
  // Filter services based on search query
  const sortedCategories = [...services] // Create a shallow copy to prevent direct mutation
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
  // Add Category Function
 const handleAddService = async (e) => {
   e.preventDefault();
   setLoading(true);
   try {
     const {
       service_title,
       service_category,
       service_price,
       service_product,
       product_usage,
     } = newItems;

     // Passing parameters as a single object
     await dispatch(
       addService({
         service_title,
         service_category,
         service_price,
         service_product,
         product_usage,
       })
     ).unwrap();

     dispatch(fetchService(currentPage)); // Refresh the services list
     setNewItems("");
     setShowAddForm(false);
     toast.success("Category Created Successfully!");
   } catch (error) {
     console.error("Error adding category:", error);
     toast.error("Error adding category.");
   } finally {
     setLoading(false);
   }
 };

  // Delete Category Function
  const handleDelete = async (serviceId) => {
    console.log("Deleting servic with ID: ", serviceId);
    setLoading(true);
    try {
      await dispatch(deleteService(serviceId)).unwrap();
      dispatch(fetchService());
      toast.success("Category Deleted Successfully!");
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Error deleting category.");
    } finally {
      setLoading(false);
    }
  };
  // update category function
  const handleUpdateService = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateService({
          id: editingServiceId,
          service_title: editingServiceName,
          product_usage: editingProductUsage,
        })
      ).unwrap();
      dispatch(fetchService(currentPage));
      toast.success("Category Updated Successfully!");
      setEditingServiceId(null); // Reset editing state
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error("Error updating category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">All Services </h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="gap-5 flex">
          <TextField
            variant="outlined"
            placeholder="Search Category"
            size="small"
            className="w-72"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
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
          Add New Service
        </Button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10 relative">
            <h1 className="text-lg font-semibold mb-5">Add New Service</h1>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6" onSubmit={handleAddService}>
              <TextField
                fullWidth
                label="Service Name"
                variant="outlined"
                name="service_title"
                value={newItems.service_title}
                onChange={handleChange}
                required
              />

              <FormControl fullWidth variant="outlined">
                <InputLabel>Services Category</InputLabel>
                <Select
                  value={newItems.service_category}
                  name="service_category"
                  onChange={handleChange}
                  label="Services Category"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        textAlign: "left",
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select Service Category</em>
                  </MenuItem>
                  {categories.map((category, index) => (
                    <MenuItem key={category._id || index} value={category._id}>
                      {category.service_category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Service Price"
                variant="outlined"
                type="number"
                name="service_price"
                value={newItems.service_price}
                onChange={handleChange}
                required
              />
              <div className="flex gap-4">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Products</InputLabel>
                  <Select
                    value={newItems.service_product}
                    name="service_product"
                    onChange={handleChange}
                    label="Porducts"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          textAlign: "left",
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Product </em>
                    </MenuItem>
                    {products.map((product, index) => (
                      <MenuItem key={product._id || index} value={product._id}>
                        {product.product_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Usage"
                  variant="outlined"
                  name="product_usage"
                  type="number"
                  value={newItems.product_usage}
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
                    backgroundColor: "#cc9f64",
                    "&:hover": {
                      backgroundColor: "#b88a57",
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
        <div className="mt-4 grid grid-cols-1 gap-4 overflow-x-auto">
          <div className="bg-white border border-[#fcefde] rounded-lg shadow-lg overflow-hidden min-w-[350px]">
            {/* Header Row */}
            <div className="grid grid-cols-4 bg-[#fcefde] text-center text-sm md:text-base">
              {/* Sortable S.No Column */}
              <div className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center">
                S.No{" "}
              </div>

              {/* Sortable Name Column */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("category_name")}
              >
                Title{" "}
                {sortConfig.key === "category_name" ? (
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
                Usage{" "}
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
            {sortedCategories && sortedCategories.length > 0 ? (
              sortedCategories.map((category, index) => (
                <div
                  key={category._id || index}
                  className="grid grid-cols-4 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100"
                >
                  <div className="py-3 text-center">{index + 1}</div>
                  <div className="py-3 text-center">
                    {editingServiceId === category._id ? (
                      <input
                        type="text"
                        value={editingServiceName}
                        onChange={(e) => setEditingServiceName(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      category.service_title
                    )}
                  </div>
                  <div className="py-3 text-center">
                    {editingServiceId === category._id ? (
                      <input
                        type="text"
                        value={editingProductUsage}
                        onChange={(e) => setEditingProductUsage(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      category.product_usage
                    )}
                  </div>
                  <div className="py-3 text-center flex justify-center">
                    {editingServiceId === category._id ? (
                      <>
                        <button
                          className="mx-2 text-green-500 hover:text-green-700"
                          onClick={handleUpdateService}
                        >
                          <FaSave />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => setEditingServiceId(null)}
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
                              category._id,
                              category.service_title,
                              category.product_usage
                            )
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(category._id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">No Service Found</div>
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

export default NewServices;
