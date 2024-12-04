import express from "express";
import {
  addBrand,
  addCategory,
  addProduct,
  addUnit,
  addVariation,
  deleteBrand,
  deleteCategory,
  deleteProduct,
  deleteUnit,
  deleteVariation,
  getBrand,
  getCategory,
  getProduct,
  getUnit,
  getVariation,
  updateBrand,
  updateCategory,
  updateProduct,
  updateUnit,
  updateVariation,
} from "../controllers/productController.js";

const productRouter = express.Router();

// Category
productRouter.post("/add_category", addCategory);
productRouter.get("/get_category", getCategory);
productRouter.delete("/delete_category", deleteCategory);
productRouter.put("/update_category", updateCategory);
// Brand
productRouter.post("/add_brand", addBrand);
productRouter.get("/get_brand", getBrand);
productRouter.delete("/delete_brand", deleteBrand);
productRouter.put("/update_brand", updateBrand);
// Unit
productRouter.post("/add_unit", addUnit);
productRouter.get("/get_unit", getUnit);
productRouter.delete("/delete_unit", deleteUnit);
productRouter.put("/update_unit", updateUnit);
// Product
productRouter.post("/add_product", addProduct);
productRouter.get("/get_product", getProduct);
productRouter.delete("/delete_product", deleteProduct);
productRouter.put("/update_product", updateProduct);
// Variaition
productRouter.post("/add_variation", addVariation);
productRouter.get("/get_variation", getVariation);
productRouter.delete("/delete_variation", deleteVariation);
productRouter.put("/update_variation", updateVariation);

export default productRouter;
