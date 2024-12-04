import express from "express";
import {
  addExpense,
  deleteExpense,
  getExpense,
  updateExpense,
} from "../controllers/expenseController.js";
const expenseRouter = express.Router();

expenseRouter.post("/add_expense", addExpense);
expenseRouter.get("/get_expense", getExpense);
expenseRouter.put("/update_expense", updateExpense);
expenseRouter.delete("/delete_expense", deleteExpense);

export default expenseRouter;
