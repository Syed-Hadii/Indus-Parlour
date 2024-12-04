import Stock from "../models/stockModel.js";

const addStock = async (req, res) => {
  const {
    stock_product,
    stock_quantity, 
    stock_usage,
  } = req.body;
  try {
    const newProduct = new Stock({
      stock_product,
      stock_quantity, 
      stock_usage,
    });
    await newProduct.save();
    res.json({ success: true, message: "Stock added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding Stock." });
  }
};
const getStock = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  const skip = (page - 1) * limit;
  const fetchAll = req.query.all === "true"; // Check if `all` parameter is set to "true"
  const search = req.query.search || ""; // Get search term if provided

  try {
    let query = {};

    // If search term is provided, use it in query
    if (search) {
      query.stock_product = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // If `fetchAll` is true, return all categories matching the search (without pagination)
    if (fetchAll) {
      const allProducts = await Stock.find(query);
      res.json({
        totalProducts: allProducts.length,
        totalPages: 1,
        currentPage: 1,
        stocks: allProducts,
      });
    } else {
      // Paginated fetch with search
      const totalProducts = await Stock.countDocuments(query);
      const stocks = await Stock.find(query)
        .populate("stock_product", "product_name")
        .skip(skip)
        .limit(limit);

      res.json({
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        stocks,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteStock = async (req, res) => {
  //   const check_service = await Stock.findOne({ service: req.body.id });
  //   if (check_service) {
  //     return res.json({
  //       success: false,
  //       message: "service Is Already In Stock",
  //     });
  //   } else {
  const result = await Stock.deleteOne({ _id: req.body._id });
  console.log(result);

  return res.json({ success: true, message: "Stock is deleted" });
};
// };
const updateStock = async (req, res) => {
  const { id, stock_product, stock_quantity, stock_usage } = req.body;
  try {
    const updatedData = {
      stock_product,
      stock_quantity,
      stock_usage,
    };

    const stock = await Stock.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "Stock is updated successfully",
      data: stock,
    });
  } catch (error) {
    console.error("Error updating Stock:", error);
    res.json({ success: false, message: "Server error", error });
  }
};

export { addStock, getStock, deleteStock, updateStock };
