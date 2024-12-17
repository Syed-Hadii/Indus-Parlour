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
  fetchPackage,
  addPackage,
  deletePackage,
  updatePackage,
} from "../../redux/slices/packageSlice";
import { fetchAllServices } from "../../redux/slices/ServiceSlices/newServiceSlice";
import {
  TextField, 
  Button, 
  IconButton,
  Autocomplete,
  Chip
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";

import Pagination from "@mui/material/Pagination";

const Packages = () => { 
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItems, setNewItems] = useState({
    package_title: "",
    package_price: "",
    services: [],
  });
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [editingPackageName, setEditingPackageName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "pack_title",
    direction: "asc",
  });

  const dispatch = useDispatch();
  const new_services = useSelector((cate) => cate.services?.data || []);
  const packages = useSelector((state) => state.packages?.data || []);
  const status = useSelector((state) => state.packages.status);
  const totalPages = useSelector((state) => state.packages.totalPages);
  const currentPage = useSelector((state) => state.packages.currentPage);
  const [loading, setLoading] = useState(false);

  //  All Functions are below:
  useEffect(() => {
    if (new_services.length === 0) {
      dispatch(fetchAllServices());
    }
    console.log("all new serivecs:", new_services);
  }, [new_services.length, dispatch, new_services]);
  // Fetch services with pagination and search

  useEffect(() => {
    if (status === "idle") {
      setLoading(true);
      dispatch(
        fetchPackage({ page: currentPage || 1, search: searchQuery })
      ).finally(() => setLoading(false));
    }
    console.log("all Packages  :", packages);
  }, [status, dispatch, currentPage, searchQuery, packages]);

  const handlePageChange = (event, page) => {
    setLoading(true);
    dispatch(fetchAllServices({ page, search: searchQuery })).finally(() =>
      setLoading(false)
    );
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItems({ ...newItems, [name]: value });
  };

  const handleSearchSubmit = () => {
    dispatch(fetchPackage({ page: 1, search: searchQuery }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  const handleEdit = (packId, packName) => {
    setEditingPackageId(packId);
    setEditingPackageName(packName);
  };
  // Filter packs based on search query
  const sortedPackages = [...packages] // Create a shallow copy to prevent direct mutation
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
  const handleAddPackage = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { package_title, package_price, services } = newItems;

      // Passing parameters as a single object
      await dispatch(
        addPackage({
          package_title,
          package_price,
          services,
        })
      ).unwrap();

      dispatch(fetchPackage(currentPage)); // Refresh the services list
      setNewItems("");
      setShowAddForm(false);
      toast.success("Package Created Successfully!");
    } catch (error) {
      console.error("Error adding pack:", error);
      toast.error("Error adding pack.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Package Function
  const handleDelete = async (packId) => {
    console.log("Deleting pack with ID: ", packId);
    setLoading(true);
    try {
      await dispatch(deletePackage(packId)).unwrap();
      dispatch(fetchPackage());
      toast.success("Package Deleted Successfully!");
    } catch (error) {
      console.error("Failed to delete pack:", error);
      toast.error("Error deleting pack.");
    } finally {
      setLoading(false);
    }
  };
  // update pack function
  const handleUpdatePackage = async () => {
    setLoading(true);
    try {
      await dispatch(
        updatePackage({
          id: editingPackageId,
          package_title: editingPackageName,
        })
      ).unwrap();
      dispatch(fetchPackage(currentPage));
      toast.success("Package Updated Successfully!");
      setEditingPackageId(null); // Reset editing state
    } catch (error) {
      console.error("Failed to update pack:", error);
      toast.error("Error updating pack.");
    } finally {
      setLoading(false);
    }
  };
   const formClose = () => {
     setShowAddForm(false);
     setNewItems({
       package_title: "",
       package_price: "",
       services: [],
     });
   };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">All Packages </h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="gap-5 flex">
          <TextField
            variant="outlined"
            placeholder="Search Package"
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
            backgroundColor: "#cc9f64 ",
            color: "#ffffff ",
            "&:hover": {
              backgroundColor: "#b88a57 ",
            },
          }}
        >
          Add New Package
        </Button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10 relative">
            <h1 className="text-lg font-semibold mb-5">Add New Package</h1>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6" onSubmit={handleAddPackage}>
              {/* Package Title */}
              <div className="w-full">
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  name="package_title"
                  value={newItems.package_title}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Package Price */}
              <div className="w-full">
                <TextField
                  fullWidth
                  label="Price"
                  variant="outlined"
                  name="package_price"
                  type="number"
                  value={newItems.package_price}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Package Services */}
              <Autocomplete
                multiple
                options={new_services} // Pass the full array of services
                getOptionLabel={(option) => option.service_title} // Display service title
                value={new_services.filter((service) =>
                  newItems.services.includes(service._id)
                )} // Filter selected services
                onChange={(event, newValue) => {
                  setNewItems((prev) => ({
                    ...prev,
                    services: newValue.map((item) => item._id), // Map selected services to IDs
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
                    backgroundColor: "#cc9f64 ",
                    "&:hover": {
                      backgroundColor: "#b88a57 ",
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
            <div className="grid grid-cols-4 bg-[#fcefde] text-gray-800 text-center text-sm md:text-base">
              {/* Sortable S.No Column */}
              <div
                className="py-3  font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("package_title")}
              >
                S.No{" "}
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

              {/* Sortable Name Column */}
              <div
                className="py-3  font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("package_title")}
              >
                Title{" "}
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

              {/* Sortable Added On Column */}
              <div
                className="py-3 font-semibold cursor-pointer flex justify-center items-center"
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

              <div className="py-3  font-semibold">Actions</div>
            </div>

            {/* Data Rows */}
            {sortedPackages && sortedPackages.length > 0 ? (
              sortedPackages.map((pack, index) => (
                <div
                  key={pack._id || index}
                  className="grid grid-cols-4 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100"
                >
                  <div className="py-3 text-center">{index + 1}</div>
                  <div className="py-3 text-center">
                    {editingPackageId === pack._id ? (
                      <input
                        type="text"
                        value={editingPackageName}
                        onChange={(e) => setEditingPackageName(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      pack.package_title
                    )}
                  </div>
                  <div className="py-3 text-center">
                    {new Date(pack.createdAt).toLocaleDateString("en-GB")}
                  </div>
                  <div className="py-3 text-center flex justify-center">
                    {editingPackageId === pack._id ? (
                      <>
                        <button
                          className="mx-2 text-green-500 hover:text-green-700"
                          onClick={handleUpdatePackage}
                        >
                          <FaSave />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => setEditingPackageId(null)}
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="mx-2 text-blue-500 hover:text-blue-700"
                          onClick={() =>
                            handleEdit(pack._id, pack.package_title)
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(pack._id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">No Package Found</div>
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

export default Packages;
