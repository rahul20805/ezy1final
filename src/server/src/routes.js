import express from "express";
import { openDb } from "./db.js";

export const router = express.Router();

// Users
router.get("/users", async (req, res) => {
  const db = await openDb();
  const users = await db.all("SELECT * FROM users");
  res.json(users);
});

router.post("/users", async (req, res) => {
  const { name, email, role, phone } = req.body;
  const db = await openDb();
  try {
    const result = await db.run(
      "INSERT INTO users (name, email, role, phone) VALUES (?, ?, ?, ?)",
      [name, email, role, phone]
    );
    const user = await db.get("SELECT * FROM users WHERE id = ?", [result.lastID]);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "Failed to create user" });
  }
});

// Vendors
router.get("/vendors", async (req, res) => {
  const { category, city } = req.query;
  const db = await openDb();
  let query = "SELECT * FROM vendors WHERE 1=1";
  const params = [];
  
  if (category) {
    query += " AND category = ?";
    params.push(category);
  }
  if (city) {
    query += " AND city = ?";
    params.push(city);
  }

  const vendors = await db.all(query, params);
  res.json(vendors);
});

router.post("/vendors", async (req, res) => {
  const { userId, businessName, category, city, address, phone } = req.body;
  const db = await openDb();
  try {
    const result = await db.run(
      "INSERT INTO vendors (userId, businessName, category, city, address, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, businessName, category, city, address, phone]
    );
    const vendor = await db.get("SELECT * FROM vendors WHERE id = ?", [result.lastID]);
    res.json(vendor);
  } catch (error) {
    res.status(400).json({ error: "Failed to register vendor" });
  }
});

// Products
router.get("/products", async (req, res) => {
  const { category, vendorId } = req.query;
  const db = await openDb();
  let query = "SELECT * FROM products WHERE 1=1";
  const params = [];
  
  if (category) {
    query += " AND category = ?";
    params.push(category);
  }
  if (vendorId) {
    query += " AND vendorId = ?";
    params.push(vendorId);
  }

  const products = await db.all(query, params);
  res.json(products);
});

router.post("/products", async (req, res) => {
  const { vendorId, name, description, price, category, image } = req.body;
  const db = await openDb();
  try {
    const result = await db.run(
      "INSERT INTO products (vendorId, name, description, price, category, image) VALUES (?, ?, ?, ?, ?, ?)",
      [vendorId, name, description, price, category, image]
    );
    const product = await db.get("SELECT * FROM products WHERE id = ?", [result.lastID]);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "Failed to add product" });
  }
});

// Orders
router.get("/orders", async (req, res) => {
  const { userId, vendorId } = req.query;
  const db = await openDb();
  let query = "SELECT * FROM orders WHERE 1=1";
  const params = [];
  
  if (userId) {
    query += " AND userId = ?";
    params.push(userId);
  }
  if (vendorId) {
    query += " AND vendorId = ?";
    params.push(vendorId);
  }

  const orders = await db.all(query, params);
  res.json(orders);
});

router.post("/orders", async (req, res) => {
  const { userId, vendorId, totalAmount } = req.body;
  const db = await openDb();
  try {
    const result = await db.run(
      "INSERT INTO orders (userId, vendorId, totalAmount) VALUES (?, ?, ?)",
      [userId, vendorId, totalAmount]
    );
    const order = await db.get("SELECT * FROM orders WHERE id = ?", [result.lastID]);
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: "Failed to place order" });
  }
});

// Locations
router.get("/locations", async (req, res) => {
  const { user_id } = req.query;
  const db = await openDb();
  let query = "SELECT * FROM locations WHERE 1=1";
  const params = [];
  
  if (user_id) {
    query += " AND user_id = ?";
    params.push(user_id);
  }

  const locations = await db.all(query, params);
  res.json(locations);
});

router.post("/locations", async (req, res) => {
  const { user_id, latitude, longitude, accuracy, formatted_address, locality, city, district, state, pincode, country, source, label } = req.body;
  const db = await openDb();
  try {
    const result = await db.run(
      "INSERT INTO locations (user_id, latitude, longitude, accuracy, formatted_address, locality, city, district, state, pincode, country, source, label) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [user_id, latitude, longitude, accuracy, formatted_address, locality, city, district, state, pincode, country, source, label]
    );
    const location = await db.get("SELECT * FROM locations WHERE id = ?", [result.lastID]);
    res.json(location);
  } catch (error) {
    res.status(400).json({ error: "Failed to save location" });
  }
});

// Partner Applications
router.get("/partner-applications", async (req, res) => {
  const { status } = req.query;
  const db = await openDb();
  let query = "SELECT * FROM partner_applications WHERE 1=1";
  const params = [];
  
  if (status) {
    query += " AND status = ?";
    params.push(status);
  }

  const applications = await db.all(query, params);
  res.json(applications);
});

router.post("/partner-applications", async (req, res) => {
  const { user_id, business_name, partner_type, category, owner_name, address, city, district, state, pincode, latitude, longitude, operating_hours, service_area, delivery_radius } = req.body;
  const db = await openDb();
  try {
    const result = await db.run(
      "INSERT INTO partner_applications (user_id, business_name, partner_type, category, owner_name, address, city, district, state, pincode, latitude, longitude, operating_hours, service_area, delivery_radius) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [user_id, business_name, partner_type, category, owner_name, address, city, district, state, pincode, latitude, longitude, operating_hours, service_area, delivery_radius]
    );
    const application = await db.get("SELECT * FROM partner_applications WHERE id = ?", [result.lastID]);
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: "Failed to submit partner application" });
  }
});

router.put("/partner-applications/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = await openDb();
  try {
    await db.run("UPDATE partner_applications SET status = ? WHERE id = ?", [status, id]);
    
    // If approved, create the vendor record and update user role
    if (status === 'APPROVED') {
      const app = await db.get("SELECT * FROM partner_applications WHERE id = ?", [id]);
      if (app) {
        await db.run(
          "INSERT INTO vendors (userId, businessName, category, city, address, phone, status) VALUES (?, ?, ?, ?, ?, ?, 'approved')",
          [app.user_id, app.business_name, app.category, app.city, app.address, "0000000000"]
        );
        await db.run("UPDATE users SET role = 'VENDOR' WHERE id = ?", [app.user_id]);
      }
    }
    
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    res.status(400).json({ error: "Failed to update status" });
  }
});

// WhatsApp Webhook
router.get("/whatsapp/webhook", (req, res) => {
  const verify_token = process.env.WHATSAPP_VERIFY_TOKEN || "EZY1_VERIFY_TOKEN";
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

router.post("/whatsapp/webhook", async (req, res) => {
  const body = req.body;
  if (body.object) {
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0] && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
      const metadata = body.entry[0].changes[0].value.metadata || {};
      const phone_number_id = metadata.phone_number_id || "simulated_id";
      const from = body.entry[0].changes[0].value.messages[0].from;
      const msg_body = body.entry[0].changes[0].value.messages[0].text ? body.entry[0].changes[0].value.messages[0].text.body : "";

      console.log(`WhatsApp message from ${from}: ${msg_body}`);
      
      // Basic mock chat flow for WhatsApp
      // In a real production app this would call the WhatsAppService/WhatsAppOrderService
      // and send a message back using Axios to the WhatsApp Cloud API.
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

