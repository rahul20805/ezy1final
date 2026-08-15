import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductCategory, Worker } from "../types";

// ==========================================
// 1. DATA INTERFACES
// ==========================================

export interface StoredProduct {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  mrp: number;
  category: string;
  subcategory?: string;
  categoryIds: number[];
  vendorId: number;
  vendorName?: string;
  stockCount: number;
  minOrderQty?: number;
  maxOrderQty?: number;
  taxPercent?: number;
  inStock: boolean;
  isAvailable: boolean;
  published: boolean;
  featured?: boolean;
  rating?: number;
  totalReviews?: number;
  images: string[];
  discountPercent?: number;
  unit?: string;
  tags?: string[];
  createdAt: string;
}

export interface StoredShop {
  id: number;
  businessName: string;
  ownerName: string;
  category: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  status: "active" | "suspended" | "pending";
  rating: number;
  totalOrders: number;
  totalRevenue: number;
  openingHours: string;
  deliveryRadiusKm: number;
  verified: boolean;
  image?: string;
  joinedAt: string;
}

export interface StoredPartnerApplication {
  id: number;
  applicantName: string;
  businessName: string;
  category: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  documentsSubmitted: string[];
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "MORE_INFORMATION_REQUIRED";
  notes?: string;
  appliedAt: string;
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

export interface StoredServiceProvider {
  id: number;
  name: string;
  category: string;
  phone: string;
  city: string;
  rating: number;
  jobsCompleted: number;
  isAvailable: boolean;
  verified: boolean;
  experienceYears: number;
  hourlyRate: number;
  joinedAt: string;
}

export interface StoredBooking {
  id: number;
  title: string;
  type: "class" | "workshop" | "doctor" | "consultation" | "service" | "transport";
  category: string;
  instructorOrDoctor: string;
  price: number;
  schedule: string;
  duration: string;
  capacity: number;
  enrolledCount: number;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  published: boolean;
  image?: string;
  location?: string;
  description?: string;
  createdAt: string;
}

export interface StoredDoctor {
  id: number;
  name: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  hospitalName: string;
  consultationFee: number;
  availability: string;
  rating: number;
  totalReviews: number;
  phone: string;
  verified: boolean;
  image?: string;
  bio?: string;
}

export interface StoredHospital {
  id: number;
  name: string;
  city: string;
  address: string;
  emergencyPhone: string;
  departments: string[];
  totalBeds: number;
  availableBeds: number;
  icuBedsAvailable: number;
  hasEmergency24x7: boolean;
  verified: boolean;
}

export interface StoredHospitalBed {
  id: number;
  hospitalId: number;
  hospitalName: string;
  department: string;
  bedType: "General Ward" | "ICU / Ventilator" | "Semi-Private" | "Emergency" | "Pediatric";
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  lastUpdated: string;
}

export interface StoredTransportListing {
  id: number;
  operatorName: string;
  vehicleType: "Bus" | "Cab" | "Auto" | "Mini Bus" | "Tempo Traveller";
  vehicleNumber: string;
  routeName: string;
  fromLocation: string;
  toLocation: string;
  timings: string;
  fare: number;
  availableSeats: number;
  totalSeats: number;
  verified: boolean;
  status: "Active" | "Maintenance" | "Inactive";
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
  deliveryFee: number;
  discountAmount: number;
  orderSource: "WEB" | "MOBILE" | "WHATSAPP";
  status: "NEW" | "ACCEPTED" | "PREPARING" | "READY" | "PICKED_UP" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  paymentMethod: "UPI" | "Wallet" | "COD" | "Card";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  vendorId: number;
  vendorName?: string;
  assignedDriverId?: number;
  assignedDriverName?: string;
  timeline: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
  createdAt: string;
  notes?: string;
}

export interface StoredCoupon {
  id: number;
  code: string;
  title: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface StoredCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  walletBalance: number;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "suspended" | "inactive";
  joinedAt: string;
  savedAddresses?: Array<{
    tag: string;
    address: string;
  }>;
}

export interface StoredSupportTicket {
  id: number;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  orderId?: string;
  category: "Order" | "Payment" | "Delivery" | "Partner" | "Product" | "Booking" | "Account" | "Other";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  subject: string;
  assignedAdmin?: string;
  messages: Array<{
    sender: "customer" | "admin";
    text: string;
    timestamp: string;
  }>;
  createdAt: string;
}

export interface StoredDispute {
  id: number;
  orderNumber: string;
  customerName: string;
  partnerName: string;
  disputeType: "Damaged Goods" | "Wrong Item" | "Delivery Delay" | "Payment Failure" | "Service Quality";
  amount: number;
  status: "PENDING" | "INVESTIGATING" | "RESOLVED" | "REFUNDED" | "REJECTED";
  reason: string;
  resolutionNotes?: string;
  createdAt: string;
}

export interface StoredDeliveryPartner {
  id: number;
  name: string;
  phone: string;
  vehicleType: "2-Wheeler (Bike)" | "Electric Scooter" | "Auto / 3-Wheeler" | "Van / Mini-Truck";
  vehicleNumber: string;
  currentStatus: "ONLINE" | "BUSY" | "OFFLINE";
  ordersDelivered: number;
  rating: number;
  earningsToday: number;
  verified: boolean;
  joinedAt: string;
}

export interface StoredDeliveryZone {
  id: number;
  name: string;
  city: string;
  radiusKm: number;
  active: boolean;
}

export interface StoredTransaction {
  id: number;
  transactionId: string;
  orderId: string;
  customerName: string;
  amount: number;
  paymentMethod: "UPI" | "Wallet" | "COD" | "Credit/Debit Card";
  gateway: "Razorpay" | "Direct UPI" | "Internal Wallet" | "Cash Handler";
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  date: string;
}

export interface StoredRefund {
  id: number;
  refundId: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "PROCESSED" | "REJECTED";
  requestedAt: string;
  processedAt?: string;
}

export interface StoredPartnerPayout {
  id: number;
  partnerId: number | string;
  partnerName: string;
  grossSales: number;
  commissionDeducted: number;
  adjustments: number;
  netPayout: number;
  status: "PENDING" | "APPROVED" | "PROCESSED" | "REJECTED";
  period: string;
  payoutDate: string;
}

export interface StoredEnquiry {
  id: number;
  customerName: string;
  name?: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  serviceType?: string;
  category?: string;
  status: "new" | "read" | "in_progress" | "resolved" | "archived";
  createdAt: string;
  notes?: string;
}

export interface StoredCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  type: "product" | "service" | "booking" | "all";
  color?: string;
  published: boolean;
  orderIndex: number;
  subcategories?: string[];
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
  targetType: "product" | "service" | "vendor" | "doctor" | "store";
  targetName: string;
  targetId: number;
  status: "approved" | "pending" | "rejected";
  isFeatured: boolean;
  isReported?: boolean;
  reportReason?: string;
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

export interface StoredAuditLog {
  id: number;
  adminName: string;
  adminRole: string;
  action: string;
  entityType: string;
  entityId: string | number;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface StoredLiveEvent {
  id: number;
  type: "order" | "customer" | "partner" | "payment" | "booking" | "review" | "support" | "delivery";
  title: string;
  description: string;
  timestamp: string;
  badge: string;
}

export interface OwnerSettings {
  brandName: string;
  tagline: string;
  ownerName: string;
  legalBusinessName: string;
  gstNumber: string;
  logoUrl: string;
  faviconUrl: string;
  themePrimaryColor: string;
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
  openingHours: string;
  isOpenToday: boolean;
  minimumOrderAmount: number;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  expressDeliveryFee: number;
  taxPercentage: number;
  deliveryRadiusKm: number;
  enableCod: boolean;
  enableUpi: boolean;
  upiId: string;
  enableWallet: boolean;
  enableOnlineCards: boolean;
  announcementBarText: string;
  enableAnnouncementBar: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  termsAndConditions: string;
  privacyPolicy: string;
  returnPolicy: string;
  cancellationPolicy: string;
  whatsappConnected: boolean;
  whatsappWebhookStatus: "Connected" | "Standby" | "Error";
}

// ==========================================
// 2. INITIAL SEEDS (RICH & COMPREHENSIVE)
// ==========================================

const initialShops: StoredShop[] = [
  {
    id: 1,
    businessName: "Sharma Kirana Store",
    ownerName: "Ramesh Sharma",
    category: "Grocery & Staples",
    city: "Mumbai",
    address: "12, Andheri West Market, Mumbai",
    phone: "9876543210",
    email: "sharma.kirana@example.com",
    status: "active",
    rating: 4.8,
    totalOrders: 340,
    totalRevenue: 84500,
    openingHours: "07:00 AM - 10:00 PM",
    deliveryRadiusKm: 8,
    verified: true,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
    joinedAt: "2025-10-15",
  },
  {
    id: 2,
    businessName: "Nair Ayurveda & Pharma",
    ownerName: "Krishnan Nair",
    category: "Pharmacy & Wellness",
    city: "Thiruvananthapuram",
    address: "45, East Fort Road, Thiruvananthapuram",
    phone: "9845012345",
    email: "nair.pharma@example.com",
    status: "active",
    rating: 4.9,
    totalOrders: 215,
    totalRevenue: 62100,
    openingHours: "08:00 AM - 11:00 PM",
    deliveryRadiusKm: 12,
    verified: true,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80",
    joinedAt: "2025-11-02",
  },
  {
    id: 3,
    businessName: "Patel Fresh Produce Hub",
    ownerName: "Hasmukh Patel",
    category: "Fresh Fruits & Veggies",
    city: "Surat",
    address: "Old Vegetable Market, Ring Road, Surat",
    phone: "9712200100",
    email: "patel.veg@example.com",
    status: "active",
    rating: 4.6,
    totalOrders: 180,
    totalRevenue: 34200,
    openingHours: "06:00 AM - 08:00 PM",
    deliveryRadiusKm: 6,
    verified: true,
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=500&q=80",
    joinedAt: "2025-12-10",
  },
  {
    id: 4,
    businessName: "Suresh Electricals & Fixes",
    ownerName: "Suresh Sharma",
    category: "Home Services",
    city: "Bengaluru",
    address: "100ft Road, Indiranagar, Bengaluru",
    phone: "9812345670",
    email: "suresh.services@example.com",
    status: "active",
    rating: 4.9,
    totalOrders: 145,
    totalRevenue: 48900,
    openingHours: "08:00 AM - 09:00 PM",
    deliveryRadiusKm: 15,
    verified: true,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80",
    joinedAt: "2026-01-05",
  },
];

const initialPartnerApplications: StoredPartnerApplication[] = [
  {
    id: 101,
    applicantName: "Deepak Choudhary",
    businessName: "Choudhary Sweets & Bakery",
    category: "Bakery & Desserts",
    phone: "9833445566",
    email: "deepak.sweets@gmail.com",
    city: "Jaipur",
    address: "MI Road, Near Panch Batti, Jaipur",
    documentsSubmitted: ["FSSAI_Cert.pdf", "GST_Registration.pdf", "Aadhaar.jpg"],
    status: "PENDING",
    notes: "Applied for 10-minute instant pastry and dessert delivery.",
    appliedAt: "2026-08-15 08:30 AM",
  },
  {
    id: 102,
    applicantName: "Dr. Sunita Deshmukh",
    businessName: "Deshmukh Dental Care Clinic",
    category: "Healthcare",
    phone: "9820011223",
    email: "dr.sunita@deshmukhdental.in",
    city: "Pune",
    address: "FC Road, Shivaji Nagar, Pune",
    documentsSubmitted: ["Medical_Council_License.pdf", "Clinic_PAN.pdf"],
    status: "UNDER_REVIEW",
    notes: "Dentist appointment booking and teleconsultation onboarding.",
    appliedAt: "2026-08-14 02:15 PM",
  },
  {
    id: 103,
    applicantName: "Vikram Malhotra",
    businessName: "Malhotra Quick Auto Fleet",
    category: "Transport",
    phone: "9988112233",
    email: "vikram.fleet@cabs.in",
    city: "Delhi",
    address: "Connaught Place, New Delhi",
    documentsSubmitted: ["Commercial_Vehicle_RC.pdf", "Driver_Badges.pdf"],
    status: "MORE_INFORMATION_REQUIRED",
    notes: "Requested updated fitness certificates for 4 electric autos.",
    appliedAt: "2026-08-13 11:45 AM",
  },
];

const initialDoctors: StoredDoctor[] = [
  {
    id: 1,
    name: "Dr. Arvind Rao",
    specialization: "General Physician & Internal Medicine",
    qualification: "MBBS, MD (General Medicine)",
    experienceYears: 14,
    hospitalName: "EzyHealth Multi-Specialty Clinic",
    consultationFee: 500,
    availability: "Mon - Sat: 09:00 AM - 02:00 PM",
    rating: 4.9,
    totalReviews: 312,
    phone: "9876541100",
    verified: true,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80",
    bio: "Senior consultant specializing in fever management, diabetes, and preventive cardiac wellness.",
  },
  {
    id: 2,
    name: "Dr. Meenakshi Sundaram",
    specialization: "Pediatrician & Child Specialist",
    qualification: "MBBS, DCH, DNB (Pediatrics)",
    experienceYears: 11,
    hospitalName: "Apollo Cradle & Children Hospital",
    consultationFee: 650,
    availability: "Mon, Wed, Fri: 10:00 AM - 04:00 PM",
    rating: 4.8,
    totalReviews: 240,
    phone: "9845019900",
    verified: true,
    image: "https://images.unsplash.com/photo-1594824813593-305f8d55998f?w=500&q=80",
    bio: "Dedicated pediatric specialist focusing on newborn care, vaccinations, and childhood immunity.",
  },
  {
    id: 3,
    name: "Dr. Sanjay Bhattacharya",
    specialization: "Orthopedic & Joint Specialist",
    qualification: "MS (Ortho), M.Ch Ortho",
    experienceYears: 18,
    hospitalName: "Fortis Memorial Healthcare",
    consultationFee: 800,
    availability: "Tue, Thu, Sat: 02:00 PM - 07:00 PM",
    rating: 4.9,
    totalReviews: 185,
    phone: "9811223399",
    verified: true,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80",
    bio: "Expert in knee replacement, sports injury rehab, and spine ergonomics.",
  },
];

const initialHospitals: StoredHospital[] = [
  {
    id: 1,
    name: "Manipal Multi-Specialty Hospital",
    city: "Bengaluru",
    address: "HAL Old Airport Road, Kodihalli, Bengaluru",
    emergencyPhone: "080-25024444",
    departments: ["Cardiology", "ICU & Critical Care", "Neurology", "Emergency & Trauma", "Pediatrics"],
    totalBeds: 250,
    availableBeds: 42,
    icuBedsAvailable: 8,
    hasEmergency24x7: true,
    verified: true,
  },
  {
    id: 2,
    name: "Fortis Memorial Hospital",
    city: "Bengaluru",
    address: "Bannerghatta Main Road, Opp. IIM, Bengaluru",
    emergencyPhone: "080-66214444",
    departments: ["Orthopedics", "Oncology", "Gastroenterology", "ICU", "Pulmonology"],
    totalBeds: 180,
    availableBeds: 29,
    icuBedsAvailable: 5,
    hasEmergency24x7: true,
    verified: true,
  },
];

const initialHospitalBeds: StoredHospitalBed[] = [
  {
    id: 1,
    hospitalId: 1,
    hospitalName: "Manipal Hospital",
    department: "Emergency & Trauma",
    bedType: "Emergency",
    totalBeds: 30,
    availableBeds: 6,
    occupiedBeds: 24,
    lastUpdated: "10 mins ago",
  },
  {
    id: 2,
    hospitalId: 1,
    hospitalName: "Manipal Hospital",
    department: "Intensive Care Unit (ICU)",
    bedType: "ICU / Ventilator",
    totalBeds: 25,
    availableBeds: 8,
    occupiedBeds: 17,
    lastUpdated: "5 mins ago",
  },
  {
    id: 3,
    hospitalId: 1,
    hospitalName: "Manipal Hospital",
    department: "General Medicine Ward",
    bedType: "General Ward",
    totalBeds: 120,
    availableBeds: 22,
    occupiedBeds: 98,
    lastUpdated: "15 mins ago",
  },
  {
    id: 4,
    hospitalId: 2,
    hospitalName: "Fortis Hospital",
    department: "Critical Cardiac ICU",
    bedType: "ICU / Ventilator",
    totalBeds: 20,
    availableBeds: 5,
    occupiedBeds: 15,
    lastUpdated: "8 mins ago",
  },
];

const initialTransportListings: StoredTransportListing[] = [
  {
    id: 1,
    operatorName: "Ezy1 EV Electric Auto Fleet",
    vehicleType: "Auto",
    vehicleNumber: "KA-01-EA-1029",
    routeName: "Indiranagar ⇄ Koramangala Shuttle",
    fromLocation: "Indiranagar Metro Station",
    toLocation: "Sony World Signal, Koramangala",
    timings: "Every 10 mins (06:00 AM - 11:30 PM)",
    fare: 40,
    availableSeats: 3,
    totalSeats: 3,
    verified: true,
    status: "Active",
  },
  {
    id: 2,
    operatorName: "Bengaluru Airport Express Electric Bus",
    vehicleType: "Bus",
    vehicleNumber: "KA-57-F-9021",
    routeName: "Vayu Vajra KIAS-9",
    fromLocation: "Kempegowda Bus Station (Majestic)",
    toLocation: "Kempegowda International Airport (BLR)",
    timings: "Every 20 mins round the clock (24x7)",
    fare: 260,
    availableSeats: 18,
    totalSeats: 40,
    verified: true,
    status: "Active",
  },
  {
    id: 3,
    operatorName: "Rajesh Luxury Cabs Fleet",
    vehicleType: "Cab",
    vehicleNumber: "KA-03-MC-8812",
    routeName: "City On-Demand Taxi / Outstation",
    fromLocation: "Whitefield Tech Park",
    toLocation: "MG Road Metro Hub",
    timings: "On-demand instant dispatch",
    fare: 350,
    availableSeats: 4,
    totalSeats: 4,
    verified: true,
    status: "Active",
  },
];

const initialCoupons: StoredCoupon[] = [
  {
    id: 1,
    code: "EZYFIRST",
    title: "Flat ₹50 OFF on Your First Order",
    discountType: "fixed",
    discountValue: 50,
    minOrderAmount: 199,
    expiryDate: "2026-12-31",
    usageLimit: 1000,
    usedCount: 284,
    active: true,
  },
  {
    id: 2,
    code: "FREESHIP",
    title: "100% Free Superfast Delivery",
    discountType: "fixed",
    discountValue: 30,
    minOrderAmount: 299,
    expiryDate: "2026-12-31",
    usageLimit: 5000,
    usedCount: 1420,
    active: true,
  },
  {
    id: 3,
    code: "SUPER20",
    title: "20% OFF on Organic Groceries & Farm Veggies",
    discountType: "percentage",
    discountValue: 20,
    minOrderAmount: 499,
    maxDiscount: 150,
    expiryDate: "2026-11-30",
    usageLimit: 500,
    usedCount: 118,
    active: true,
  },
];

const initialDeliveryPartners: StoredDeliveryPartner[] = [
  {
    id: 1,
    name: "Akash Kumar",
    phone: "9876500112",
    vehicleType: "Electric Scooter",
    vehicleNumber: "KA-01-EZ-4411",
    currentStatus: "ONLINE",
    ordersDelivered: 412,
    rating: 4.9,
    earningsToday: 950,
    verified: true,
    joinedAt: "2025-11-10",
  },
  {
    id: 2,
    name: "Mohammad Farooq",
    phone: "9845122334",
    vehicleType: "2-Wheeler (Bike)",
    vehicleNumber: "KA-03-HJ-9081",
    currentStatus: "BUSY",
    ordersDelivered: 680,
    rating: 4.8,
    earningsToday: 1200,
    verified: true,
    joinedAt: "2025-09-18",
  },
  {
    id: 3,
    name: "Ramesh Pawar",
    phone: "9712399881",
    vehicleType: "2-Wheeler (Bike)",
    vehicleNumber: "KA-04-TR-5520",
    currentStatus: "ONLINE",
    ordersDelivered: 295,
    rating: 4.7,
    earningsToday: 600,
    verified: true,
    joinedAt: "2026-01-14",
  },
];

const initialSupportTickets: StoredSupportTicket[] = [
  {
    id: 1,
    ticketNumber: "TCK-2026-081",
    customerName: "Rahul Sharma",
    customerPhone: "9876543210",
    orderId: "EZY-2026-0801",
    category: "Delivery",
    priority: "HIGH",
    status: "IN_PROGRESS",
    subject: "Driver running 10 mins delayed on delivery route",
    assignedAdmin: "Admin Alka",
    messages: [
      { sender: "customer", text: "Order was expected at 10:00 AM, rider is stuck in Indiranagar signal.", timestamp: "10:05 AM" },
      { sender: "admin", text: "Checked with rider Akash, he has cleared signal and is 2 mins away from your apartment gate.", timestamp: "10:08 AM" },
    ],
    createdAt: "2026-08-15 10:05 AM",
  },
  {
    id: 2,
    ticketNumber: "TCK-2026-082",
    customerName: "Priya Nair",
    customerPhone: "9845012345",
    category: "Payment",
    priority: "MEDIUM",
    status: "OPEN",
    subject: "UPI transaction debited twice during checkout",
    assignedAdmin: "Finance Team",
    messages: [
      { sender: "customer", text: "Bank debited ₹476 twice via GPay due to momentary network glitch.", timestamp: "09:30 AM" },
    ],
    createdAt: "2026-08-15 09:30 AM",
  },
];

const initialDisputes: StoredDispute[] = [
  {
    id: 1,
    orderNumber: "EZY-2026-0798",
    customerName: "Sneha Mukherjee",
    partnerName: "Sharma Kirana Store",
    disputeType: "Damaged Goods",
    amount: 120,
    status: "INVESTIGATING",
    reason: "Egg carton outer packing crushed during transit.",
    resolutionNotes: "Vendor agrees to issue instant ₹120 wallet refund credit.",
    createdAt: "2026-08-14 04:30 PM",
  },
];

const initialTransactions: StoredTransaction[] = [
  {
    id: 1,
    transactionId: "TXN-UPI-990812",
    orderId: "EZY-2026-0801",
    customerName: "Rahul Sharma",
    amount: 740,
    paymentMethod: "UPI",
    gateway: "Direct UPI",
    status: "SUCCESS",
    date: "2026-08-15 09:45 AM",
  },
  {
    id: 2,
    transactionId: "TXN-WAL-990813",
    orderId: "EZY-2026-0802",
    customerName: "Priya Nair",
    amount: 476,
    paymentMethod: "Wallet",
    gateway: "Internal Wallet",
    status: "SUCCESS",
    date: "2026-08-15 10:15 AM",
  },
  {
    id: 3,
    transactionId: "TXN-COD-990814",
    orderId: "EZY-2026-0803",
    customerName: "Anil Kumble",
    amount: 240,
    paymentMethod: "COD",
    gateway: "Cash Handler",
    status: "SUCCESS",
    date: "2026-08-14 06:30 PM",
  },
];

const initialAuditLogs: StoredAuditLog[] = [
  {
    id: 1,
    adminName: "Alka Yadav (Super Admin)",
    adminRole: "SUPER_ADMIN",
    action: "UPDATE_SETTING",
    entityType: "OwnerSettings",
    entityId: "brandName",
    details: "Synchronized brand identity and WhatsApp click-to-chat gateway",
    timestamp: "2026-08-15 10:30:15 AM",
    ipAddress: "192.168.1.104",
  },
  {
    id: 2,
    adminName: "Rahul Yadav (Admin)",
    adminRole: "SUPER_ADMIN",
    action: "APPROVE_PARTNER",
    entityType: "PartnerAccount",
    entityId: "sharma_grocery",
    details: "Approved Sharma Kirana retail license and activated store catalog",
    timestamp: "2026-08-15 09:12:00 AM",
    ipAddress: "192.168.1.108",
  },
  {
    id: 3,
    adminName: "Finance Desk",
    adminRole: "FINANCE_MANAGER",
    action: "APPROVE_PAYOUT",
    entityType: "PartnerPayout",
    entityId: "PAY-2026-01",
    details: "Processed weekly settlement payout ₹42,500 to Nair Ayurveda Pharma",
    timestamp: "2026-08-14 05:45:20 PM",
    ipAddress: "10.0.0.12",
  },
];

const initialLiveEvents: StoredLiveEvent[] = [
  {
    id: 1,
    type: "order",
    title: "New WhatsApp Order Received",
    description: "Customer ordered 5kg Atta & Butter via WhatsApp bot (Order #EZY-2026-0801)",
    timestamp: "2 mins ago",
    badge: "Order Placed",
  },
  {
    id: 2,
    type: "payment",
    title: "UPI Payment Verified",
    description: "₹740 received via GPay from Rahul Sharma",
    timestamp: "4 mins ago",
    badge: "Payment OK",
  },
  {
    id: 3,
    type: "delivery",
    title: "Rider Dispatched",
    description: "Rider Akash picked up grocery packet from Sharma Kirana (ETA 12 mins)",
    timestamp: "7 mins ago",
    badge: "Out for Delivery",
  },
  {
    id: 4,
    type: "partner",
    title: "New Partner Application",
    description: "Choudhary Sweets & Bakery submitted partner documents for review",
    timestamp: "25 mins ago",
    badge: "Pending KYC",
  },
];

// Existing base seeds (Products, Bookings, Orders, Enquiries, Categories, Gallery, Reviews, FAQs, Settings)
const initialProducts: StoredProduct[] = [
  {
    id: 1,
    name: "Aashirvaad Shudh Chakki Atta (5kg)",
    sku: "GROC-ATT-001",
    description: "100% whole wheat flour, fiber-rich, perfectly milled for super soft rotis.",
    price: 240,
    mrp: 260,
    category: "Atta, Rice & Dal",
    subcategory: "Flour & Grains",
    categoryIds: [1],
    vendorId: 1,
    vendorName: "Sharma Kirana Store",
    stockCount: 45,
    minOrderQty: 1,
    maxOrderQty: 5,
    taxPercent: 5,
    inStock: true,
    isAvailable: true,
    published: true,
    featured: true,
    rating: 4.8,
    totalReviews: 430,
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80"],
    discountPercent: 8,
    unit: "5 kg pack",
    tags: ["wheat", "atta", "staple"],
    createdAt: "2026-01-10",
  },
  {
    id: 2,
    name: "Amul Butter - Pasteurised (500g)",
    sku: "DAIRY-BUT-002",
    description: "Utterly butterly delicious fresh dairy butter made from pure milk fat.",
    price: 250,
    mrp: 275,
    category: "Dairy, Bread & Eggs",
    subcategory: "Butter & Cheese",
    categoryIds: [2],
    vendorId: 1,
    vendorName: "Sharma Kirana Store",
    stockCount: 28,
    minOrderQty: 1,
    maxOrderQty: 4,
    taxPercent: 5,
    inStock: true,
    isAvailable: true,
    published: true,
    featured: true,
    rating: 4.9,
    totalReviews: 890,
    images: ["https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80"],
    discountPercent: 9,
    unit: "500g block",
    tags: ["dairy", "butter", "amul"],
    createdAt: "2026-01-12",
  },
  {
    id: 3,
    name: "Fresh Farm Red Onions (1kg)",
    sku: "VEG-ONI-003",
    description: "Directly sourced from local farmers. Crisp, fresh, and hand-sorted daily.",
    price: 35,
    mrp: 50,
    category: "Fresh Produce & Fruits",
    subcategory: "Vegetables",
    categoryIds: [3],
    vendorId: 3,
    vendorName: "Patel Fresh Produce Hub",
    stockCount: 120,
    minOrderQty: 1,
    maxOrderQty: 10,
    taxPercent: 0,
    inStock: true,
    isAvailable: true,
    published: true,
    featured: false,
    rating: 4.5,
    totalReviews: 120,
    images: ["https://images.unsplash.com/photo-1508747703725-719777637510?w=500&q=80"],
    discountPercent: 30,
    unit: "1 kg",
    tags: ["vegetables", "fresh", "organic"],
    createdAt: "2026-02-01",
  },
  {
    id: 4,
    name: "Lays India's Magic Masala Chips (50g)",
    sku: "SNK-LAY-004",
    description: "Classic spicy potato chips with exotic Indian aromatic spices.",
    price: 20,
    mrp: 20,
    category: "Munchies & Snacks",
    subcategory: "Chips & Crisps",
    categoryIds: [4],
    vendorId: 1,
    vendorName: "Sharma Kirana Store",
    stockCount: 200,
    minOrderQty: 1,
    maxOrderQty: 12,
    taxPercent: 12,
    inStock: true,
    isAvailable: true,
    published: true,
    featured: true,
    rating: 4.7,
    totalReviews: 540,
    images: ["https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&q=80"],
    discountPercent: 0,
    unit: "50g pack",
    tags: ["chips", "snacks", "lays"],
    createdAt: "2026-02-05",
  },
  {
    id: 5,
    name: "Organic Raw Mountain Honey (500g)",
    sku: "WELL-HON-005",
    description: "Unfiltered 100% pure wild honey packed with natural antioxidants.",
    price: 380,
    mrp: 450,
    category: "Organic & Wellness",
    subcategory: "Honey & Supplements",
    categoryIds: [6],
    vendorId: 2,
    vendorName: "Nair Ayurveda & Pharma",
    stockCount: 15,
    minOrderQty: 1,
    maxOrderQty: 3,
    taxPercent: 5,
    inStock: true,
    isAvailable: true,
    published: true,
    featured: true,
    rating: 4.9,
    totalReviews: 95,
    images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80"],
    discountPercent: 15,
    unit: "500g jar",
    tags: ["honey", "organic", "ayurveda"],
    createdAt: "2026-02-08",
  },
  {
    id: 6,
    name: "Dolo 650mg Paracetamol Tablets",
    sku: "MED-DOL-006",
    description: "Fast relief from fever, headache, body aches, and fever symptoms.",
    price: 32,
    mrp: 35,
    category: "Pharmacy & First Aid",
    subcategory: "Pain & Fever",
    categoryIds: [7],
    vendorId: 2,
    vendorName: "Nair Ayurveda & Pharma",
    stockCount: 80,
    minOrderQty: 1,
    maxOrderQty: 6,
    taxPercent: 12,
    inStock: true,
    isAvailable: true,
    published: true,
    featured: false,
    rating: 4.8,
    totalReviews: 210,
    images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80"],
    discountPercent: 9,
    unit: "Strip of 15 tabs",
    tags: ["medicine", "fever", "pharmacy"],
    createdAt: "2026-02-10",
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
    deliveryFee: 0,
    discountAmount: 0,
    orderSource: "WHATSAPP",
    status: "OUT_FOR_DELIVERY",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    vendorId: 1,
    vendorName: "Sharma Kirana Store",
    assignedDriverId: 1,
    assignedDriverName: "Akash Kumar",
    timeline: [
      { status: "NEW", timestamp: "09:45 AM", note: "Order placed via WhatsApp Assistant" },
      { status: "ACCEPTED", timestamp: "09:47 AM", note: "Accepted by Sharma Kirana" },
      { status: "PREPARING", timestamp: "09:50 AM", note: "Packed and sealed in eco bag" },
      { status: "OUT_FOR_DELIVERY", timestamp: "09:58 AM", note: "Handed over to rider Akash" },
    ],
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
    deliveryFee: 0,
    discountAmount: 0,
    orderSource: "WEB",
    status: "ACCEPTED",
    paymentMethod: "Wallet",
    paymentStatus: "paid",
    vendorId: 2,
    vendorName: "Nair Ayurveda & Pharma",
    timeline: [
      { status: "NEW", timestamp: "10:15 AM", note: "Web checkout completed" },
      { status: "ACCEPTED", timestamp: "10:18 AM", note: "Prescription verified & accepted" },
    ],
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
    deliveryFee: 30,
    discountAmount: 30,
    orderSource: "MOBILE",
    status: "DELIVERED",
    paymentMethod: "COD",
    paymentStatus: "paid",
    vendorId: 1,
    vendorName: "Sharma Kirana Store",
    assignedDriverId: 2,
    assignedDriverName: "Mohammad Farooq",
    timeline: [
      { status: "NEW", timestamp: "06:30 PM" },
      { status: "OUT_FOR_DELIVERY", timestamp: "06:45 PM" },
      { status: "DELIVERED", timestamp: "07:05 PM", note: "Delivered to customer directly" },
    ],
    createdAt: "2026-08-14 06:30 PM",
  }
];

const initialCustomers: StoredCustomer[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.s@example.com",
    phone: "9876543210",
    city: "Bengaluru",
    address: "HSR Layout, Sector 2, Bengaluru",
    walletBalance: 1935,
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
    address: "Whitefield, Palm Meadows, Bengaluru",
    walletBalance: 420,
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
    address: "Andheri West, Mumbai",
    walletBalance: 850,
    totalOrders: 22,
    totalSpent: 12400,
    status: "active",
    joinedAt: "2025-09-18",
  },
];

const initialCategories: StoredCategory[] = [
  { id: 1, name: "Atta, Rice & Dal", slug: "atta-rice-dal", description: "Fresh staples, pulses, basmati & whole wheat", image: "🌾", type: "product", color: "bg-amber-100 text-amber-800", published: true, orderIndex: 1, subcategories: ["Flour & Atta", "Rice & Poha", "Dals & Pulses"] },
  { id: 2, name: "Dairy, Bread & Eggs", slug: "dairy-bread-eggs", description: "Farm fresh milk, butter, cheese & artisan bread", image: "🥛", type: "product", color: "bg-blue-100 text-blue-800", published: true, orderIndex: 2, subcategories: ["Milk & Curd", "Butter & Cheese", "Bread & Bakery"] },
  { id: 3, name: "Fresh Produce & Fruits", slug: "fresh-produce", description: "Organic vegetables, seasonal fruits straight from farms", image: "🍎", type: "product", color: "bg-emerald-100 text-emerald-800", published: true, orderIndex: 3, subcategories: ["Daily Veggies", "Seasonal Fruits", "Exotic Herbs"] },
  { id: 4, name: "Munchies & Snacks", slug: "munchies-snacks", description: "Chips, namkeen, biscuits & gourmet cookies", image: "🍿", type: "product", color: "bg-orange-100 text-orange-800", published: true, orderIndex: 4, subcategories: ["Chips & Crisps", "Biscuits", "Namkeen & Dry Snacks"] },
  { id: 5, name: "Cold Drinks & Juices", slug: "cold-drinks-juices", description: "Fresh juices, soft drinks, tender coconut water", image: "🥤", type: "product", color: "bg-sky-100 text-sky-800", published: true, orderIndex: 5, subcategories: ["Fruit Juices", "Soft Drinks", "Energy Drinks"] },
  { id: 6, name: "Organic & Wellness", slug: "organic-wellness", description: "Pure honey, herbal teas, dry fruits & superfoods", image: "🍯", type: "product", color: "bg-yellow-100 text-yellow-800", published: true, orderIndex: 6, subcategories: ["Pure Honey", "Herbal Supplements", "Dry Fruits"] },
  { id: 7, name: "Pharmacy & First Aid", slug: "pharmacy", description: "Over the counter medicines, sanitizers & vitamins", image: "💊", type: "product", color: "bg-rose-100 text-rose-800", published: true, orderIndex: 7, subcategories: ["Pain Relief", "First Aid", "Vitamins & Minerals"] },
  { id: 8, name: "Home & Local Services", slug: "home-services", description: "Electricians, plumbers, deep cleaners & carpenters", image: "🔧", type: "service", color: "bg-indigo-100 text-indigo-800", published: true, orderIndex: 8, subcategories: ["Electrical Fixes", "Plumbing", "Deep Cleaning", "Appliance Repair"] },
  { id: 9, name: "Workshops & Classes", slug: "workshops-classes", description: "Art & craft workshops, pottery, yoga & wellness", image: "🎨", type: "booking", color: "bg-purple-100 text-purple-800", published: true, orderIndex: 9, subcategories: ["Clay Pottery", "Painting", "Yoga & Meditation"] },
  { id: 10, name: "Doctor Consultations", slug: "doctor-consultations", description: "General medicine, pediatric, dental & specialists", image: "🩺", type: "booking", color: "bg-teal-100 text-teal-800", published: true, orderIndex: 10, subcategories: ["General Physician", "Pediatrics", "Dental Care", "Orthopedic"] },
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
    status: "CONFIRMED",
    published: true,
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80",
    location: "Studio 4B, Indiranagar, Bengaluru",
    description: "Hands-on pottery on electric wheel, glazing techniques, and take home 2 finished pots.",
    createdAt: "2026-02-01",
  },
  {
    id: 2,
    title: "General Physician Health Consultation Slot",
    type: "doctor",
    category: "Healthcare",
    instructorOrDoctor: "Dr. Arvind Rao (MD, General Med)",
    price: 500,
    schedule: "Mon-Sat, 9:00 AM - 2:00 PM",
    duration: "20 Mins",
    capacity: 25,
    enrolledCount: 14,
    status: "CONFIRMED",
    published: true,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80",
    location: "EzyHealth Clinic, Koramangala, Bengaluru",
    description: "Complete clinical examination, vitals review, diagnostic prescriptions & lifestyle guidance.",
    createdAt: "2026-02-03",
  },
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
];

const initialOwnerSettings: OwnerSettings = {
  brandName: "ezy1",
  tagline: "Everything You Need, One Platform",
  ownerName: "Navya / Alka & Rahul Yadav",
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
  cancellationPolicy: "Orders can be cancelled free of charge within 60 seconds of order placement. Workshop bookings are refundable up to 24 hours prior.",
  whatsappConnected: true,
  whatsappWebhookStatus: "Connected",
};

// ==========================================
// 3. STORE STATE & METHODS
// ==========================================

export interface StoreState {
  // Domain Data Arrays
  shops: StoredShop[];
  partnerApplications: StoredPartnerApplication[];
  products: StoredProduct[];
  services: StoredService[];
  serviceProviders: StoredServiceProvider[];
  bookings: StoredBooking[];
  doctors: StoredDoctor[];
  hospitals: StoredHospital[];
  hospitalBeds: StoredHospitalBed[];
  transportListings: StoredTransportListing[];
  orders: StoredOrder[];
  coupons: StoredCoupon[];
  customers: StoredCustomer[];
  supportTickets: StoredSupportTicket[];
  disputes: StoredDispute[];
  deliveryPartners: StoredDeliveryPartner[];
  deliveryZones: StoredDeliveryZone[];
  transactions: StoredTransaction[];
  refunds: StoredRefund[];
  partnerPayouts: StoredPartnerPayout[];
  enquiries: StoredEnquiry[];
  categories: StoredCategory[];
  gallery: StoredGalleryItem[];
  reviews: StoredReview[];
  heroSlides: StoredHeroSlide[];
  faqs: StoredFaq[];
  auditLogs: StoredAuditLog[];
  liveEvents: StoredLiveEvent[];
  settings: OwnerSettings;

  // Shop Methods
  addShop: (shop: Omit<StoredShop, "id" | "joinedAt">) => StoredShop;
  updateShop: (id: number, updates: Partial<StoredShop>) => void;
  deleteShop: (id: number) => void;

  // Partner Application Methods
  updateApplicationStatus: (id: number, status: StoredPartnerApplication["status"], notes?: string) => void;
  deleteApplication: (id: number) => void;

  // Product Methods
  addProduct: (product: Omit<StoredProduct, "id" | "createdAt">) => StoredProduct;
  updateProduct: (id: number, updates: Partial<StoredProduct>) => void;
  deleteProduct: (id: number) => void;
  toggleProductPublish: (id: number) => void;
  bulkUpdateProducts: (ids: number[], updates: Partial<StoredProduct>) => void;

  // Service & Specialist Methods
  addService: (service: Omit<StoredService, "id" | "createdAt">) => StoredService;
  updateService: (id: number, updates: Partial<StoredService>) => void;
  deleteService: (id: number) => void;
  toggleServicePublish: (id: number) => void;
  addServiceProvider: (provider: Omit<StoredServiceProvider, "id" | "joinedAt">) => StoredServiceProvider;
  updateServiceProvider: (id: number, updates: Partial<StoredServiceProvider>) => void;

  // Healthcare Methods
  addDoctor: (doc: Omit<StoredDoctor, "id">) => StoredDoctor;
  updateDoctor: (id: number, updates: Partial<StoredDoctor>) => void;
  deleteDoctor: (id: number) => void;
  updateHospitalBedCount: (bedId: number, availableBeds: number, occupiedBeds: number) => void;

  // Transport Methods
  addTransportListing: (t: Omit<StoredTransportListing, "id">) => StoredTransportListing;
  updateTransportListing: (id: number, updates: Partial<StoredTransportListing>) => void;
  deleteTransportListing: (id: number) => void;

  // Bookings Methods
  addBooking: (booking: Omit<StoredBooking, "id" | "createdAt">) => StoredBooking;
  updateBooking: (id: number, updates: Partial<StoredBooking>) => void;
  deleteBooking: (id: number) => void;
  toggleBookingPublish: (id: number) => void;

  // Order Methods
  addOrder: (order: Omit<StoredOrder, "id" | "createdAt" | "orderNumber" | "timeline">) => StoredOrder;
  updateOrderStatus: (id: number, status: StoredOrder["status"], note?: string) => void;
  updateOrderPaymentStatus: (id: number, status: StoredOrder["paymentStatus"]) => void;
  assignDriverToOrder: (orderId: number, driverId: number, driverName: string) => void;
  deleteOrder: (id: number) => void;

  // Coupons & Deals Methods
  addCoupon: (coupon: Omit<StoredCoupon, "id" | "usedCount">) => StoredCoupon;
  updateCoupon: (id: number, updates: Partial<StoredCoupon>) => void;
  deleteCoupon: (id: number) => void;

  // Customer & Support & Enquiry Methods
  addCustomer: (cust: Omit<StoredCustomer, "id" | "joinedAt">) => StoredCustomer;
  updateCustomer: (id: number, updates: Partial<StoredCustomer>) => void;
  deleteCustomer: (id: number) => void;
  addSupportTicket: (ticket: Omit<StoredSupportTicket, "id" | "ticketNumber" | "createdAt">) => StoredSupportTicket;
  updateSupportTicketStatus: (id: number, status: StoredSupportTicket["status"]) => void;
  replyToSupportTicket: (ticketId: number, text: string) => void;
  updateDisputeStatus: (id: number, status: StoredDispute["status"], notes?: string) => void;
  addEnquiry: (enquiry: Omit<StoredEnquiry, "id" | "createdAt">) => StoredEnquiry;
  updateEnquiryStatus: (id: number, status: StoredEnquiry["status"], notes?: string) => void;
  deleteEnquiry: (id: number) => void;

  // Delivery Methods
  addDeliveryPartner: (driver: Omit<StoredDeliveryPartner, "id" | "joinedAt">) => StoredDeliveryPartner;
  updateDeliveryPartner: (id: number, updates: Partial<StoredDeliveryPartner>) => void;
  addDeliveryZone: (zone: Omit<StoredDeliveryZone, "id">) => StoredDeliveryZone;
  updateDeliveryZone: (id: number, updates: Partial<StoredDeliveryZone>) => void;

  // Finance & Refunds Methods
  processRefund: (refundId: number, approve: boolean) => void;
  approvePayout: (payoutId: number) => void;

  // Categories & Content Methods
  addCategory: (category: Omit<StoredCategory, "id">) => StoredCategory;
  updateCategory: (id: number, updates: Partial<StoredCategory>) => void;
  deleteCategory: (id: number) => void;
  toggleCategoryPublish: (id: number) => void;
  addGalleryItem: (item: Omit<StoredGalleryItem, "id" | "uploadedAt">) => StoredGalleryItem;
  deleteGalleryItem: (id: number) => void;
  toggleGalleryPublish: (id: number) => void;
  updateReview: (id: number, updates: Partial<StoredReview>) => void;
  deleteReview: (id: number) => void;
  replyToReview: (id: number, reply: string) => void;
  addHeroSlide: (slide: Omit<StoredHeroSlide, "id">) => StoredHeroSlide;
  updateHeroSlide: (id: number, updates: Partial<StoredHeroSlide>) => void;
  deleteHeroSlide: (id: number) => void;
  addFaq: (faq: Omit<StoredFaq, "id">) => StoredFaq;
  updateFaq: (id: number, updates: Partial<StoredFaq>) => void;
  deleteFaq: (id: number) => void;

  // Audit Logging
  logAuditEvent: (action: string, entityType: string, entityId: string | number, details: string) => void;

  // Settings & Utilities
  updateSettings: (updates: Partial<OwnerSettings>) => void;
  resetToDefaults: () => void;
  exportDatabaseJson: () => string;
  importDatabaseJson: (jsonString: string) => boolean;
}

export const useStoreData = create<StoreState>()(
  persist(
    (set, get) => ({
      shops: initialShops,
      partnerApplications: initialPartnerApplications,
      products: initialProducts,
      services: initialServices,
      serviceProviders: [],
      bookings: initialBookings,
      doctors: initialDoctors,
      hospitals: initialHospitals,
      hospitalBeds: initialHospitalBeds,
      transportListings: initialTransportListings,
      orders: initialOrders,
      coupons: initialCoupons,
      customers: initialCustomers,
      supportTickets: initialSupportTickets,
      disputes: initialDisputes,
      enquiries: [
        {
          id: 1,
          customerName: "Rajiv Singhania",
          name: "Rajiv Singhania",
          email: "rajiv@singhania.com",
          phone: "9812345678",
          subject: "Bulk Corporate Gifting Inquiry",
          message: "Interested in ordering 200 artisanal pottery sets and sweet hampers for Diwali.",
          serviceType: "Bulk Orders",
          status: "new",
          createdAt: "2026-08-14",
        },
      ],
      deliveryPartners: initialDeliveryPartners,
      deliveryZones: [{ id: 1, name: "Indiranagar Core Zone", city: "Bengaluru", radiusKm: 6, active: true }],
      transactions: initialTransactions,
      refunds: [
        { id: 1, refundId: "REF-2026-001", orderNumber: "EZY-2026-0798", customerName: "Sneha Mukherjee", amount: 120, reason: "Damaged packing in transit", status: "PENDING", requestedAt: "2026-08-14" }
      ],
      partnerPayouts: [
        { id: 1, partnerId: 1, partnerName: "Sharma Kirana Store", grossSales: 84500, commissionDeducted: 4225, adjustments: 0, netPayout: 80275, status: "APPROVED", period: "Aug 01 - Aug 10, 2026", payoutDate: "2026-08-12" },
        { id: 2, partnerId: 2, partnerName: "Nair Ayurveda Pharma", grossSales: 62100, commissionDeducted: 3105, adjustments: 0, netPayout: 58995, status: "PENDING", period: "Aug 01 - Aug 10, 2026", payoutDate: "2026-08-15" }
      ],
      categories: initialCategories,
      gallery: initialGallery,
      reviews: initialReviews,
      heroSlides: initialHeroSlides,
      faqs: initialFaqs,
      auditLogs: initialAuditLogs,
      liveEvents: initialLiveEvents,
      settings: initialOwnerSettings,

      // Shops
      addShop: (data) => {
        const nextId = Math.max(...get().shops.map((s) => s.id), 0) + 1;
        const newShop: StoredShop = {
          ...data,
          id: nextId,
          joinedAt: new Date().toISOString().split("T")[0],
        };
        set({ shops: [newShop, ...get().shops] });
        get().logAuditEvent("CREATE_SHOP", "Shop", nextId, `Created shop "${data.businessName}"`);
        return newShop;
      },
      updateShop: (id, updates) => {
        set({ shops: get().shops.map((s) => (s.id === id ? { ...s, ...updates } : s)) });
        get().logAuditEvent("UPDATE_SHOP", "Shop", id, `Updated shop #${id} settings`);
      },
      deleteShop: (id) => {
        const shop = get().shops.find((s) => s.id === id);
        set({ shops: get().shops.filter((s) => s.id !== id) });
        get().logAuditEvent("DELETE_SHOP", "Shop", id, `Deleted shop "${shop?.businessName}"`);
      },

      // Partner Applications
      updateApplicationStatus: (id, status, notes) => {
        set({
          partnerApplications: get().partnerApplications.map((a) =>
            a.id === id ? { ...a, status, ...(notes ? { notes } : {}) } : a
          ),
        });
        get().logAuditEvent("UPDATE_APPLICATION", "PartnerApplication", id, `Application marked as ${status}`);
      },
      deleteApplication: (id) => {
        set({ partnerApplications: get().partnerApplications.filter((a) => a.id !== id) });
      },

      // Products
      addProduct: (data) => {
        const nextId = Math.max(...get().products.map((p) => p.id), 0) + 1;
        const newProduct: StoredProduct = {
          ...data,
          id: nextId,
          createdAt: new Date().toISOString().split("T")[0],
        };
        set({ products: [newProduct, ...get().products] });
        get().logAuditEvent("CREATE_PRODUCT", "Product", nextId, `Added product "${data.name}"`);
        return newProduct;
      },
      updateProduct: (id, updates) => {
        set({ products: get().products.map((p) => (p.id === id ? { ...p, ...updates } : p)) });
        get().logAuditEvent("UPDATE_PRODUCT", "Product", id, `Updated product details`);
      },
      deleteProduct: (id) => {
        const p = get().products.find((item) => item.id === id);
        set({ products: get().products.filter((item) => item.id !== id) });
        get().logAuditEvent("DELETE_PRODUCT", "Product", id, `Deleted product "${p?.name}"`);
      },
      toggleProductPublish: (id) => {
        set({
          products: get().products.map((p) => (p.id === id ? { ...p, published: !p.published } : p)),
        });
      },
      bulkUpdateProducts: (ids, updates) => {
        set({
          products: get().products.map((p) => (ids.includes(p.id) ? { ...p, ...updates } : p)),
        });
        get().logAuditEvent("BULK_UPDATE_PRODUCTS", "Product", ids.join(","), `Bulk updated ${ids.length} products`);
      },

      // Services & Specialists
      addService: (data) => {
        const nextId = Math.max(...get().services.map((s) => s.id), 0) + 1;
        const newSvc: StoredService = { ...data, id: nextId, createdAt: new Date().toISOString().split("T")[0] };
        set({ services: [newSvc, ...get().services] });
        get().logAuditEvent("CREATE_SERVICE", "Service", nextId, `Created service "${data.name}"`);
        return newSvc;
      },
      updateService: (id, updates) => {
        set({ services: get().services.map((s) => (s.id === id ? { ...s, ...updates } : s)) });
      },
      deleteService: (id) => {
        set({ services: get().services.filter((s) => s.id !== id) });
      },
      toggleServicePublish: (id) => {
        set({
          services: get().services.map((s) => (s.id === id ? { ...s, published: !s.published } : s)),
        });
      },
      addServiceProvider: (data) => {
        const nextId = Math.max(...get().serviceProviders.map((sp) => sp.id), 0) + 1;
        const newSp: StoredServiceProvider = { ...data, id: nextId, joinedAt: new Date().toISOString().split("T")[0] };
        set({ serviceProviders: [newSp, ...get().serviceProviders] });
        return newSp;
      },
      updateServiceProvider: (id, updates) => {
        set({
          serviceProviders: get().serviceProviders.map((sp) => (sp.id === id ? { ...sp, ...updates } : sp)),
        });
      },

      // Healthcare
      addDoctor: (data) => {
        const nextId = Math.max(...get().doctors.map((d) => d.id), 0) + 1;
        const doc: StoredDoctor = { ...data, id: nextId };
        set({ doctors: [doc, ...get().doctors] });
        get().logAuditEvent("ADD_DOCTOR", "Doctor", nextId, `Added doctor "${data.name}"`);
        return doc;
      },
      updateDoctor: (id, updates) => {
        set({ doctors: get().doctors.map((d) => (d.id === id ? { ...d, ...updates } : d)) });
      },
      deleteDoctor: (id) => {
        set({ doctors: get().doctors.filter((d) => d.id !== id) });
      },
      updateHospitalBedCount: (bedId, availableBeds, occupiedBeds) => {
        set({
          hospitalBeds: get().hospitalBeds.map((b) =>
            b.id === bedId
              ? { ...b, availableBeds, occupiedBeds, lastUpdated: "Just now" }
              : b
          ),
        });
        get().logAuditEvent("UPDATE_BEDS", "HospitalBed", bedId, `Updated available beds to ${availableBeds}`);
      },

      // Transport
      addTransportListing: (data) => {
        const nextId = Math.max(...get().transportListings.map((t) => t.id), 0) + 1;
        const listing: StoredTransportListing = { ...data, id: nextId };
        set({ transportListings: [listing, ...get().transportListings] });
        return listing;
      },
      updateTransportListing: (id, updates) => {
        set({
          transportListings: get().transportListings.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        });
      },
      deleteTransportListing: (id) => {
        set({ transportListings: get().transportListings.filter((t) => t.id !== id) });
      },

      // Bookings
      addBooking: (data) => {
        const nextId = Math.max(...get().bookings.map((b) => b.id), 0) + 1;
        const newBooking: StoredBooking = { ...data, id: nextId, createdAt: new Date().toISOString().split("T")[0] };
        set({ bookings: [newBooking, ...get().bookings] });
        get().logAuditEvent("CREATE_BOOKING", "Booking", nextId, `Created session "${data.title}"`);
        return newBooking;
      },
      updateBooking: (id, updates) => {
        set({ bookings: get().bookings.map((b) => (b.id === id ? { ...b, ...updates } : b)) });
      },
      deleteBooking: (id) => {
        set({ bookings: get().bookings.filter((b) => b.id !== id) });
      },

      // Orders
      addOrder: (data) => {
        const nextId = Math.max(...get().orders.map((o) => o.id), 0) + 1;
        const orderNumber = `EZY-${new Date().getFullYear()}-${String(nextId).padStart(4, "0")}`;
        const newOrder: StoredOrder = {
          ...data,
          id: nextId,
          orderNumber,
          timeline: [{ status: data.status, timestamp: "Just now", note: "Order initiated" }],
          createdAt: new Date().toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }),
        };
        set({ orders: [newOrder, ...get().orders] });
        get().logAuditEvent("NEW_ORDER", "Order", orderNumber, `New order created for ₹${data.totalAmount}`);
        return newOrder;
      },
      updateOrderStatus: (id, status, note) => {
        set({
          orders: get().orders.map((o) => {
            if (o.id === id) {
              const newTimeline = [
                ...o.timeline,
                { status, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), note },
              ];
              return { ...o, status, timeline: newTimeline };
            }
            return o;
          }),
        });
        get().logAuditEvent("ORDER_STATUS", "Order", id, `Order marked as ${status}`);
      },
      updateOrderPaymentStatus: (id, paymentStatus) => {
        set({ orders: get().orders.map((o) => (o.id === id ? { ...o, paymentStatus } : o)) });
      },
      assignDriverToOrder: (orderId, driverId, driverName) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  assignedDriverId: driverId,
                  assignedDriverName: driverName,
                  status: "OUT_FOR_DELIVERY",
                  timeline: [
                    ...o.timeline,
                    { status: "OUT_FOR_DELIVERY", timestamp: "Just now", note: `Assigned to rider ${driverName}` },
                  ],
                }
              : o
          ),
        });
        get().logAuditEvent("ASSIGN_DRIVER", "Order", orderId, `Assigned to rider ${driverName}`);
      },
      deleteOrder: (id) => {
        set({ orders: get().orders.filter((o) => o.id !== id) });
      },

      // Coupons
      addCoupon: (data) => {
        const nextId = Math.max(...get().coupons.map((c) => c.id), 0) + 1;
        const coupon: StoredCoupon = { ...data, id: nextId, usedCount: 0 };
        set({ coupons: [coupon, ...get().coupons] });
        get().logAuditEvent("CREATE_COUPON", "Coupon", data.code, `Created coupon code ${data.code}`);
        return coupon;
      },
      updateCoupon: (id, updates) => {
        set({ coupons: get().coupons.map((c) => (c.id === id ? { ...c, ...updates } : c)) });
      },
      deleteCoupon: (id) => {
        set({ coupons: get().coupons.filter((c) => c.id !== id) });
      },

      // Customers & Support
      addCustomer: (data) => {
        const nextId = Math.max(...get().customers.map((c) => c.id), 0) + 1;
        const customer: StoredCustomer = { ...data, id: nextId, joinedAt: new Date().toISOString().split("T")[0] };
        set({ customers: [customer, ...get().customers] });
        return customer;
      },
      updateCustomer: (id, updates) => {
        set({ customers: get().customers.map((c) => (c.id === id ? { ...c, ...updates } : c)) });
      },
      deleteCustomer: (id) => {
        set({ customers: get().customers.filter((c) => c.id !== id) });
      },
      addSupportTicket: (data) => {
        const nextId = Math.max(...get().supportTickets.map((t) => t.id), 0) + 1;
        const ticketNumber = `TCK-${new Date().getFullYear()}-${String(nextId).padStart(3, "0")}`;
        const ticket: StoredSupportTicket = {
          ...data,
          id: nextId,
          ticketNumber,
          createdAt: new Date().toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }),
        };
        set({ supportTickets: [ticket, ...get().supportTickets] });
        return ticket;
      },
      updateSupportTicketStatus: (id, status) => {
        set({ supportTickets: get().supportTickets.map((t) => (t.id === id ? { ...t, status } : t)) });
      },
      replyToSupportTicket: (ticketId, text) => {
        set({
          supportTickets: get().supportTickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  messages: [
                    ...t.messages,
                    {
                      sender: "admin",
                      text,
                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    },
                  ],
                }
              : t
          ),
        });
      },
      updateDisputeStatus: (id, status, notes) => {
        set({
          disputes: get().disputes.map((d) => (d.id === id ? { ...d, status, ...(notes ? { resolutionNotes: notes } : {}) } : d)),
        });
      },

      // Delivery
      addDeliveryPartner: (data) => {
        const nextId = Math.max(...get().deliveryPartners.map((dp) => dp.id), 0) + 1;
        const partner: StoredDeliveryPartner = { ...data, id: nextId, joinedAt: new Date().toISOString().split("T")[0] };
        set({ deliveryPartners: [partner, ...get().deliveryPartners] });
        return partner;
      },
      updateDeliveryPartner: (id, updates) => {
        set({
          deliveryPartners: get().deliveryPartners.map((dp) => (dp.id === id ? { ...dp, ...updates } : dp)),
        });
      },
      addDeliveryZone: (data) => {
        const nextId = Math.max(...get().deliveryZones.map((z) => z.id), 0) + 1;
        const zone: StoredDeliveryZone = { ...data, id: nextId };
        set({ deliveryZones: [...get().deliveryZones, zone] });
        return zone;
      },
      updateDeliveryZone: (id, updates) => {
        set({ deliveryZones: get().deliveryZones.map((z) => (z.id === id ? { ...z, ...updates } : z)) });
      },

      // Finance
      processRefund: (refundId, approve) => {
        set({
          refunds: get().refunds.map((r) =>
            r.id === refundId
              ? {
                  ...r,
                  status: approve ? "PROCESSED" : "REJECTED",
                  processedAt: new Date().toISOString().split("T")[0],
                }
              : r
          ),
        });
        get().logAuditEvent("PROCESS_REFUND", "Refund", refundId, approve ? "Refund approved & credited" : "Refund request rejected");
      },
      approvePayout: (payoutId) => {
        set({
          partnerPayouts: get().partnerPayouts.map((p) =>
            p.id === payoutId ? { ...p, status: "PROCESSED", payoutDate: new Date().toISOString().split("T")[0] } : p
          ),
        });
        get().logAuditEvent("APPROVE_PAYOUT", "PartnerPayout", payoutId, `Payout approved and disbursed`);
      },

      toggleBookingPublish: (id) => {
        set({
          bookings: get().bookings.map((b) => (b.id === id ? { ...b, published: !b.published } : b)),
        });
      },

      // Enquiries
      addEnquiry: (data) => {
        const nextId = Math.max(...get().enquiries.map((e) => e.id), 0) + 1;
        const enq: StoredEnquiry = { ...data, id: nextId, createdAt: new Date().toISOString().split("T")[0] };
        set({ enquiries: [enq, ...get().enquiries] });
        get().logAuditEvent("CREATE_ENQUIRY", "Enquiry", nextId, `New customer enquiry from ${data.customerName || data.name}`);
        return enq;
      },
      updateEnquiryStatus: (id, status, notes) => {
        set({
          enquiries: get().enquiries.map((e) =>
            e.id === id ? { ...e, status, ...(notes !== undefined ? { notes } : {}) } : e
          ),
        });
      },
      deleteEnquiry: (id) => {
        set({ enquiries: get().enquiries.filter((e) => e.id !== id) });
      },

      // Categories, Gallery, Reviews, CMS
      addCategory: (data) => {
        const nextId = Math.max(...get().categories.map((c) => c.id), 0) + 1;
        const cat: StoredCategory = { ...data, id: nextId };
        set({ categories: [...get().categories, cat] });
        get().logAuditEvent("CREATE_CATEGORY", "Category", nextId, `Added category "${data.name}"`);
        return cat;
      },
      updateCategory: (id, updates) => {
        set({ categories: get().categories.map((c) => (c.id === id ? { ...c, ...updates } : c)) });
      },
      deleteCategory: (id) => {
        set({ categories: get().categories.filter((c) => c.id !== id) });
      },
      toggleCategoryPublish: (id) => {
        set({
          categories: get().categories.map((c) => (c.id === id ? { ...c, published: !c.published } : c)),
        });
      },
      addGalleryItem: (data) => {
        const nextId = Math.max(...get().gallery.map((g) => g.id), 0) + 1;
        const item: StoredGalleryItem = { ...data, id: nextId, uploadedAt: new Date().toISOString().split("T")[0] };
        set({ gallery: [item, ...get().gallery] });
        return item;
      },
      deleteGalleryItem: (id) => {
        set({ gallery: get().gallery.filter((g) => g.id !== id) });
      },
      toggleGalleryPublish: (id) => {
        set({
          gallery: get().gallery.map((g) => (g.id === id ? { ...g, published: !g.published } : g)),
        });
      },
      updateReview: (id, updates) => {
        set({ reviews: get().reviews.map((r) => (r.id === id ? { ...r, ...updates } : r)) });
      },
      deleteReview: (id) => {
        set({ reviews: get().reviews.filter((r) => r.id !== id) });
      },
      replyToReview: (id, reply) => {
        set({ reviews: get().reviews.map((r) => (r.id === id ? { ...r, reply } : r)) });
      },
      addHeroSlide: (data) => {
        const nextId = Math.max(...get().heroSlides.map((s) => s.id), 0) + 1;
        const slide: StoredHeroSlide = { ...data, id: nextId };
        set({ heroSlides: [...get().heroSlides, slide] });
        return slide;
      },
      updateHeroSlide: (id, updates) => {
        set({ heroSlides: get().heroSlides.map((s) => (s.id === id ? { ...s, ...updates } : s)) });
      },
      deleteHeroSlide: (id) => {
        set({ heroSlides: get().heroSlides.filter((s) => s.id !== id) });
      },
      addFaq: (data) => {
        const nextId = Math.max(...get().faqs.map((f) => f.id), 0) + 1;
        const faq: StoredFaq = { ...data, id: nextId };
        set({ faqs: [...get().faqs, faq] });
        return faq;
      },
      updateFaq: (id, updates) => {
        set({ faqs: get().faqs.map((f) => (f.id === id ? { ...f, ...updates } : f)) });
      },
      deleteFaq: (id) => {
        set({ faqs: get().faqs.filter((f) => f.id !== id) });
      },

      // Audit Log Event Recorder
      logAuditEvent: (action, entityType, entityId, details) => {
        const nextId = Math.max(...get().auditLogs.map((l) => l.id), 0) + 1;
        const log: StoredAuditLog = {
          id: nextId,
          adminName: "Super Admin",
          adminRole: "SUPER_ADMIN",
          action,
          entityType,
          entityId,
          details,
          timestamp: new Date().toLocaleString(),
          ipAddress: "127.0.0.1",
        };
        set({ auditLogs: [log, ...get().auditLogs.slice(0, 99)] });
      },

      // Settings
      updateSettings: (updates) => {
        set({ settings: { ...get().settings, ...updates } });
        get().logAuditEvent("UPDATE_SETTINGS", "OwnerSettings", "Global", "Updated platform master settings");
      },

      // Global Reset & JSON Backup/Restore
      resetToDefaults: () => {
        set({
          shops: initialShops,
          partnerApplications: initialPartnerApplications,
          products: initialProducts,
          services: initialServices,
          serviceProviders: [],
          bookings: initialBookings,
          doctors: initialDoctors,
          hospitals: initialHospitals,
          hospitalBeds: initialHospitalBeds,
          transportListings: initialTransportListings,
          orders: initialOrders,
          coupons: initialCoupons,
          customers: initialCustomers,
          supportTickets: initialSupportTickets,
          disputes: initialDisputes,
          deliveryPartners: initialDeliveryPartners,
          deliveryZones: [{ id: 1, name: "Indiranagar Core Zone", city: "Bengaluru", radiusKm: 6, active: true }],
          transactions: initialTransactions,
          refunds: [
            { id: 1, refundId: "REF-2026-001", orderNumber: "EZY-2026-0798", customerName: "Sneha Mukherjee", amount: 120, reason: "Damaged packing in transit", status: "PENDING", requestedAt: "2026-08-14" }
          ],
          partnerPayouts: [
            { id: 1, partnerId: 1, partnerName: "Sharma Kirana Store", grossSales: 84500, commissionDeducted: 4225, adjustments: 0, netPayout: 80275, status: "APPROVED", period: "Aug 01 - Aug 10, 2026", payoutDate: "2026-08-12" },
            { id: 2, partnerId: 2, partnerName: "Nair Ayurveda Pharma", grossSales: 62100, commissionDeducted: 3105, adjustments: 0, netPayout: 58995, status: "PENDING", period: "Aug 01 - Aug 10, 2026", payoutDate: "2026-08-15" }
          ],
          categories: initialCategories,
          gallery: initialGallery,
          reviews: initialReviews,
          heroSlides: initialHeroSlides,
          faqs: initialFaqs,
          auditLogs: initialAuditLogs,
          liveEvents: initialLiveEvents,
          settings: initialOwnerSettings,
        });
      },

      exportDatabaseJson: () => {
        const state = get();
        return JSON.stringify(
          {
            shops: state.shops,
            partnerApplications: state.partnerApplications,
            products: state.products,
            services: state.services,
            bookings: state.bookings,
            doctors: state.doctors,
            hospitals: state.hospitals,
            hospitalBeds: state.hospitalBeds,
            transportListings: state.transportListings,
            orders: state.orders,
            coupons: state.coupons,
            customers: state.customers,
            supportTickets: state.supportTickets,
            disputes: state.disputes,
            deliveryPartners: state.deliveryPartners,
            deliveryZones: state.deliveryZones,
            transactions: state.transactions,
            refunds: state.refunds,
            partnerPayouts: state.partnerPayouts,
            categories: state.categories,
            gallery: state.gallery,
            reviews: state.reviews,
            heroSlides: state.heroSlides,
            faqs: state.faqs,
            auditLogs: state.auditLogs,
            settings: state.settings,
            exportTimestamp: new Date().toISOString(),
          },
          null,
          2
        );
      },

      importDatabaseJson: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString);
          set({
            ...(parsed.shops ? { shops: parsed.shops } : {}),
            ...(parsed.partnerApplications ? { partnerApplications: parsed.partnerApplications } : {}),
            ...(parsed.products ? { products: parsed.products } : {}),
            ...(parsed.services ? { services: parsed.services } : {}),
            ...(parsed.bookings ? { bookings: parsed.bookings } : {}),
            ...(parsed.doctors ? { doctors: parsed.doctors } : {}),
            ...(parsed.hospitals ? { hospitals: parsed.hospitals } : {}),
            ...(parsed.hospitalBeds ? { hospitalBeds: parsed.hospitalBeds } : {}),
            ...(parsed.transportListings ? { transportListings: parsed.transportListings } : {}),
            ...(parsed.orders ? { orders: parsed.orders } : {}),
            ...(parsed.coupons ? { coupons: parsed.coupons } : {}),
            ...(parsed.customers ? { customers: parsed.customers } : {}),
            ...(parsed.supportTickets ? { supportTickets: parsed.supportTickets } : {}),
            ...(parsed.disputes ? { disputes: parsed.disputes } : {}),
            ...(parsed.deliveryPartners ? { deliveryPartners: parsed.deliveryPartners } : {}),
            ...(parsed.deliveryZones ? { deliveryZones: parsed.deliveryZones } : {}),
            ...(parsed.transactions ? { transactions: parsed.transactions } : {}),
            ...(parsed.refunds ? { refunds: parsed.refunds } : {}),
            ...(parsed.partnerPayouts ? { partnerPayouts: parsed.partnerPayouts } : {}),
            ...(parsed.categories ? { categories: parsed.categories } : {}),
            ...(parsed.gallery ? { gallery: parsed.gallery } : {}),
            ...(parsed.reviews ? { reviews: parsed.reviews } : {}),
            ...(parsed.heroSlides ? { heroSlides: parsed.heroSlides } : {}),
            ...(parsed.faqs ? { faqs: parsed.faqs } : {}),
            ...(parsed.settings ? { settings: parsed.settings } : {}),
          });
          return true;
        } catch (e) {
          console.error("Failed to import JSON:", e);
          return false;
        }
      },
    }),
    {
      name: "ezy1_complete_platform_os_v3",
    }
  )
);
