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
  fetchStaff,
  addStaff,
  deleteStaff,
  updateStaff,
} from "../../redux/slices/staffSlice";
import { TextField, Button, IconButton } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";

import Pagination from "@mui/material/Pagination";

const Staff = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItems, setNewItems] = useState({
    staff_name: "",
    staff_designation: "",
    staff_start_time: "",
    staff_end_time: "",
    staff_salary: "",
    staff_join_date: new Date(),
    staff_cell: "",
  });
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [editingStaffName, setEditingStaffName] = useState("");
  const [editingStaffDesignation, setEditingStaffDesignation] = useState("");
  const [editingStaff_Start_time, setEditingStaff_Start_time] = useState("");
  const [editingStaff_End_time, setEditingStaff_End_time] = useState("");
  const [editingStaffSalary, setEditingStaffSalary] = useState(""); 
  const [editingStaffCell, setEditingStaffCell] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "staff_name",
    direction: "asc",
  });

  const dispatch = useDispatch();
  const staffs = useSelector((state) => state.staffs?.data || []);
  const status = useSelector((state) => state.staffs.status);
  const totalPages = useSelector((state) => state.staffs.totalPages);
  const currentPage = useSelector((state) => state.staffs.currentPage);
  const [loading, setLoading] = useState(false);

  //  All Functions are below:

  // Fetch services with pagination and search

  useEffect(() => {
    if (status === "idle") {
      setLoading(true);
      dispatch(
        fetchStaff({ page: currentPage || 1, search: searchQuery })
      ).finally(() => setLoading(false));
    }
    console.log("all Staffs  :", staffs);
  }, [status, dispatch, currentPage, searchQuery]);

  const handlePageChange = (event, page) => {
    setLoading(true);
    dispatch(fetchStaff({ page, search: searchQuery })).finally(() =>
      setLoading(false)
    );
  };
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setNewItems((prev) => ({
      ...prev,
      [name]: type === "time" || type === "date" ? value : value,
    }));
  };
  const handleDateChange = (date) => {
    setNewItems((prev) => ({
      ...prev,
      staff_join_date: date,
    }));
  };

  const handleSearchSubmit = () => {
    dispatch(fetchStaff({ page: 1, search: searchQuery }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  const handleEdit = (
    staffId,
    name,
    designation,
    startTime,
    endTime,
    salary, 
    cell
  ) => {
    setEditingStaffId(staffId);
    setEditingStaffName(name);
    setEditingStaffDesignation(designation);
    setEditingStaff_Start_time(startTime);
    setEditingStaff_End_time(endTime);
    setEditingStaffSalary(salary); 
    setEditingStaffCell(cell);
  };
  // Filter staffs based on search query
  const sortedStaffs = [...staffs] // Create a shallow copy to prevent direct mutation
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
  const formClose = () => {
    setShowAddForm(false);
    setNewItems({
      staff_name: "",
      staff_designation: "",
      staff_start_time: "",
      staff_end_time: "",
      staff_salary: "",
      staff_join_date: "",
      staff_cell: "",
    });
  };
  // * All CRUD Functions *
  // Add Staff Function
  const handleAddStaff = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(addStaff(newItems)).unwrap();
      dispatch(fetchStaff());
      toast.success("Staff Created Successfully!");
      setNewItems({
        staff_name: "",
        staff_designation: "",
        staff_start_time: "",
        staff_end_time: "",
        staff_salary: "",
        staff_join_date: new Date(),
        staff_cell: "",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error("Error adding staff.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Staff Function
  const handleDelete = async (staffId) => {
    console.log("Deleting staff with ID: ", staffId);
    setLoading(true);
    try {
      await dispatch(deleteStaff(staffId)).unwrap();
      dispatch(fetchStaff());
      toast.success("Staff Deleted Successfully!");
    } catch (error) {
      console.error("Failed to delete staff:", error);
      toast.error("Error deleting staff.");
    } finally {
      setLoading(false);
    }
  };
  // update staff function
  const handleUpdateStaff = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateStaff({
          _id: editingStaffId,
          staff_name: editingStaffName,
          staff_designation: editingStaffDesignation,
          staff_start_time: editingStaff_Start_time,
          staff_end_time: editingStaff_End_time,
          staff_salary: editingStaffSalary, 
          staff_cell: editingStaffCell,
        })
      ).unwrap();
      dispatch(fetchStaff(currentPage));
      toast.success("Staff Updated Successfully!");
      setEditingStaffId(null); // Reset editing state
    } catch (error) {
      console.error("Failed to update staff:", error);
      toast.error("Error updating staff.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">All Staff </h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="gap-5 flex">
          <TextField
            variant="outlined"
            placeholder="Search Staff"
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
          Add New Staff
        </Button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] max-h-[80vh] overflow-y-auto">
            <div className="border flex justify-between items-center p-5">
              <h1 className="text-lg font-semibold mb-0 mx-auto">Add Staff</h1>
              <FaTimes
                className="cursor-pointer"
                aria-label="Close form"
                onClick={formClose}
              />
            </div>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6 mt-5" onSubmit={handleAddStaff}>
              {/* Staff Name */}
              <TextField
                fullWidth
                label="Staff Name"
                variant="outlined"
                name="staff_name"
                value={newItems.staff_name}
                onChange={handleChange}
                required
              />
              {/* Designation */}
              <TextField
                fullWidth
                label="Designation"
                variant="outlined"
                name="staff_designation"
                value={newItems.staff_designation}
                onChange={handleChange}
                required
              />
              {/* Timings */}
              <div className="flex justify-between gap-5">
                <TextField
                  type="time"
                  label="Start Time"
                  name="staff_start_time"
                  value={newItems.staff_start_time}
                  onChange={handleChange}
                  required
                  className="w-[48%]"
                />
                <TextField
                  type="time"
                  label="End Time"
                  name="staff_end_time"
                  value={newItems.staff_end_time}
                  onChange={handleChange}
                  required
                  className="w-[48%]"
                />
              </div>
              {/* Salary */}
              <TextField
                fullWidth
                label="Salary"
                variant="outlined"
                name="staff_salary"
                value={newItems.staff_salary}
                onChange={handleChange}
                required
              />
              {/* Joining Date */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Joining Date"
                  value={newItems.staff_join_date}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
              {/* Cell Number */}
              <TextField
                fullWidth
                label="Cell #"
                variant="outlined"
                name="staff_cell"
                value={newItems.staff_cell}
                onChange={handleChange}
                required
              />
              {/* Buttons */}
              <div className="pt-8 flex justify-end gap-7">
                <Button
                  sx={{
                    color: "red",
                  }}
                  onClick={formClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
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
          <div className="bg-white border border-[#fcefde] rounded-lg shadow-lg overflow-hidden min-w-[1000px]">
            {/* Header Row */}
            <div className="grid grid-cols-9 bg-[#fcefde] text-center text-sm md:text-base">
              {/* Sortable S.No Column */}
              <div className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center">
                S.No{" "}
              </div>

              {/* Sortable Name Column */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("staff_name")}
              >
                Staff Name{" "}
                {sortConfig.key === "staff_name" ? (
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
                onClick={() => handleSort("staff_designation")}
              >
                Designation{" "}
                {sortConfig.key === "staff_designation" ? (
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
                onClick={() => handleSort("staff_start_time")}
              >
                Start Time{" "}
                {sortConfig.key === "staff_start_time" ? (
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
                onClick={() => handleSort("staff_end_time")}
              >
                End Time{" "}
                {sortConfig.key === "staff_end_time" ? (
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
                onClick={() => handleSort("staff_salary")}
              >
                Salary{" "}
                {sortConfig.key === "staff_salary" ? (
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
                onClick={() => handleSort("staff_join_date")}
              >
                Joining Date{" "}
                {sortConfig.key === "staff_join_date" ? (
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
                onClick={() => handleSort("staff_cell")}
              >
                Cell #{" "}
                {sortConfig.key === "staff_cell" ? (
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

              <div className="py-3 text-gray-800 font-semibold">Actions</div>
            </div>

            {/* Data Rows */}
            {sortedStaffs && sortedStaffs.length > 0 ? (
              sortedStaffs.map((staff, index) => (
                <div
                  key={staff._id || index}
                  className="grid grid-cols-9 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100"
                >
                  <div className="py-3 text-center">{index + 1}</div>
                  {/* Staff Name */}
                  <div className="py-3 text-center">
                    {editingStaffId === staff._id ? (
                      <input
                        type="text"
                        value={editingStaffName}
                        onChange={(e) => setEditingStaffName(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      staff.staff_name
                    )}
                  </div>
                  {/* Designatoin */}
                  <div className="py-3 text-center">
                    {editingStaffId === staff._id ? (
                      <input
                        type="text"
                        value={editingStaffDesignation}
                        onChange={(e) =>
                          setEditingStaffDesignation(e.target.value)
                        }
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      staff.staff_designation
                    )}
                  </div>
                  {/* Start Time */}
                  <div className="py-3 text-center">
                    {editingStaffId === staff._id ? (
                      <div className="flex justify-center items-center space-x-2">
                        {/* Hour Dropdown (1-12) */}
                        <select
                          value={editingStaff_Start_time?.split(" ")[0]} // Get the hour part (1-12)
                          onChange={(e) =>
                            setEditingStaff_Start_time(
                              `${e.target.value} ${
                                editingStaff_Start_time.split(" ")[1]
                              }`
                            )
                          }
                          className="w-16 bg-blue-100 text-center"
                        >
                          {[...Array(12).keys()].map((hour) => (
                            <option key={hour + 1} value={hour + 1}>
                              {hour + 1}
                            </option>
                          ))}
                        </select>

                        {/* AM/PM Dropdown */}
                        <select
                          value={editingStaff_Start_time?.split(" ")[1]} // Get the AM/PM part
                          onChange={(e) =>
                            setEditingStaff_Start_time(
                              `${editingStaff_Start_time.split(" ")[0]} ${
                                e.target.value
                              }`
                            )
                          }
                          className="w-16 bg-blue-100 text-center"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    ) : (
                      staff.staff_start_time
                    )}
                  </div>
                  {/* End TIme */}
                  <div className="py-3 text-center">
                    {editingStaffId === staff._id ? (
                      <input
                        type="text"
                        value={editingStaff_End_time}
                        onChange={(e) =>
                          setEditingStaff_End_time(e.target.value)
                        }
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      staff.staff_end_time
                    )}
                  </div>
                  {/* Salary */}
                  <div className="py-3 text-center">
                    {editingStaffId === staff._id ? (
                      <input
                        type="text"
                        value={editingStaffSalary}
                        onChange={(e) => setEditingStaffSalary(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      staff.staff_salary
                    )}
                  </div>
                  {/* Join Date */}
                  <div className="py-3 text-center">
                    {new Date(staff.staff_join_date).toLocaleDateString(
                      "en-GB"
                    )}
                  </div>
                  {/* Cell # */}
                  <div className="py-3 text-center">
                    {editingStaffId === staff._id ? (
                      <input
                        type="text"
                        value={editingStaffCell}
                        onChange={(e) => setEditingStaffCell(e.target.value)}
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      staff.staff_cell
                    )}
                  </div>

                  <div className="py-3 text-center flex justify-center">
                    {editingStaffId === staff._id ? (
                      <>
                        <button
                          className="mx-2 text-green-500 hover:text-green-700"
                          onClick={handleUpdateStaff}
                        >
                          <FaSave />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => setEditingStaffId(null)}
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
                              staff._id,
                              staff.staff_name,
                              staff.staff_designation,
                              staff.staff_start_time,
                              staff.staff_end_time,
                              staff.staff_salary,
                              staff.staff_cell
                            )
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(staff._id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">No Staff Found</div>
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

export default Staff;
