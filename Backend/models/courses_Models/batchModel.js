import mongoose from "mongoose";

const batch_Schema = new mongoose.Schema(
  {
    batch_start_date: {
      type: Date,
      required: true,
    },
    batch_end_date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Batch = mongoose.model("Batch", batch_Schema);
export default Batch;
