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
  fetchPurchase,
  addPurchase,
  deletePurchase,
  updatePurchase,
} from "../../redux/slices/purchaseSlice";
import { fetchAllProducts } from "../../redux/slices/ProductSlices/newProductSlice";
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

const Purchase = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItems, setNewItems] = useState({
    purchase_product: "",
    purchase_quantity: "",
    purchase_price: "",
    purchase_usage: "",
  });
  const [editingPurchaseId, setEditingPurchaseId] = useState(null);
  const [editingPurchaseProduct, setEditingPurchaseProduct] = useState("");
  const [editingPurchaseQuantity, setEditingPurchaseQuantity] = useState("");
  const [editingPurchasePrice, setEditingPurchasePrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "purchase_product",
    direction: "asc",
  });

  const dispatch = useDispatch();
  const products = useSelector((cate) => cate.products?.data || []);
  const purchases = useSelector((state) => state.purchases?.data || []);
  const status = useSelector((state) => state.purchases.status);
  const totalPages = useSelector((state) => state.purchases.totalPages);
  const currentPage = useSelector((state) => state.purchases.currentPage);
  const [loading, setLoading] = useState(false);

  //  All Functions are below:
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchAllProducts());
    }
    console.log("all new purchased products:", products);
  }, [products.length, dispatch]);
  // Fetch services with pagination and search

  useEffect(() => {
    if (status === "idle") {
      setLoading(true);
      dispatch(
        fetchPurchase({ page: currentPage || 1, search: searchQuery })
      ).finally(() => setLoading(false));
    }
    console.log("all paginated Purchases  :", purchases);
  }, [status, dispatch, currentPage, searchQuery]);

  const handlePageChange = (event, page) => {
    setLoading(true);
    dispatch(fetchPurchase({ page, search: searchQuery })).finally(() =>
      setLoading(false)
    );
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItems({ ...newItems, [name]: value });
  };

  const handleSearchSubmit = () => {
    dispatch(fetchPurchase({ page: 1, search: searchQuery }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  const handleEdit = (
    purchaseId,
    purchaseProduct,
    purchaseQuantity,
    purchasePrice
  ) => {
    setEditingPurchaseId(purchaseId);
    setEditingPurchaseProduct(purchaseProduct);
    setEditingPurchaseQuantity(purchaseQuantity);
    setEditingPurchasePrice(purchasePrice);
  };
  // Filter purchases based on search query
  const sortedPurchases = [...purchases] // Create a shallow copy to prevent direct mutation
    .sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Check if sorting key is "purchase_product" and handle nested object
      if (sortConfig.key === "purchase_product") {
        aValue = a.purchase_product?.product_name || ""; // Use fallback for undefined values
        bValue = b.purchase_product?.product_name || "";
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
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
  // Add Purchase Function
  const handleAddPurchase = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        purchase_product,
        purchase_quantity,
        purchase_price,
        purchase_usage,
      } = newItems;

      // Passing parameters as a single object
      await dispatch(
        addPurchase({
          purchase_product,
          purchase_quantity,
          purchase_price,
          purchase_usage,
        })
      ).unwrap();

      dispatch(fetchPurchase(currentPage)); // Refresh the services list
      setNewItems("");
      setShowAddForm(false);
      toast.success("Purchase Created Successfully!");
    } catch (error) {
      console.error("Error adding purchase:", error);
      toast.error("Error adding purchase.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Purchase Function
  const handleDelete = async (purchaseId) => {
    console.log("Deleting purchase with ID: ", purchaseId);
    setLoading(true);
    try {
      await dispatch(deletePurchase(purchaseId)).unwrap();
      dispatch(fetchPurchase());
      toast.success("Purchase Deleted Successfully!");
    } catch (error) {
      console.error("Failed to delete purchase:", error);
      toast.error("Error deleting purchase.");
    } finally {
      setLoading(false);
    }
  };
  // update purchase function
  const handleUpdatePurchase = async () => {
    setLoading(true);
    try {
      await dispatch(
        updatePurchase({
          id: editingPurchaseId,
          purchase_product: editingPurchaseProduct,
          purchase_quantity: editingPurchaseQuantity,
          purchase_price: editingPurchasePrice,
        })
      ).unwrap();
      dispatch(fetchPurchase(currentPage));
      toast.success("Purchase Updated Successfully!");
      setEditingPurchaseId(null); // Reset editing state
    } catch (error) {
      console.error("Failed to update purchase:", error);
      toast.error("Error updating purchase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">All Items </h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="gap-5 flex">
          <TextField
            variant="outlined"
            placeholder="Search Item"
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
          Add New Item
        </Button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10 relative">
            <h1 className="text-lg font-semibold mb-5">Add New Item</h1>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6" onSubmit={handleAddPurchase}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Products</InputLabel>
                <Select
                  value={newItems.purchase_product}
                  name="purchase_product"
                  onChange={handleChange}
                  label="Products  "
                  MenuProps={{
                    PaperProps: {
                      style: {
                        textAlign: "left",
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select Product</em>
                  </MenuItem>
                  {products.map((product, index) => (
                    <MenuItem key={product._id || index} value={product._id}>
                      {product.product_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="w-full">
                <TextField
                  fullWidth
                  label="  Quantity"
                  variant="outlined"
                  name="purchase_quantity"
                  type="number"
                  value={newItems.purchase_quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full">
                <TextField
                  fullWidth
                  label="Price"
                  variant="outlined"
                  name="purchase_price"
                  type="number"
                  value={newItems.purchase_price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full">
                <TextField
                  fullWidth
                  label="Usage"
                  variant="outlined"
                  name="purchase_usage"
                  type="number"
                  value={newItems.purchase_usage}
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
        <div className="mt-4 grid grid-cols-1 gap-4 overflow-x-auto">
          <div className="bg-white border border-[#fcefde] rounded-lg shadow-lg overflow-hidden min-w-[550px]">
            {/* Header Row */}
            <div className="grid grid-cols-6 bg-[#fcefde] text-center text-sm md:text-base">
              {/* Sortable S.No Column */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("purchase_product")}
              >
                S.No{" "}
                {sortConfig.key === "purchase_product" ? (
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
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("purchase_product")}
              >
                Product{" "}
                {sortConfig.key === "purchase_product" ? (
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
                onClick={() => handleSort("purchase_quantity")}
              >
                Quantity{" "}
                {sortConfig.key === "purchase_quantity" ? (
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
                onClick={() => handleSort("purchase_price")}
              >
                Price{" "}
                {sortConfig.key === "purchase_price" ? (
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
            {sortedPurchases && sortedPurchases.length > 0 ? (
              sortedPurchases.map((purchase, index) => (
                <div
                  key={purchase._id || index}
                  className="grid grid-cols-6 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100"
                >
                  <div className="py-3 text-center">{index + 1}</div>
                  {/* Product Name */}
                  <div className="py-3 text-center overflow-hidden">
                    {editingPurchaseId === purchase._id ? (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Products</InputLabel>
                        <Select
                          value={editingPurchaseProduct}
                          name="purchase_product"
                          onChange={(e) =>
                            setEditingPurchaseProduct(e.target.value)
                          }
                          label="Products"
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
                            <em>Select Product</em>
                          </MenuItem>
                          {/* Map through products to create MenuItem for each */}
                          {products.map((product) => (
                            <MenuItem key={product._id} value={product._id}>
                              {product.product_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      // Use optional chaining to handle undefined values
                      purchase?.purchase_product?.product_name ||
                      "No Product Selected"
                    )}
                  </div>
                  {/* QTY */}
                  <div className="py-3 text-center">
                    {editingPurchaseId === purchase._id ? (
                      <input
                        type="text"
                        value={editingPurchaseQuantity}
                        onChange={(e) =>
                          setEditingPurchaseQuantity(e.target.value)
                        }
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      purchase.purchase_quantity
                    )}
                  </div>
                  {/* Price */}
                  <div className="py-3 text-center">
                    {editingPurchaseId === purchase._id ? (
                      <input
                        type="text"
                        value={editingPurchasePrice}
                        onChange={(e) =>
                          setEditingPurchasePrice(e.target.value)
                        }
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      purchase.purchase_price
                    )}
                  </div>
                  {/* Date */}
                  <div className="py-3 text-center">
                    {new Date(purchase.createdAt).toLocaleDateString("en-GB")}
                  </div>
                  <div className="py-3 text-center flex justify-center">
                    {editingPurchaseId === purchase._id ? (
                      <>
                        <button
                          className="mx-2 text-green-500 hover:text-green-700"
                          onClick={handleUpdatePurchase}
                        >
                          <FaSave />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => setEditingPurchaseId(null)}
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
                              purchase._id,
                              purchase.purchase_product,
                              purchase.purchase_quantity,
                              purchase.purchase_price
                            )
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(purchase._id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">No Items Found</div>
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

export default Purchase;
