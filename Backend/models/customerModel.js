import mongoose from "mongoose";

const customer_Schema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
      required: true,
    },

    cell_no: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Customer = mongoose.model("Customer", customer_Schema);
export default Customer;
