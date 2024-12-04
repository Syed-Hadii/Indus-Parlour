import Expense from "../models/expenseModel.js";

const addExpense = async (req, res) => {
  const { expense_purpose, expense_amount } = req.body;
  try {
    const newExpense = new Expense({
      expense_purpose,
      expense_amount,
    });
    await newExpense.save();
    res.json({ success: true, message: "Expense added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding Expense." });
  }
};
const getExpense = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  const skip = (page - 1) * limit;
  const fetchAll = req.query.all === "true"; // Check if `all` parameter is set to "true"
  const search = req.query.search || ""; // Get search term if provided

  try {
    let query = {};

    // If search term is provided, use it in query
    if (search) {
      query.expense_purpose = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // If `fetchAll` is true, return all categories matching the search (without pagination)
    if (fetchAll) {
      const allExpenses = await Expense.find(query);
      res.json({
        totalExpenses: allExpenses.length,
        totalPages: 1,
        currentPage: 1,
        expenses: allExpenses,
      });
    } else {
      // Paginated fetch with search
      const totalExpenses = await Expense.countDocuments(query);
      const expenses = await Expense.find(query).skip(skip).limit(limit);

      res.json({
        totalExpenses,
        totalPages: Math.ceil(totalExpenses / limit),
        currentPage: page,
        expenses,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteExpense = async (req, res) => {
  //   const check_service = await Expense.findOne({ service: req.body.id });
  //   if (check_service) {
  //     return res.json({
  //       success: false,
  //       message: "service Is Already In Expense",
  //     });
  //   } else {
  const result = await Expense.deleteOne({ _id: req.body._id });
  console.log(result);

  return res.json({ success: true, message: "Expense is deleted" });
};
// };
const updateExpense = async (req, res) => {
  const { id, expense_purpose, expense_amount } = req.body;
  try {
    const updatedData = {
      expense_purpose,
      expense_amount,
    };

    const expense = await Expense.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "Expense is updated successfully",
      data: expense,
    });
  } catch (error) {
    console.error("Error updating Expense:", error);
    res.json({ success: false, message: "Server error", error });
  }
};

export { addExpense, getExpense, deleteExpense, updateExpense };
