import Package from "../models/packageModel.js";

const addPackage = async (req, res) => {
  const { package_title, package_price, services } = req.body;
  try {
    const newPackage = new Package({
      package_title,
      package_price,
      services,
    });
    await newPackage.save();
    res.json({ success: true, message: "Package added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding Package." });
  }
};
const getPackage = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  const skip = (page - 1) * limit;
  const fetchAll = req.query.all === "true"; // Check if `all` parameter is set to "true"
  const search = req.query.search || ""; // Get search term if provided

  try {
    let query = {};

    // If search term is provided, use it in query
    if (search) {
      query.package_title = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // If `fetchAll` is true, return all categories matching the search (without pagination)
    if (fetchAll) {
      const allPackages = await Package.find(query).populate({
        path: "services",
        select: "service_title", // Include only the service title
      });
      res.json({
        totalPackages: allPackages.length,
        totalPages: 1,
        currentPage: 1,
        packages: allPackages,
      });
    } else {
      // Paginated fetch with search
      const totalPackages = await Package.countDocuments(query);
      const packages = await Package.find(query) // Fixed: Await the find query first
        .skip(skip)
        .limit(limit)
        .populate([
          {
            path: "services",
            select: "_id service_title",
          },
          {
            path: "services",
            select: "_id service_title",
          },
        ]);

      res.json({
        totalPackages,
        totalPages: Math.ceil(totalPackages / limit),
        currentPage: page,
        packages,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deletePackage = async (req, res) => {
  //   const check_service = await Package.findOne({ service: req.body.id });
  //   if (check_service) {
  //     return res.json({
  //       success: false,
  //       message: "service Is Already In Package",
  //     });
  //   } else {
  const result = await Package.deleteOne({ _id: req.body._id });
  console.log(result);

  return res.json({ success: true, message: "Package is deleted" });
};
// };
const updatePackage = async (req, res) => {
  const { id, package_title } = req.body;
  try {
    const updatedData = {
      package_title,
    };

    const service = await Package.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "Package is updated successfully",
      data: service,
    });
  } catch (error) {
    console.error("Error updating Package:", error);
    res.json({ success: false, message: "Server error", error });
  }
};

export { addPackage, getPackage, deletePackage, updatePackage };
