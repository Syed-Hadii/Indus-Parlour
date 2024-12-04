import mongoose from "mongoose";
const brandSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", 
    },
    brand_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
