import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    unit_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Unit = mongoose.model("Unit", unitSchema);
export default Unit;
