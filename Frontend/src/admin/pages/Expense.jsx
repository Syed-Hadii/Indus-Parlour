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
  fetchExpense,
  addExpense,
  deleteExpense,
  updateExpense,
} from "../../redux/slices/expenseSlice";
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

const Expense = () => { 
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItems, setNewItems] = useState({
    expense_purpose: "",
    expense_amount: "",
  });
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editingExpensePurpose, setEditingExpensePurpose] = useState("");
  const [editingExpenseAmount, setEditingExpenseAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "expense_purpose",
    direction: "asc",
  });

  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses?.data || []);
  const status = useSelector((state) => state.expenses.status);
  const totalPages = useSelector((state) => state.expenses.totalPages);
  const currentPage = useSelector((state) => state.expenses.currentPage);
  const [loading, setLoading] = useState(false);

  //  All Functions are below:

  // Fetch services with pagination and search

  useEffect(() => {
    if (status === "idle") {
      setLoading(true);
      dispatch(
        fetchExpense({ page: currentPage || 1, search: searchQuery })
      ).finally(() => setLoading(false));
    }
    console.log("all Expenses  :", expenses);
  }, [status, dispatch, currentPage, searchQuery]);

  const handlePageChange = (event, page) => {
    setLoading(true);
    dispatch(fetchExpense({ page, search: searchQuery })).finally(() =>
      setLoading(false)
    );
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItems({ ...newItems, [name]: value });
  };

  const handleSearchSubmit = () => {
    dispatch(fetchExpense({ page: 1, search: searchQuery }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };
  const handleEdit = (expenseId, expensePurpose, expenseAmount) => {
    setEditingExpenseId(expenseId);
    setEditingExpensePurpose(expensePurpose);
    setEditingExpenseAmount(expenseAmount);
  };
  // Filter expenses based on search query
  const sortedExpenses = [...expenses] // Create a shallow copy to prevent direct mutation
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
  // Add Expense Function
  const handleAddExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { expense_purpose, expense_amount } = newItems;

      // Passing parameters as a single object
      await dispatch(
        addExpense({
          expense_purpose,
          expense_amount,
        })
      ).unwrap();

      dispatch(fetchExpense(currentPage)); // Refresh the services list
      setNewItems("");
      setShowAddForm(false);
      toast.success("Expense Created Successfully!");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Error adding expense.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Expense Function
  const handleDelete = async (expenseId) => {
    console.log("Deleting expense with ID: ", expenseId);
    setLoading(true);
    try {
      await dispatch(deleteExpense(expenseId)).unwrap();
      dispatch(fetchExpense());
      toast.success("Expense Deleted Successfully!");
    } catch (error) {
      console.error("Failed to delete expense:", error);
      toast.error("Error deleting expense.");
    } finally {
      setLoading(false);
    }
  };
  // update expense function
  const handleUpdateExpense = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateExpense({
          id: editingExpenseId,
          expense_purpose: editingExpensePurpose,
          expense_amount: editingExpenseAmount,
        })
      ).unwrap();
      dispatch(fetchExpense(currentPage));
      toast.success("Expense Updated Successfully!");
      setEditingExpenseId(null); // Reset editing state
    } catch (error) {
      console.error("Failed to update expense:", error);
      toast.error("Error updating expense.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">All Expense </h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="gap-5 flex">
          <TextField
            variant="outlined"
            placeholder="Search Expense"
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
          Add New Expense
        </Button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10 relative">
            <h1 className="text-lg font-semibold mb-5">Add New Expense</h1>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6" onSubmit={handleAddExpense}>
              <div className="w-full">
                <TextField
                  fullWidth
                  label="  Purpose"
                  variant="outlined"
                  name="expense_purpose"
                  value={newItems.expense_purpose}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="w-full">
                <TextField
                  fullWidth
                  label="Amount"
                  variant="outlined"
                  name="expense_amount"
                  type="number"
                  value={newItems.expense_amount}
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
          <div className="bg-white border border-[#fcefde] rounded-lg shadow-lg overflow-hidden min-w-[350px]">
            {/* Header Row */}
            <div className="grid grid-cols-4 bg-[#fcefde] text-center text-sm md:text-base">
              {/* Sortable S.No Column */}
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer flex justify-center items-center"
                onClick={() => handleSort("expense_purpose")}
              >
                S.No{" "}
                {sortConfig.key === "expense_purpose" ? (
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
                onClick={() => handleSort("expense_purpose")}
              >
                Purpose{" "}
                {sortConfig.key === "expense_purpose" ? (
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
                onClick={() => handleSort("expense_amount")}
              >
                Amount{" "}
                {sortConfig.key === "expense_amount" ? (
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
            {sortedExpenses && sortedExpenses.length > 0 ? (
              sortedExpenses.map((expense, index) => (
                <div
                  key={expense._id || index}
                  className="grid grid-cols-4 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100"
                >
                  <div className="py-3 text-center">{index + 1}</div>
                  <div className="py-3 text-center">
                    {editingExpenseId === expense._id ? (
                      <input
                        type="text"
                        value={editingExpensePurpose}
                        onChange={(e) =>
                          setEditingExpensePurpose(e.target.value)
                        }
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      expense.expense_purpose
                    )}
                  </div>
                  <div className="py-3 text-center">
                    {editingExpenseId === expense._id ? (
                      <input
                        type="text"
                        value={editingExpenseAmount}
                        onChange={(e) =>
                          setEditingExpenseAmount(e.target.value)
                        }
                        className="w-full bg-blue-100 text-center"
                      />
                    ) : (
                      expense.expense_amount
                    )}
                  </div>

                  <div className="py-3 text-center flex justify-center">
                    {editingExpenseId === expense._id ? (
                      <>
                        <button
                          className="mx-2 text-green-500 hover:text-green-700"
                          onClick={handleUpdateExpense}
                        >
                          <FaSave />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => setEditingExpenseId(null)}
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
                              expense._id,
                              expense.expense_purpose,
                              expense.expense_amount
                            )
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="mx-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(expense._id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">No Expense Found</div>
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

export default Expense;
