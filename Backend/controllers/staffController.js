import Staff from "../models/staffModel.js";

const addStaff = async (req, res) => {
  const {
    staff_name,
    staff_designation,
    staff_start_time,
    staff_end_time,
    staff_salary,
    staff_join_date,
    staff_cell,
  } = req.body;
  try {
    const newStaff = new Staff({
      staff_name,
      staff_designation,
      staff_start_time,
      staff_end_time,
      staff_salary,
      staff_join_date,
      staff_cell,
    });
    await newStaff.save();
    res.json({ success: true, message: "Staff added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding Staff." });
  }
};
const getStaff = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  const skip = (page - 1) * limit;
  const fetchAll = req.query.all === "true"; // Check if `all` parameter is set to "true"
  const search = req.query.search || ""; // Get search term if provided

  try {
    let query = {};

    // If search term is provided, use it in query
    if (search) {
      query.staff_name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // If `fetchAll` is true, return all categories matching the search (without pagination)
    if (fetchAll) {
      const allProducts = await Staff.find(query);
      res.json({
        totalProducts: allProducts.length,
        totalPages: 1,
        currentPage: 1,
        staffs: allProducts,
      });
    } else {
      // Paginated fetch with search
      const totalProducts = await Staff.countDocuments(query);
      const staffs = await Staff.find(query).skip(skip).limit(limit);

      res.json({
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        staffs,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteStaff = async (req, res) => {
  //   const check_service = await Staff.findOne({ service: req.body.id });
  //   if (check_service) {
  //     return res.json({
  //       success: false,
  //       message: "service Is Already In Staff",
  //     });
  //   } else {
  const result = await Staff.deleteOne({ _id: req.body._id });
  console.log(result);

  return res.json({ success: true, message: "Staff is deleted" });
};
// };
const updateStaff = async (req, res) => {
  const {
    id,
    staff_name,
    staff_designation,
    staff_start_time,
    staff_end_time,
    staff_salary, 
    staff_cell,
  } = req.body;
  try {
    const updatedData = {
      staff_name,
      staff_designation,
      staff_start_time,
      staff_end_time,
      staff_salary, 
      staff_cell,
    };

    const Staff = await Staff.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "Staff is updated successfully",
      data: Staff,
    });
  } catch (error) {
    console.error("Error updating Staff:", error);
    res.json({ success: false, message: "Server error", error });
  }
};

export { addStaff, getStaff, deleteStaff, updateStaff };
