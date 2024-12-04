import mongoose from "mongoose";

const purchase_Schema = new mongoose.Schema(
  {
    purchase_product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    purchase_quantity: {
      type: Number,
      required: true,
    },

    purchase_price: {
      type: Number,
      required: true,
    },
    purchase_usage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const Purchase = mongoose.model("Purchase", purchase_Schema);
export default Purchase;
