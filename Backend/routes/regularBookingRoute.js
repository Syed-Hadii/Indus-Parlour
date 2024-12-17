import express from "express";
import {
  addRegular_Booking,
  deleteRegular_Booking,
  getRegular_Booking,
  updateRegular_Booking,
  getRecieptNo
} from "../controllers/regularBookingController.js";

const regularBookingRouter = express.Router();

regularBookingRouter.post("/add_regularbooking", addRegular_Booking);
regularBookingRouter.get("/get_regularbooking", getRegular_Booking);
regularBookingRouter.put("/update_regularbooking", updateRegular_Booking);
regularBookingRouter.delete("/delete_regularbooking", deleteRegular_Booking);
// Fetching data with reciept
regularBookingRouter.post("/reciept_data", getRecieptNo);

export default regularBookingRouter;
