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
  fetchCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} from "../../../redux/slices/ProductSlices/categoriesSlice";
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

const Categories = () => { 
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "category_name",
    direction: "asc",
  });

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.data);
  const status = useSelector((state) => state.categories.status);
  const totalPages = useSelector((state) => state.categories.totalPages);
  const currentPage = useSelector((state) => state.categories.currentPage);
  const [loading, setLoading] = useState(false);

  //  All Functions are below:
  // Fetch categories with pagination and search
  useEffect(() => {
    if (status === "idle") {
      setLoading(true);
      dispatch(
        fetchCategories({ page: currentPage || 1, search: searchQuery })
      ).finally(() => setLoading(false));
    }
  }, [status, dispatch, currentPage, searchQuery]);

  const handlePageChange = (event, page) => {
    setLoading(true);
    dispatch(fetchCategories({ page, search: searchQuery })).finally(() =>
      setLoading(false)
    );
  };

  const handleSearchSubmit = () => {
    dispatch(fetchCategories({ page: 1, search: searchQuery }));
  };
 
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  const handleEdit = (categoryId, categoryName) => {
    setEditingCategoryId(categoryId);
    setEditingCategoryName(categoryName);
  };
  // Filter categories based on search query
  const sortedCategories= [...categories]  
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
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(addCategory(newCategory)).unwrap();
      dispatch(fetchCategories(currentPage));
      setNewCategory("");
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
  const handleDelete = async (categoryId) => {
    console.log("Deleting category with ID: ", categoryId);
    setLoading(true);
    try {
      await dispatch(deleteCategory(categoryId)).unwrap();
      dispatch(fetchCategories());
      toast.success("Category Deleted Successfully!");
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Error deleting category.");
    } finally {
      setLoading(false);
    }
  };
  // update category function
  const handleUpdateCategory = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateCategory({
          id: editingCategoryId,
          category_name: editingCategoryName,
        })
      ).unwrap();
      dispatch(fetchCategories(currentPage));
      toast.success("Category Updated Successfully!");
      setEditingCategoryId(null); // Reset editing state
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error("Error updating category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">All Categories </h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="gap-5 flex">
          <TextField
            variant="outlined"
            placeholder="Search Category"
            size="small"
            className=" w-64 md:w-72"
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
          Add New Category
        </Button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10 relative">
            <h1 className="text-lg font-semibold mb-5">Add New Category</h1>
            <hr className="mb-6 border-gray-400" />
            <form onSubmit={handleAddCategory} className="space-y-6">
              <div className="w-full">
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  name="category_name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
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
                {loading ? (
                  <RotatingLines width="30" strokeColor="#1abc9c" />
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="contained"
                    sx={{
                      backgroundColor: "#cc9f64",
                      "&:hover": {
                        backgroundColor: "#b88a57",
                      },
                    }}
                  >
                    {loading ? "Adding..." : "Add Category"}
                  </Button>
                )}
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
          <div className="bg-white border border-[#fcefde] rounded-lg shadow-lg overflow-hidden min-w-[400px]">
            {/* Header Row */}
            <div className="grid grid-cols-4 bg-[#fcefde] text-gray-800 text-center text-sm md:text-base">
              {/* Sortable S.No Column */}
              <div
                className="py-3  font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("category_name")}
              >
                S.No{" "}
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

              {/* Sortable Name Column */}
              <div
                className="py-3  font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("category_name")}
              >
                Name{" "}
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
                className="py-3  font-semibold cursor-pointer flex justify-center items-center"
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

              <div className="py-3 font-semibold">Actions</div>
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
                    {editingCategoryId === category._id ? (
                      <input
                        type="text"
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      category.category_name
                    )}
                  </div>
                  <div className="py-3 text-center">
                    {new Date(category.createdAt).toLocaleDateString("en-GB")}
                  </div>
                  <div className="py-3 text-center flex justify-center">
                    {editingCategoryId === category._id ? (
                      <>
                        <button
                          className="mx-2 text-green-500 hover:text-green-700"
                          onClick={handleUpdateCategory}
                        >
                          <FaSave />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => setEditingCategoryId(null)}
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="mx-2 text-blue-500 hover:text-blue-700"
                          onClick={() =>
                            handleEdit(category._id, category.category_name)
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
              <div className="text-center py-5">No Categories Found</div>
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

export default Categories;
