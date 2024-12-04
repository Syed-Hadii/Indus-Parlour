import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true, 
    },
    product_name: {
      type: String,
      required: true,
    },
    variation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variation",
      required: true,
    },
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", productSchema);
export default Product;
