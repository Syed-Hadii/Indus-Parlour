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
  fetchStock,
  addStock,
  deleteStock,
  updateStock,
} from "../../redux/slices/stockSlice";
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

const Stock = () => { 
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItems, setNewItems] = useState({
    stock_product: "",
    stock_quantity: "",
    stock_usage: "",
  });
  const [editingStockId, setEditingStockId] = useState(null);
  const [editingStockProduct, setEditingStockProduct] = useState("");
  const [editingStockQuantity, setEditingStockQuantity] = useState("");
  const [editingStockUsage, setEditingStockUsage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "stock_product",
    direction: "asc",
  });

  const dispatch = useDispatch();
  const products = useSelector((cate) => cate.products?.data || []);
  const stocks = useSelector((state) => state.stocks?.data || []);
  const status = useSelector((state) => state.stocks.status);
  const totalPages = useSelector((state) => state.stocks.totalPages);
  const currentPage = useSelector((state) => state.stocks.currentPage);
  const [loading, setLoading] = useState(false);

  //  All Functions are below:
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchAllProducts());
    }
    console.log("all new products:", products);
  }, [products.length, dispatch]);
  // Fetch services with pagination and search

  useEffect(() => {
    if (status === "idle") {
      setLoading(true);
      dispatch(
        fetchStock({ page: currentPage || 1, search: searchQuery })
      ).finally(() => setLoading(false));
    }
    console.log("all Stocks  :", stocks);
  }, [status, dispatch, currentPage, searchQuery]);

  const handlePageChange = (event, page) => {
    setLoading(true);
    dispatch(fetchStock({ page, search: searchQuery })).finally(() =>
      setLoading(false)
    );
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItems({ ...newItems, [name]: value });
  };

  const handleSearchSubmit = () => {
    dispatch(fetchStock({ page: 1, search: searchQuery }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  const handleEdit = (stockId, stockProduct, stockQuantity, stockUsage) => {
    setEditingStockId(stockId);
    setEditingStockProduct(stockProduct);
    setEditingStockQuantity(stockQuantity);
    setEditingStockUsage(stockUsage);
  };
  // Filter stocks based on search query
  const sortedStocks = [...stocks] // Shallow copy of stocks array
    .sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nested "stock_product" field
      if (sortConfig.key === "stock_product") {
        aValue = a.stock_product?.product_name || ""; // Use fallback for undefined
        bValue = b.stock_product?.product_name || "";
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
  // Add Stock Function
  const handleAddStock = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { stock_product, stock_quantity, stock_usage } = newItems;

      // Passing parameters as a single object
      await dispatch(
        addStock({
          stock_product,
          stock_quantity,
          stock_usage,
        })
      ).unwrap();

      dispatch(fetchStock(currentPage)); // Refresh the services list
      setNewItems("");
      setShowAddForm(false);
      toast.success("Stock Created Successfully!");
    } catch (error) {
      console.error("Error adding stock:", error);
      toast.error("Error adding stock.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Stock Function
  const handleDelete = async (stockId) => {
    console.log("Deleting stock with ID: ", stockId);
    setLoading(true);
    try {
      await dispatch(deleteStock(stockId)).unwrap();
      dispatch(fetchStock());
      toast.success("Stock Deleted Successfully!");
    } catch (error) {
      console.error("Failed to delete stock:", error);
      toast.error("Error deleting stock.");
    } finally {
      setLoading(false);
    }
  };
  // update stock function
  const handleUpdateStock = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateStock({
          id: editingStockId,
          stock_product: editingStockProduct,
          stock_quantity: editingStockQuantity,
          stock_usage: editingStockUsage,
        })
      ).unwrap();
      dispatch(fetchStock(currentPage));
      toast.success("Stock Updated Successfully!");
      setEditingStockId(null); // Reset editing state
    } catch (error) {
      console.error("Failed to update stock:", error);
      toast.error("Error updating stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">All Stock </h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="gap-5 flex">
          <TextField
            variant="outlined"
            placeholder="Search Stock"
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
          Add New Stock
        </Button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10 relative">
            <h1 className="text-lg font-semibold mb-5">Add New Item</h1>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6" onSubmit={handleAddStock}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Products</InputLabel>
                <Select
                  value={newItems.stock_product}
                  name="stock_product"
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
                  name="stock_quantity"
                  type="number"
                  value={newItems.stock_quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="w-full">
                <TextField
                  fullWidth
                  label="Usage"
                  variant="outlined"
                  name="stock_usage"
                  type="number"
                  value={newItems.stock_usage}
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
            <div className="grid grid-cols-6 bg-[#e0f2e9] text-center text-sm md:text-base">
              {/* Sortable S.No Column */}
              <div className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center">
                S.No{" "}
              </div>

              {/* Sortable Name Column */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("stock_product")}
              >
                Product{" "}
                {sortConfig.key === "stock_product" ? (
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
                onClick={() => handleSort("stock_quantity")}
              >
                Quantity{" "}
                {sortConfig.key === "stock_quantity" ? (
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
                onClick={() => handleSort("stock_usage")}
              >
                Usages{" "}
                {sortConfig.key === "stock_usage" ? (
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
                Date{" "}
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
            {sortedStocks && sortedStocks.length > 0 ? (
              sortedStocks.map((stock, index) => (
                <div
                  key={stock._id || index}
                  className="grid grid-cols-6 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100"
                >
                  {/* Sr. No */}
                  <div className="py-3 text-center">{index + 1}</div>
                  {/* Product Name */}
                  <div className="py-3  text-center overflow-hidden">
                    {editingStockId === stock._id ? (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel> Products</InputLabel>
                        <Select
                          value={editingStockProduct}
                          name="stock_product"
                          onChange={(e) =>
                            setEditingStockProduct(e.target.value)
                          }
                          label="  Products"
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
                          {/* Map through categories to create MenuItem for each */}
                          {products.map((product) => (
                            <MenuItem key={product._id} value={product._id}>
                              {product.product_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      stock?.stock_product?.product_name || "No Product Selected"
                    )}
                  </div>
                  {/* Stock Qty */}
                  <div className="py-3 text-center">
                    {editingStockId === stock._id ? (
                      <input
                        type="text"
                        value={editingStockQuantity}
                        onChange={(e) =>
                          setEditingStockQuantity(e.target.value)
                        }
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      stock.stock_quantity
                    )}
                  </div>
                  <div className="py-3 text-center">
                    {editingStockId === stock._id ? (
                      <input
                        type="text"
                        value={editingStockUsage}
                        onChange={(e) => setEditingStockUsage(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      stock.stock_usage
                    )}
                  </div>
                  <div className="py-3 text-center">
                    {new Date(stock.createdAt).toLocaleDateString("en-GB")}
                  </div>
                  <div className="py-3 text-center flex justify-center">
                    {editingStockId === stock._id ? (
                      <>
                        <button
                          className="mx-2 text-green-500 hover:text-green-700"
                          onClick={handleUpdateStock}
                        >
                          <FaSave />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => setEditingStockId(null)}
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
                              stock._id,
                              stock.stock_product,
                              stock.stock_quantity,
                              stock.stock_usage
                            )
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(stock._id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">No Stock Found</div>
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

export default Stock;
