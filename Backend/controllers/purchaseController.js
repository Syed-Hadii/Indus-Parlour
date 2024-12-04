import Purchase from "../models/purchaseModel.js";

const addPurchase = async (req, res) => {
  const {
    purchase_product,
    purchase_quantity,
    purchase_price,
    purchase_usage,
  } = req.body;
  try {
    const newProduct = new Purchase({
      purchase_product,
      purchase_quantity,
      purchase_price,
      purchase_usage,
    });
    await newProduct.save();
    res.json({ success: true, message: "Purchase added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding Purchase." });
  }
};
const getPurchase = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  const skip = (page - 1) * limit;
  const fetchAll = req.query.all === "true"; // Check if `all` parameter is set to "true"
  const search = req.query.search || ""; // Get search term if provided

  try {
    let query = {};

    // If search term is provided, use it in query
    if (search) {
      query.purchase_product = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // If `fetchAll` is true, return all categories matching the search (without pagination)
    if (fetchAll) {
      const allProducts = await Purchase.find(query);
      res.json({
        totalProducts: allProducts.length,
        totalPages: 1,
        currentPage: 1,
        purchases: allProducts,
      });
    } else {
      // Paginated fetch with search
      const totalProducts = await Purchase.countDocuments(query);
      const purchases = await Purchase.find(query)
        .populate("purchase_product", "product_name")
        .skip(skip)
        .limit(limit);

      res.json({
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        purchases,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
const deletePurchase = async (req, res) => {
  //   const check_service = await Purchase.findOne({ service: req.body.id });
  //   if (check_service) {
  //     return res.json({
  //       success: false,
  //       message: "service Is Already In Purchase",
  //     });
  //   } else {
  const result = await Purchase.deleteOne({ _id: req.body._id });
  console.log(result);

  return res.json({ success: true, message: "Purchase is deleted" });
};
// };
const updatePurchase = async (req, res) => {
  const { id, purchase_product, purchase_quantity, purchase_price } = req.body;
  try {
    const updatedData = {
      purchase_product,
      purchase_quantity,
      purchase_price,
    };

    const service = await Purchase.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return res.json({
      success: true,
      message: "Purchase is updated successfully",
      data: service,
    });
  } catch (error) {
    console.error("Error updating Purchase:", error);
    res.json({ success: false, message: "Server error", error });
  }
};

export { addPurchase, getPurchase, deletePurchase, updatePurchase };
