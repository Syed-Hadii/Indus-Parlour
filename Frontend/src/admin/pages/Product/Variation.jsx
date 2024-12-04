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
  fetchVariations,
  addVariation,
  updateVariation,
  deleteVariation,
} from "../../../redux/slices/ProductSlices/variationSlice";
import { fetchAllUnits } from "../../../redux/slices/ProductSlices/unitsSlice";
import { useDispatch, useSelector } from "react-redux";
 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";

const Variation = () => { 
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVariationId, setEditingVariationId] = useState(null);
  const [editingVariationName, setEditingVariationName] = useState("");
  const [editingUnitId, setEditingUnitId] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState(null);
  const [editingUsage, setEditingUsage] = useState(null);
  const [editingPrice, setEditingPrice] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "variation_name",
    direction: "asc",
  });
  const [newItems, setNewItems] = useState({
    variation_name: "",
    unit_id: "",
    quantity: "",
    usage: "",
    price: "",
  });

  const dispatch = useDispatch();
  const units = useSelector((state) => state.units?.data || []);
  const variations = useSelector((state) => state.variations.data || []);
  const status = useSelector((state) => state.variations?.status || "idle");
  const totalPages = useSelector((state) => state.variations?.totalPages || 1);
  const currentPage = useSelector(
    (state) => state.variations?.currentPage || 1
  );

  const [loading, setLoading] = useState(false);
  // fetching data

  useEffect(() => {
    if (units.length === 0) {
      dispatch(fetchAllUnits());
    } 
  }, [units.length, dispatch]);

  useEffect(() => {
    if (status === "idle" || status === "failed") {
      setLoading(true);
      dispatch(
        fetchVariations({ page: currentPage, search: searchQuery })
      ).finally(() => setLoading(false));
    }

    
  }, [dispatch, status, currentPage, searchQuery, variations.length]);

  // Pagination and searching logic
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItems({ ...newItems, [name]: value });
  };
  const handlePageChange = (event, page) => {
    setLoading(true);
    dispatch(fetchVariations({ page, search: searchQuery })).finally(() =>
      setLoading(false)
    );
  };
  const handleSearchSubmit = () => {
    dispatch(fetchVariations({ page: 1, search: searchQuery }));
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  const sortedvariations = [...variations].sort((a, b) => {
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
    variationId,
    variationName,
    variationUnit,
    variationUsage,
    variationQuantity,
    variationPrice
  ) => {
    setEditingVariationId(variationId);
    setEditingVariationName(variationName);
    setEditingUnitId(variationUnit);
    setEditingUsage(variationUsage);
    setEditingQuantity(variationQuantity);
    setEditingPrice(variationPrice);
  };
  // All CRUD Functions
  // add function
  const handleAddVariation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { variation_name, unit_id, quantity, usage, price } = newItems; // Destructure name and id from newItems
      await dispatch(
        addVariation({ variation_name, unit_id, quantity, usage, price })
      ).unwrap();
      dispatch(fetchVariations(currentPage));
      setNewItems("");
      setShowAddForm(false);
      toast.success("Variation Created Successfully!");
    } catch (error) {
      console.error("Error adding Variation:", error);
      toast.error("Error adding Variation.");
    } finally {
      setLoading(false);
    }
  };
  // delete function
  const handleDelete = async (variationId) => {
    console.log("Deleting Variation with ID: ", variationId);
    setLoading(true);
    try {
      await dispatch(deleteVariation(variationId)).unwrap();
      dispatch(fetchVariations());
      toast.success("Variation Deleted Successfully!");
    } catch (error) {
      console.error("Failed to delete Variation:", error);
      toast.error("Error deleting Variation.");
    } finally {
      setLoading(false);
    }
  };
  // update function
  const handleUpdateVariation = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateVariation({
          id: editingVariationId,
          variation_name: editingVariationName,
          unit_id: editingUnitId,
          quantity: editingQuantity,
          usage: editingUsage,
          price: editingPrice,
        })
      ).unwrap();
      dispatch(fetchVariations(currentPage));
      toast.success("Variation Updated Successfully!");
      setEditingVariationId(null); // Reset editing state
    } catch (error) {
      console.error("Failed to update Variation:", error);
      toast.error("Error updating Variation.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">All Variations </h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="gap-5 flex">
          <TextField
            variant="outlined"
            placeholder="Search Variation"
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
          Add New Variation
        </Button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10 relative">
            <h1 className="text-lg font-semibold mb-5">Add New Variation</h1>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6" onSubmit={handleAddVariation}>
              <div className="w-full">
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  name="variation_name"
                  value={newItems.variation_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Variation Units *</InputLabel>
                <Select
                  value={newItems.unit_id || ""}
                  name="unit_id"
                  onChange={handleChange}
                  label="Variation Unit *  "
                  MenuProps={{
                    PaperProps: {
                      style: {
                        textAlign: "left",
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select Unit</em>
                  </MenuItem>
                  {/* Map through categories to create MenuItem for each */}
                  {units.map((unit, index) => (
                    <MenuItem key={unit._id || index} value={unit._id}>
                      {unit.unit_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="w-full">
                <TextField
                  fullWidth
                  label="Usage" // Update label for the numeric field
                  variant="outlined"
                  name="usage" // Update name to reflect the data it's for
                  type="number" // Specify input type as number
                  value={newItems.usage} // Bind value to the appropriate state property
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full">
                <TextField
                  fullWidth
                  label="Quantity" // Update label for the numeric field
                  variant="outlined"
                  name="quantity" // Update name to reflect the data it's for
                  type="number" // Specify input type as number
                  value={newItems.quantity} // Bind value to the appropriate state property
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full">
                <TextField
                  fullWidth
                  label="Price" // Update label for the numeric field
                  variant="outlined"
                  name="price" // Update name to reflect the data it's for
                  type="number" // Specify input type as number
                  value={newItems.price} // Bind value to the appropriate state property
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
            <div className="grid grid-cols-8 bg-[#e0f2e9] text-center text-sm md:text-base">
              {/* S.No Column */}
              <div className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center">
                Sr No.
              </div>

              {/* Name Column */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("variation_name")}
              >
                Name{" "}
                {sortConfig.key === "variation_name" ? (
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
                Unit
              </div>

              {/* Added On Column */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("usage")}
              >
                Usage{" "}
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
                onClick={() => handleSort("quantity")}
              >
                Quantity{" "}
                {sortConfig.key === "quantity" ? (
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
                onClick={() => handleSort("price")}
              >
                Price{" "}
                {sortConfig.key === "price" ? (
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
            {sortedvariations && sortedvariations.length > 0 ? (
              sortedvariations.map((variation, index) => (
                <div
                  key={variation._id || index}
                  className="grid grid-cols-8 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100"
                >
                  {/* Sr No */}
                  <div className="py-3 text-center">{index + 1}</div>

                  {/* variation Name */}
                  <div className="py-3 text-center">
                    {editingVariationId === variation._id ? (
                      <input
                        type="text"
                        value={editingVariationName}
                        onChange={(e) =>
                          setEditingVariationName(e.target.value)
                        }
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      variation.variation_name
                    )}
                  </div>

                  {/* Category ID (Display select box in edit mode) */}
                  <div className="py-3 text-center overflow-hidden">
                    {editingVariationId === variation._id ? (
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Unit</InputLabel>
                        <Select
                          value={editingUnitId}
                          name="unit_id"
                          onChange={(e) => setEditingUnitId(e.target.value)}
                          label="Unit"
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
                            <em>Select Unit</em>
                          </MenuItem>
                          {/* Map through units to create MenuItem for each */}
                          {units.map((unit) => (
                            <MenuItem key={unit._id} value={unit._id}>
                              {unit.unit_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      variation.unit_id?.unit_name || "No Unit" // Safely access unit_name with optional chaining
                    )}
                  </div>

                  <div className="py-3 text-center ">
                    {editingVariationId === variation._id ? (
                      <input
                        type="text"
                        value={editingUsage}
                        onChange={(e) => setEditingUsage(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      variation.usage
                    )}
                  </div>
                  <div className="py-3 text-center">
                    {editingVariationId === variation._id ? (
                      <input
                        type="text"
                        value={editingQuantity}
                        onChange={(e) => setEditingQuantity(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      variation.quantity
                    )}
                  </div>
                  <div className="py-3 text-center">
                    {editingVariationId === variation._id ? (
                      <input
                        type="text"
                        value={editingPrice}
                        onChange={(e) => setEditingPrice(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      variation.price
                    )}
                  </div>
                  {/* Added On */}
                  <div className="py-3 text-center">
                    {new Date(variation.createdAt).toLocaleDateString("en-GB")}
                  </div>

                  {/* Actions */}
                  <div className="py-3 text-center flex justify-center">
                    {editingVariationId === variation._id ? (
                      <>
                        <button
                          className="mx-2 text-green-500 hover:text-green-700"
                          onClick={handleUpdateVariation}
                        >
                          <FaSave />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => setEditingVariationId(null)}
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
                              variation._id,
                              variation.variation_name,
                              variation.unit_id,
                              variation.usage,
                              variation.quantity,
                              variation.price
                            )
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(variation._id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">No Variations Found</div>
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

export default Variation;
