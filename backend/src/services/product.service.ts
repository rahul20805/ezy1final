import { query, queryOne, execute } from "../repositories/database.adapter.js";

export const productService = {
  async getProducts(filters: {
    category?: string;
    vendorId?: number;
    search?: string;
    city?: string;
    limit?: number;
    offset?: number;
  }) {
    let sql = "SELECT p.*, v.businessName as vendorName, v.city as vendorCity FROM products p LEFT JOIN vendors v ON p.vendorId = v.id WHERE 1=1";
    const params: any[] = [];

    if (filters.category) {
      sql += " AND (LOWER(p.category) = LOWER(?) OR LOWER(p.category) LIKE LOWER(?))";
      params.push(filters.category, `%${filters.category}%`);
    }

    if (filters.vendorId) {
      sql += " AND p.vendorId = ?";
      params.push(Number(filters.vendorId));
    }

    if (filters.search) {
      sql += " AND (LOWER(p.name) LIKE LOWER(?) OR LOWER(p.description) LIKE LOWER(?))";
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.city) {
      sql += " AND LOWER(v.city) = LOWER(?)";
      params.push(filters.city);
    }

    sql += " ORDER BY p.id DESC";

    if (filters.limit) {
      sql += " LIMIT ?";
      params.push(Number(filters.limit));
      if (filters.offset) {
        sql += " OFFSET ?";
        params.push(Number(filters.offset));
      }
    }

    return query(sql, params);
  },

  async getProductById(id: number) {
    const product = await queryOne(
      "SELECT p.*, v.businessName as vendorName, v.city as vendorCity, v.phone as vendorPhone FROM products p LEFT JOIN vendors v ON p.vendorId = v.id WHERE p.id = ?",
      [id]
    );
    if (!product) throw new Error("Product not found");
    return product;
  },

  async getCategories() {
    // Return standard categories + dynamic categories from products
    const rows = await query("SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != ''");
    const existing = rows.map(r => r.category);

    const standard = [
      { id: 1, name: "Grocery & Kirana", slug: "grocery", icon: "ShoppingBag" },
      { id: 2, name: "Fresh Fruits", slug: "fruits", icon: "Apple" },
      { id: 3, name: "Vegetables", slug: "vegetables", icon: "Carrot" },
      { id: 4, name: "Restaurants & Food", slug: "restaurants", icon: "Utensils" },
      { id: 5, name: "Pharmacy & Medicines", slug: "pharmacy", icon: "Pill" },
      { id: 6, name: "Home Healthcare", slug: "home-healthcare", icon: "HeartPulse" },
      { id: 7, name: "Diagnostics & Labs", slug: "diagnostics", icon: "Activity" },
      { id: 8, name: "Hospitals & Clinics", slug: "hospitals", icon: "Building2" },
      { id: 9, name: "Local Services", slug: "services", icon: "Wrench" },
      { id: 10, name: "Cab & Transport", slug: "transport", icon: "Car" },
      { id: 11, name: "Bus Tickets", slug: "bus", icon: "Bus" },
      { id: 12, name: "Share Ride", slug: "share-ride", icon: "Users" },
      { id: 13, name: "Stays & Hotels", slug: "stays", icon: "BedDouble" },
      { id: 14, name: "Travel & Tours", slug: "travel", icon: "Compass" }
    ];

    return standard;
  },

  async getVendors(filters: { category?: string; city?: string; search?: string }) {
    let sql = "SELECT * FROM vendors WHERE 1=1";
    const params: any[] = [];

    if (filters.category) {
      sql += " AND LOWER(category) = LOWER(?)";
      params.push(filters.category);
    }

    if (filters.city) {
      sql += " AND LOWER(city) = LOWER(?)";
      params.push(filters.city);
    }

    if (filters.search) {
      sql += " AND (LOWER(businessName) LIKE LOWER(?) OR LOWER(city) LIKE LOWER(?))";
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    sql += " ORDER BY rating DESC";
    return query(sql, params);
  },

  async getVendorById(id: number) {
    const vendor = await queryOne("SELECT * FROM vendors WHERE id = ?", [id]);
    if (!vendor) throw new Error("Vendor not found");

    const products = await query("SELECT * FROM products WHERE vendorId = ? AND available = 1", [id]);
    return {
      ...vendor,
      products
    };
  },

  async createProduct(data: {
    vendorId?: number;
    name: string;
    description?: string;
    price: number;
    category: string;
    image?: string;
    available?: boolean | number;
  }) {
    const res = await execute(
      `INSERT INTO products (vendorId, name, description, price, category, image, available)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.vendorId || 1,
        data.name,
        data.description || "",
        data.price,
        data.category,
        data.image || "",
        data.available !== false ? 1 : 0
      ]
    );
    const newId = res.lastID;
    return this.getProductById(newId);
  },

  async updateProduct(id: number, data: Partial<{
    name: string;
    description?: string;
    price: number;
    category: string;
    image?: string;
    available?: boolean | number;
  }>) {
    const existing = await queryOne("SELECT * FROM products WHERE id = ?", [id]);
    if (!existing) throw new Error("Product not found");

    await execute(
      `UPDATE products 
       SET name = COALESCE(?, name),
           description = COALESCE(?, description),
           price = COALESCE(?, price),
           category = COALESCE(?, category),
           image = COALESCE(?, image),
           available = COALESCE(?, available)
       WHERE id = ?`,
      [
        data.name ?? null,
        data.description ?? null,
        data.price ?? null,
        data.category ?? null,
        data.image ?? null,
        data.available !== undefined ? (data.available ? 1 : 0) : null,
        id
      ]
    );
    return this.getProductById(id);
  },

  async deleteProduct(id: number) {
    const existing = await queryOne("SELECT * FROM products WHERE id = ?", [id]);
    if (!existing) throw new Error("Product not found");
    await execute("DELETE FROM products WHERE id = ?", [id]);
    return { success: true, message: `Product ${id} deleted successfully` };
  }
};
