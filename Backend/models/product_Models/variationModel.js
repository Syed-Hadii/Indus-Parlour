import mongoose from "mongoose";
const variationSchema = new mongoose.Schema(
  {
    variation_name: {
      type: String,
      required: true,
    },
    unit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    usage: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const Variation = mongoose.model("Variation", variationSchema);
export default Variation;
