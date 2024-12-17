import mongoose from "mongoose";

// Create a schema to store the last used receipt number
const receiptCounterSchema = new mongoose.Schema({
  currentReceiptNumber: {
    type: Number,
    default: 0,
  },
});

const ReceiptCounter = mongoose.model("ReceiptCounter", receiptCounterSchema);

export default ReceiptCounter;
