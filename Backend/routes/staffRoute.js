import express from "express";
import {
  addStaff,
  deleteStaff,
  getStaff,
  updateStaff,
} from "../controllers/staffController.js";
const StaffRouter = express.Router();

StaffRouter.post("/add_Staff", addStaff);
StaffRouter.get("/get_Staff", getStaff);
StaffRouter.put("/update_Staff", updateStaff);
StaffRouter.delete("/delete_Staff", deleteStaff);

export default StaffRouter;
