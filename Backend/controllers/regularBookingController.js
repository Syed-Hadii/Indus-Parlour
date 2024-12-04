import Regular_Booking from "../models/regularBookingModel.js";

// Add a new Regular Booking
const addRegular_Booking = async (req, res) => {
  console.log("hello");
  const {
    regular_packages,
    package_services_n_staff,
    regular_customer,
    services_n_staff,
    regular_payment_type,
    regular_discount,
    regular_recieve_amount,
    regular_appointment_time,
  } = req.body;

  try {
    const newRegular_Booking = new Regular_Booking({
      regular_packages,
      package_services_n_staff,
      regular_customer,
      services_n_staff, // Now expecting an array of objects with regular_services and regular_staff
      regular_payment_type,
      regular_discount,
      regular_recieve_amount,
      regular_appointment_time,
    });

    await newRegular_Booking.save();
    res.json({ success: true, message: "Regular Booking added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding Regular Booking." });
  }
};

// Get Regular Bookings
const getRegular_Booking = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  const skip = (page - 1) * limit;
  const fetchAll = req.query.all === "true";
  const search = req.query.search || "";

  try {
    let query = {};

    // If search term is provided, use it in query
    if (search) {
      query.regular_booking_regular_booking = { $regex: search, $options: "i" };
    }

    // Fetch all or paginated bookings
    if (fetchAll) {
      const allRegular_Bookings = await Regular_Booking.find(query).populate([
        {path: "regular_packages", select: "package_title package_price" },
        {path: "package_services_n_staff.package_services",select: "service_title service_price"},
        {path: "package_services_n_staff.package_staff", select: "staff_name"},
        {path: "regular_customer", select: "customer_name" },
        {path: "services_n_staff.regular_services",select: "service_title service_price"},
        {path: "services_n_staff.regular_staff", select: "staff_name" },
      ]);

      res.json({
        totalRegular_Bookings: allRegular_Bookings.length,
        totalPages: 1,
        currentPage: 1,
        regular_bookings: allRegular_Bookings,
      });
    } else {
      const totalRegular_Bookings = await Regular_Booking.countDocuments(query);
      const regular_bookings = await Regular_Booking.find(query)
        .populate([
          { path: "regular_packages", select: "package_title package_price" },
          { path: "regular_customer", select: "customer_name" },
          {
            path: "services_n_staff.regular_services",
            select: "service_title service_price",
          },
          { path: "services_n_staff.regular_staff", select: "staff_name" },
        ])
        .skip(skip)
        .limit(limit);

      res.json({
        totalRegular_Bookings,
        totalPages: Math.ceil(totalRegular_Bookings / limit),
        currentPage: page,
        regular_bookings,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Regular Booking
const updateRegular_Booking = async (req, res) => {
  const {
    id,
    regular_packages, 
    regular_customer,
    services_n_staff,
    regular_payment_type,
    regular_discount,
    regular_recieve_amount,
    regular_appointment_time,
  } = req.body;

  try {
    const updatedData = {
      regular_packages, 
      regular_customer,
      services_n_staff, // Update the array of objects
      regular_payment_type,
      regular_discount,
      regular_recieve_amount,
      regular_appointment_time,
    };

    const booking = await Regular_Booking.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return res.json({
      success: true,
      message: "Regular Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error updating Regular Booking:", error);
    res.json({ success: false, message: "Server error", error });
  }
};

// Delete Regular Booking
const deleteRegular_Booking = async (req, res) => {
  try {
    const booking = await Regular_Booking.deleteOne({ _id: req.body._id });
    console.log(booking);

    res.json({
      success: true,
      message: "Regular Booking deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Regular Booking:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  addRegular_Booking,
  getRegular_Booking,
  updateRegular_Booking,
  deleteRegular_Booking,
};
