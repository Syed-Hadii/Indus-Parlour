import mongoose from "mongoose";

const package_Schema = new mongoose.Schema(
  {
    package_title: {
      type: String,
      required: true,
    },

    package_price: {
      type: Number,
      required: true,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "New_Service",
        required: true,
      },
    ],
  },
  { timestamps: true }
);
const Package = mongoose.model("Package", package_Schema);
export default Package;
