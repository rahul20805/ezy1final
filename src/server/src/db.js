import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export async function openDb () {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  })
}

export async function initDb() {
  const db = await openDb();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'CUSTOMER',
      phone TEXT,
      walletBal REAL DEFAULT 0.0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      businessName TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      city TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      rating REAL DEFAULT 0.0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendorId INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      available BOOLEAN DEFAULT 1,
      category TEXT NOT NULL,
      image TEXT,
      FOREIGN KEY (vendorId) REFERENCES vendors (id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      vendorId INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      totalAmount REAL NOT NULL,
      orderSource TEXT DEFAULT 'WEB',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id),
      FOREIGN KEY (vendorId) REFERENCES vendors (id)
    );

    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      accuracy REAL,
      formatted_address TEXT NOT NULL,
      locality TEXT,
      city TEXT,
      district TEXT,
      state TEXT,
      pincode TEXT,
      country TEXT,
      source TEXT NOT NULL,
      label TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS partner_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      business_name TEXT NOT NULL,
      partner_type TEXT NOT NULL,
      category TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      district TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      operating_hours TEXT,
      service_area TEXT,
      delivery_radius REAL,
      status TEXT DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);
  
  // Seed Database with Mock Data if empty
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    console.log("Seeding Database...");
    await db.run(`INSERT INTO users (name, email, role, phone) VALUES ('Admin', 'admin@ezy1.com', 'ADMIN', '9999999999')`);
    await db.run(`INSERT INTO users (name, email, role, phone) VALUES ('Ramesh', 'ramesh@shop.com', 'VENDOR', '8888888888')`);
    
    await db.run(`INSERT INTO vendors (userId, businessName, category, status, city, address, phone) 
                  VALUES (2, 'Sharma General Store', 'Grocery', 'approved', 'Delhi', '123 Main St', '8888888888')`);
                  
    await db.run(`INSERT INTO products (vendorId, name, description, price, category, image) 
                  VALUES (1, 'Aashirvaad Atta (5kg)', 'Whole wheat flour', 250, 'Grocery', 'https://images.unsplash.com/photo-1627909303352-7c85854b4df9')`);
    await db.run(`INSERT INTO products (vendorId, name, description, price, category, image) 
                  VALUES (1, 'Tata Salt (1kg)', 'Iodized salt', 25, 'Grocery', 'https://images.unsplash.com/photo-1627909303352-7c85854b4df9')`);
  }
}
