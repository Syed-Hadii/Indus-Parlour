import express from "express";
import {
  addBooking,
  deleteBooking,
  getBooking,
  updateBooking, 
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/add_booking", addBooking);
bookingRouter.get("/get_booking", getBooking);
bookingRouter.put("/update_booking", updateBooking);
bookingRouter.delete("/delete_booking", deleteBooking); 

export default bookingRouter;
