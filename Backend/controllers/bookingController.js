import Booking from "../models/bookingModel.js";

const addBooking = async (req, res) => {
  console.log("hello");
  const {
    booking_date,
    booking_service_type,
    booking_services,
    booking_packages,
    booking_customer,
    booking_payment_type,
    booking_advance,
    booking_discount,
    booking_appointment_time,
  } = req.body;
  try {
    const newBooking = new Booking({
      booking_date,
      booking_service_type,
      booking_services,
      booking_packages,
      booking_customer,
      booking_payment_type,
      booking_advance,
      booking_discount,
      booking_appointment_time,
    });
    await newBooking.save();
    res.json({ success: true, message: "Booking added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding Booking." });
  }
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
      query.booking_booking = { $regex: search, $options: "i" }; // Case-insensitive search
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
        .populate("booking_services", "service_title service_price")
        .populate("booking_packages", "package_title package_price")
        .populate("booking_customer", "customer_name")
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
    booking_service_type,
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
      booking_service_type,
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

export { addBooking, getBooking, updateBooking, deleteBooking };
