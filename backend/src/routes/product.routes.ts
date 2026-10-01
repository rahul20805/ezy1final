import { Router } from "express";
import { productController } from "../controllers/product.controller.js";

export const productRouter = Router();

productRouter.get("/products", productController.getProducts);
productRouter.get("/products/:id", productController.getProductById);
productRouter.get("/categories", productController.getCategories);
productRouter.get("/vendors", productController.getVendors);
productRouter.get("/vendors/:id", productController.getVendorById);
