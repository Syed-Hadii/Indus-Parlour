import express from "express";
import {
  addStock,
  deleteStock,
  getStock,
  updateStock,
} from "../controllers/stockController.js";
const stockRouter = express.Router();

stockRouter.post("/add_stock", addStock);
stockRouter.get("/get_stock", getStock);
stockRouter.put("/update_stock", updateStock);
stockRouter.delete("/delete_stock", deleteStock);

export default stockRouter;
