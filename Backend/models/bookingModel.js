import mongoose from "mongoose";

const booking_Schema = new mongoose.Schema(
  {
    booking_date: {
      type: Date,
      required: true,
    },

    booking_service_type: {
      type: String,
      required: true,
      enum: ["Regular", "Bridal"],
      message: "{VALUE} is not a valid service type",
    },
    booking_services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "New_Service",
        required: true,
      },
    ],
    booking_packages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
        required: true,
      },
    ],
    booking_customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    booking_payment_type: {
      type: String,
      required: true,
      enum: ["Cash", "Card"],
    },
    booking_advance: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Advance cannot be negative"],
    },
    booking_discount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    booking_appointment_time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Booking = mongoose.model("Booking", booking_Schema);
export default Booking;
