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
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Pagination,
  IconButton, 
} from "@mui/material";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../../redux/slices/ProductSlices/newProductSlice";
import { fetchAllCategories } from "../../../redux/slices/ProductSlices/categoriesSlice";
import { fetchAllBrands } from "../../../redux/slices/ProductSlices/brandSlice";
import { fetchAllVariations } from "../../../redux/slices/ProductSlices/variationSlice";
import { useDispatch, useSelector } from "react-redux"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";

const NewProduct = () => { 
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [editingProductName, setEditingProductName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [editingVariation, setEditingVariation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "product_name",
    direction: "asc",
  });
  const [newItems, setNewItems] = useState({
    category_id: "",
    brand_id: "",
    product_name: "",
    variation_id: "",
  });

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories?.data || []);
  const brands = useSelector((state) => state.brands?.data || []);
  const variations = useSelector((state) => state.variations?.data || []);
  const products = useSelector((state) => state.products.data || []);
  const status = useSelector((state) => state.products?.status || "idle");
  const totalPages = useSelector((state) => state.products?.totalPages || 1);
  const currentPage = useSelector((state) => state.products?.currentPage || 1);

  const [loading, setLoading] = useState(false);
  // fetching data

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchAllCategories());
    }
    if (brands.length === 0) {
      dispatch(fetchAllBrands());
    }
    if (variations.length === 0) {
      dispatch(fetchAllVariations());
    }
  }, [categories.length, brands.length, variations.length, dispatch]);

  useEffect(() => {
    if (status === "idle" || status === "failed") {
      setLoading(true);
      dispatch(
        fetchProducts({ page: currentPage, search: searchQuery })
      ).finally(() => setLoading(false));
    }

    if (products) {
      console.log("Fetch Data is here:", products);
    }
  }, [dispatch, status, currentPage, searchQuery, products.length]);

  // Pagination and searching logic
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItems({ ...newItems, [name]: value });
  };
  const handlePageChange = (event, page) => {
    setLoading(true);
    dispatch(fetchProducts({ page, search: searchQuery })).finally(() =>
      setLoading(false)
    );
  };
  const handleSearchSubmit = () => {
    dispatch(fetchProducts({ page: 1, search: searchQuery }));
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  const sortedproducts = [...products].sort((a, b) => {
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
  const handleEdit = (
    productId,
    productName,
    productBrand,
    productVariation
  ) => {
    setEditingProductId(productId);
    setEditingProductName(productName);
    setEditingBrand(productBrand);
    setEditingVariation(productVariation);
  };
  // All CRUD Functions
  // add function
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { category_id, brand_id, product_name, variation_id } = newItems;
      await dispatch(
        addProduct({ category_id, brand_id, product_name, variation_id })
      ).unwrap();
      dispatch(fetchProducts(currentPage));
      setNewItems("");
      setShowAddForm(false);
      toast.success("Product Created Successfully!");
    } catch (error) {
      console.error("Error adding Product:", error);
      toast.error("Error adding Product.");
    } finally {
      setLoading(false);
    }
  };
  // delete function
  const handleDelete = async (productId) => {
    console.log("Deleting Product with ID: ", productId);
    setLoading(true);
    try {
      await dispatch(deleteProduct(productId)).unwrap();
      dispatch(fetchProducts());
      toast.success("Product Deleted Successfully!");
    } catch (error) {
      console.error("Failed to delete Product:", error);
      toast.error("Error deleting Product.");
    } finally {
      setLoading(false);
    }
  };
  // update function
  const handleUpdateProduct = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateProduct({
          id: editingProductId, 
          brand_id: editingBrand,
          product_name: editingProductName,
          variation_id: editingVariation,
        })
      ).unwrap();
      dispatch(fetchProducts(currentPage));
      toast.success("Product Updated Successfully!");
      setEditingProductId(null); // Reset editing state
    } catch (error) {
      console.error("Failed to update Product:", error);
      toast.error("Error updating Product.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">All Products </h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="gap-5 flex">
          <TextField
            variant="outlined"
            placeholder="Search Product"
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
              backgroundColor: "#16a085", // Optional: Adjust hover color for consistency
            },
          }}
        >
          Add New Product
        </Button>
      </div>
    {showAddForm && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
    <div className="bg-white p-6 text-center rounded-lg shadow-2xl w-[650px] relative mt-10">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">Add New Product</h1>
      <hr className="mb-6 border-gray-300" />
      <form className="space-y-6" onSubmit={handleAddProduct}>
        {/* Categories */}
        <div className="text-left">
          <FormControl fullWidth variant="outlined" className="mb-3">
            <InputLabel>Categories *</InputLabel>
            <Select
              value={newItems.category_id || ""}
              name="category_id"
              onChange={handleChange}
              label="Categories *"
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
              {categories.map((category, index) => (
                <MenuItem key={category._id || index} value={category._id}>
                  {category.category_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Brands */}
        <div className="text-left">
          <FormControl fullWidth variant="outlined" className="mb-3">
            <InputLabel>Brands *</InputLabel>
            <Select
              value={newItems.brand_id || ""}
              name="brand_id"
              onChange={handleChange}
              label="Brands *"
              MenuProps={{
                PaperProps: {
                  style: {
                    textAlign: "left",
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>Select Brand</em>
              </MenuItem>
              {brands.map((brand, index) => (
                <MenuItem key={brand._id || index} value={brand._id}>
                  {brand.brand_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Product Name */}
        <div className="text-left">
          <TextField
            fullWidth
            label="Product Name"
            variant="outlined"
            name="product_name"
            value={newItems.product_name}
            onChange={handleChange}
            required
            className="mb-3"
          />
        </div>

        {/* Variations */}
        <div className="text-left">
          <FormControl fullWidth variant="outlined" className="mb-3">
            <InputLabel>Variations *</InputLabel>
            <Select
              value={newItems.variation_id || ""}
              name="variation_id"
              onChange={handleChange}
              label="Variations *"
              MenuProps={{
                PaperProps: {
                  style: {
                    textAlign: "left",
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>Select Variation</em>
              </MenuItem>
              {variations.map((variation, index) => (
                <MenuItem key={variation._id || index} value={variation._id}>
                  {variation.variation_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Buttons */}
        <div className="pt-6 flex justify-end gap-6">
          <Button
            sx={{
              color: "#e74c3c",
              border: "1px solid #e74c3c",
              "&:hover": {
                backgroundColor: "#f9ebea",
              },
            }}
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#2ecc71",
              "&:hover": {
                backgroundColor: "#27ae60",
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
            <div className="grid grid-cols-6 bg-[#e0f2e9] text-center text-sm md:text-base">
              {/* S.No Column */}
              <div className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center">
                Sr No.
              </div>

              {/* Name Column */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("product_name")}
              >
                Name{" "}
                {sortConfig.key === "product_name" ? (
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
              <div className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center">
                Brand
              </div>

              {/* Added On Column */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("usage")}
              >
                Variation{" "}
                {sortConfig.key === "usage" ? (
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
              <div className="py-3 text-gray-800 font-semibold">Actions</div>
            </div>

            {/* Data Rows */}
            {sortedproducts && sortedproducts.length > 0 ? (
              sortedproducts.map((product, index) => (
                <div
                  key={product._id || index}
                  className="grid grid-cols-6 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100"
                >
                  {/* Sr No */}
                  <div className="py-3 text-center">{index + 1}</div>

                  {/* product Name */}
                  <div className="py-3 text-center">
                    {editingProductId === product._id ? (
                      <input
                        type="text"
                        value={editingProductName}
                        onChange={(e) => setEditingProductName(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      product.product_name
                    )}
                  </div>

                  {/* Category ID   */}
                  <div className="py-3 text-center overflow-hidden">
                  
                    {  product.brand_id?.brand_name || "No Brand" }
                   
                  </div>

                  <div className="py-3  text-center overflow-hidden">
                    {editingProductId === product._id ? (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel> Variation</InputLabel>
                        <Select
                          value={editingVariation}
                          name="variation_id"
                          onChange={(e) => setEditingVariation(e.target.value)}
                          label="  Variation"
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
                            <em>Select Variation</em>
                          </MenuItem>
                          {/* Map through categories to create MenuItem for each */}
                          {variations.map((variation) => (
                            <MenuItem key={variation._id} value={variation._id}>
                              {variation.variation_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      product.variation_id?.variation_name || "No Variation"
                    )}
                  </div>

                  {/* Added On */}
                  <div className="py-3 text-center">
                    {new Date(product.createdAt).toLocaleDateString("en-GB")}
                  </div>

                  {/* Actions */}
                  <div className="py-3 text-center flex justify-center">
                    {editingProductId === product._id ? (
                      <>
                        <button
                          className="mx-2 text-green-500 hover:text-green-700"
                          onClick={handleUpdateProduct}
                        >
                          <FaSave />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => setEditingProductId(null)}
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
                              product._id,
                              product.product_name,
                              product.brand_id,
                              product.variation_id
                            )
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(product._id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">No Products Found</div>
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

export default NewProduct;
