import express from "express";
import {
  addPackage,
  deletePackage,
  getPackage,
  updatePackage,
} from "../controllers/packageController.js";
const packageRouter = express.Router();

packageRouter.post("/add_package", addPackage);
packageRouter.get("/get_package", getPackage);
packageRouter.put("/update_package", updatePackage);
packageRouter.delete("/delete_package", deletePackage);

export default packageRouter;
