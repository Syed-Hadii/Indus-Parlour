import mongoose from "mongoose";

const stock_Schema = new mongoose.Schema(
  {
    stock_product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    stock_quantity: {
      type: Number,
      required: true,
    }, 
    stock_usage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const Stock = mongoose.model("Stock", stock_Schema);
export default Stock;
