import mongoose from "mongoose";

const booking_Schema = new mongoose.Schema(
  {
    booking_type: {
      type: String,
      required: true,
      enum: ["Regular", "Bridal"],
      message: "{VALUE} is not a valid service type",
    },
    // Required for "Regular", excluded for "Bridal"
    booking_date: {
      type: Date,
      required: true,
    },
    booking_appointment_time: {
      type: Date,
      required: function () {
        return this.booking_type === "Regular";
      },
    },
    booking_services: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "New_Service",
          required: true,
        },
        service_date: {
          type: Date,
          required: function () {
            return this.booking_type === "Bridal";
          },
        },
        service_time: {
          type: Date,
          required: function () {
            return this.booking_type === "Bridal";
          },
        },
      },
    ],
    booking_packages: [
      {
        package: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Package",
          required: true,
        },
        // Services are only included inside the package for Bridal
        services: {
          type: [
            {
              service: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "New_Service",
                required: true,
              },
              service_date: {
                type: Date,
                required: function () {
                  return this.booking_type === "Bridal";
                },
              },
              service_time: {
                type: Date,
                required: function () {
                  return this.booking_type === "Bridal";
                },
              },
            },
          ],
          required: function () {
            return this.booking_type === "Bridal";
          },
        },
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
    },
    booking_advance: {
      type: Number,
      default: 0,
      min: [0, "Advance cannot be negative"],
    },
    booking_discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    receipt_no: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicates
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", booking_Schema);
export default Booking;
