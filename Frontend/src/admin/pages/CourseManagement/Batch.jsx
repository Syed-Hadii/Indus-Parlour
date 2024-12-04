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
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { useSelector } from "react-redux";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";


const Batch = () => {
  const url = "http://localhost:3002";
  const [showAddForm, setShowAddForm] = useState(false);
    const data = useSelector((state) => state.product.data);
      const [startDate, setStartDate] = useState(null);
      const [endDate, setEndDate] = useState(null);
  const [sortedData, setSortedData] = useState(data);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });
  const [newItems, setNewItems] = useState({
    name: "",
    unit: "",
    store_id: "",
    pkg_qty: "",
    pkg_amount: "",
  });
  const [entriesToShow, setEntriesToShow] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const handleEntriesChange = (event) => {
    setEntriesToShow(event.target.value);
    setCurrentPage(1); // Reset to first page when entries per page change
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate pagination data
  const startIndex = (currentPage - 1) * entriesToShow;
  const endIndex = startIndex + entriesToShow;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItems({ ...newItems, [name]: value });
  };

  const toggleSort = (columnKey) => {
    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnKey, direction });

    const sortedArray = [...data].sort((a, b) => {
      if (a[columnKey] < b[columnKey]) return direction === "asc" ? -1 : 1;
      if (a[columnKey] > b[columnKey]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setSortedData(sortedArray);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">All Batches </h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="gap-5 flex">
          <TextField
            variant="outlined"
            placeholder="Search Batch"
            size="small"
            className="w-72"
            InputProps={{
              endAdornment: <FaSearch className="text-gray-500" />,
            }}
          />
          {/* Entries Dropdown */}
          <FormControl size="small" variant="outlined" className="w-24">
            <InputLabel>Show entries</InputLabel>
            <Select
              value={entriesToShow}
              onChange={handleEntriesChange}
              label="Show entries"
            >
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={10}>10</MenuItem>
            </Select>
          </FormControl>
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
          Add Batch
        </Button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10 relative">
            <h1 className="text-lg font-semibold mb-5">Add New Batch</h1>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                {/* Start Date Field */}
                <FormControl fullWidth variant="outlined">
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </FormControl>

                {/* End Date Field */}
                <FormControl fullWidth variant="outlined">
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </FormControl>
              </LocalizationProvider>

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
                      backgroundColor: "#16a085",
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

      <div className="mt-4 grid grid-cols-1 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-6 bg-[#e0f2e9] text-center text-sm md:text-base">
            {/* Sortable S.No Column */}
            <div
              className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
              onClick={() => toggleSort("srNo")}
            >
              S.No{" "}
              {sortConfig.key === "srNo" ? (
                sortConfig.direction === "asc" ? (
                  <FaSortUp className="ml-1" />
                ) : (
                  <FaSortDown className="ml-1" />
                )
              ) : (
                <FaSort className="ml-1" />
              )}
            </div>

            {/* Sortable Name Column */}
            <div
              className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
              onClick={() => toggleSort("title")}
            >
              Course Start Date{" "}
              {sortConfig.key === "title" ? (
                sortConfig.direction === "asc" ? (
                  <FaSortUp className="ml-1" />
                ) : (
                  <FaSortDown className="ml-1" />
                )
              ) : (
                <FaSort className="ml-1" />
              )}
            </div>
            {/* Category */}
            <div
              className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
              onClick={() => toggleSort("category")}
            >
              Course Start Date{" "}
              {sortConfig.key === "category" ? (
                sortConfig.direction === "asc" ? (
                  <FaSortUp className="ml-1" />
                ) : (
                  <FaSortDown className="ml-1" />
                )
              ) : (
                <FaSort className="ml-1" />
              )}
            </div>

            {/* Sortable Added On Column */}
            <div
              className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
              onClick={() => toggleSort("price")}
            >
              Slug{" "}
              {sortConfig.key === "price" ? (
                sortConfig.direction === "asc" ? (
                  <FaSortUp className="ml-1" />
                ) : (
                  <FaSortDown className="ml-1" />
                )
              ) : (
                <FaSort className="ml-1" />
              )}
            </div>
            <div
              className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
              onClick={() => toggleSort("date")}
            >
              Added On{" "}
              {sortConfig.key === "date" ? (
                sortConfig.direction === "asc" ? (
                  <FaSortUp className="ml-1" />
                ) : (
                  <FaSortDown className="ml-1" />
                )
              ) : (
                <FaSort className="ml-1" />
              )}
            </div>

            <div className="py-3 text-gray-800 font-semibold">Actions</div>
          </div>

          {/* Data Rows */}
          {paginatedData.map((item) => (
            <div
              key={item.srNo}
              className="grid grid-cols-6 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100"
            >
              <div className="py-3 text-center">{item.srNo}</div>
              <div className="py-3 text-center">{item.date}</div>
              <div className="py-3 text-center">{item.date}</div>
              <div className="py-3 text-center">{item.slug}</div>
              <div className="py-3 text-center">{item.date}</div>
              <div className="py-3 text-center flex justify-center">
                {/* Action Buttons */}
                <button className="text-green-600 py-1 px-2 rounded-md flex items-center gap-2 mr-2">
                  <FaEdit className="text-sm" />
                </button>
                <button className="text-red-600 py-1 px-2 rounded-md flex items-center">
                  <FaTrash className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center mt-4">
        <Pagination
          count={Math.ceil(data.length / entriesToShow)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default Batch;
