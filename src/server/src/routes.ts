import express from "express";
import { PrismaClient } from "@prisma/client";

export const router = express.Router();
const prisma = new PrismaClient();

// Users
router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.post("/users", async (req, res) => {
  const { name, email, role, phone } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email, role, phone }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "Failed to create user" });
  }
});

// Vendors
router.get("/vendors", async (req, res) => {
  const { category, city } = req.query;
  const where: any = {};
  if (category) where.category = category as string;
  if (city) where.city = city as string;

  const vendors = await prisma.vendor.findMany({ where, include: { user: true } });
  res.json(vendors);
});

router.post("/vendors", async (req, res) => {
  const { userId, businessName, category, city, address, phone } = req.body;
  try {
    const vendor = await prisma.vendor.create({
      data: { userId, businessName, category, city, address, phone }
    });
    res.json(vendor);
  } catch (error) {
    res.status(400).json({ error: "Failed to register vendor" });
  }
});

// Products
router.get("/products", async (req, res) => {
  const { category, vendorId } = req.query;
  const where: any = {};
  if (category) where.category = category as string;
  if (vendorId) where.vendorId = Number(vendorId);

  const products = await prisma.product.findMany({ where, include: { vendor: true } });
  res.json(products);
});

router.post("/products", async (req, res) => {
  const { vendorId, name, description, price, category, available } = req.body;
  try {
    const product = await prisma.product.create({
      data: { vendorId, name, description, price, category, available }
    });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "Failed to add product" });
  }
});

// Orders
router.get("/orders", async (req, res) => {
  const { userId, vendorId } = req.query;
  const where: any = {};
  if (userId) where.userId = Number(userId);
  if (vendorId) where.vendorId = Number(vendorId);

  const orders = await prisma.order.findMany({ where });
  res.json(orders);
});

router.post("/orders", async (req, res) => {
  const { userId, vendorId, totalAmount } = req.body;
  try {
    const order = await prisma.order.create({
      data: { userId, vendorId, totalAmount, status: "pending" }
    });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: "Failed to place order" });
  }
});
