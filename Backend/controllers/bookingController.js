import Booking from "../models/bookingModel.js";
import ReceiptCounter from "../models/recieptCounterModel.js";

const addBooking = async (req, res) => {
  const {
    booking_date,
    booking_type,
    booking_services,
    booking_packages,
    booking_customer,
    booking_payment_type,
    booking_advance,
    booking_discount,
    booking_appointment_time,
  } = req.body;

  try {
    // Generate receipt number
    const receiptNo = await getReceiptNumber();

    // Construct booking object based on type
    const bookingData = {
      booking_type,
      booking_date,
      booking_customer,
      booking_payment_type,
      booking_advance,
      booking_discount,
      receipt_no: receiptNo,
      ...(booking_type === "Regular" && {
        booking_appointment_time,
        booking_services: booking_services.map((service) => ({
          service: service.service,
        })),
        booking_packages: booking_packages.map((pkg) => ({
          package: pkg.package,
        })),
      }),
      ...(booking_type === "Bridal" && {
        booking_services: booking_services.map((service) => ({
          service: service.service,
          service_date: service.service_date || null,
          service_time: service.service_time || null,
        })),
        booking_packages: booking_packages.map((pkg) => ({
          package: pkg.package,
          services: pkg.services.map((service) => ({
            service: service.service,
            service_date: service.service_date || null,
            service_time: service.service_time || null,
          })),
        })),
      }),
    };

    // Save booking to the database
    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();

    // Fetch receipt data
    const receiptData = await getRecentBooking(savedBooking._id);

    res.json({
      success: true,
      message: "Booking added successfully.",
      receiptData,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error adding Booking.",
      error: error.message,
    });
  }
};


// Helper: Generate receipt number
const getReceiptNumber = async () => {
  let receiptCounter = await ReceiptCounter.findOne();
  if (!receiptCounter) {
    receiptCounter = new ReceiptCounter({ currentReceiptNumber: 1 });
    await receiptCounter.save();
  }
  const receiptNo = String(receiptCounter.currentReceiptNumber).padStart(
    4,
    "0"
  );
  receiptCounter.currentReceiptNumber += 1;
  await receiptCounter.save();
  return receiptNo;
};

const getBooking = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  const skip = (page - 1) * limit;
  const fetchAll = req.query.all === "true"; // Check if `all` parameter is set to "true"
  const search = req.query.search || ""; // Get search term if provided

  try {
    let query = {};

    // If search term is provided, use it in query
    if (search) {
      query.receipt_no = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // If `fetchAll` is true, return all categories matching the search (without pagination)
    if (fetchAll) {
      const allBookings = await Booking.find(query);
      res.json({
        totalBookings: allBookings.length,
        totalPages: 1,
        currentPage: 1,
        bookings: allBookings,
      });
    } else {
      // Paginated fetch with search
      const totalBookings = await Booking.countDocuments(query);
      const bookings = await Booking.find(query)
        .populate({
          path: "booking_services.service",
          select: "service_title service_price",
        })
        .populate({
          path: "booking_packages.package",
          select: "package_title package_price",
        })
        .populate({
          path: "booking_customer",
          select: "customer_name",
        })
        .skip(skip)
        .limit(limit);

      res.json({
        totalBookings,
        totalPages: Math.ceil(totalBookings / limit),
        currentPage: page,
        bookings,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteBooking = async (req, res) => {
  //   const check_service = await Booking.findOne({ service: req.body.id });
  //   if (check_service) {
  //     return res.json({
  //       success: false,
  //       message: "service Is Already In Booking",
  //     });
  //   } else {
  const result = await Booking.deleteOne({ _id: req.body._id });
  console.log(result);

  return res.json({ success: true, message: "Booking is deleted" });
};
// };
const updateBooking = async (req, res) => {
  const {
    id,
    booking_type,
    booking_services,
    booking_packages,
    booking_customer,
    booking_payment_type,
    booking_advance,
    booking_discount,
    booking_appointment_time,
  } = req.body;
  try {
    const updatedData = {
      booking_type,
      booking_services,
      booking_packages,
      booking_customer,
      booking_payment_type,
      booking_advance,
      booking_discount,
      booking_appointment_time,
    };

    const service = await Booking.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "Booking is updated successfully",
      data: service,
    });
  } catch (error) {
    console.error("Error updating Booking:", error);
    res.json({ success: false, message: "Server error", error });
  }
};
// Recent Booking for Reciept Generating
const getRecentBooking = async (bookingId) => {
  try {
    // Fetch the booking by ID
    const booking = await Booking.findById(bookingId)
      .populate({
        path: "booking_services.service",
        select: "service_title service_price",
      })
      .populate({
        path: "booking_packages.package",
        select: "package_title package_price",
      })
      .populate({
        path: "booking_customer",
        select: "customer_name",
      });

    if (!booking) {
      console.log("Booking not found");
      return;
    }
    console.log("Booking Agai Bhai:", booking);

    return booking;
  } catch (error) {
    console.log("Error fetching booking data:", error);
    return null;
  }
};

export { addBooking, getBooking, updateBooking, deleteBooking };
