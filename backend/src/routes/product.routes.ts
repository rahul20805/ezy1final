import { Router } from "express";
import { productController } from "../controllers/product.controller.js";

export const productRouter = Router();

productRouter.get("/products", productController.getProducts);
productRouter.post("/products", productController.createProduct);
productRouter.get("/products/:id", productController.getProductById);
productRouter.put("/products/:id", productController.updateProduct);
productRouter.delete("/products/:id", productController.deleteProduct);
productRouter.get("/categories", productController.getCategories);
productRouter.get("/vendors", productController.getVendors);
productRouter.get("/vendors/:id", productController.getVendorById);
