import Customer from "../models/customerModel.js";

const addCustomer = async (req, res) => {
  try {
    const { customer_name, cell_no } = req.body;
    const customer = new Customer({ customer_name, cell_no });
    await customer.save();
    res.status(201).json({ message: "Customer added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding customer" });
  }
};
const getCustomer = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  const skip = (page - 1) * limit;
  const fetchAll = req.query.all === "true"; // Check if `all` parameter is set to "true"
  const search = req.query.search || ""; // Get search term if provided

  try {
    let query = {};

    // If search term is provided, use it in query
    if (search) {
      query.customer_name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // If `fetchAll` is true, return all customers matching the search (without pagination)
    if (fetchAll) {
      const allCustomers = await Customer.find(query);
      res.json({
        totalCustomers: allCustomers.length,
        totalPages: 1,
        currentPage: 1,
        customers: allCustomers,
      });
    } else {
      // Paginated fetch with search
      const totalCustomers = await Customer.countDocuments(query);
      const customers = await Customer.find(query)
        .skip(skip)
        .limit(limit);

      res.json({
        totalCustomers,
        totalPages: Math.ceil(totalCustomers / limit),
        currentPage: page,
        customers,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCustomer = async (req, res) => {
//   const check_customer = await New_Service.findOne({ customer: req.body.id });
//   if (check_customer) {
//     return res.json({
//       success: false,
//       message: "Customer Is Already In New_Service",
//     });
//   } else {
    const result = await Customer.deleteOne({ _id: req.body._id });

    return res.json({ success: true, message: "Customer is deleted" });
  }
// };
const updateCustomer = async (req, res) => {
  const { id, customer_name } = req.body;
  try {
    const updatedData = {
      customer_name,
    };

    const customer = await Customer.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "Customer is updated successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Error updating Customer:", error);
    res.json({ success: false, message: "Server error", error });
  }
};

export { addCustomer, getCustomer, deleteCustomer, updateCustomer };
