import express from "express";
import {
  addCustomer,
  deleteCustomer,
  getCustomer,
  updateCustomer,
} from "../controllers/customerController.js";
const customerRouter = express.Router();

customerRouter.post("/add_customer", addCustomer);
customerRouter.get("/get_customer", getCustomer);
customerRouter.put("/update_customer", updateCustomer);
customerRouter.delete("/delete_customer", deleteCustomer);

export default customerRouter;
