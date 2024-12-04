import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSearch,
  FaSortUp,
  FaSortDown,
  FaSort
} from "react-icons/fa";
import {
  fetchUnits,
  addUnit,
  deleteUnit,
  updateUnit,
} from "../../../redux/slices/ProductSlices/unitsSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Pagination, IconButton } from "@mui/material";

const Unit = () => { 
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUnit, setNewUnit] = useState("");
  const [editingUnitId, setEditingUnitId] = useState(null);
  const [editingUnitName, setEditingUnitName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "unit_name",
    direction: "asc",
  });

   const dispatch = useDispatch();
   const units = useSelector((state) => state.units.data);
   const status = useSelector((state) => state.units.status);
   const totalPages = useSelector((state) => state.units.totalPages);
   const currentPage = useSelector((state) => state.units.currentPage);
   const [loading, setLoading] = useState(false);

   //  All Functions are below:
   // Fetch units with pagination and search
   useEffect(() => {
     if (status === "idle") {
       setLoading(true);
       dispatch(
         fetchUnits({ page: currentPage || 1, search: searchQuery })
       ).finally(() => setLoading(false));
     }
   }, [status, dispatch, currentPage, searchQuery]);

   const handlePageChange = (event, page) => {
     setLoading(true);
     dispatch(fetchUnits({ page, search: searchQuery })).finally(() =>
       setLoading(false)
     );
   };

   const handleSearchSubmit = () => {
     dispatch(fetchUnits({ page: 1, search: searchQuery }));
   };

   const handleKeyPress = (event) => {
     if (event.key === "Enter") {
       handleSearchSubmit();
     }
   };
   const handleEdit = (unitId, unitName) => {
     setEditingUnitId(unitId);
     setEditingUnitName(unitName);
   };
    

   // Filter and sort units locally
 const sortedUnits = [...units] // Create a shallow copy to prevent direct mutation
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
   // Add Unit Function
   const handleAddUnit = async (e) => {
     e.preventDefault();
     setLoading(true);
     try {
       await dispatch(addUnit(newUnit)).unwrap();
       dispatch(fetchUnits(currentPage));
       setNewUnit("");
       setShowAddForm(false);
       toast.success("Unit Created Successfully!");
     } catch (error) {
       console.error("Error adding unit:", error);
       toast.error("Error adding unit.");
     } finally {
       setLoading(false);
     }
   };
   // Delete Unit Function
   const handleDelete = async (unitId) => {
     console.log("Deleting Unit with ID: ", unitId);
     setLoading(true);
     try {
       await dispatch(deleteUnit(unitId)).unwrap();
       dispatch(fetchUnits());
       toast.success("Unit Deleted Successfully!");
     } catch (error) {
       console.error("Failed to delete Unit:", error);
       toast.error("Error deleting Unit.");
     } finally {
       setLoading(false);
     }
   };
   // update Unit function
   const handleUpdateUnit = async () => {
     setLoading(true);
     try {
       await dispatch(
         updateUnit({
           id: editingUnitId,
           unit_name: editingUnitName,
         })
       ).unwrap();
       dispatch(fetchUnits(currentPage));
       toast.success("Unit Updated Successfully!");
       setEditingUnitId(null); // Reset editing state
     } catch (error) {
       console.error("Failed to update Unit:", error);
       toast.error("Error updating Unit.");
     } finally {
       setLoading(false);
     }
   };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">All Units </h1>
      <div className="flex justify-between flex-wrap gap-3">
        <TextField
          variant="outlined"
          placeholder="Search Unit"
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
        <Button
          variant="contained"
          startIcon={<FaPlus />}
          onClick={() => setShowAddForm(true)}
          sx={{
            backgroundColor: "#1abc9c",
            "&:hover": { backgroundColor: "#16a085" },
          }}
        >
          Add New Unit
        </Button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10 relative">
            <h1 className="text-lg font-semibold mb-5">Add New Unit</h1>
            <hr className="mb-6 border-gray-400" />
            <form onSubmit={handleAddUnit} className="space-y-6">
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                required
              />
              <div className="pt-8 flex justify-end gap-7">
                <Button color="secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#1abc9c",
                    "&:hover": { backgroundColor: "#16a085" },
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
                onClick={() => handleSort("unit_name")}
              >
                Name{" "}
                {sortConfig.key === "unit_name" ? (
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
            {/* Data Row */}
            {sortedUnits && sortedUnits.length > 0 ? (
              sortedUnits.map((unit, index) => (
                <div
                  key={unit._id || index}
                  className="grid grid-cols-4 border-b text-gray-700 hover:bg-gray-100"
                >
                  <div className="py-3 text-center">{index + 1}</div>
                  <div className="py-3 text-center">
                    {editingUnitId === unit._id ? (
                      <input
                        type="text"
                        value={editingUnitName}
                        onChange={(e) => setEditingUnitName(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      unit.unit_name
                    )}
                  </div>
                  <div className="py-3 text-center">
                    {new Date(unit.createdAt).toLocaleDateString("en-GB")}
                  </div>
                  <div className="py-3 text-center flex justify-center">
                    {editingUnitId === unit._id ? (
                      <>
                        <button
                          onClick={handleUpdateUnit}
                          className="mx-2 text-green-500"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={() => setEditingUnitId(null)}
                          className="mx-2 text-red-500"
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(unit._id, unit.unit_name)}
                          className="mx-2 text-blue-500"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(unit._id)}
                          className="mx-2 text-red-500"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-5 text-gray-500">No Units Found.</p>
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

export default Unit;
