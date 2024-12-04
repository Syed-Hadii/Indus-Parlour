import mongoose from "mongoose";

const staff_Schema = new mongoose.Schema(
  {
    staff_name: {
      type: String,
      required: true,
    },
    staff_designation: {
      type: String,
      required: true,
    },
    staff_start_time: {
      type: String,
      required: true,
    },
    staff_end_time: {
      type: String,
      required: true,
    },
    staff_salary: {
      type: Number,
      required: true,
    },
    staff_join_date: {
      type: Date,
      required: true,
    },
    staff_cell: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Staff = mongoose.model("Staff", staff_Schema);
export default Staff;
