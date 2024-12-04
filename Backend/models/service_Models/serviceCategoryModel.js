import mongoose from "mongoose";

const serviceCategorySchema = new mongoose.Schema(
  {
    service_category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Service_Category = mongoose.model(
  "Service_Category",
  serviceCategorySchema
);
export default Service_Category;
