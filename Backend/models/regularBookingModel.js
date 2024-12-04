import mongoose from "mongoose";

const regularBooking_Schema = new mongoose.Schema(
  {
    regular_packages: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    package_services_n_staff: [
      {
        package_services: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "New_Service",
          required: true,
        },
        package_staff: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Staff",
          required: true,
        },
      },
    ],
    regular_customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    services_n_staff: [
      {
        regular_services: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "New_Service",
          required: true,
        },
        regular_staff: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Staff",
          required: true,
        },
      },
    ],

    regular_payment_type: {
      type: String,
      required: true,
      enum: ["Cash", "Card"],
    },
    regular_discount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    regular_recieve_amount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Amount cannot be negative"],
    },
    regular_appointment_time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Regular_Booking = mongoose.model(
  "Regular_Booking",
  regularBooking_Schema
);
export default Regular_Booking;
