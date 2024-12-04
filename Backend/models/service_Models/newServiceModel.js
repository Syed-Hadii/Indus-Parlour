import mongoose from "mongoose";

const newServiceSchema = new mongoose.Schema(
  {
    service_title: {
      type: String,
      required: true,
    },
    service_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service_Category",
      required: true,
    },
    service_price: {
      type: Number,
      required: true,
    },
    service_product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    product_usage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const New_Service = mongoose.model("New_Service", newServiceSchema);
export default New_Service;
