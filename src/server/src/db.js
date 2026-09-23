import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultDbPath = path.resolve(__dirname, '../database.sqlite');

export async function openDb () {
  return open({
    filename: process.env.DB_PATH || defaultDbPath,
    driver: sqlite3.Database
  })
}

export async function initDb() {
  const db = await openDb();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      phone TEXT UNIQUE,
      passwordHash TEXT,
      role TEXT DEFAULT 'CUSTOMER',
      walletBal REAL DEFAULT 0.0,
      googleId TEXT,
      avatar TEXT,
      status TEXT DEFAULT 'ACTIVE',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS otps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT NOT NULL,
      otpHash TEXT NOT NULL,
      plainOtp TEXT,
      expiresAt INTEGER NOT NULL,
      attempts INTEGER DEFAULT 0,
      lastSentAt INTEGER NOT NULL,
      verified INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      eventId TEXT,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      priority TEXT DEFAULT 'NORMAL',
      data TEXT,
      actionUrl TEXT,
      isRead INTEGER DEFAULT 0,
      readAt DATETIME,
      channel TEXT DEFAULT 'IN_APP',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS notification_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL UNIQUE,
      orders INTEGER DEFAULT 1,
      delivery INTEGER DEFAULT 1,
      bookings INTEGER DEFAULT 1,
      bus INTEGER DEFAULT 1,
      doctor INTEGER DEFAULT 1,
      hospital INTEGER DEFAULT 1,
      services INTEGER DEFAULT 1,
      offers INTEGER DEFAULT 1,
      announcements INTEGER DEFAULT 1,
      pushEnabled INTEGER DEFAULT 1,
      smsEnabled INTEGER DEFAULT 1,
      emailEnabled INTEGER DEFAULT 1,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS push_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      deviceInfo TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
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

    CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partnerUserId TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      name TEXT NOT NULL,
      businessName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'PARTNER',
      partnerType TEXT DEFAULT 'GROCERY',
      providerType TEXT DEFAULT 'GROCERY',
      category TEXT DEFAULT 'Grocery',
      city TEXT NOT NULL,
      address TEXT,
      status TEXT DEFAULT 'ACTIVE',
      isVerified INTEGER DEFAULT 1,
      mustChangePassword INTEGER DEFAULT 0,
      failedAttempts INTEGER DEFAULT 0,
      lockedUntil INTEGER DEFAULT 0,
      lastLoginAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS partner_password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partnerId INTEGER NOT NULL,
      tokenHash TEXT NOT NULL UNIQUE,
      expiresAt INTEGER NOT NULL,
      used INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (partnerId) REFERENCES partners (id)
    );

    CREATE TABLE IF NOT EXISTS hospital_beds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partnerId INTEGER NOT NULL,
      ward TEXT NOT NULL,
      bedNumber TEXT NOT NULL,
      bedType TEXT DEFAULT 'GENERAL',
      status TEXT DEFAULT 'AVAILABLE',
      patientName TEXT,
      dailyRate REAL DEFAULT 1500,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (partnerId) REFERENCES partners (id)
    );

    CREATE TABLE IF NOT EXISTS hospital_doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partnerId INTEGER NOT NULL,
      name TEXT NOT NULL,
      specialty TEXT NOT NULL,
      department TEXT NOT NULL,
      qualification TEXT,
      experienceYears INTEGER DEFAULT 5,
      consultationFee REAL DEFAULT 500,
      availability TEXT DEFAULT 'Mon-Fri 09:00 - 17:00',
      status TEXT DEFAULT 'AVAILABLE',
      FOREIGN KEY (partnerId) REFERENCES partners (id)
    );

    CREATE TABLE IF NOT EXISTS hospital_appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partnerId INTEGER NOT NULL,
      doctorId INTEGER,
      patientName TEXT NOT NULL,
      patientPhone TEXT NOT NULL,
      appointmentDate TEXT NOT NULL,
      timeSlot TEXT NOT NULL,
      status TEXT DEFAULT 'CONFIRMED',
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (partnerId) REFERENCES partners (id)
    );

    CREATE TABLE IF NOT EXISTS pharmacy_medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partnerId INTEGER NOT NULL,
      name TEXT NOT NULL,
      genericName TEXT,
      category TEXT DEFAULT 'General',
      price REAL NOT NULL,
      stockQuantity INTEGER DEFAULT 100,
      requiresPrescription INTEGER DEFAULT 0,
      dosage TEXT,
      status TEXT DEFAULT 'IN_STOCK',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (partnerId) REFERENCES partners (id)
    );

    CREATE TABLE IF NOT EXISTS restaurant_menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partnerId INTEGER NOT NULL,
      name TEXT NOT NULL,
      category TEXT DEFAULT 'Main Course',
      price REAL NOT NULL,
      isVeg INTEGER DEFAULT 1,
      available INTEGER DEFAULT 1,
      description TEXT,
      preparationTimeMin INTEGER DEFAULT 20,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (partnerId) REFERENCES partners (id)
    );

    CREATE TABLE IF NOT EXISTS delivery_assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partnerId INTEGER NOT NULL,
      orderId INTEGER,
      pickupAddress TEXT NOT NULL,
      deliveryAddress TEXT NOT NULL,
      status TEXT DEFAULT 'ASSIGNED',
      earnings REAL DEFAULT 60.0,
      distanceKm REAL DEFAULT 3.5,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (partnerId) REFERENCES partners (id)
    );

    CREATE TABLE IF NOT EXISTS hotels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partnerId INTEGER,
      name TEXT NOT NULL,
      type TEXT DEFAULT 'HOTEL',
      city TEXT NOT NULL,
      address TEXT NOT NULL,
      rating REAL DEFAULT 4.5,
      pricePerNight REAL NOT NULL,
      originalPrice REAL,
      amenities TEXT,
      image TEXT,
      availableRooms INTEGER DEFAULT 10,
      totalRooms INTEGER DEFAULT 20,
      checkInTime TEXT DEFAULT '12:00 PM',
      checkOutTime TEXT DEFAULT '11:00 AM',
      status TEXT DEFAULT 'AVAILABLE',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS hotel_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      hotelId INTEGER NOT NULL,
      checkInDate TEXT NOT NULL,
      checkOutDate TEXT NOT NULL,
      guestsCount INTEGER DEFAULT 1,
      roomsCount INTEGER DEFAULT 1,
      totalAmount REAL NOT NULL,
      guestName TEXT NOT NULL,
      guestPhone TEXT NOT NULL,
      status TEXT DEFAULT 'CONFIRMED',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id),
      FOREIGN KEY (hotelId) REFERENCES hotels (id)
    );

    CREATE TABLE IF NOT EXISTS travel_packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      agencyName TEXT NOT NULL,
      agencyPhone TEXT,
      destination TEXT NOT NULL,
      duration TEXT NOT NULL,
      price REAL NOT NULL,
      rating REAL DEFAULT 4.8,
      itinerary TEXT,
      includedAmenities TEXT,
      image TEXT,
      type TEXT DEFAULT 'LOCAL_TOUR',
      availableSeats INTEGER DEFAULT 15,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS travel_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      packageId INTEGER NOT NULL,
      travelDate TEXT NOT NULL,
      travelersCount INTEGER DEFAULT 1,
      totalAmount REAL NOT NULL,
      travelerName TEXT NOT NULL,
      travelerPhone TEXT NOT NULL,
      status TEXT DEFAULT 'CONFIRMED',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id),
      FOREIGN KEY (packageId) REFERENCES travel_packages (id)
    );

    CREATE TABLE IF NOT EXISTS explore_places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      category TEXT DEFAULT 'TOURIST_ATTRACTION',
      description TEXT,
      openingHours TEXT DEFAULT '09:00 AM - 06:00 PM',
      entryFee REAL DEFAULT 0,
      directions TEXT,
      localTips TEXT,
      rating REAL DEFAULT 4.7,
      image TEXT,
      nearbyHotelsCount INTEGER DEFAULT 12,
      nearbyRestaurantsCount INTEGER DEFAULT 25,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS buses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      busNumber TEXT NOT NULL,
      operatorName TEXT NOT NULL,
      busType TEXT DEFAULT 'AC_SLEEPER',
      sourceCity TEXT NOT NULL,
      destinationCity TEXT NOT NULL,
      departureTime TEXT NOT NULL,
      arrivalTime TEXT NOT NULL,
      duration TEXT NOT NULL,
      fare REAL NOT NULL,
      totalSeats INTEGER DEFAULT 36,
      availableSeats INTEGER DEFAULT 18,
      runningStatus TEXT DEFAULT 'ON_TIME',
      liveLocation TEXT,
      stops TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bus_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      busId INTEGER NOT NULL,
      travelDate TEXT NOT NULL,
      seatNumbers TEXT NOT NULL,
      totalAmount REAL NOT NULL,
      passengerName TEXT NOT NULL,
      passengerPhone TEXT NOT NULL,
      ticketNumber TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'CONFIRMED',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id),
      FOREIGN KEY (busId) REFERENCES buses (id)
    );

    CREATE TABLE IF NOT EXISTS shared_rides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      driverUserId INTEGER,
      driverName TEXT NOT NULL,
      driverPhone TEXT NOT NULL,
      vehicleType TEXT DEFAULT 'SEDAN',
      sourceCity TEXT NOT NULL,
      destinationCity TEXT NOT NULL,
      pickupPoint TEXT NOT NULL,
      dropPoint TEXT NOT NULL,
      departureDate TEXT NOT NULL,
      departureTime TEXT NOT NULL,
      totalSeats INTEGER DEFAULT 4,
      availableSeats INTEGER DEFAULT 3,
      farePerSeat REAL NOT NULL,
      verifiedStatus TEXT DEFAULT 'VERIFIED',
      status TEXT DEFAULT 'OPEN',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS shared_ride_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rideId INTEGER NOT NULL,
      passengerUserId INTEGER NOT NULL,
      passengerName TEXT NOT NULL,
      passengerPhone TEXT NOT NULL,
      seatsBooked INTEGER DEFAULT 1,
      totalFare REAL NOT NULL,
      status TEXT DEFAULT 'CONFIRMED',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (rideId) REFERENCES shared_rides (id),
      FOREIGN KEY (passengerUserId) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS home_healthcare_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      serviceName TEXT NOT NULL,
      category TEXT DEFAULT 'DOCTOR_AT_HOME',
      description TEXT,
      fee REAL NOT NULL,
      duration TEXT DEFAULT '45 mins',
      rating REAL DEFAULT 4.9,
      image TEXT,
      providerName TEXT NOT NULL,
      availableSlots TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS home_healthcare_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      serviceId INTEGER NOT NULL,
      serviceType TEXT NOT NULL,
      patientName TEXT NOT NULL,
      patientPhone TEXT NOT NULL,
      address TEXT NOT NULL,
      appointmentDate TEXT NOT NULL,
      timeSlot TEXT NOT NULL,
      status TEXT DEFAULT 'CONFIRMED',
      totalAmount REAL NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id),
      FOREIGN KEY (serviceId) REFERENCES home_healthcare_services (id)
    );
  `);
  
  // Check if missing columns need migration
  const partnerColumns = await db.all("PRAGMA table_info(partners)");
  const pColNames = partnerColumns.map((c) => c.name);
  if (!pColNames.includes("providerType")) {
    try { await db.exec("ALTER TABLE partners ADD COLUMN providerType TEXT DEFAULT 'GROCERY'"); } catch {}
  }

  const userColumns = await db.all("PRAGMA table_info(users)");
  const colNames = userColumns.map((c) => c.name);
  if (!colNames.includes("username")) {
    try { await db.exec("ALTER TABLE users ADD COLUMN username TEXT"); } catch {}
  }
  if (!colNames.includes("passwordHash")) {
    try { await db.exec("ALTER TABLE users ADD COLUMN passwordHash TEXT"); } catch {}
  }
  if (!colNames.includes("status")) {
    try { await db.exec("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'ACTIVE'"); } catch {}
  }
  if (!colNames.includes("googleId")) {
    try { await db.exec("ALTER TABLE users ADD COLUMN googleId TEXT"); } catch {}
  }
  if (!colNames.includes("avatar")) {
    try { await db.exec("ALTER TABLE users ADD COLUMN avatar TEXT"); } catch {}
  }
  if (!colNames.includes("updatedAt")) {
    try { await db.exec("ALTER TABLE users ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP"); } catch {}
  }

  // Ensure partner accounts have accurate providerType and seed new providers if missing
  const crypto = await import('crypto');
  const hashPw = (pw) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const derived = crypto.pbkdf2Sync(pw, salt, 100000, 64, "sha512").toString("hex");
    return `${salt}:${derived}`;
  };

  const seedPartners = [
    { partnerUserId: 'EZY-P-10001', pw: 'Admin@2026!', name: 'Alka & Rahul Yadav', bName: 'EZY1 Platform Headquarters', email: 'admin@ezy1.in', phone: '9876543210', role: 'ADMIN', pType: 'ADMIN', cat: 'All', city: 'Bengaluru', addr: 'HQ Tech Park' },
    { partnerUserId: 'EZY-P-10002', pw: 'Sharma@2026!', name: 'Ramesh Sharma', bName: 'Sharma Kirana Store', email: 'sharma.kirana@partner.ezy1.in', phone: '9876543211', role: 'PARTNER', pType: 'GROCERY', cat: 'Grocery', city: 'Mumbai', addr: '123 Market Rd' },
    { partnerUserId: 'EZY-P-10003', pw: 'Nair@2026!', name: 'Krishnan Nair', bName: 'Nair Ayurveda & Pharma', email: 'nair.pharma@partner.ezy1.in', phone: '9876543212', role: 'PARTNER', pType: 'PHARMACY', cat: 'Pharmacy', city: 'Thiruvananthapuram', addr: '45 Temple St' },
    { partnerUserId: 'EZY-P-10004', pw: 'Suresh@2026!', name: 'Suresh Sharma', bName: 'Suresh Electricals & Fixes', email: 'suresh.services@partner.ezy1.in', phone: '9876543213', role: 'PARTNER', pType: 'SERVICE_PROVIDER', cat: 'Services', city: 'Bengaluru', addr: '77 MG Rd' },
    { partnerUserId: 'EZY-P-10005', pw: 'Rajesh@2026!', name: 'Rajesh Kumar', bName: 'Rajesh Fleet & Logistics', email: 'rajesh.transport@partner.ezy1.in', phone: '9876543214', role: 'PARTNER', pType: 'DELIVERY', cat: 'Transport', city: 'Delhi', addr: '99 Ring Rd' },
    { partnerUserId: 'EZY-P-10006', pw: 'Hospital@2026!', name: 'Dr. Ananya Roy', bName: 'City Care Multispecialty Hospital', email: 'citycare.hospital@partner.ezy1.in', phone: '9876543215', role: 'PARTNER', pType: 'HOSPITAL', cat: 'Healthcare', city: 'Bengaluru', addr: '12 Indiranagar' },
    { partnerUserId: 'EZY-P-10007', pw: 'Restaurant@2026!', name: 'Chef Farhan Qureshi', bName: 'Royal Biryani & Curries', email: 'royal.biryani@partner.ezy1.in', phone: '9876543216', role: 'PARTNER', pType: 'RESTAURANT', cat: 'Food', city: 'Hyderabad', addr: '88 Banjara Hills' }
  ];

  for (const p of seedPartners) {
    const existing = await db.get("SELECT id FROM partners WHERE partnerUserId = ?", [p.partnerUserId]);
    const pwHash = hashPw(p.pw);
    if (!existing) {
      await db.run(`
        INSERT INTO partners (partnerUserId, passwordHash, name, businessName, email, phone, role, partnerType, providerType, category, city, address, status, isVerified, mustChangePassword)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 1, 0)
      `, [p.partnerUserId, pwHash, p.name, p.bName, p.email, p.phone, p.role, p.pType, p.pType, p.cat, p.city, p.addr]);
    } else {
      await db.run(`
        UPDATE partners SET providerType = ?, partnerType = ?, role = ?, passwordHash = ?, failedAttempts = 0, lockedUntil = 0 WHERE partnerUserId = ?
      `, [p.pType, p.pType, p.role, pwHash, p.partnerUserId]);
    }
  }

  // Seed sample provider domain rows if empty
  const hospPartner = await db.get("SELECT id FROM partners WHERE partnerUserId = 'EZY-P-10006'");
  if (hospPartner) {
    const bedCount = await db.get("SELECT COUNT(*) as count FROM hospital_beds WHERE partnerId = ?", [hospPartner.id]);
    if (bedCount.count === 0) {
      await db.run(`
        INSERT INTO hospital_beds (partnerId, ward, bedNumber, bedType, status, dailyRate)
        VALUES 
        (?, 'ICU Ward A', 'ICU-101', 'ICU', 'AVAILABLE', 4500),
        (?, 'ICU Ward A', 'ICU-102', 'ICU', 'OCCUPIED', 4500),
        (?, 'General Ward B', 'GEN-201', 'GENERAL', 'AVAILABLE', 1200),
        (?, 'Private Deluxe', 'DELUXE-301', 'DELUXE', 'AVAILABLE', 3000)
      `, [hospPartner.id, hospPartner.id, hospPartner.id, hospPartner.id]);

      await db.run(`
        INSERT INTO hospital_doctors (partnerId, name, specialty, department, qualification, consultationFee, availability)
        VALUES
        (?, 'Dr. S. K. Gupta', 'Cardiologist', 'Cardiology', 'MD, DM (Cardiology)', 800, 'Mon-Sat 10:00 - 14:00'),
        (?, 'Dr. Priya Varma', 'Neurologist', 'Neurology', 'MBBS, MD, DM', 950, 'Tue-Sun 11:00 - 16:00')
      `, [hospPartner.id, hospPartner.id]);
    }
  }

  const pharmaPartner = await db.get("SELECT id FROM partners WHERE partnerUserId = 'EZY-P-10003'");
  if (pharmaPartner) {
    const medCount = await db.get("SELECT COUNT(*) as count FROM pharmacy_medicines WHERE partnerId = ?", [pharmaPartner.id]);
    if (medCount.count === 0) {
      await db.run(`
        INSERT INTO pharmacy_medicines (partnerId, name, genericName, category, price, stockQuantity, requiresPrescription)
        VALUES
        (?, 'Paracetamol 650mg', 'Paracetamol', 'Analgesic', 30.0, 500, 0),
        (?, 'Amoxicillin 500mg', 'Amoxicillin', 'Antibiotic', 120.0, 100, 1),
        (?, 'Cetirizine 10mg', 'Cetirizine', 'Antihistamine', 45.0, 250, 0)
      `, [pharmaPartner.id, pharmaPartner.id, pharmaPartner.id]);
    }
  }

  const restPartner = await db.get("SELECT id FROM partners WHERE partnerUserId = 'EZY-P-10007'");
  if (restPartner) {
    const menuCount = await db.get("SELECT COUNT(*) as count FROM restaurant_menu WHERE partnerId = ?", [restPartner.id]);
    if (menuCount.count === 0) {
      await db.run(`
        INSERT INTO restaurant_menu (partnerId, name, category, price, isVeg, available)
        VALUES
        (?, 'Hyderabadi Dum Biryani', 'Main Course', 280.0, 0, 1),
        (?, 'Paneer Butter Masala', 'Main Course', 220.0, 1, 1),
        (?, 'Garlic Naan (2 pcs)', 'Breads', 60.0, 1, 1)
      `, [restPartner.id, restPartner.id, restPartner.id]);
    }
  }

  const delivPartner = await db.get("SELECT id FROM partners WHERE partnerUserId = 'EZY-P-10005'");
  if (delivPartner) {
    const tripCount = await db.get("SELECT COUNT(*) as count FROM delivery_assignments WHERE partnerId = ?", [delivPartner.id]);
    if (tripCount.count === 0) {
      await db.run(`
        INSERT INTO delivery_assignments (partnerId, orderId, pickupAddress, deliveryAddress, status, earnings, distanceKm)
        VALUES
        (?, 101, 'Sharma Kirana Store, Indiranagar', 'Flat 402, Green Glen Layout, Bellandur', 'ASSIGNED', 75.0, 4.2),
        (?, 102, 'Royal Biryani & Curries, Koramangala', 'HSR Layout Sector 2', 'DELIVERED', 60.0, 3.1)
      `, [delivPartner.id, delivPartner.id]);
    }
  }
  
  // Seed Database with Mock Data if empty
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    console.log("Seeding Database with default users and preferences...");
    await db.run(`INSERT INTO users (id, name, email, role, phone, walletBal) VALUES (1, 'Admin', 'admin@ezy1.com', 'ADMIN', '9999999999', 50000.0)`);
    await db.run(`INSERT INTO users (id, name, email, role, phone, walletBal) VALUES (2, 'Ramesh Kumar', 'ramesh@shop.com', 'VENDOR', '8888888888', 12450.0)`);
    await db.run(`INSERT INTO users (id, name, email, role, phone, walletBal) VALUES (3, 'Rahul Sharma', 'customer@ezy1.com', 'CUSTOMER', '9876543210', 2500.0)`);
    
    // Seed default preferences for seed users
    await db.run(`INSERT OR IGNORE INTO notification_preferences (userId) VALUES (1)`);
    await db.run(`INSERT OR IGNORE INTO notification_preferences (userId) VALUES (2)`);
    await db.run(`INSERT OR IGNORE INTO notification_preferences (userId) VALUES (3)`);

    // Seed initial notifications for customer
    await db.run(`
      INSERT INTO notifications (userId, eventId, type, category, title, message, priority, actionUrl, isRead)
      VALUES 
      (3, 'evt_welcome_1', 'EZY1_LAUNCH', 'announcements', 'Welcome to EZY1! 🎉', 'Experience instant groceries, medicine, services, and live bus tracking in one app.', 'NORMAL', '/dashboard', 0),
      (3, 'evt_offer_1', 'COUPON_AVAILABLE', 'offers', 'Special Welcome Offer 🎁', 'Use code EZYFIRST for flat ₹100 off on your first order above ₹299.', 'HIGH', '/dashboard/commerce', 0),
      (3, 'evt_wallet_1', 'PAYMENT_SUCCESS', 'orders', 'Wallet Credited 💰', 'Welcome cashback of ₹50 has been added to your EZY1 Digital Wallet.', 'NORMAL', '/dashboard/wallet', 1)
    `);

    await db.run(`INSERT INTO vendors (userId, businessName, category, status, city, address, phone) 
                  VALUES (2, 'Sharma General Store', 'Grocery', 'approved', 'Delhi', '123 Main St', '8888888888')`);
                  
    await db.run(`INSERT INTO products (vendorId, name, description, price, category, image) 
                  VALUES (1, 'Aashirvaad Atta (5kg)', 'Whole wheat flour', 250, 'Grocery', 'https://images.unsplash.com/photo-1627909303352-7c85854b4df9')`);
    await db.run(`INSERT INTO products (vendorId, name, description, price, category, image) 
                  VALUES (1, 'Tata Salt (1kg)', 'Iodized salt', 25, 'Grocery', 'https://images.unsplash.com/photo-1627909303352-7c85854b4df9')`);
  }

  // 1. Seed Hotels (EZY Stay)
  const hotelCount = await db.get("SELECT COUNT(*) as count FROM hotels");
  if (hotelCount.count === 0) {
    await db.run(`
      INSERT INTO hotels (name, type, city, address, rating, pricePerNight, originalPrice, amenities, image, availableRooms, totalRooms)
      VALUES
      ('The Heritage Grand Suites', 'HOTEL', 'Bengaluru', 'MG Road, Central Bengaluru', 4.8, 2899, 4500, 'Free WiFi, Breakfast Included, AC, Swimming Pool, Parking', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', 6, 25),
      ('Bloom Suites Urban Stay', 'HOTEL', 'Bengaluru', 'Indiranagar 100ft Road', 4.6, 1899, 2800, 'Free WiFi, AC, Work Desk, 24/7 Room Service', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80', 8, 30),
      ('Coorg Pine Mist Homestay', 'HOMESTAY', 'Madikeri', 'Estate Hilltop, Coorg', 4.9, 2400, 3200, 'Home Cooked Meals, Fireplace, Coffee Estate Walk, WiFi', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80', 3, 8),
      ('Zostel Backpacker Hub', 'HOSTEL', 'Bengaluru', 'Koramangala 5th Block', 4.5, 699, 999, 'Bunk Beds, High Speed WiFi, Cafe, Common Room', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80', 12, 40)
    `);
  }

  // 2. Seed Travel Packages & Tours (EZY Travel)
  const travelCount = await db.get("SELECT COUNT(*) as count FROM travel_packages");
  if (travelCount.count === 0) {
    await db.run(`
      INSERT INTO travel_packages (title, agencyName, agencyPhone, destination, duration, price, rating, itinerary, includedAmenities, image, type, availableSeats)
      VALUES
      ('Mysore Royal Heritage Day Tour', 'Karnataka Eco Tours', '+91 9845012345', 'Mysore & Srirangapatna', '1 Day (06:00 AM - 09:00 PM)', 1299, 4.9, 'Mysore Palace -> Chamundi Hills -> Brindavan Gardens -> Srirangapatna Fort', 'AC Coach, Guided Commentary, Entry Tickets, Lunch', 'https://images.unsplash.com/photo-1600100397608-f010f4439c7a?w=800&q=80', 'LOCAL_TOUR', 18),
      ('Ooty & Nilgiri Toy Train Getaway', 'Southern Holidays Ltd', '+91 9845023456', 'Ooty, Tamil Nadu', '3 Days / 2 Nights', 5499, 4.8, 'Toy Train Experience -> Botanical Garden -> Doddabetta Peak -> Pykara Lake', 'Hotel Stay, Breakfast & Dinner, Sightseeing Cab, Toy Train Pass', 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80', 'DOMESTIC', 12),
      ('Hampi Ancient Ruins Exploration', 'Heritage Expeditions', '+91 9845034567', 'Hampi, Karnataka', '2 Days / 1 Night', 3899, 4.9, 'Virupaksha Temple -> Vijaya Vittala Stone Chariot -> Sunset at Matanga Hill', 'Resort Stay, Certified Historian Guide, Cycle Tour', 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80', 'SIGHTSEEING', 14)
    `);
  }

  // 3. Seed Explore Places & Local Guides (Explore & Guide)
  const exploreCount = await db.get("SELECT COUNT(*) as count FROM explore_places");
  if (exploreCount.count === 0) {
    await db.run(`
      INSERT INTO explore_places (name, city, category, description, openingHours, entryFee, directions, localTips, rating, image, nearbyHotelsCount, nearbyRestaurantsCount)
      VALUES
      ('Cubbon Park & State Central Library', 'Bengaluru', 'TOURIST_ATTRACTION', '300-acre green lung in the heart of the city, famous for red brick Victorian architecture, weekend morning walks, and lush foliage.', '06:00 AM - 07:00 PM', 0, 'Accessible via Cubbon Park Metro Station (Purple Line)', 'Visit Sunday mornings for car-free pedestrian cycling and dog park fun.', 4.8, 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80', 14, 38),
      ('VV Puram Food Street (Thindi Beedi)', 'Bengaluru', 'FOOD_STREET', 'Legendary street-food haven with dozens of pure-veg stalls serving hot Paddus, Akki Roti, Butter Masala Dosa, and Jalebi.', '06:00 PM - 11:30 PM', 0, 'Sajjan Rao Circle, VV Puram. Nearest Metro: National College', 'Do not miss the Congress Groundnut Bun and Hot Floating Idli.', 4.9, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', 8, 45),
      ('Bengaluru Palace', 'Bengaluru', 'HERITAGE', 'Tudor-style royal residence built by Rev. J. Garrett, reminiscent of Windsor Castle, featuring fortified towers and stained glass.', '10:00 AM - 05:30 PM', 250, 'Palace Road, Vasanth Nagar. Metro: Cubbon Park or Cantonment', 'Audio guide is included with the entry ticket. Photography passes are extra.', 4.6, 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80', 12, 22),
      ('Lalbagh Botanical Garden & Glass House', 'Bengaluru', 'TOURIST_ATTRACTION', 'Historic 240-acre garden commissioned by Hyder Ali, housing 1,800+ rare species and a 3,000-million-year-old rock outcrop.', '06:00 AM - 07:00 PM', 30, 'Lalbagh Metro Station on Green Line opens right at the West Gate', 'Best enjoyed during morning yoga or biannual Republic Day flower show.', 4.7, 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80', 9, 31)
    `);
  }

  // 4. Seed Regional Buses (EZY Bus)
  const busCount = await db.get("SELECT COUNT(*) as count FROM buses");
  if (busCount.count === 0) {
    await db.run(`
      INSERT INTO buses (busNumber, operatorName, busType, sourceCity, destinationCity, departureTime, arrivalTime, duration, fare, totalSeats, availableSeats, runningStatus, liveLocation, stops)
      VALUES
      ('KA-01-F-9921', 'KSRTC Airavat Club Class', 'AC_SLEEPER', 'Bengaluru', 'Mysore', '07:30 AM', '10:30 AM', '3h 00m', 380, 42, 16, 'ON_TIME', 'Bidadi Toll Plaza (KM 32)', 'Majestic, Kengeri, Mandya, Mysore Suburb Bus Stand'),
      ('KA-57-A-4102', 'VRL Travels Multi-Axle Volvo', 'VOLVO_MULTI_AXLE', 'Bengaluru', 'Hyderabad', '09:00 PM', '06:30 AM', '9h 30m', 1150, 36, 9, 'ON_TIME', 'Anantapur Bypass', 'Anand Rao Circle, Hebbal, Kurnool, Gachibowli'),
      ('KA-04-E-1080', 'EZY City Shuttle (KIA Express)', 'ELECTRIC', 'Indiranagar', 'Kempegowda Airport (BLR)', '08:15 AM', '09:30 AM', '1h 15m', 240, 32, 21, 'ON_TIME', 'Hebbal Flyover', 'CMH Road, Domlur, Hebbal, Toll Gate, Terminal 1 & 2')
    `);
  }

  // 5. Seed Shared Rides (EZY Share Ride)
  const rideCount = await db.get("SELECT COUNT(*) as count FROM shared_rides");
  if (rideCount.count === 0) {
    await db.run(`
      INSERT INTO shared_rides (driverName, driverPhone, vehicleType, sourceCity, destinationCity, pickupPoint, dropPoint, departureDate, departureTime, totalSeats, availableSeats, farePerSeat, verifiedStatus)
      VALUES
      ('Aditya Sen (Software Engg)', '+91 9845112233', 'Honda City (Sedan)', 'Bengaluru', 'Bengaluru', 'Indiranagar Metro Station', 'Electronic City Phase 1 (Infosys Gate)', 'Today', '09:00 AM', 4, 3, 110, 'VERIFIED'),
      ('Deepika Rao (Product Designer)', '+91 9845223344', 'Hyundai Creta (SUV)', 'Bengaluru', 'Bengaluru', 'HSR Layout BDA Complex', 'Whitefield ITPL Main Gate', 'Today', '09:30 AM', 4, 2, 130, 'VERIFIED'),
      ('Karthik Nair (Consultant)', '+91 9845334455', 'Maruti Baleno (Hatchback)', 'Bengaluru', 'Mysore', 'Silk Board Junction', 'Mysore Palace Gate', 'Tomorrow', '06:30 AM', 3, 2, 350, 'VERIFIED')
    `);
  }

  // 6. Seed Home Healthcare (Doctor at Home, Nurse, Physiotherapy)
  const healthCount = await db.get("SELECT COUNT(*) as count FROM home_healthcare_services");
  if (healthCount.count === 0) {
    await db.run(`
      INSERT INTO home_healthcare_services (serviceName, category, description, fee, duration, rating, image, providerName, availableSlots)
      VALUES
      ('General Physician Home Visit', 'DOCTOR_AT_HOME', 'Certified MBBS doctor visits your home for physical examination, prescription, vitals checkup, and treatment plan.', 799, '45 mins', 4.9, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80', 'Apollo HomeCare Network', 'Today: 11:30 AM, 02:00 PM, 05:00 PM'),
      ('Certified Nurse Visit at Home', 'NURSE_AT_HOME', 'IV infusion, wound dressing, catheter change, post-surgical dressing and injections administered by a registered nurse.', 499, '30 mins', 4.8, 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80', 'Portea Health Specialists', 'Today: 10:00 AM, 01:00 PM, 04:30 PM'),
      ('Physiotherapy & Mobility Session', 'PHYSIOTHERAPY', 'Qualified physiotherapist for stroke recovery, back pain, joint rehab, geriatric mobility and sports injury exercises.', 850, '60 mins', 4.9, 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80', 'Max Physio Care', 'Today: 03:00 PM, 06:00 PM'),
      ('Complete Full Body Blood Sample Collection', 'SAMPLE_COLLECTION', 'NABL-accredited phlebotomist collects blood/urine sample from home with cold-chain transport. Digital report in 6 hrs.', 199, '15 mins', 4.9, 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80', 'Thyrocare / EZY Diagnostics', 'Today: 07:00 AM - 11:00 AM (Fasting)')
    `);
  }

  // 7. Seed Emergency Beds in hospital_beds if missing
  const emBed = await db.get("SELECT COUNT(*) as count FROM hospital_beds WHERE bedType = 'EMERGENCY'");
  if (emBed.count === 0 && hospPartner) {
    await db.run(`
      INSERT INTO hospital_beds (partnerId, ward, bedNumber, bedType, status, dailyRate)
      VALUES
      (?, 'Emergency Trauma ICU', 'ER-01', 'EMERGENCY', 'AVAILABLE', 5000),
      (?, 'Emergency Trauma ICU', 'ER-02', 'EMERGENCY', 'AVAILABLE', 5000),
      (?, 'Emergency Cardiac Ward', 'ER-03', 'EMERGENCY', 'OCCUPIED', 5500)
    `, [hospPartner.id, hospPartner.id, hospPartner.id]);
  }
}
