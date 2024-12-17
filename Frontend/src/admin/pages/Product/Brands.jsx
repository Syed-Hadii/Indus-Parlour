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
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Pagination,
  IconButton
} from "@mui/material";
import {
  fetchBrands,
  addBrand,
  updateBrand,
  deleteBrand,
} from "../../../redux/slices/ProductSlices/brandSlice";
import { fetchAllCategories } from "../../../redux/slices/ProductSlices/categoriesSlice";
import { useDispatch, useSelector } from "react-redux";
 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";

const Brands = () => { 
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingBrandName, setEditingBrandName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "brand_name",
    direction: "asc",
  });
  const [newItems, setNewItems] = useState({
    category_id: "",
    brand_name: "",
  }); 

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories?.data || []);
  const brands = useSelector((state) => state.brands.data || []);
  const status = useSelector((state) => state.brands?.status || "idle");
  const totalPages = useSelector((state) => state.brands?.totalPages || 1);
  const currentPage = useSelector((state) => state.brands?.currentPage || 1);

  const [loading, setLoading] = useState(false);
  // fetching data

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchAllCategories());
    }
    console.log("Categories:", categories);
  }, [categories, categories.length, dispatch]);

  useEffect(() => {
    if (status === "idle" || status === "failed") {
      setLoading(true);
      dispatch(fetchBrands({ page: currentPage, search: searchQuery })).finally(
        () => setLoading(false)
      );
    }

    if (brands) {
      console.log("Brands:", brands);
    }
  }, [dispatch, status, currentPage, searchQuery, brands.length, brands]);

  // Pagination and searching logic
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItems({ ...newItems, [name]: value });
  };
  const handlePageChange = (event, page) => {
    setLoading(true);
    dispatch(fetchBrands({ page, search: searchQuery })).finally(() =>
      setLoading(false)
    );
  };
  const handleSearchSubmit = () => {
    dispatch(fetchBrands({ page: 1, search: searchQuery }));
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  const sortedbrands = [...brands].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  const handleEdit = (brandId, brandName, brandCat) => {
    setEditingBrandId(brandId);
    setEditingBrandName(brandName);
    setEditingCategoryId(brandCat);
  };
  // All CRUD Functions
  // add function
  const handleAddBrand = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { category_id, brand_name } = newItems; // Destructure name and id from newItems
      await dispatch(addBrand({ category_id, brand_name })).unwrap();
      dispatch(fetchBrands(currentPage));
      setNewItems("");
      setShowAddForm(false);
      toast.success("Brand Created Successfully!");
    } catch (error) {
      console.error("Error adding Brand:", error);
      toast.error("Error adding Brand.");
    } finally {
      setLoading(false);
    }
  };
  // delete function 
  const handleDelete = async (brandId) => {
    console.log("Deleting Brand with ID: ", brandId);
    setLoading(true);
    try {
      await dispatch(deleteBrand(brandId)).unwrap();
      dispatch(fetchBrands());
      toast.success("Brand Deleted Successfully!");
    } catch (error) {
      console.error("Failed to delete Brand:", error);
      toast.error("Error deleting Brand.");
    } finally {
      setLoading(false);
    }
  };
  // update function
  const handleUpdateBrand = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateBrand({
          id: editingBrandId,
          category_id: editingCategoryId,
          brand_name: editingBrandName,
        })
      ).unwrap();
      dispatch(fetchBrands(currentPage));
      toast.success("Brand Updated Successfully!");
      setEditingBrandId(null); // Reset editing state
    } catch (error) {
      console.error("Failed to update Brand:", error);
      toast.error("Error updating Brand.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">All Brands </h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="gap-5 flex">
          <TextField
            variant="outlined"
            placeholder="Search Brand"
            size="small"
            className="md:w-72"
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
              backgroundColor: "#b88a57", // Optional: Adjust hover color for consistency
            },
          }}
        >
          Add New Brand
        </Button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10 relative">
            <h1 className="text-lg font-semibold mb-5">Add New Brand</h1>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6" onSubmit={handleAddBrand}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Brand Category</InputLabel>
                <Select
                  value={newItems.category_id || ""}
                  name="category_id"
                  onChange={handleChange}
                  label="Select Category"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        textAlign: "left",
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select Category</em>
                  </MenuItem>
                  {/* Map through categories to create MenuItem for each */}
                  {categories.map((category, index) => (
                    <MenuItem key={category._id || index} value={category._id}>
                      {category.category_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="w-full">
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  name="brand_name"
                  value={newItems.brand_name}
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
                      backgroundColor: "#b88a57", // Optional: Adjust hover color for consistency
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
          <div className="bg-white border border-[#fcefde] rounded-lg shadow-lg overflow-x-auto">
            {/* Header Row */}
            <div className="grid grid-cols-5 bg-[#fcefde] text-center text-xs md:text-sm lg:text-base">
              {/* S.No Column */}
              <div className="py-2 md:py-3 text-gray-800 font-semibold flex justify-center items-center">
                Sr No.
              </div>

              {/* Name Column */}
              <div
                className="py-2 md:py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("brand_name")}
              >
                Brand Name{" "}
                {sortConfig.key === "brand_name" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </div>

              {/* Category_id Column */}
              <div className="py-2 md:py-3 text-gray-800 font-semibold flex justify-center items-center">
                Category ID
              </div>

              {/* Added On Column */}
              <div
                className="py-2 md:py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
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

              {/* Actions Column */}
              <div className="py-2 md:py-3 text-gray-800 font-semibold flex justify-center items-center">
                Actions
              </div>
            </div>

            {/* Data Rows */}
            {sortedbrands && sortedbrands.length > 0 ? (
              sortedbrands.map((brand, index) => (
                <div
                  key={brand._id}
                  className="grid grid-cols-5 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100"
                >
                  {/* Sr No */}
                  <div className="py-2 md:py-3 text-center">{index + 1}</div>

                  {/* Brand Name */}
                  <div className="py-2 md:py-3 text-center">
                    {editingBrandId === brand._id ? (
                      <input
                        type="text"
                        value={editingBrandName}
                        onChange={(e) => setEditingBrandName(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      brand.brand_name
                    )}
                  </div>

                  {/* Category ID */}
                  <div className="py-2 md:py-3 text-center">
                    {editingBrandId === brand._id ? (
                      <select
                        value={newItems.category_id}
                        onChange={(e) => setEditingCategoryId(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.category_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      brand.category_id?.category_name || "No Category"
                    )}
                  </div>

                  {/* Added On */}
                  <div className="py-2 md:py-3 text-center">
                    {new Date(brand.createdAt).toLocaleDateString("en-GB")}
                  </div>

                  {/* Actions */}
                  <div className="py-2 md:py-3 text-center flex justify-center">
                    {editingBrandId === brand._id ? (
                      <>
                        <button
                          className="mx-2 text-green-500 hover:text-green-700"
                          onClick={handleUpdateBrand}
                        >
                          <FaSave />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => setEditingBrandId(null)}
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
                              brand._id,
                              brand.brand_name,
                              brand.category_id
                            )
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(brand._id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 md:py-5">No Brands Found</div>
            )}
          </div>
        </div>
      )}
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

export default Brands;
