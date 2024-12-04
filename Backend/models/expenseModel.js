import mongoose from "mongoose";

const expense_Schema = new mongoose.Schema(
  {
    expense_purpose: {
      type: String,
      required: true,
    },
    expense_amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const Expense = mongoose.model("Expense", expense_Schema);
export default Expense;
