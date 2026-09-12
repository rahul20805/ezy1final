import fs from "fs";
import path from "path";
import { hashPassword } from "./auth.js";

// Storage path determination (handles local disk and serverless /tmp)
function getStorageFilePath() {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "ezy1_production_db.json");
  }
  return path.join(process.cwd(), "ezy1_db.json");
}

const STORAGE_FILE = getStorageFilePath();

// Initial database seeding
function getInitialSeedData() {
  return {
    users: [
      {
        id: 1,
        username: "admin",
        passwordHash: hashPassword("admin123"),
        name: "Platform Master Owner",
        email: "admin@ezy1.in",
        phone: "+91 98765 43210",
        city: "Bengaluru",
        role: "super_owner",
        vendorId: 0,
        status: "active",
        createdAt: "2025-09-01T00:00:00.000Z",
      },
      {
        id: 2,
        username: "sharma_grocery",
        passwordHash: hashPassword("partner123"),
        name: "Ramesh Sharma",
        email: "sharma.kirana@partner.ezy1.in",
        phone: "9876543210",
        city: "Mumbai",
        role: "partner",
        vendorId: 1,
        status: "active",
        createdAt: "2025-10-15T00:00:00.000Z",
      },
      {
        id: 3,
        username: "nair_pharma",
        passwordHash: hashPassword("partner123"),
        name: "Krishnan Nair",
        email: "nair.pharma@partner.ezy1.in",
        phone: "9845012345",
        city: "Thiruvananthapuram",
        role: "partner",
        vendorId: 2,
        status: "active",
        createdAt: "2025-11-02T00:00:00.000Z",
      },
      {
        id: 4,
        username: "suresh_services",
        passwordHash: hashPassword("partner123"),
        name: "Suresh Sharma",
        email: "suresh.services@partner.ezy1.in",
        phone: "9812345670",
        city: "Bengaluru",
        role: "partner",
        vendorId: 3,
        status: "active",
        createdAt: "2026-01-05T00:00:00.000Z",
      },
      {
        id: 5,
        username: "rajesh_transport",
        passwordHash: hashPassword("partner123"),
        name: "Rajesh Kumar",
        email: "rajesh.transport@partner.ezy1.in",
        phone: "9900112233",
        city: "Bengaluru",
        role: "partner",
        vendorId: 4,
        status: "active",
        createdAt: "2026-01-10T00:00:00.000Z",
      },
      {
        id: 6,
        username: "dr_priya",
        passwordHash: hashPassword("partner123"),
        name: "Dr. Priya Sharma",
        email: "dr.priya@partner.ezy1.in",
        phone: "9823456789",
        city: "Mumbai",
        role: "partner",
        vendorId: 6,
        status: "active",
        createdAt: "2026-01-15T00:00:00.000Z",
      },
    ],
    vendors: [
      {
        id: 1,
        userId: 2,
        businessName: "Sharma Kirana Store",
        ownerName: "Ramesh Sharma",
        category: "Grocery",
        city: "Mumbai",
        address: "12, Andheri West Market, Mumbai",
        phone: "9876543210",
        email: "sharma.kirana@partner.ezy1.in",
        description: "Fresh grains, daily grocery essentials, packaged spices, and instant daily needs.",
        status: "approved",
        rating: 4.8,
        totalOrders: 340,
        totalRevenue: 84500,
        openingHours: "07:00 AM - 10:00 PM",
        deliveryRadiusKm: 8,
        verified: true,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
        joinedAt: "2025-10-15T00:00:00.000Z",
      },
      {
        id: 2,
        userId: 3,
        businessName: "Nair Ayurveda & Pharma",
        ownerName: "Krishnan Nair",
        category: "Pharmacy",
        city: "Thiruvananthapuram",
        address: "45, East Fort Road, Thiruvananthapuram",
        phone: "9845012345",
        email: "nair.pharma@partner.ezy1.in",
        description: "Certified prescription medications, Ayurvedic wellness supplements, and first-aid kits.",
        status: "approved",
        rating: 4.9,
        totalOrders: 215,
        totalRevenue: 62100,
        openingHours: "08:00 AM - 11:00 PM",
        deliveryRadiusKm: 12,
        verified: true,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80",
        joinedAt: "2025-11-02T00:00:00.000Z",
      },
      {
        id: 3,
        userId: 4,
        businessName: "Suresh Electricals & Fixes",
        ownerName: "Suresh Sharma",
        category: "Services",
        city: "Bengaluru",
        address: "100ft Road, Indiranagar, Bengaluru",
        phone: "9812345670",
        email: "suresh.services@partner.ezy1.in",
        description: "Professional residential electrical installation, switchboard repair, appliance maintenance.",
        serviceType: "Electrical & Home Maintenance",
        pricePerHour: 299,
        experienceYears: 8,
        serviceArea: "Bengaluru Central & East",
        available: true,
        status: "approved",
        rating: 4.9,
        totalOrders: 145,
        totalRevenue: 48900,
        openingHours: "08:00 AM - 09:00 PM",
        deliveryRadiusKm: 15,
        verified: true,
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80",
        joinedAt: "2026-01-05T00:00:00.000Z",
      },
      {
        id: 4,
        userId: 5,
        businessName: "Rajesh Fleet & Logistics",
        ownerName: "Rajesh Kumar",
        category: "Transport",
        city: "Bengaluru",
        address: "Majestic Bus Station Road, Bengaluru",
        phone: "9900112233",
        email: "rajesh.transport@partner.ezy1.in",
        description: "Reliable airport cabs, city rides, and intracity parcel transport.",
        vehicleType: "Sedan & Express Van",
        routeName: "Bengaluru City & Airport Express",
        fare: 499,
        availableSeats: 4,
        timings: "24x7 Active",
        licenseNumber: "KA-01-2024-TR",
        available: true,
        status: "approved",
        rating: 4.7,
        totalOrders: 420,
        totalRevenue: 124000,
        openingHours: "24x7 Active",
        deliveryRadiusKm: 30,
        verified: true,
        image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80",
        joinedAt: "2026-01-10T00:00:00.000Z",
      },
      {
        id: 5,
        userId: 1,
        businessName: "Manipal Multi-Specialty Hospital",
        ownerName: "Dr. Arvind Rao",
        category: "Healthcare",
        city: "Bengaluru",
        address: "HAL Old Airport Road, Kodihalli, Bengaluru",
        phone: "080-25024444",
        email: "emergency@manipal.health",
        description: "24x7 Trauma care, ICU beds, general physician appointments, and diagnostic laboratories.",
        departments: "Emergency, Cardiology, Neurology, Orthopedics, Critical Care",
        totalBeds: 350,
        availableBeds: 42,
        icuBedsAvailable: 8,
        hasEmergency24x7: true,
        emergencyPhone: "080-25024444",
        facilities: "24x7 Emergency, ICU, Pharmacy, Ambulance, Blood Bank",
        status: "approved",
        rating: 4.9,
        totalOrders: 980,
        totalRevenue: 450000,
        openingHours: "24x7 Emergency",
        deliveryRadiusKm: 25,
        verified: true,
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&q=80",
        joinedAt: "2025-08-20T00:00:00.000Z",
      },
      {
        id: 6,
        userId: 6,
        businessName: "Dr. Priya Sharma Clinic",
        ownerName: "Dr. Priya Sharma",
        category: "Healthcare",
        city: "Mumbai",
        address: "Flat 101, Om Sai Chambers, Dadar West, Mumbai",
        phone: "9823456789",
        email: "dr.priya@partner.ezy1.in",
        description: "Experienced General Physician & Internal Medicine Specialist providing comprehensive family health consultations.",
        doctorName: "Dr. Priya Sharma",
        specialization: "General Physician & Internal Medicine",
        qualifications: "MBBS, MD (General Medicine)",
        experienceYears: 12,
        consultationFee: 300,
        timings: "09:00 AM - 01:00 PM, 05:00 PM - 08:30 PM",
        available: true,
        departments: "General Medicine, Preventive Healthcare",
        totalBeds: 5,
        availableBeds: 2,
        icuBedsAvailable: 0,
        hasEmergency24x7: false,
        emergencyPhone: "9823456789",
        facilities: "Consultation, ECG, Basic Lab Tests, Vaccination",
        status: "approved",
        rating: 4.8,
        totalOrders: 85,
        totalRevenue: 25500,
        openingHours: "09:00 AM - 08:30 PM",
        deliveryRadiusKm: 10,
        verified: true,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80",
        joinedAt: "2026-01-15T00:00:00.000Z",
      },
    ],
    products: [
      {
        id: 1,
        vendorId: 1,
        name: "Aashirvaad Superior Sharbati Atta (5kg)",
        sku: "GROC-ATT-01",
        description: "100% whole wheat flour, naturally stone-ground for soft chapatis.",
        price: 255,
        mrp: 295,
        category: "Grocery",
        stockCount: 45,
        inStock: true,
        isAvailable: true,
        published: true,
        images: ["https://images.unsplash.com/photo-1627909303352-7c85854b4df9?w=500&q=80"],
        createdAt: "2025-10-15T00:00:00.000Z",
      },
      {
        id: 2,
        vendorId: 1,
        name: "Tata Salt Vacuum Evaporated (1kg)",
        sku: "GROC-SLT-02",
        description: "Iodized crystal salt for daily healthy cooking.",
        price: 28,
        mrp: 30,
        category: "Grocery",
        stockCount: 120,
        inStock: true,
        isAvailable: true,
        published: true,
        images: ["https://images.unsplash.com/photo-1627909303352-7c85854b4df9?w=500&q=80"],
        createdAt: "2025-10-15T00:00:00.000Z",
      },
      {
        id: 3,
        vendorId: 1,
        name: "Fortune Sunlite Refined Sunflower Oil (1L)",
        sku: "GROC-OIL-03",
        description: "Light and healthy cooking oil enriched with vitamins A & D.",
        price: 135,
        mrp: 160,
        category: "Grocery",
        stockCount: 60,
        inStock: true,
        isAvailable: true,
        published: true,
        images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80"],
        createdAt: "2025-10-16T00:00:00.000Z",
      },
      {
        id: 4,
        vendorId: 2,
        name: "Chyawanprash Special Herbal Immune Booster (500g)",
        sku: "PHARM-CHY-01",
        description: "Traditional Ayurvedic formulation containing fresh Amla and over 40 herbs.",
        price: 340,
        mrp: 395,
        category: "Pharmacy",
        stockCount: 30,
        inStock: true,
        isAvailable: true,
        published: true,
        images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80"],
        createdAt: "2025-11-02T00:00:00.000Z",
      },
      {
        id: 5,
        vendorId: 2,
        name: "Digital Infrared Forehead Thermometer",
        sku: "PHARM-THM-02",
        description: "Non-contact instant 1-second temperature measurement with fever alert display.",
        price: 899,
        mrp: 1499,
        category: "Pharmacy",
        stockCount: 15,
        inStock: true,
        isAvailable: true,
        published: true,
        images: ["https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&q=80"],
        createdAt: "2025-11-03T00:00:00.000Z",
      },
    ],
    services: [
      {
        id: 1,
        vendorId: 3,
        name: "Ceiling Fan & Switchboard Complete Repair",
        description: "Inspection, capacitor replacement, wiring diagnosis, and full safety check.",
        category: "Services",
        price: 299,
        isAvailable: true,
        published: true,
        rating: 4.9,
        providerName: "Suresh Sharma",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80",
        createdAt: "2026-01-05T00:00:00.000Z",
      },
      {
        id: 2,
        vendorId: 3,
        name: "AC Filter Cleaning & Gas Level Check",
        description: "Deep pressure coil cleaning, air filter wash, and refrigerant pressure test.",
        category: "Services",
        price: 599,
        isAvailable: true,
        published: true,
        rating: 4.8,
        providerName: "Suresh Sharma",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&q=80",
        createdAt: "2026-01-06T00:00:00.000Z",
      },
    ],
    categories: [
      { id: 1, name: "Grocery", slug: "grocery", description: "Daily essentials, grains, spices & home provisions", orderIndex: 1 },
      { id: 2, name: "Pharmacy", slug: "pharmacy", description: "Medicines, wellness, Ayurvedic supplements & healthcare gear", orderIndex: 2 },
      { id: 3, name: "Services", slug: "services", description: "Home technicians, electricians, plumbers & repair experts", orderIndex: 3 },
      { id: 4, name: "Transport", slug: "transport", description: "City cabs, auto fleet, airport rides & parcel logistics", orderIndex: 4 },
      { id: 5, name: "Healthcare", slug: "healthcare", description: "Multi-specialty clinics, doctor appointments & ICU bed updates", orderIndex: 5 },
    ],
    orders: [
      {
        id: 1001,
        orderNumber: "EZ-2026-1001",
        userId: 1,
        customerName: "Rahul Yadav",
        customerPhone: "9876543210",
        deliveryAddress: "Sector 14, HSR Layout, Bengaluru",
        vendorId: 1,
        vendorName: "Sharma Kirana Store",
        totalAmount: 283,
        status: "DELIVERED",
        paymentMethod: "UPI",
        paymentStatus: "paid",
        items: [
          { id: 1, name: "Aashirvaad Superior Sharbati Atta (5kg)", price: 255, quantity: 1 },
          { id: 2, name: "Tata Salt Vacuum Evaporated (1kg)", price: 28, quantity: 1 },
        ],
        createdAt: "2026-09-12T14:30:00.000Z",
      },
    ],
    partnerApplications: [
      {
        id: 101,
        businessName: "Choudhary Sweets & Bakery",
        ownerName: "Deepak Choudhary",
        category: "Grocery",
        partnerType: "shop_owner",
        email: "deepak.sweets@gmail.com",
        phone: "9833445566",
        city: "Jaipur",
        address: "MI Road, Near Panch Batti, Jaipur",
        status: "APPROVED",
        operatingHours: "08:00 AM - 10:00 PM",
        deliveryRadius: 10,
        createdAt: "2026-08-15T08:30:00.000Z",
      },
    ],
    changeLogs: [
      {
        id: 1,
        vendorId: 1,
        userId: 2,
        partnerName: "Sharma Kirana Store",
        fieldChanged: "openingHours",
        previousValue: "08:00 AM - 09:00 PM",
        newValue: "07:00 AM - 10:00 PM",
        timestamp: "2026-09-10T09:15:00.000Z",
        operation: "UPDATE",
        status: "Applied",
      },
      {
        id: 2,
        vendorId: 5,
        userId: 1,
        partnerName: "Manipal Multi-Specialty Hospital",
        fieldChanged: "availableBeds",
        previousValue: "38",
        newValue: "42",
        timestamp: "2026-09-12T11:30:00.000Z",
        operation: "UPDATE",
        status: "Applied",
      },
    ],
    systemSettings: {
      brandName: "Ezy1",
      tagline: "Everything You Need, One Platform",
      supportPhone: "+91 98765 43210",
      supportEmail: "support@ezy1.site",
      officialWebsite: "https://ezy1.site",
      lastUpdated: new Date().toISOString(),
    },
  };
}

// Memory database instance
let memDb = null;

export function getDb() {
  if (memDb) {
    if (!memDb.changeLogs) memDb.changeLogs = [];
    if (!memDb.services) memDb.services = [];
    return memDb;
  }

  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const fileData = fs.readFileSync(STORAGE_FILE, "utf-8");
      memDb = JSON.parse(fileData);
    }
  } catch (err) {
    console.warn("Could not read persistent DB file, seeding new state:", err.message);
  }

  if (!memDb) {
    memDb = getInitialSeedData();
    saveDb();
  }

  if (!memDb.changeLogs) memDb.changeLogs = [];
  if (!memDb.services) memDb.services = [];
  if (!memDb.vendors.find((v) => Number(v.id) === 6)) {
    const seed = getInitialSeedData();
    const docVendor = seed.vendors.find((v) => Number(v.id) === 6);
    if (docVendor) memDb.vendors.push(docVendor);
    const docUser = seed.users.find((u) => Number(u.id) === 6);
    if (docUser && !memDb.users.find((u) => Number(u.id) === 6)) memDb.users.push(docUser);
    saveDb();
  }

  return memDb;
}

export function saveDb() {
  if (!memDb) return;
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(memDb, null, 2), "utf-8");
  } catch (err) {
    // Non-blocking in serverless environments where root or disk might be restricted
    console.warn("Unable to write DB to disk (in-memory state active):", err.message);
  }
}

// ---------------- Database Helper Functions ----------------

// Users
export function findUserByUsername(username) {
  const db = getDb();
  return db.users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase()) || null;
}

export function findUserByEmail(email) {
  const db = getDb();
  return db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
}

export function findUserById(id) {
  const db = getDb();
  return db.users.find((u) => Number(u.id) === Number(id)) || null;
}

export function createUser(userData) {
  const db = getDb();
  const nextId = db.users.length ? Math.max(...db.users.map((u) => u.id)) + 1 : 1;
  const newUser = {
    id: nextId,
    username: userData.username || `user_${nextId}`,
    passwordHash: hashPassword(userData.password || "password123"),
    name: userData.name,
    email: userData.email,
    phone: userData.phone || "",
    city: userData.city || "",
    role: userData.role || "user",
    vendorId: userData.vendorId || 0,
    status: "active",
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  saveDb();
  return newUser;
}

// Vendors / Partners
export function getVendors(filter = {}) {
  const db = getDb();
  return db.vendors.filter((v) => {
    if (filter.category && v.category.toLowerCase() !== filter.category.toLowerCase()) return false;
    if (filter.city && v.city.toLowerCase() !== filter.city.toLowerCase()) return false;
    if (filter.status && v.status !== filter.status) return false;
    return true;
  });
}

export function getVendorById(id) {
  const db = getDb();
  return db.vendors.find((v) => Number(v.id) === Number(id)) || null;
}

export function getVendorByUserId(userId) {
  const db = getDb();
  return db.vendors.find((v) => Number(v.userId) === Number(userId)) || null;
}

const IMMUTABLE_FIELDS = ["id", "userId"];
const ADMIN_ONLY_FIELDS = ["rating", "totalOrders", "totalRevenue", "verified", "status"];

export function updateVendor(id, updates, authUser = null) {
  const db = getDb();
  const index = db.vendors.findIndex((v) => Number(v.id) === Number(id));
  if (index === -1) return null;

  const existingVendor = db.vendors[index];
  const safeUpdates = { ...updates };

  // Strip immutable fields
  IMMUTABLE_FIELDS.forEach((f) => delete safeUpdates[f]);

  // Strip admin-only fields if user is not super_owner/admin
  const isAdmin = authUser && (authUser.role === "super_owner" || authUser.role === "SUPER_ADMIN" || authUser.role === "ADMIN");
  if (!isAdmin) {
    ADMIN_ONLY_FIELDS.forEach((f) => delete safeUpdates[f]);
  }

  // Audit change tracking: record diff in changeLogs
  if (!db.changeLogs) db.changeLogs = [];
  Object.keys(safeUpdates).forEach((key) => {
    const oldVal = existingVendor[key];
    const newVal = safeUpdates[key];
    if (oldVal !== undefined && newVal !== undefined && JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      const nextLogId = db.changeLogs.length ? Math.max(...db.changeLogs.map((c) => c.id)) + 1 : 1;
      db.changeLogs.unshift({
        id: nextLogId,
        vendorId: Number(id),
        userId: authUser ? Number(authUser.id) : existingVendor.userId,
        partnerName: existingVendor.businessName,
        fieldChanged: key,
        previousValue: typeof oldVal === "object" ? JSON.stringify(oldVal) : String(oldVal ?? ""),
        newValue: typeof newVal === "object" ? JSON.stringify(newVal) : String(newVal ?? ""),
        timestamp: new Date().toISOString(),
        operation: "UPDATE",
        status: "Applied",
      });
    }
  });

  db.vendors[index] = {
    ...existingVendor,
    ...safeUpdates,
    updatedAt: new Date().toISOString(),
  };
  saveDb();
  return db.vendors[index];
}

export function recordChangeLog(entry) {
  const db = getDb();
  if (!db.changeLogs) db.changeLogs = [];
  const nextId = db.changeLogs.length ? Math.max(...db.changeLogs.map((c) => c.id)) + 1 : 1;
  const newLog = {
    id: nextId,
    timestamp: new Date().toISOString(),
    status: "Applied",
    operation: "UPDATE",
    ...entry,
  };
  db.changeLogs.unshift(newLog);
  saveDb();
  return newLog;
}

export function getChangeLogs(filter = {}) {
  const db = getDb();
  if (!db.changeLogs) db.changeLogs = [];
  return db.changeLogs.filter((log) => {
    if (filter.vendorId && Number(log.vendorId) !== Number(filter.vendorId)) return false;
    if (filter.userId && Number(log.userId) !== Number(filter.userId)) return false;
    return true;
  });
}

export function getChangeLogsByVendorId(vendorId) {
  return getChangeLogs({ vendorId: Number(vendorId) });
}

export function createVendor(data) {
  const db = getDb();
  const nextId = db.vendors.length ? Math.max(...db.vendors.map((v) => v.id)) + 1 : 1;
  const newVendor = {
    id: nextId,
    userId: Number(data.userId),
    businessName: data.businessName,
    ownerName: data.ownerName || "",
    category: data.category || "Grocery",
    city: data.city || "",
    address: data.address || "",
    phone: data.phone || "",
    email: data.email || "",
    description: data.description || "",
    status: data.status || "approved",
    rating: 5.0,
    totalOrders: 0,
    totalRevenue: 0,
    openingHours: data.openingHours || "09:00 AM - 09:00 PM",
    deliveryRadiusKm: Number(data.deliveryRadiusKm) || 10,
    verified: true,
    image: data.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
    joinedAt: new Date().toISOString(),
  };
  db.vendors.push(newVendor);
  saveDb();
  return newVendor;
}

// Products
export function getProducts(filter = {}) {
  const db = getDb();
  return db.products.filter((p) => {
    if (filter.vendorId && Number(p.vendorId) !== Number(filter.vendorId)) return false;
    if (filter.category && p.category.toLowerCase() !== filter.category.toLowerCase()) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
    }
    return true;
  });
}

export function getProductById(id) {
  const db = getDb();
  return db.products.find((p) => Number(p.id) === Number(id)) || null;
}

export function createProduct(data) {
  const db = getDb();
  const nextId = db.products.length ? Math.max(...db.products.map((p) => p.id)) + 1 : 1;
  const newProduct = {
    id: nextId,
    vendorId: Number(data.vendorId),
    name: data.name,
    sku: data.sku || `PROD-${nextId}`,
    description: data.description || "",
    price: Number(data.price) || 0,
    mrp: Number(data.mrp) || Number(data.price) || 0,
    category: data.category || "Grocery",
    stockCount: Number(data.stockCount) || 50,
    inStock: data.stockCount > 0,
    isAvailable: true,
    published: true,
    images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [data.image || "https://images.unsplash.com/photo-1627909303352-7c85854b4df9?w=500&q=80"],
    createdAt: new Date().toISOString(),
  };
  db.products.push(newProduct);
  saveDb();
  return newProduct;
}

export function updateProduct(id, updates) {
  const db = getDb();
  const index = db.products.findIndex((p) => Number(p.id) === Number(id));
  if (index === -1) return null;

  const { id: _, vendorId: __, ...safeUpdates } = updates;
  db.products[index] = {
    ...db.products[index],
    ...safeUpdates,
    updatedAt: new Date().toISOString(),
  };
  saveDb();
  return db.products[index];
}

export function deleteProduct(id) {
  const db = getDb();
  const index = db.products.findIndex((p) => Number(p.id) === Number(id));
  if (index === -1) return false;

  db.products.splice(index, 1);
  saveDb();
  return true;
}

export function getServices(filter = {}) {
  const db = getDb();
  return db.services.filter((s) => {
    if (filter.vendorId && Number(s.vendorId) !== Number(filter.vendorId)) return false;
    if (filter.category && s.category.toLowerCase() !== filter.category.toLowerCase()) return false;
    return true;
  });
}

export function getServiceById(id) {
  const db = getDb();
  return db.services.find((s) => Number(s.id) === Number(id)) || null;
}

export function createService(data) {
  const db = getDb();
  const nextId = db.services.length ? Math.max(...db.services.map((s) => s.id)) + 1 : 1;
  const newService = {
    id: nextId,
    vendorId: Number(data.vendorId),
    name: data.name,
    description: data.description || "",
    category: data.category || "Services",
    price: Number(data.price) || 0,
    isAvailable: data.isAvailable !== false,
    published: data.published !== false,
    rating: 5.0,
    providerName: data.providerName || "",
    image: data.image || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80",
    createdAt: new Date().toISOString(),
  };
  db.services.push(newService);
  saveDb();
  return newService;
}

export function updateService(id, updates) {
  const db = getDb();
  const index = db.services.findIndex((s) => Number(s.id) === Number(id));
  if (index === -1) return null;

  const { id: _, vendorId: __, ...safeUpdates } = updates;
  db.services[index] = {
    ...db.services[index],
    ...safeUpdates,
    updatedAt: new Date().toISOString(),
  };
  saveDb();
  return db.services[index];
}

export function deleteService(id) {
  const db = getDb();
  const index = db.services.findIndex((s) => Number(s.id) === Number(id));
  if (index === -1) return false;

  db.services.splice(index, 1);
  saveDb();
  return true;
}

// Categories
export function getCategories() {
  const db = getDb();
  return db.categories || [];
}

// Orders
export function getOrders(filter = {}) {
  const db = getDb();
  return db.orders.filter((o) => {
    if (filter.userId && Number(o.userId) !== Number(filter.userId)) return false;
    if (filter.vendorId && Number(o.vendorId) !== Number(filter.vendorId)) return false;
    return true;
  });
}

export function createOrder(data) {
  const db = getDb();
  const nextId = db.orders.length ? Math.max(...db.orders.map((o) => o.id)) + 1 : 1001;
  const newOrder = {
    id: nextId,
    orderNumber: `EZ-${new Date().getFullYear()}-${nextId}`,
    userId: Number(data.userId) || 1,
    customerName: data.customerName || "Valued Customer",
    customerPhone: data.customerPhone || "",
    deliveryAddress: data.deliveryAddress || "",
    vendorId: Number(data.vendorId) || 1,
    vendorName: data.vendorName || "Ezy1 Partner",
    totalAmount: Number(data.totalAmount) || 0,
    status: "NEW",
    paymentMethod: data.paymentMethod || "UPI",
    paymentStatus: data.paymentStatus || "paid",
    items: data.items || [],
    createdAt: new Date().toISOString(),
  };
  db.orders.push(newOrder);
  saveDb();
  return newOrder;
}

export function updateOrderStatus(id, status) {
  const db = getDb();
  const order = db.orders.find((o) => Number(o.id) === Number(id));
  if (!order) return null;

  order.status = status;
  order.updatedAt = new Date().toISOString();
  saveDb();
  return order;
}

// Partner Applications
export function getPartnerApplications(filter = {}) {
  const db = getDb();
  return db.partnerApplications.filter((app) => {
    if (filter.status && app.status.toUpperCase() !== filter.status.toUpperCase()) return false;
    return true;
  });
}

export function createPartnerApplication(data) {
  const db = getDb();
  const nextId = db.partnerApplications.length ? Math.max(...db.partnerApplications.map((a) => a.id)) + 1 : 101;
  const newApp = {
    id: nextId,
    businessName: data.businessName,
    ownerName: data.ownerName,
    category: data.category || "Grocery",
    partnerType: data.partnerType || "shop_owner",
    email: data.email,
    phone: data.phone,
    city: data.city,
    address: data.address,
    operatingHours: data.operatingHours || "09:00 AM - 09:00 PM",
    deliveryRadius: Number(data.deliveryRadius) || 5,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  db.partnerApplications.push(newApp);
  saveDb();
  return newApp;
}

export function updatePartnerApplicationStatus(id, status) {
  const db = getDb();
  const app = db.partnerApplications.find((a) => Number(a.id) === Number(id));
  if (!app) return null;

  app.status = status.toUpperCase();
  app.updatedAt = new Date().toISOString();

  // If approved, create vendor record and user account automatically
  if (app.status === "APPROVED") {
    let user = findUserByEmail(app.email);
    if (!user) {
      user = createUser({
        name: app.ownerName,
        email: app.email,
        phone: app.phone,
        city: app.city,
        role: "partner",
        username: app.email.split("@")[0],
        password: "partner123",
      });
    }

    const existingVendor = db.vendors.find((v) => v.businessName === app.businessName);
    if (!existingVendor) {
      const vendor = createVendor({
        userId: user.id,
        businessName: app.businessName,
        ownerName: app.ownerName,
        category: app.category,
        city: app.city,
        address: app.address,
        phone: app.phone,
        email: app.email,
        openingHours: app.operatingHours,
        deliveryRadiusKm: app.deliveryRadius,
        status: "approved",
      });
      user.vendorId = vendor.id;
      user.role = "partner";
      saveDb();
    }
  }

  saveDb();
  return app;
}
