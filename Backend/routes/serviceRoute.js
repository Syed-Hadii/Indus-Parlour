import express from "express";
import { addCategory, addService, deleteCategory, deleteService, getCategory, getService, updateCategory, updateService } from "../controllers/serviceController.js";

const serviceRouter = express.Router();

// Service Category Routes
serviceRouter.post("/add_category", addCategory)
serviceRouter.get("/get_category", getCategory )
serviceRouter.delete("/delete_category", deleteCategory)
serviceRouter.put("/update_category", updateCategory)

// New Service Routes
serviceRouter.post("/add_service", addService);
serviceRouter.get("/get_service", getService );
serviceRouter.delete("/delete_service", deleteService);
serviceRouter.put("/update_service", updateService);

export default serviceRouter;
