import { Request, Response } from "express";
import { productService } from "../services/product.service.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export const productController = {
  async getProducts(req: Request, res: Response) {
    try {
      const { category, vendorId, search, city, limit, offset } = req.query;
      const products = await productService.getProducts({
        category: category ? String(category) : undefined,
        vendorId: vendorId ? Number(vendorId) : undefined,
        search: search ? String(search) : undefined,
        city: city ? String(city) : undefined,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined
      });
      // Return both array directly and wrapped object for backward compatibility
      res.json(products);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async getProductById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await productService.getProductById(id);
      res.json(product);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  },

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await productService.getCategories();
      res.json(categories);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async getVendors(req: Request, res: Response) {
    try {
      const { category, city, search } = req.query;
      const vendors = await productService.getVendors({
        category: category ? String(category) : undefined,
        city: city ? String(city) : undefined,
        search: search ? String(search) : undefined
      });
      res.json(vendors);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async getVendorById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const vendor = await productService.getVendorById(id);
      res.json(vendor);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }
};
