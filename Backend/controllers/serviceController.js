import Service_Category from "../models/service_Models/serviceCategoryModel.js";
import New_Service from "../models/service_Models/newServiceModel.js";
import Package from "../models/packageModel.js";

// Service Service_Category Functions
const addCategory = async (req, res) => {
  try {
    const { service_category } = req.body;
    const category = new Service_Category({ service_category });
    await category.save();
    res.status(201).json({ message: "Service_Category added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding category" });
  }
};
const getCategory = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  const skip = (page - 1) * limit;
  const fetchAll = req.query.all === "true"; // Check if `all` parameter is set to "true"
  const search = req.query.search || ""; // Get search term if provided

  try {
    let query = {};

    // If search term is provided, use it in query
    if (search) {
      query.service_category = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // If `fetchAll` is true, return all categories matching the search (without pagination)
    if (fetchAll) {
      const allCategories = await Service_Category.find(query);
      res.json({
        totalCategories: allCategories.length,
        totalPages: 1,
        currentPage: 1,
        service_categories: allCategories,
      });
    } else {
      // Paginated fetch with search
      const totalCategories = await Service_Category.countDocuments(query);
      const categories = await Service_Category.find(query)
        .skip(skip)
        .limit(limit);

      res.json({
        totalCategories,
        totalPages: Math.ceil(totalCategories / limit),
        currentPage: page,
        categories,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCategory = async (req, res) => {
  const check_category = await New_Service.findOne({ category: req.body.id });
  if (check_category) {
    return res.json({
      success: false,
      message: "Service_Category Is Already In New_Service",
    });
  } else {
    const result = await Service_Category.deleteOne({ _id: req.body._id });

    return res.json({ success: true, message: "Service_Category is deleted" });
  }
};
const updateCategory = async (req, res) => {
  const { id, service_category } = req.body;
  try {
    const updatedData = {
      service_category,
    };

    const category = await Service_Category.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "Service_Category is updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error updating Service_Category:", error);
    res.json({ success: false, message: "Server error", error });
  }
};

// New Services Functions
const addService = async (req, res) => {
  const {
    service_title,
    service_category,
    service_price,
    service_product,
    product_usage,
  } = req.body;
  try {
    const newService = new New_Service({
      service_title,
      service_category,
      service_price,
      service_product,
      product_usage,
    });
    await newService.save();
    res.json({ success: true, message: "New_Service added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding New_Service." });
  }
};
const getService = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  const skip = (page - 1) * limit;
  const fetchAll = req.query.all === "true"; // Check if `all` parameter is set to "true"
  const search = req.query.search || ""; // Get search term if provided

  try {
    let query = {};

    // If search term is provided, use it in query
    if (search) {
      query.service_title = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // If `fetchAll` is true, return all categories matching the search (without pagination)
    if (fetchAll) {
      const allServices = await New_Service.find(query);
      res.json({
        totalServices: allServices.length,
        totalPages: 1,
        currentPage: 1,
        services: allServices,
      });
    } else {
      // Paginated fetch with search
      const totalServices = await New_Service.countDocuments(query);
      const services = await New_Service.find(query).skip(skip).limit(limit);

      res.json({
        totalServices,
        totalPages: Math.ceil(totalServices / limit),
        currentPage: page,
        services,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteService = async (req, res) => {
  const check_service = await Package.findOne({ service: req.body.id });
  if (check_service) {
    return res.json({
      success: false,
      message: "service Is Already In Package",
    });
  } else {
    const result = await New_Service.deleteOne({ _id: req.body._id });
    console.log(result);

    return res.json({ success: true, message: "New_Service is deleted" });
  }
};
const updateService = async (req, res) => {
  const {
    id,
    service_title,
    service_category,
    service_price,
    service_product,
    product_usage,
  } = req.body;
  try {
    const updatedData = {
      service_title,
      service_category,
      service_price,
      service_product,
      product_usage,
    };

    const service = await New_Service.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "New_Service is updated successfully",
      data: service,
    });
  } catch (error) {
    console.error("Error updating New_Service:", error);
    res.json({ success: false, message: "Server error", error });
  }
};

export {
  // Service Category Functions
  addCategory,
  getCategory,
  deleteCategory,
  updateCategory,
  // New Service Functions
  addService,
  getService,
  deleteService,
  updateService,
};
