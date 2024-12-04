import Brand from "../models/product_Models/brandModel.js";
import Category from "../models/product_Models/categoryModel.js";
import Product from "../models/product_Models/newProductModel.js";
import Unit from "../models/product_Models/unitModel.js";
import Variation from "../models/product_Models/variationModel.js";
import Purchase from "../models/purchaseModel.js";

// Category API
const addCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    const category = new Category({ category_name });
    await category.save();
    res.status(201).json({ message: "Category added successfully" });
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
      query.category_name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // If `fetchAll` is true, return all categories matching the search (without pagination)
    if (fetchAll) {
      const allCategories = await Category.find(query);
      res.json({
        totalCategories: allCategories.length,
        totalPages: 1,
        currentPage: 1,
        categories: allCategories,
      });
    } else {
      // Paginated fetch with search
      const totalCategories = await Category.countDocuments(query);
      const categories = await Category.find(query).skip(skip).limit(limit);

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
  const check_category = await Brand.findOne({ category: req.body.id });
  if (check_category) {
    return res.json({
      success: false,
      message: "Category Is Already In Brand",
    });
  } else {
    const result = await Category.deleteOne({ _id: req.body._id });

    return res.json({ success: true, message: "Category is deleted" });
  }
};
const updateCategory = async (req, res) => {
  const { id, category_name } = req.body;
  try {
    const updatedData = {
      category_name,
    };

    const category = await Category.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "Category is updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error updating Category:", error);
    res.json({ success: false, message: "Server error", error });
  }
};
// Brand API
const addBrand = async (req, res) => {
  const { category_id, brand_name } = req.body;
  try {
    const newBrand = new Brand({
      category_id,
      brand_name,
    });
    await newBrand.save();
    res.json({ success: true, message: "Brand added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding Brand." });
  }
};
const getBrand = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  const skip = (page - 1) * limit;
  const fetchAll = req.query.all === "true"; // Check if `all` parameter is set to "true"
  const search = req.query.search || ""; // Get search term if provided

  try {
    let query = {};

    // If search term is provided, use it in query
    if (search) {
      query.brand_name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // If `fetchAll` is true, return all categories matching the search (without pagination)
    if (fetchAll) {
      const allBrands = await Brand.find(query);
      res.json({
        totalBrands: allBrands.length,
        totalPages: 1,
        currentPage: 1,
        brands: allBrands,
      });
    } else {
      // Paginated fetch with search
      const totalBrands = await Brand.countDocuments(query);
      const brands = await Brand.find(query)
        .populate("category_id", "category_name")
        .skip(skip)
        .limit(limit);

      res.json({
        totalBrands,
        totalPages: Math.ceil(totalBrands / limit),
        currentPage: page,
        brands,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteBrand = async (req, res) => {
  try {
    // Step 1: Check if any product is using the given brand ID
    const check_brand = await Product.findOne({ brand: req.body.id });

    if (check_brand) {
      // If the brand ID is found in any product, prevent deletion and return a message
      return res.json({
        success: false,
        message: "Brand is already used in a product, cannot delete.",
      });
    }

    // Step 2: If the brand is not used in any product, proceed to delete the brand
    const result = await Brand.deleteOne({ _id: req.body.id });

    if (result.deletedCount > 0) {
      return res.json({
        success: true,
        message: "Brand successfully deleted.",
      });
    } else {
      return res.json({ success: false, message: "Brand not found." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Could not delete the brand.",
    });
  }
};

const updateBrand = async (req, res) => {
  const { id, brand_name } = req.body;
  try {
    const updatedData = {
      brand_name,
    };

    const brand = await Brand.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "Brand is updated successfully",
      data: brand,
    });
  } catch (error) {
    console.error("Error updating Brand:", error);
    res.json({ success: false, message: "Server error", error });
  }
};
// Unit API
const addUnit = async (req, res) => {
  try {
    const { unit_name } = req.body;
    const unit = new Unit({ unit_name });
    await unit.save();
    res.status(201).json({ message: "Unit added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding unit" });
  }
};
const getUnit = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  const skip = (page - 1) * limit;
  const fetchAll = req.query.all === "true"; // Check if `all` parameter is set to "true"
  const search = req.query.search || ""; // Get search term if provided

  try {
    let query = {};
    if (search) {
      query.unit_name = { $regex: search, $options: "i" };
    }
    // If `fetchAll` is true, return all categories matching the search (without pagination)
    if (fetchAll) {
      const allUnits = await Unit.find(query);
      res.json({
        totalUnits: allUnits.length,
        totalPages: 1,
        currentPage: 1,
        units: allUnits,
      });
    } else {
      // Paginated fetch with search
      const totalUnits = await Unit.countDocuments(query);
      const units = await Unit.find(query).skip(skip).limit(limit);

      res.json({
        totalUnits,
        totalPages: Math.ceil(totalUnits / limit),
        currentPage: page,
        units,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUnit = async (req, res) => {
  const check_unit = await Variation.findOne({ unit: req.body.id });
  if (check_unit) {
    return res.json({
      success: false,
      message: "Unit Is Already In Variation",
    });
  } else {
    const result = await Unit.deleteOne({ _id: req.body._id });
    console.log(result);

    return res.json({ success: true, message: "Unit is deleted" });
  }
};
const updateUnit = async (req, res) => {
  const { id, unit_name } = req.body;
  try {
    const updatedData = {
      unit_name,
    };

    const unit = await Unit.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "Unit is updated successfully",
      data: unit,
    });
  } catch (error) {
    console.error("Error updating Unit:", error);
    res.json({ success: false, message: "Server error", error });
  }
};
// Product API
const addProduct = async (req, res) => {
  const { category_id, brand_id, product_name, variation_id } = req.body;
  try {
    const newProduct = new Product({
      category_id,
      brand_id,
      product_name,
      variation_id,
    });
    await newProduct.save();
    res.json({ success: true, message: "Product added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding Product." });
  }
};
const getProduct = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  const skip = (page - 1) * limit;
  const fetchAll = req.query.all === "true"; // Check if `all` parameter is set to "true"
  const search = req.query.search || ""; // Get search term if provided

  try {
    let query = {};

    // If search term is provided, use it in query
    if (search) {
      query.product_name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // If `fetchAll` is true, return all categories matching the search (without pagination)
    if (fetchAll) {
      const allProducts = await Product.find(query);
      res.json({
        totalProducts: allProducts.length,
        totalPages: 1,
        currentPage: 1,
        products: allProducts,
      });
    } else {
      // Paginated fetch with search
      const totalProducts = await Product.countDocuments(query);
      const product = await Product.find(query)
        .populate("brand_id", "brand_name")
        .populate("variation_id", "variation_name")
        .skip(skip)
        .limit(limit);

      res.json({
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        product,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteProduct = async (req, res) => {
  const check_product = await Purchase.findOne({ product: req.body.id });
  if (check_product) {
    return res.json({
      success: false,
      message: "product Is Already In Purchase",
    });
  } else {
  const result = await Product.deleteOne({ _id: req.body._id });
  console.log(result);

  return res.json({ success: true, message: "Product is deleted" });
};
};
const updateProduct = async (req, res) => {
  const { id,   brand_id, product_name, variation_id } = req.body;
  try {
    const updatedData = { 
      brand_id,
      product_name,
      variation_id,
    };

    const product = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "Product is updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating Product:", error);
    res.json({ success: false, message: "Server error", error });
  }
};
// Variation API
const addVariation = async (req, res) => {
  const { variation_name, unit_id, quantity, usage, price } = req.body;
  try {
    const newVariation = new Variation({
      variation_name,
      unit_id,
      quantity,
      usage,
      price,
    });
    await newVariation.save();
    res.json({ success: true, message: "Variation added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding Variation." });
  }
};
const getVariation = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  const skip = (page - 1) * limit;
  const fetchAll = req.query.all === "true"; // Check if `all` parameter is set to "true"
  const search = req.query.search || ""; // Get search term if provided

  try {
    let query = {};

    // If search term is provided, use it in query
    if (search) {
      query.variation_name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // If `fetchAll` is true, return all categories matching the search (without pagination)
    if (fetchAll) {
      const allVariations = await Variation.find(query);
      res.json({
        totalVariations: allVariations.length,
        totalPages: 1,
        currentPage: 1,
        variations: allVariations,
      });
    } else {
      // Paginated fetch with search
      const totalVariations = await Variation.countDocuments(query);
      const variations = await Variation.find(query)
        .populate("unit_id", "unit_name")
        .skip(skip)
        .limit(limit);

      res.json({
        totalVariations,
        totalPages: Math.ceil(totalVariations / limit),
        currentPage: page,
        variations,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteVariation = async (req, res) => {
  const check_variation = await Product.findOne({ variation: req.body.id });
  if (check_variation) {
    return res.json({
      success: false,
      message: "variation Is Already In Product",
    });
  } else {
  const result = await Variation.deleteOne({ _id: req.body._id });
  console.log(result);

  return res.json({ success: true, message: "Variation is deleted" });
};
};
const updateVariation = async (req, res) => {
  const { id, variation_name, unit_id, quantity, usage, price } = req.body;
  try {
    const updatedData = {
      variation_name,
      unit_id,
      quantity,
      usage,
      price,
    };

    const variation = await Variation.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "Variation is updated successfully",
      data: variation,
    });
  } catch (error) {
    console.error("Error updating Variation:", error);
    res.json({ success: false, message: "Server error", error });
  }
};

export {
  // Category Functions
  addCategory,
  getCategory,
  deleteCategory,
  updateCategory,
  // Brand Functions
  addBrand,
  getBrand,
  deleteBrand,
  updateBrand,
  // Unit Functions
  addUnit,
  getUnit,
  deleteUnit,
  updateUnit,
  // Product Fucntions
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  // Variation Functions
  addVariation,
  getVariation,
  deleteVariation,
  updateVariation
};
