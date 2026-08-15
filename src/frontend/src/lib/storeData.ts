import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductCategory, Worker } from "../types";

export interface StoredProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  mrp: number;
  category: string;
  categoryIds: number[];
  vendorId: number;
  stockCount: number;
  inStock: boolean;
  isAvailable: boolean;
  published: boolean;
  featured?: boolean;
  rating?: number;
  totalReviews?: number;
  images: string[];
  sku?: string;
  discountPercent?: number;
  unit?: string;
  createdAt: string;
}

export interface StoredService {
  id: number;
  name: string;
  description: string;
  category: string;
  pricePerHour: number;
  providerName: string;
  vendorId: number;
  isAvailable: boolean;
  published: boolean;
  rating: number;
  totalReviews: number;
  image?: string;
  duration?: string;
  tags?: string[];
  createdAt: string;
}

export interface StoredBooking {
  id: number;
  title: string;
  type: "class" | "workshop" | "doctor" | "consultation" | "service";
  category: string;
  instructorOrDoctor: string;
  price: number;
  schedule: string;
  duration: string;
  capacity: number;
  enrolledCount: number;
  status: "open" | "full" | "completed" | "cancelled";
  published: boolean;
  image?: string;
  location?: string;
  description?: string;
  createdAt: string;
}

export interface StoredOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  totalAmount: number;
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  paymentMethod: "UPI" | "Wallet" | "COD" | "Card";
  paymentStatus: "paid" | "pending" | "failed";
  vendorId: number;
  createdAt: string;
  notes?: string;
}

export interface StoredEnquiry {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: "General" | "Bulk Order" | "Custom Service" | "Support" | "Partner Application";
  status: "new" | "in_progress" | "resolved" | "archived";
  assignedTo?: string;
  notes?: string;
  createdAt: string;
}

export interface StoredCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive" | "blocked";
  joinedAt: string;
  avatar?: string;
}

export interface StoredCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string; // emoji or image url
  type: "product" | "service" | "booking" | "all";
  color?: string;
  published: boolean;
  orderIndex: number;
}

export interface StoredGalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  caption?: string;
  tags: string[];
  published: boolean;
  uploadedAt: string;
}

export interface StoredReview {
  id: number;
  author: string;
  rating: number;
  comment: string;
  targetType: "product" | "service" | "vendor" | "store";
  targetName: string;
  targetId: number;
  status: "approved" | "pending" | "rejected";
  isFeatured: boolean;
  date: string;
  reply?: string;
}

export interface StoredHeroSlide {
  id: number;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  published: boolean;
}

export interface StoredFaq {
  id: number;
  question: string;
  answer: string;
  category: string;
  published: boolean;
}

export interface OwnerSettings {
  // Business Info
  brandName: string;
  tagline: string;
  ownerName: string;
  legalBusinessName: string;
  gstNumber: string;
  
  // Branding
  logoUrl: string;
  faviconUrl: string;
  themePrimaryColor: string;
  
  // Contact & Social
  phone: string;
  email: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  
  // Business Operational Rules
  openingHours: string;
  isOpenToday: boolean;
  minimumOrderAmount: number;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  expressDeliveryFee: number;
  taxPercentage: number;
  deliveryRadiusKm: number;
  
  // Payment Options
  enableCod: boolean;
  enableUpi: boolean;
  upiId: string;
  enableWallet: boolean;
  enableOnlineCards: boolean;
  
  // Website Announcements & SEO
  announcementBarText: string;
  enableAnnouncementBar: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  
  // Policies
  termsAndConditions: string;
  privacyPolicy: string;
  returnPolicy: string;
  cancellationPolicy: string;
}

// Initial Seeds
const initialProducts: StoredProduct[] = [
  {
    id: 1,
    name: "Aashirvaad Shudh Chakki Atta (5kg)",
    description: "100% whole wheat flour, fiber-rich, perfectly milled for super soft rotis.",
    price: 240,
    mrp: 260,
    category: "Atta, Rice & Dal",
    categoryIds: [1],
    vendorId: 1,
    stockCount: 45,
    inStock: true,
    isAvailable: true,
    published: true,
    featured: true,
    rating: 4.8,
    totalReviews: 430,
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80"],
    sku: "GROC-ATT-001",
    discountPercent: 8,
    unit: "5 kg pack",
    createdAt: "2026-01-10",
  },
  {
    id: 2,
    name: "Amul Butter - Pasteurised (500g)",
    description: "Utterly butterly delicious fresh dairy butter made from pure milk fat.",
    price: 250,
    mrp: 275,
    category: "Dairy & Bread",
    categoryIds: [2],
    vendorId: 1,
    stockCount: 28,
    inStock: true,
    isAvailable: true,
    published: true,
    featured: true,
    rating: 4.9,
    totalReviews: 890,
    images: ["https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80"],
    sku: "DAIRY-BUT-002",
    discountPercent: 9,
    unit: "500g block",
    createdAt: "2026-01-12",
  },
  {
    id: 3,
    name: "Fresh Farm Red Onions (1kg)",
    description: "Directly sourced from local farmers. Crisp, fresh, and hand-sorted daily.",
    price: 35,
    mrp: 50,
    category: "Fresh Produce",
    categoryIds: [3],
    vendorId: 3,
    stockCount: 120,
    inStock: true,
    isAvailable: true,
    published: true,
    featured: false,
    rating: 4.5,
    totalReviews: 120,
    images: ["https://images.unsplash.com/photo-1508747703725-719777637510?w=500&q=80"],
    sku: "VEG-ONI-003",
    discountPercent: 30,
    unit: "1 kg",
    createdAt: "2026-02-01",
  },
  {
    id: 4,
    name: "Lays India's Magic Masala Chips (50g)",
    description: "Classic spicy potato chips with exotic Indian aromatic spices.",
    price: 20,
    mrp: 20,
    category: "Munchies & Snacks",
    categoryIds: [4],
    vendorId: 1,
    stockCount: 200,
    inStock: true,
    isAvailable: true,
    published: true,
    featured: true,
    rating: 4.7,
    totalReviews: 540,
    images: ["https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&q=80"],
    sku: "SNK-LAY-004",
    discountPercent: 0,
    unit: "50g pack",
    createdAt: "2026-02-05",
  },
  {
    id: 5,
    name: "Organic Raw Mountain Honey (500g)",
    description: "Unfiltered 100% pure wild honey packed with natural antioxidants.",
    price: 380,
    mrp: 450,
    category: "Organic & Wellness",
    categoryIds: [6],
    vendorId: 2,
    stockCount: 15,
    inStock: true,
    isAvailable: true,
    published: true,
    featured: true,
    rating: 4.9,
    totalReviews: 95,
    images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80"],
    sku: "WELL-HON-005",
    discountPercent: 15,
    unit: "500g jar",
    createdAt: "2026-02-08",
  },
  {
    id: 6,
    name: "Dolo 650mg Paracetamol Tablets",
    description: "Fast relief from fever, headache, body aches, and fever symptoms.",
    price: 32,
    mrp: 35,
    category: "Pharmacy",
    categoryIds: [7],
    vendorId: 2,
    stockCount: 80,
    inStock: true,
    isAvailable: true,
    published: true,
    featured: false,
    rating: 4.8,
    totalReviews: 210,
    images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80"],
    sku: "MED-DOL-006",
    discountPercent: 9,
    unit: "Strip of 15 tabs",
    createdAt: "2026-02-10",
  }
];

const initialServices: StoredService[] = [
  {
    id: 1,
    name: "Complete Home Electrical Repair & Inspection",
    description: "Wiring inspection, switchboard repair, MCB fixes, appliance point wiring.",
    category: "Electrical",
    pricePerHour: 299,
    providerName: "Suresh Sharma",
    vendorId: 4,
    isAvailable: true,
    published: true,
    rating: 4.9,
    totalReviews: 84,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80",
    duration: "1-2 Hours",
    tags: ["Wiring", "Fan Installation", "Short Circuit Fix"],
    createdAt: "2026-01-15",
  },
  {
    id: 2,
    name: "Emergency Plumbing & Pipe Leakage Fix",
    description: "Tap repairs, bathroom fittings, drain cleaning, water pump servicing.",
    category: "Plumbing",
    pricePerHour: 249,
    providerName: "Ramesh Verma",
    vendorId: 4,
    isAvailable: true,
    published: true,
    rating: 4.8,
    totalReviews: 112,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80",
    duration: "45 Mins",
    tags: ["Tap Fix", "Drainage", "Pipe Fitting"],
    createdAt: "2026-01-18",
  },
  {
    id: 3,
    name: "Deep Home Cleaning & Sanitization",
    description: "Kitchen de-greasing, bathroom scrubbing, floor buffing & balcony wash.",
    category: "Cleaning",
    pricePerHour: 499,
    providerName: "Sparkle Cleaners Team",
    vendorId: 4,
    isAvailable: true,
    published: true,
    rating: 4.7,
    totalReviews: 67,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80",
    duration: "3-4 Hours",
    tags: ["Deep Clean", "Sofa Shampoo", "Kitchen"],
    createdAt: "2026-02-01",
  }
];

const initialBookings: StoredBooking[] = [
  {
    id: 1,
    title: "Pottery & Clay Art Mastery Weekend Workshop",
    type: "workshop",
    category: "Art & Craft",
    instructorOrDoctor: "Alka Yadav (Master Ceramicist)",
    price: 1200,
    schedule: "Every Saturday & Sunday, 10:00 AM - 1:00 PM",
    duration: "3 Hours",
    capacity: 12,
    enrolledCount: 9,
    status: "open",
    published: true,
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80",
    location: "Studio 4B, Indiranagar, Bengaluru",
    description: "Hands-on pottery on electric wheel, glazing techniques, and take home 2 finished pots.",
    createdAt: "2026-02-01",
  },
  {
    id: 2,
    title: "General Physician Health Checkup & Consultation",
    type: "doctor",
    category: "Healthcare",
    instructorOrDoctor: "Dr. Arvind Rao (MD, General Med)",
    price: 500,
    schedule: "Mon-Sat, 9:00 AM - 2:00 PM",
    duration: "20 Mins",
    capacity: 25,
    enrolledCount: 14,
    status: "open",
    published: true,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80",
    location: "EzyHealth Clinic, Koramangala",
    description: "Complete clinical examination, vitals review, diagnostic prescriptions & lifestyle guidance.",
    createdAt: "2026-02-03",
  },
  {
    id: 3,
    title: "Yoga & Mindfulness Morning Sessions",
    type: "class",
    category: "Fitness & Wellness",
    instructorOrDoctor: "Pooja Hegde (Certified Yogi)",
    price: 800,
    schedule: "Tue, Thu, Sat at 6:30 AM",
    duration: "1 Hour",
    capacity: 20,
    enrolledCount: 18,
    status: "open",
    published: true,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&q=80",
    location: "Greenview Park / Online Hybrid",
    description: "Pranayama, Hatha postures, guided meditation for stress relief and mobility.",
    createdAt: "2026-02-05",
  }
];

const initialOrders: StoredOrder[] = [
  {
    id: 1,
    orderNumber: "EZY-2026-0801",
    customerName: "Rahul Sharma",
    customerPhone: "9876543210",
    customerEmail: "rahul.s@example.com",
    deliveryAddress: "Flat 402, Sunshine Apts, 5th Cross, HSR Layout, Bengaluru",
    items: [
      { id: 1, name: "Aashirvaad Atta 5kg", price: 240, quantity: 1 },
      { id: 2, name: "Amul Butter 500g", price: 250, quantity: 2 },
    ],
    totalAmount: 740,
    status: "out_for_delivery",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    vendorId: 1,
    createdAt: "2026-08-15 09:45 AM",
    notes: "Leave package with security guard if not available."
  },
  {
    id: 2,
    orderNumber: "EZY-2026-0802",
    customerName: "Priya Nair",
    customerPhone: "9845012345",
    customerEmail: "priya.nair@example.com",
    deliveryAddress: "Villa 14, Palm Meadows, Whitefield, Bengaluru",
    items: [
      { id: 6, name: "Dolo 650mg Tabs", price: 32, quantity: 3 },
      { id: 5, name: "Organic Honey 500g", price: 380, quantity: 1 },
    ],
    totalAmount: 476,
    status: "confirmed",
    paymentMethod: "Wallet",
    paymentStatus: "paid",
    vendorId: 2,
    createdAt: "2026-08-15 10:15 AM",
  },
  {
    id: 3,
    orderNumber: "EZY-2026-0803",
    customerName: "Anil Kumble",
    customerPhone: "9711223344",
    customerEmail: "anil.k@example.com",
    deliveryAddress: "22/1, 12th Main Road, Jayanagar, Bengaluru",
    items: [
      { id: 3, name: "Fresh Farm Red Onions 1kg", price: 35, quantity: 4 },
      { id: 4, name: "Lays Masala 50g", price: 20, quantity: 5 },
    ],
    totalAmount: 240,
    status: "delivered",
    paymentMethod: "COD",
    paymentStatus: "paid",
    vendorId: 1,
    createdAt: "2026-08-14 06:30 PM",
  }
];

const initialEnquiries: StoredEnquiry[] = [
  {
    id: 1,
    customerName: "Kavita Singhal",
    email: "kavita.s@corporategifts.in",
    phone: "9819988776",
    subject: "Bulk Order Quote: 150 Pottery Gift Sets for Corporate Diwali",
    message: "We want handcrafted customized pottery gift mugs with company branding for our annual event. Could you please share bulk pricing and dispatch timelines?",
    category: "Bulk Order",
    status: "new",
    assignedTo: "Alka Yadav",
    createdAt: "2026-08-14 11:20 AM",
  },
  {
    id: 2,
    customerName: "Vikram Mehta",
    email: "vikram.mehta@gmail.com",
    phone: "9988776655",
    subject: "Custom Handcrafted Resin Dining Table Query",
    message: "Looking for an 8-seater live edge walnut wood table with turquoise resin river. Can we visit the studio this Saturday?",
    category: "Custom Service",
    status: "in_progress",
    assignedTo: "Ramesh Sharma",
    createdAt: "2026-08-13 04:10 PM",
  },
  {
    id: 3,
    customerName: "Sunita Reddy",
    email: "sunita.reddy@techpark.com",
    phone: "9844001122",
    subject: "Private Weekend Pottery Workshop for 10 Team Members",
    message: "We would like to book a private team bonding session. Are slots available next Friday afternoon?",
    category: "General",
    status: "resolved",
    createdAt: "2026-08-12 02:40 PM",
  }
];

const initialCustomers: StoredCustomer[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.s@example.com",
    phone: "9876543210",
    city: "Bengaluru",
    address: "HSR Layout, Sector 2",
    totalOrders: 14,
    totalSpent: 6850,
    status: "active",
    joinedAt: "2025-11-10",
  },
  {
    id: 2,
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "9845012345",
    city: "Bengaluru",
    address: "Whitefield, Palm Meadows",
    totalOrders: 9,
    totalSpent: 4290,
    status: "active",
    joinedAt: "2025-12-05",
  },
  {
    id: 3,
    name: "Amit Patel",
    email: "amit.patel@example.com",
    phone: "9712345678",
    city: "Mumbai",
    address: "Andheri West",
    totalOrders: 22,
    totalSpent: 12400,
    status: "active",
    joinedAt: "2025-09-18",
  },
  {
    id: 4,
    name: "Sneha Mukherjee",
    email: "sneha.m@example.com",
    phone: "9830012345",
    city: "Kolkata",
    address: "Salt Lake Sector 5",
    totalOrders: 4,
    totalSpent: 1950,
    status: "active",
    joinedAt: "2026-01-20",
  }
];

const initialCategories: StoredCategory[] = [
  { id: 1, name: "Atta, Rice & Dal", slug: "atta-rice-dal", description: "Fresh staples, pulses, basmati & whole wheat", image: "🌾", type: "product", color: "bg-amber-100 text-amber-800", published: true, orderIndex: 1 },
  { id: 2, name: "Dairy, Bread & Eggs", slug: "dairy-bread-eggs", description: "Farm fresh milk, butter, cheese & artisan bread", image: "🥛", type: "product", color: "bg-blue-100 text-blue-800", published: true, orderIndex: 2 },
  { id: 3, name: "Fresh Produce & Fruits", slug: "fresh-produce", description: "Organic vegetables, seasonal fruits straight from farms", image: "🍎", type: "product", color: "bg-emerald-100 text-emerald-800", published: true, orderIndex: 3 },
  { id: 4, name: "Munchies & Snacks", slug: "munchies-snacks", description: "Chips, namkeen, biscuits & gourmet cookies", image: "🍿", type: "product", color: "bg-orange-100 text-orange-800", published: true, orderIndex: 4 },
  { id: 5, name: "Cold Drinks & Juices", slug: "cold-drinks-juices", description: "Fresh juices, soft drinks, tender coconut water", image: "🥤", type: "product", color: "bg-sky-100 text-sky-800", published: true, orderIndex: 5 },
  { id: 6, name: "Organic & Wellness", slug: "organic-wellness", description: "Pure honey, herbal teas, dry fruits & superfoods", image: "🍯", type: "product", color: "bg-yellow-100 text-yellow-800", published: true, orderIndex: 6 },
  { id: 7, name: "Pharmacy & First Aid", slug: "pharmacy", description: "Over the counter medicines, sanitizers & vitamins", image: "💊", type: "product", color: "bg-rose-100 text-rose-800", published: true, orderIndex: 7 },
  { id: 8, name: "Home & Local Services", slug: "home-services", description: "Electricians, plumbers, deep cleaners & carpenters", image: "🔧", type: "service", color: "bg-indigo-100 text-indigo-800", published: true, orderIndex: 8 },
  { id: 9, name: "Workshops & Classes", slug: "workshops-classes", description: "Art & craft workshops, pottery, yoga & wellness", image: "🎨", type: "booking", color: "bg-purple-100 text-purple-800", published: true, orderIndex: 9 },
  { id: 10, name: "Doctor Consultations", slug: "doctor-consultations", description: "General medicine, dental, homeopathy & specialists", image: "🩺", type: "booking", color: "bg-teal-100 text-teal-800", published: true, orderIndex: 10 },
];

const initialGallery: StoredGalleryItem[] = [
  {
    id: 1,
    title: "Handcrafted Ceramic Vases Showcase",
    category: "Art & Studio",
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80",
    caption: "Terracotta and porcelain hand-painted vases from our weekend artisan workshop.",
    tags: ["Pottery", "Handmade", "Home Decor"],
    published: true,
    uploadedAt: "2026-02-01",
  },
  {
    id: 2,
    title: "Fresh Farm Harvest Day",
    category: "Storefront",
    imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
    caption: "Daily fresh organic produce arrival at our partner hyper-local hubs.",
    tags: ["Fresh", "Organic", "Grocery"],
    published: true,
    uploadedAt: "2026-02-03",
  },
  {
    id: 3,
    title: "Super-fast 10-Minute Dispatch Fleet",
    category: "Delivery Fleet",
    imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
    caption: "Electric 2-wheeler riders ready for rapid neighborhood deliveries.",
    tags: ["Fast Delivery", "EV Riders", "Logistics"],
    published: true,
    uploadedAt: "2026-02-06",
  }
];

const initialReviews: StoredReview[] = [
  {
    id: 1,
    author: "Rohan Kapoor",
    rating: 5,
    comment: "Ordered Aashirvaad Atta and dairy at 8:30 AM and got it at my door within 12 minutes! Superb experience.",
    targetType: "product",
    targetName: "Aashirvaad Atta 5kg",
    targetId: 1,
    status: "approved",
    isFeatured: true,
    date: "2026-08-14",
    reply: "Thank you Rohan! We strive to make local deliveries faster every day."
  },
  {
    id: 2,
    author: "Ananya Deshmukh",
    rating: 5,
    comment: "Attended the Pottery Workshop this weekend. Alka was an incredible mentor. Loved crafting my own ceramic bowl!",
    targetType: "service",
    targetName: "Pottery & Clay Art Mastery",
    targetId: 1,
    status: "approved",
    isFeatured: true,
    date: "2026-08-12",
    reply: "Thank you Ananya! So glad you enjoyed the clay session."
  },
  {
    id: 3,
    author: "Karan Johar",
    rating: 4,
    comment: "Electrician arrived right on time and fixed our short circuit in 20 minutes. Very polite and professional.",
    targetType: "service",
    targetName: "Complete Home Electrical Repair",
    targetId: 1,
    status: "approved",
    isFeatured: false,
    date: "2026-08-11",
  }
];

const initialHeroSlides: StoredHeroSlide[] = [
  {
    id: 1,
    title: "Everything You Need, Delivered in Minutes",
    subtitle: "Groceries, Fresh Farm Produce, Medicines, Home Services & Workshops right at your doorstep.",
    badge: "⚡ Hyperlocal SuperApp",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
    buttonText: "Shop Groceries Now",
    buttonLink: "/shop",
    published: true,
  },
  {
    id: 2,
    title: "Expert Home Services on Demand",
    subtitle: "Trusted electricians, certified plumbers, cleaning specialists & local technicians.",
    badge: "🛠️ Verified Professionals",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80",
    buttonText: "Book a Service",
    buttonLink: "/services",
    published: true,
  }
];

const initialFaqs: StoredFaq[] = [
  {
    id: 1,
    question: "How fast is delivery on ezy1?",
    answer: "Most grocery, dairy, and pharmacy orders are fulfilled and delivered within 10 to 25 minutes depending on your distance from the local partner store.",
    category: "Delivery",
    published: true,
  },
  {
    id: 2,
    question: "What payment methods are supported?",
    answer: "We support UPI (GPay, PhonePe, Paytm), Ezy1 In-App Wallet, Cash on Delivery (COD), and Credit/Debit cards.",
    category: "Payments",
    published: true,
  },
  {
    id: 3,
    question: "How can I register as a partner vendor?",
    answer: "Click 'Partner Login' in the navigation bar, choose your business category, and enter your unique partner credentials to access the dedicated management portal.",
    category: "Partners",
    published: true,
  }
];

const initialOwnerSettings: OwnerSettings = {
  brandName: "ezy1",
  tagline: "Everything You Need, One Platform",
  ownerName: "Alka & Rahul Yadav",
  legalBusinessName: "Ezy1 Hyperlocal Ventures Pvt. Ltd.",
  gstNumber: "29AAAAA0000A1Z5",
  logoUrl: "/favicon.ico",
  faviconUrl: "/favicon.ico",
  themePrimaryColor: "#f97316",
  phone: "+91 98765 43210",
  email: "support@ezy1.in",
  whatsappNumber: "+919876543210",
  address: "Plot 88, 4th Cross, 100ft Road, Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560038",
  instagramUrl: "https://instagram.com/ezy1_india",
  facebookUrl: "https://facebook.com/ezy1india",
  twitterUrl: "https://twitter.com/ezy1_india",
  youtubeUrl: "https://youtube.com/@ezy1_official",
  linkedinUrl: "https://linkedin.com/company/ezy1",
  openingHours: "Mon - Sun: 6:00 AM - 11:30 PM",
  isOpenToday: true,
  minimumOrderAmount: 99,
  freeDeliveryThreshold: 499,
  standardDeliveryFee: 30,
  expressDeliveryFee: 50,
  taxPercentage: 5,
  deliveryRadiusKm: 12,
  enableCod: true,
  enableUpi: true,
  upiId: "ezy1business@okhdfcbank",
  enableWallet: true,
  enableOnlineCards: true,
  announcementBarText: "🎉 Super Weekend Offer: Get FREE delivery on all orders above ₹299! Use code: EZYFREE",
  enableAnnouncementBar: true,
  metaTitle: "EZY1 - Hyperlocal Quick Commerce & Local Services Platform",
  metaDescription: "Instant grocery delivery, local artisans, home repair, verified doctor appointments and swift rides - all in one seamless super-app.",
  metaKeywords: "quick commerce, grocery delivery, home services, electrician, plumber, doctors, pottery workshops",
  termsAndConditions: "All sales are subject to local partner availability. Orders once dispatched cannot be cancelled without standard cancellation charges.",
  privacyPolicy: "We value your privacy. Your personal information, address, and payment credentials are encrypted and never shared with third-party marketers.",
  returnPolicy: "Perishable grocery items can be returned within 2 hours of delivery if defective. Non-perishables have a 48-hour return window.",
  cancellationPolicy: "Orders can be cancelled free of charge within 60 seconds of order placement. Workshop bookings are refundable up to 24 hours prior."
};

export interface StoreState {
  products: StoredProduct[];
  services: StoredService[];
  bookings: StoredBooking[];
  orders: StoredOrder[];
  enquiries: StoredEnquiry[];
  customers: StoredCustomer[];
  categories: StoredCategory[];
  gallery: StoredGalleryItem[];
  reviews: StoredReview[];
  heroSlides: StoredHeroSlide[];
  faqs: StoredFaq[];
  settings: OwnerSettings;
  
  // Product Actions
  addProduct: (product: Omit<StoredProduct, "id" | "createdAt">) => StoredProduct;
  updateProduct: (id: number, updates: Partial<StoredProduct>) => void;
  deleteProduct: (id: number) => void;
  toggleProductPublish: (id: number) => void;
  
  // Service Actions
  addService: (service: Omit<StoredService, "id" | "createdAt">) => StoredService;
  updateService: (id: number, updates: Partial<StoredService>) => void;
  deleteService: (id: number) => void;
  toggleServicePublish: (id: number) => void;
  
  // Booking Actions
  addBooking: (booking: Omit<StoredBooking, "id" | "createdAt">) => StoredBooking;
  updateBooking: (id: number, updates: Partial<StoredBooking>) => void;
  deleteBooking: (id: number) => void;
  toggleBookingPublish: (id: number) => void;
  
  // Order Actions
  addOrder: (order: Omit<StoredOrder, "id" | "createdAt" | "orderNumber">) => StoredOrder;
  updateOrderStatus: (id: number, status: StoredOrder["status"]) => void;
  updateOrderPaymentStatus: (id: number, status: StoredOrder["paymentStatus"]) => void;
  deleteOrder: (id: number) => void;
  
  // Enquiry Actions
  addEnquiry: (enquiry: Omit<StoredEnquiry, "id" | "createdAt">) => StoredEnquiry;
  updateEnquiryStatus: (id: number, status: StoredEnquiry["status"], notes?: string) => void;
  deleteEnquiry: (id: number) => void;
  
  // Customer Actions
  addCustomer: (customer: Omit<StoredCustomer, "id" | "joinedAt">) => StoredCustomer;
  updateCustomer: (id: number, updates: Partial<StoredCustomer>) => void;
  deleteCustomer: (id: number) => void;
  
  // Category Actions
  addCategory: (category: Omit<StoredCategory, "id">) => StoredCategory;
  updateCategory: (id: number, updates: Partial<StoredCategory>) => void;
  deleteCategory: (id: number) => void;
  toggleCategoryPublish: (id: number) => void;
  
  // Gallery Actions
  addGalleryItem: (item: Omit<StoredGalleryItem, "id" | "uploadedAt">) => StoredGalleryItem;
  updateGalleryItem: (id: number, updates: Partial<StoredGalleryItem>) => void;
  deleteGalleryItem: (id: number) => void;
  toggleGalleryPublish: (id: number) => void;
  
  // Review Actions
  addReview: (review: Omit<StoredReview, "id" | "date">) => StoredReview;
  updateReview: (id: number, updates: Partial<StoredReview>) => void;
  deleteReview: (id: number) => void;
  replyToReview: (id: number, replyText: string) => void;
  
  // Website Content Actions
  addHeroSlide: (slide: Omit<StoredHeroSlide, "id">) => StoredHeroSlide;
  updateHeroSlide: (id: number, updates: Partial<StoredHeroSlide>) => void;
  deleteHeroSlide: (id: number) => void;
  addFaq: (faq: Omit<StoredFaq, "id">) => StoredFaq;
  updateFaq: (id: number, updates: Partial<StoredFaq>) => void;
  deleteFaq: (id: number) => void;
  
  // Settings Actions
  updateSettings: (updates: Partial<OwnerSettings>) => void;
  
  // Global Store Utilities
  resetToDefaults: () => void;
  exportDatabaseJson: () => string;
  importDatabaseJson: (jsonString: string) => boolean;
}

export const useStoreData = create<StoreState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      services: initialServices,
      bookings: initialBookings,
      orders: initialOrders,
      enquiries: initialEnquiries,
      customers: initialCustomers,
      categories: initialCategories,
      gallery: initialGallery,
      reviews: initialReviews,
      heroSlides: initialHeroSlides,
      faqs: initialFaqs,
      settings: initialOwnerSettings,
      
      // Products
      addProduct: (data) => {
        const nextId = Math.max(...get().products.map(p => p.id), 0) + 1;
        const newProduct: StoredProduct = {
          ...data,
          id: nextId,
          createdAt: new Date().toISOString().split("T")[0],
        };
        set({ products: [newProduct, ...get().products] });
        return newProduct;
      },
      updateProduct: (id, updates) => {
        set({
          products: get().products.map(p => p.id === id ? { ...p, ...updates } : p)
        });
      },
      deleteProduct: (id) => {
        set({ products: get().products.filter(p => p.id !== id) });
      },
      toggleProductPublish: (id) => {
        set({
          products: get().products.map(p => p.id === id ? { ...p, published: !p.published } : p)
        });
      },
      
      // Services
      addService: (data) => {
        const nextId = Math.max(...get().services.map(s => s.id), 0) + 1;
        const newService: StoredService = {
          ...data,
          id: nextId,
          createdAt: new Date().toISOString().split("T")[0],
        };
        set({ services: [newService, ...get().services] });
        return newService;
      },
      updateService: (id, updates) => {
        set({
          services: get().services.map(s => s.id === id ? { ...s, ...updates } : s)
        });
      },
      deleteService: (id) => {
        set({ services: get().services.filter(s => s.id !== id) });
      },
      toggleServicePublish: (id) => {
        set({
          services: get().services.map(s => s.id === id ? { ...s, published: !s.published } : s)
        });
      },
      
      // Bookings
      addBooking: (data) => {
        const nextId = Math.max(...get().bookings.map(b => b.id), 0) + 1;
        const newBooking: StoredBooking = {
          ...data,
          id: nextId,
          createdAt: new Date().toISOString().split("T")[0],
        };
        set({ bookings: [newBooking, ...get().bookings] });
        return newBooking;
      },
      updateBooking: (id, updates) => {
        set({
          bookings: get().bookings.map(b => b.id === id ? { ...b, ...updates } : b)
        });
      },
      deleteBooking: (id) => {
        set({ bookings: get().bookings.filter(b => b.id !== id) });
      },
      toggleBookingPublish: (id) => {
        set({
          bookings: get().bookings.map(b => b.id === id ? { ...b, published: !b.published } : b)
        });
      },
      
      // Orders
      addOrder: (data) => {
        const nextId = Math.max(...get().orders.map(o => o.id), 0) + 1;
        const orderNumber = `EZY-${new Date().getFullYear()}-${String(nextId).padStart(4, "0")}`;
        const newOrder: StoredOrder = {
          ...data,
          id: nextId,
          orderNumber,
          createdAt: new Date().toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }),
        };
        set({ orders: [newOrder, ...get().orders] });
        return newOrder;
      },
      updateOrderStatus: (id, status) => {
        set({
          orders: get().orders.map(o => o.id === id ? { ...o, status } : o)
        });
      },
      updateOrderPaymentStatus: (id, paymentStatus) => {
        set({
          orders: get().orders.map(o => o.id === id ? { ...o, paymentStatus } : o)
        });
      },
      deleteOrder: (id) => {
        set({ orders: get().orders.filter(o => o.id !== id) });
      },
      
      // Enquiries
      addEnquiry: (data) => {
        const nextId = Math.max(...get().enquiries.map(e => e.id), 0) + 1;
        const newEnquiry: StoredEnquiry = {
          ...data,
          id: nextId,
          createdAt: new Date().toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }),
        };
        set({ enquiries: [newEnquiry, ...get().enquiries] });
        return newEnquiry;
      },
      updateEnquiryStatus: (id, status, notes) => {
        set({
          enquiries: get().enquiries.map(e => e.id === id ? { ...e, status, ...(notes !== undefined ? { notes } : {}) } : e)
        });
      },
      deleteEnquiry: (id) => {
        set({ enquiries: get().enquiries.filter(e => e.id !== id) });
      },
      
      // Customers
      addCustomer: (data) => {
        const nextId = Math.max(...get().customers.map(c => c.id), 0) + 1;
        const newCustomer: StoredCustomer = {
          ...data,
          id: nextId,
          joinedAt: new Date().toISOString().split("T")[0],
        };
        set({ customers: [newCustomer, ...get().customers] });
        return newCustomer;
      },
      updateCustomer: (id, updates) => {
        set({
          customers: get().customers.map(c => c.id === id ? { ...c, ...updates } : c)
        });
      },
      deleteCustomer: (id) => {
        set({ customers: get().customers.filter(c => c.id !== id) });
      },
      
      // Categories
      addCategory: (data) => {
        const nextId = Math.max(...get().categories.map(c => c.id), 0) + 1;
        const newCat: StoredCategory = {
          ...data,
          id: nextId,
        };
        set({ categories: [...get().categories, newCat] });
        return newCat;
      },
      updateCategory: (id, updates) => {
        set({
          categories: get().categories.map(c => c.id === id ? { ...c, ...updates } : c)
        });
      },
      deleteCategory: (id) => {
        set({ categories: get().categories.filter(c => c.id !== id) });
      },
      toggleCategoryPublish: (id) => {
        set({
          categories: get().categories.map(c => c.id === id ? { ...c, published: !c.published } : c)
        });
      },
      
      // Gallery
      addGalleryItem: (data) => {
        const nextId = Math.max(...get().gallery.map(g => g.id), 0) + 1;
        const newItem: StoredGalleryItem = {
          ...data,
          id: nextId,
          uploadedAt: new Date().toISOString().split("T")[0],
        };
        set({ gallery: [newItem, ...get().gallery] });
        return newItem;
      },
      updateGalleryItem: (id, updates) => {
        set({
          gallery: get().gallery.map(g => g.id === id ? { ...g, ...updates } : g)
        });
      },
      deleteGalleryItem: (id) => {
        set({ gallery: get().gallery.filter(g => g.id !== id) });
      },
      toggleGalleryPublish: (id) => {
        set({
          gallery: get().gallery.map(g => g.id === id ? { ...g, published: !g.published } : g)
        });
      },
      
      // Reviews
      addReview: (data) => {
        const nextId = Math.max(...get().reviews.map(r => r.id), 0) + 1;
        const newReview: StoredReview = {
          ...data,
          id: nextId,
          date: new Date().toISOString().split("T")[0],
        };
        set({ reviews: [newReview, ...get().reviews] });
        return newReview;
      },
      updateReview: (id, updates) => {
        set({
          reviews: get().reviews.map(r => r.id === id ? { ...r, ...updates } : r)
        });
      },
      deleteReview: (id) => {
        set({ reviews: get().reviews.filter(r => r.id !== id) });
      },
      replyToReview: (id, reply) => {
        set({
          reviews: get().reviews.map(r => r.id === id ? { ...r, reply } : r)
        });
      },
      
      // Website Content
      addHeroSlide: (data) => {
        const nextId = Math.max(...get().heroSlides.map(s => s.id), 0) + 1;
        const newSlide: StoredHeroSlide = { ...data, id: nextId };
        set({ heroSlides: [...get().heroSlides, newSlide] });
        return newSlide;
      },
      updateHeroSlide: (id, updates) => {
        set({
          heroSlides: get().heroSlides.map(s => s.id === id ? { ...s, ...updates } : s)
        });
      },
      deleteHeroSlide: (id) => {
        set({ heroSlides: get().heroSlides.filter(s => s.id !== id) });
      },
      addFaq: (data) => {
        const nextId = Math.max(...get().faqs.map(f => f.id), 0) + 1;
        const newFaq: StoredFaq = { ...data, id: nextId };
        set({ faqs: [...get().faqs, newFaq] });
        return newFaq;
      },
      updateFaq: (id, updates) => {
        set({
          faqs: get().faqs.map(f => f.id === id ? { ...f, ...updates } : f)
        });
      },
      deleteFaq: (id) => {
        set({ faqs: get().faqs.filter(f => f.id !== id) });
      },
      
      // Settings
      updateSettings: (updates) => {
        set({ settings: { ...get().settings, ...updates } });
      },
      
      // Global Utilities
      resetToDefaults: () => {
        set({
          products: initialProducts,
          services: initialServices,
          bookings: initialBookings,
          orders: initialOrders,
          enquiries: initialEnquiries,
          customers: initialCustomers,
          categories: initialCategories,
          gallery: initialGallery,
          reviews: initialReviews,
          heroSlides: initialHeroSlides,
          faqs: initialFaqs,
          settings: initialOwnerSettings,
        });
      },
      exportDatabaseJson: () => {
        const state = get();
        return JSON.stringify(
          {
            products: state.products,
            services: state.services,
            bookings: state.bookings,
            orders: state.orders,
            enquiries: state.enquiries,
            customers: state.customers,
            categories: state.categories,
            gallery: state.gallery,
            reviews: state.reviews,
            heroSlides: state.heroSlides,
            faqs: state.faqs,
            settings: state.settings,
            exportTimestamp: new Date().toISOString(),
          },
          null,
          2
        );
      },
      importDatabaseJson: (jsonString: string) => {
        try {
          const parsed = JSON.parse(jsonString);
          set({
            ...(parsed.products ? { products: parsed.products } : {}),
            ...(parsed.services ? { services: parsed.services } : {}),
            ...(parsed.bookings ? { bookings: parsed.bookings } : {}),
            ...(parsed.orders ? { orders: parsed.orders } : {}),
            ...(parsed.enquiries ? { enquiries: parsed.enquiries } : {}),
            ...(parsed.customers ? { customers: parsed.customers } : {}),
            ...(parsed.categories ? { categories: parsed.categories } : {}),
            ...(parsed.gallery ? { gallery: parsed.gallery } : {}),
            ...(parsed.reviews ? { reviews: parsed.reviews } : {}),
            ...(parsed.heroSlides ? { heroSlides: parsed.heroSlides } : {}),
            ...(parsed.faqs ? { faqs: parsed.faqs } : {}),
            ...(parsed.settings ? { settings: parsed.settings } : {}),
          });
          return true;
        } catch (e) {
          console.error("Failed to import database JSON:", e);
          return false;
        }
      },
    }),
    {
      name: "ezy1_master_database_v2",
    }
  )
);
