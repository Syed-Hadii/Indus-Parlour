import express from "express";
import {
  addPurchase,
  deletePurchase,
  getPurchase,
  updatePurchase,
} from "../controllers/purchaseController.js";
const purchaseRouter = express.Router();

purchaseRouter.post("/add_purchase", addPurchase);
purchaseRouter.get("/get_purchase", getPurchase);
purchaseRouter.put("/update_purchase", updatePurchase);
purchaseRouter.delete("/delete_purchase", deletePurchase);

export default purchaseRouter;
