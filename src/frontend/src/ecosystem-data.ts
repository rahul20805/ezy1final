/**
 * EZY1 Ecosystem Centralized Category & Catalog Data
 * Comprehensive consumer-first local super-app catalog covering all everyday needs.
 */

export interface SuperCategory {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  color: string;
  route: string;
  badge?: string;
  group: "SHOP" | "FOOD" | "HEALTH" | "MOBILITY" | "SERVICES" | "LOCAL";
  isAgeRestricted?: boolean;
}

export const SUPER_CATEGORIES: SuperCategory[] = [
  // SHOP
  { id: "grocery", name: "Grocery", icon: "🛒", tagline: "Atta, Dal, Oil, Spices & Daily Essentials", color: "emerald", route: "/category/grocery", badge: "Essentials", group: "SHOP" },
  { id: "fruits", name: "Fruits", icon: "🍎", tagline: "Farm Fresh Apples, Mangoes & Combos", color: "rose", route: "/category/fruits", badge: "Farm Fresh", group: "SHOP" },
  { id: "vegetables", name: "Vegetables", icon: "🥦", tagline: "Fresh Greens, Onions, Potatoes & Herbs", color: "green", route: "/category/vegetables", badge: "Daily Harvest", group: "SHOP" },
  { id: "quick", name: "Quick Commerce", icon: "⚡", tagline: "Delivered in 10-15 Minutes", color: "amber", route: "/dashboard/commerce", badge: "15 Mins", group: "SHOP" },
  { id: "books", name: "Books & Stationery", icon: "📚", tagline: "Academic, Fiction, Exams & Pens", color: "indigo", route: "/category/books", group: "SHOP" },
  { id: "electronics", name: "Electronics", icon: "📱", tagline: "Mobiles, Laptops, Audio & Accessories", color: "blue", route: "/category/electronics", badge: "Best Deals", group: "SHOP" },
  { id: "fashion", name: "Fashion & Clothes", icon: "👗", tagline: "Men, Women, Kids, Ethnic & Western", color: "pink", route: "/category/fashion", group: "SHOP" },
  { id: "home-kitchen", name: "Home & Kitchen", icon: "🍳", tagline: "Cookware, Storage, Decor & Cleaning", color: "orange", route: "/category/home-kitchen", group: "SHOP" },
  { id: "baby-care", name: "Baby & Mother Care", icon: "👶", tagline: "Diapers, Baby Food & Hygiene", color: "sky", route: "/category/baby-care", group: "SHOP" },
  { id: "pet-care", name: "Pet Care", icon: "🐾", tagline: "Food, Treats, Toys & Grooming", color: "teal", route: "/category/pet-care", group: "SHOP" },
  { id: "sports", name: "Sports & Fitness", icon: "🏋️", tagline: "Gym Gear, Cricket, Yoga & Supplements", color: "red", route: "/category/sports", group: "SHOP" },
  { id: "gifts", name: "Flowers & Gifts", icon: "🎁", tagline: "Fresh Flowers, Cakes & Hampers", color: "purple", route: "/category/gifts", group: "SHOP" },
  { id: "paan", name: "Paan & Convenience", icon: "🍃", tagline: "Mouth Fresheners & Paan (18+)", color: "lime", route: "/category/paan", isAgeRestricted: true, group: "SHOP" },

  // FOOD
  { id: "restaurants", name: "Restaurants", icon: "🍔", tagline: "Biryani, North Indian, Pizza & Street Food", color: "orange", route: "/category/restaurants", badge: "Top Rated", group: "FOOD" },
  { id: "cafe", name: "Cafe & Coffee", icon: "☕", tagline: "Espresso, Cold Brew, Pastries & Snacks", color: "amber", route: "/category/cafe", group: "FOOD" },
  { id: "sweets", name: "Sweets & Desserts", icon: "Gulab Jamun", tagline: "Mithai, Pastries, Ice Creams & Cakes", color: "yellow", route: "/category/sweets", group: "FOOD" },
  { id: "chocolates", name: "Chocolates", icon: "🍫", tagline: "Artisanal, Premium & Gift Boxes", color: "brown", route: "/category/chocolates", group: "FOOD" },

  // HEALTH
  { id: "pharmacy", name: "Pharmacy & Medicines", icon: "💊", tagline: "OTC, Prescriptions & Wellness", color: "teal", route: "/dashboard/healthcare", badge: "Verified", group: "HEALTH" },
  { id: "hospitals", name: "Hospitals & Beds", icon: "🏥", tagline: "Nearby ICU/Beds, Doctors & Ambulance", color: "red", route: "/hospitals", badge: "Live Beds", group: "HEALTH" },
  { id: "doctors", name: "Find a Doctor", icon: "🩺", tagline: "General Physician, Cardiologist & More", color: "cyan", route: "/doctors", group: "HEALTH" },
  { id: "home-doctor", name: "Doctor at Home", icon: "👨‍⚕️", tagline: "Physician & Caregiver Home Visits", color: "blue", route: "/home-healthcare", badge: "At Home", group: "HEALTH" },
  { id: "diagnostics", name: "Lab Tests & Scans", icon: "🔬", tagline: "Full Body Checkups & Home Collection", color: "violet", route: "/diagnostics", group: "HEALTH" },
  { id: "sexual-wellness", name: "Sexual Wellness", icon: "🔒", tagline: "100% Discreet Packaging & Private Care", color: "slate", route: "/category/sexual-wellness", badge: "Discreet", isAgeRestricted: true, group: "HEALTH" },
  { id: "beauty", name: "Beauty & Personal Care", icon: "✨", tagline: "Skincare, Haircare, Makeup & Hygiene", color: "fuchsia", route: "/category/beauty", group: "HEALTH" },

  // MOBILITY & TRANSPORT
  { id: "ride", name: "EZY Ride", icon: "🚕", tagline: "Bike Taxi, Auto & Cabs at Fair Fares", color: "yellow", route: "/dashboard/transport", badge: "Fastest", group: "MOBILITY" },
  { id: "bus", name: "Regional Bus", icon: "🚌", tagline: "City, Intercity & Seat Booking", color: "blue", route: "/bus", badge: "EZY Bus", group: "MOBILITY" },
  { id: "share-ride", name: "Share Ride", icon: "🚗", tagline: "Verified Carpool & Shared Cabs", color: "emerald", route: "/share-ride", badge: "Save 60%", group: "MOBILITY" },
  { id: "parcel", name: "EZY Parcel", icon: "📦", tagline: "Send Packages Anywhere in City", color: "emerald", route: "/parcel", group: "MOBILITY" },

  // STAY & TRAVEL
  { id: "stay", name: "Hotels & Stay", icon: "🏨", tagline: "Hotels, Resorts, Homestays & Hostels", color: "amber", route: "/stays", badge: "EZY Stay", group: "LOCAL" },
  { id: "travel", name: "Travel & Tours", icon: "✈️", tagline: "Tour Packages, Guides & Sightseeing", color: "sky", route: "/travel", badge: "EZY Travel", group: "LOCAL" },
  { id: "explore", name: "Explore City", icon: "🧭", tagline: "Famous Places, Historic Spots & Food", color: "purple", route: "/explore", badge: "City Guide", group: "LOCAL" },

  // SERVICES & LOCAL
  { id: "services", name: "Home Services", icon: "🔧", tagline: "Electrician, Plumber, AC Repair & Cleaning", color: "blue", route: "/services", badge: "Trusted", group: "SERVICES" },
  { id: "local-shops", name: "Local Shops Near You", icon: "🏪", tagline: "Neighbourhood Stores with Direct Contact", color: "zinc", route: "/local-shops", group: "LOCAL" },
  { id: "famous", name: "Famous in Your City", icon: "📍", tagline: "Iconic Food, Heritage Spots & Hidden Gems", color: "red", route: "/famous", badge: "City Specials", group: "LOCAL" },
];

export interface CatalogItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;
  unit: string;
  rating: number;
  reviewCount: number;
  deliveryMinutes: number;
  image: string;
  isVeg?: boolean;
  brand?: string;
  tags: string[];
  specs?: Record<string, string>;
  isAgeRestricted?: boolean;
  isDiscreet?: boolean;
  freshnessScore?: number;
  requiresPrescription?: boolean;
  author?: string;
  cuisine?: string;
}

export const CATALOG_ITEMS: CatalogItem[] = [
  // GROCERY
  {
    id: "g-1",
    categoryId: "grocery",
    name: "Aashirvaad Superior MP Sharbati Atta",
    description: "100% pure whole wheat stone ground flour for extra soft rotis.",
    price: 245,
    mrp: 275,
    unit: "5 kg",
    rating: 4.8,
    reviewCount: 340,
    deliveryMinutes: 15,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60",
    brand: "Aashirvaad",
    isVeg: true,
    tags: ["Atta & Flour", "Kitchen Staples", "Daily Essentials"],
  },
  {
    id: "g-2",
    categoryId: "grocery",
    name: "Daawat Rozana Gold Basmati Rice",
    description: "Rich aroma, long slender grains, aged to perfection.",
    price: 380,
    mrp: 450,
    unit: "5 kg",
    rating: 4.7,
    reviewCount: 220,
    deliveryMinutes: 15,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60",
    brand: "Daawat",
    isVeg: true,
    tags: ["Rice", "Kitchen Staples"],
  },
  {
    id: "g-3",
    categoryId: "grocery",
    name: "Tata Sampann Unpolished Toor Dal",
    description: "Rich in natural protein, no artificial polishing, quick cooking.",
    price: 165,
    mrp: 185,
    unit: "1 kg",
    rating: 4.9,
    reviewCount: 512,
    deliveryMinutes: 15,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60",
    brand: "Tata Sampann",
    isVeg: true,
    tags: ["Dal & Pulses", "Kitchen Staples"],
  },
  {
    id: "g-4",
    categoryId: "grocery",
    name: "Fortune Sunlite Refined Sunflower Oil",
    description: "Light, healthy edible cooking oil with Vitamin A & D.",
    price: 135,
    mrp: 155,
    unit: "1 L",
    rating: 4.6,
    reviewCount: 180,
    deliveryMinutes: 15,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60",
    brand: "Fortune",
    isVeg: true,
    tags: ["Oil & Ghee", "Kitchen Staples"],
  },
  {
    id: "g-5",
    categoryId: "grocery",
    name: "Amul Pasteurised Pure Cow Butter",
    description: "Utterly butterly delicious fresh dairy table butter.",
    price: 58,
    mrp: 60,
    unit: "100 g",
    rating: 4.9,
    reviewCount: 1420,
    deliveryMinutes: 12,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=60",
    brand: "Amul",
    isVeg: true,
    tags: ["Dairy & Bread", "Breakfast"],
  },

  // FRUITS
  {
    id: "f-1",
    categoryId: "fruits",
    name: "Kashmir Royal Gala Apples",
    description: "Sweet, juicy, crisp red apples directly handpicked from orchards.",
    price: 180,
    mrp: 220,
    unit: "1 kg",
    rating: 4.8,
    reviewCount: 310,
    deliveryMinutes: 15,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=60",
    isVeg: true,
    freshnessScore: 98,
    tags: ["Apples", "Fresh Fruits", "Seasonal"],
  },
  {
    id: "f-2",
    categoryId: "fruits",
    name: "Robusta Fresh Bananas",
    description: "Naturally ripened, rich in potassium and energy.",
    price: 45,
    mrp: 55,
    unit: "1 kg (approx 6-7 pcs)",
    rating: 4.7,
    reviewCount: 420,
    deliveryMinutes: 12,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=60",
    isVeg: true,
    freshnessScore: 96,
    tags: ["Bananas", "Fresh Fruits"],
  },
  {
    id: "f-3",
    categoryId: "fruits",
    name: "Ratnagiri Alphonso Mangoes",
    description: "GI-tagged authentic king of mangoes, sweet aromatic pulp.",
    price: 499,
    mrp: 650,
    unit: "1 kg (approx 3-4 pcs)",
    rating: 4.9,
    reviewCount: 190,
    deliveryMinutes: 20,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=60",
    isVeg: true,
    freshnessScore: 99,
    tags: ["Mangoes", "Seasonal Fruits", "Exotic"],
  },

  // VEGETABLES
  {
    id: "v-1",
    categoryId: "vegetables",
    name: "Hybrid Fresh Red Tomatoes",
    description: "Firm, ripe, nutrient-rich farm fresh red tomatoes.",
    price: 32,
    mrp: 40,
    unit: "1 kg",
    rating: 4.6,
    reviewCount: 560,
    deliveryMinutes: 15,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60",
    isVeg: true,
    freshnessScore: 95,
    tags: ["Tomatoes", "Daily Vegetables"],
  },
  {
    id: "v-2",
    categoryId: "vegetables",
    name: "Fresh Nasik Red Onions",
    description: "Crisp and pungent quality onions, kitchen must-have.",
    price: 38,
    mrp: 48,
    unit: "1 kg",
    rating: 4.7,
    reviewCount: 890,
    deliveryMinutes: 15,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=60",
    isVeg: true,
    freshnessScore: 94,
    tags: ["Onions & Potatoes", "Daily Vegetables"],
  },
  {
    id: "v-3",
    categoryId: "vegetables",
    name: "Hydroponic Baby Spinach (Palak)",
    description: "Tender, washed and pesticide-free dark green leafy spinach.",
    price: 28,
    mrp: 35,
    unit: "250 g bunch",
    rating: 4.9,
    reviewCount: 230,
    deliveryMinutes: 15,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=60",
    isVeg: true,
    freshnessScore: 99,
    tags: ["Leafy Vegetables", "Herbs"],
  },

  // RESTAURANTS & FOOD
  {
    id: "r-1",
    categoryId: "restaurants",
    name: "Hyderabadi Special Dum Biryani",
    description: "Slow-cooked fragrant basmati rice with marinated chicken & saffron.",
    price: 280,
    mrp: 320,
    unit: "Serves 1-2",
    rating: 4.8,
    reviewCount: 940,
    deliveryMinutes: 25,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60",
    cuisine: "Hyderabadi",
    isVeg: false,
    brand: "Royal Biryani House",
    tags: ["Biryani", "Main Course", "Popular"],
  },
  {
    id: "r-2",
    categoryId: "restaurants",
    name: "Paneer Butter Masala & Garlic Naan Combo",
    description: "Creamy rich tomato-cashew gravy with soft paneer cubes and 2 butter rotis.",
    price: 220,
    mrp: 260,
    unit: "Full Meal",
    rating: 4.7,
    reviewCount: 650,
    deliveryMinutes: 20,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60",
    cuisine: "North Indian",
    isVeg: true,
    brand: "Punjab Junction",
    tags: ["North Indian", "Meals", "Pure Veg"],
  },

  // CAFE & COFFEE
  {
    id: "c-1",
    categoryId: "cafe",
    name: "Classic Filter Coffee (South Indian Decoction)",
    description: "Authentic double-strength Chicory blended hot filter coffee.",
    price: 45,
    mrp: 50,
    unit: "150 ml Cup",
    rating: 4.9,
    reviewCount: 810,
    deliveryMinutes: 15,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60",
    isVeg: true,
    brand: "Malgudi Coffee Bar",
    tags: ["Coffee", "Hot Beverages", "Morning Special"],
  },
  {
    id: "c-2",
    categoryId: "cafe",
    name: "Hazelnut Cold Coffee & Croissant",
    description: "Chilled blended creamy cold brew paired with flaky butter croissant.",
    price: 180,
    mrp: 210,
    unit: "350 ml + 1 pc",
    rating: 4.8,
    reviewCount: 390,
    deliveryMinutes: 20,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&auto=format&fit=crop&q=60",
    isVeg: true,
    brand: "Cafe Espresso",
    tags: ["Cold Coffee", "Bakery", "Combos"],
  },

  // BOOKS & STATIONERY
  {
    id: "b-1",
    categoryId: "books",
    name: "Atomic Habits by James Clear",
    description: "An easy & proven way to build good habits and break bad ones.",
    price: 399,
    mrp: 599,
    unit: "Paperback",
    rating: 4.9,
    reviewCount: 1890,
    deliveryMinutes: 30,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60",
    author: "James Clear",
    brand: "Penguin Random House",
    tags: ["Self-Help", "Bestseller", "Non-Fiction"],
  },
  {
    id: "b-2",
    categoryId: "books",
    name: "Classmate Pulse Spiral Ruled Notebook (Pack of 3)",
    description: "Premium smooth 70 GSM paper, 300 pages, water-resistant cover.",
    price: 210,
    mrp: 240,
    unit: "Pack of 3",
    rating: 4.7,
    reviewCount: 420,
    deliveryMinutes: 20,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=60",
    brand: "Classmate",
    tags: ["Notebooks", "School & College", "Stationery"],
  },

  // ELECTRONICS
  {
    id: "e-1",
    categoryId: "electronics",
    name: "boAt Airdopes 141 True Wireless Earbuds",
    description: "42H playback, ASAP charge, ENx tech for noise-free calls, IPX4.",
    price: 999,
    mrp: 2990,
    unit: "1 Unit",
    rating: 4.6,
    reviewCount: 2310,
    deliveryMinutes: 25,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
    brand: "boAt",
    specs: { "Battery": "42 Hours", "Connectivity": "Bluetooth 5.1", "Warranty": "1 Year Brand Warranty", "Fast Charge": "5 mins = 75 mins" },
    tags: ["Earphones", "Wireless", "Audio"],
  },
  {
    id: "e-2",
    categoryId: "electronics",
    name: "Mi 10000mAh Power Bank 3i",
    description: "18W fast charging, dual output, metallic body, 12 layer circuit protection.",
    price: 1199,
    mrp: 1499,
    unit: "1 Unit",
    rating: 4.8,
    reviewCount: 1650,
    deliveryMinutes: 20,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&auto=format&fit=crop&q=60",
    brand: "Xiaomi",
    specs: { "Capacity": "10000 mAh", "Output": "18W Fast Charge", "Ports": "Dual USB + Type-C", "Warranty": "6 Months" },
    tags: ["Power Banks", "Mobile Accessories"],
  },

  // FASHION
  {
    id: "fa-1",
    categoryId: "fashion",
    name: "Classic Regular Fit Pure Cotton Crew T-Shirt",
    description: "Breathable, pre-shrunk premium combed cotton for everyday comfort.",
    price: 399,
    mrp: 799,
    unit: "Size: M, L, XL",
    rating: 4.6,
    reviewCount: 310,
    deliveryMinutes: 30,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60",
    brand: "Urban Basics",
    tags: ["Men's Wear", "T-Shirts", "Cotton"],
  },
  {
    id: "fa-2",
    categoryId: "fashion",
    name: "Women's Straight Cotton Kurti with Palazzo",
    description: "Elegant floral printed ethnic wear, lightweight and all-day comfort.",
    price: 699,
    mrp: 1499,
    unit: "Size: S, M, L, XL",
    rating: 4.7,
    reviewCount: 420,
    deliveryMinutes: 30,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=60",
    brand: "Rangriti",
    tags: ["Women's Wear", "Ethnic", "Kurtis"],
  },

  // PHARMACY
  {
    id: "p-1",
    categoryId: "pharmacy",
    name: "Dolo 650 Paracetamol Tablets",
    description: "Relief from fever, mild to moderate body pain and headache.",
    price: 30,
    mrp: 32,
    unit: "Strip of 15 Tablets",
    rating: 4.9,
    reviewCount: 1580,
    deliveryMinutes: 15,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
    brand: "Micro Labs",
    requiresPrescription: false,
    tags: ["Fever & Pain", "OTC Medicines", "Essentials"],
  },
  {
    id: "p-2",
    categoryId: "pharmacy",
    name: "Limcee Chewable Vitamin C 500mg",
    description: "Orange flavored immunity booster tablets with Vitamin C and Zinc.",
    price: 25,
    mrp: 28,
    unit: "Strip of 15 Tablets",
    rating: 4.8,
    reviewCount: 890,
    deliveryMinutes: 15,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60",
    brand: "Abbott",
    requiresPrescription: false,
    tags: ["Immunity", "Vitamins & Supplements"],
  },

  // SEXUAL WELLNESS (100% Discreet Packaging)
  {
    id: "sw-1",
    categoryId: "sexual-wellness",
    name: "Durex Invisible Extra Thin Condoms (Pack of 10)",
    description: "Ultra-thin design for maximum sensitivity and trusted protection.",
    price: 260,
    mrp: 290,
    unit: "Pack of 10",
    rating: 4.8,
    reviewCount: 710,
    deliveryMinutes: 15,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60",
    brand: "Durex",
    isDiscreet: true,
    isAgeRestricted: true,
    tags: ["Condoms", "Discreet Packaging", "18+ Only"],
  },
  {
    id: "sw-2",
    categoryId: "sexual-wellness",
    name: "K-Y Natural Feel Water-Based Intimate Lubricant",
    description: "Gentle water-soluble formula, non-greasy, pH balanced for comfort.",
    price: 350,
    mrp: 399,
    unit: "100 ml",
    rating: 4.7,
    reviewCount: 290,
    deliveryMinutes: 15,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60",
    brand: "K-Y",
    isDiscreet: true,
    isAgeRestricted: true,
    tags: ["Lubricants", "Intimate Care", "Discreet Packaging"],
  },

  // PAAN & CONVENIENCE (18+ Age verification)
  {
    id: "pa-1",
    categoryId: "paan",
    name: "Calcutta Meetha Paan (Prepared Fresh)",
    description: "Sweet gulkand, saunf, cardamom, supari-free hygienic traditional paan.",
    price: 35,
    mrp: 35,
    unit: "1 pc",
    rating: 4.8,
    reviewCount: 410,
    deliveryMinutes: 15,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=60",
    brand: "Banarasi Paan Corner",
    isAgeRestricted: true,
    tags: ["Meetha Paan", "Mouth Fresheners", "Traditional"],
  },
  {
    id: "pa-2",
    categoryId: "paan",
    name: "Pass Pass Mint & Saunf Mouth Freshener",
    description: "Crunchy sweetened herbal digestive mouth freshener.",
    price: 10,
    mrp: 10,
    unit: "Pack of 2",
    rating: 4.7,
    reviewCount: 310,
    deliveryMinutes: 12,
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500&auto=format&fit=crop&q=60",
    brand: "Pass Pass",
    isAgeRestricted: false,
    tags: ["Mouth Freshener", "Digestive"],
  },
];

export interface HospitalFacility {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  distanceKm: number;
  rating: number;
  totalBeds: number;
  availableBeds: {
    icu: number;
    general: number;
    deluxe: number;
  };
  departments: string[];
  hasAmbulance24x7: boolean;
  hasBloodBank: boolean;
  hasPharmacy24x7: boolean;
}

export const HOSPITALS_DATA: HospitalFacility[] = [
  {
    id: "hosp-1",
    name: "Apollo Multispecialty Hospital",
    city: "Bengaluru",
    address: "154/11, Opp IIM, Bannerghatta Road",
    phone: "080-26304050",
    emergencyPhone: "1066",
    distanceKm: 2.3,
    rating: 4.8,
    totalBeds: 250,
    availableBeds: { icu: 6, general: 24, deluxe: 8 },
    departments: ["Cardiology", "Neurology", "Emergency & Trauma", "Orthopedics", "Pediatrics"],
    hasAmbulance24x7: true,
    hasBloodBank: true,
    hasPharmacy24x7: true,
  },
  {
    id: "hosp-2",
    name: "Manipal Hospital",
    city: "Bengaluru",
    address: "98, HAL Old Airport Rd, Kodihalli",
    phone: "080-25024444",
    emergencyPhone: "080-25023344",
    distanceKm: 3.8,
    rating: 4.7,
    totalBeds: 400,
    availableBeds: { icu: 9, general: 38, deluxe: 14 },
    departments: ["Oncology", "Cardiology", "Gastroenterology", "Nephrology", "General Surgery"],
    hasAmbulance24x7: true,
    hasBloodBank: true,
    hasPharmacy24x7: true,
  },
  {
    id: "hosp-3",
    name: "Fortis Hospital",
    city: "Bengaluru",
    address: "14, Cunningham Road, Vasanth Nagar",
    phone: "080-41994444",
    emergencyPhone: "105010",
    distanceKm: 4.1,
    rating: 4.6,
    totalBeds: 180,
    availableBeds: { icu: 4, general: 18, deluxe: 5 },
    departments: ["Orthopedics", "Cardiology", "ENT", "Internal Medicine"],
    hasAmbulance24x7: true,
    hasBloodBank: true,
    hasPharmacy24x7: true,
  }
];

export interface LabPackage {
  id: string;
  name: string;
  description: string;
  testsCount: number;
  fastingRequired: boolean;
  price: number;
  mrp: number;
  reportHours: number;
  homeCollectionAvailable: boolean;
  sampleType: string;
  includedParameters: string[];
}

export const LAB_PACKAGES: LabPackage[] = [
  {
    id: "lab-1",
    name: "Complete Master Health Checkup",
    description: "Comprehensive 82-parameter vital screening including Heart, Liver, Kidney, Thyroid, Diabetes & Complete Blood Count.",
    testsCount: 82,
    fastingRequired: true,
    price: 999,
    mrp: 2499,
    reportHours: 24,
    homeCollectionAvailable: true,
    sampleType: "Blood & Urine",
    includedParameters: ["CBC (24)", "Lipid Profile (8)", "Liver Function (11)", "Kidney Function (9)", "Thyroid (3)", "HbA1c Diabetes"],
  },
  {
    id: "lab-2",
    name: "Diabetes Care & Monitoring Panel",
    description: "Essential fasting blood sugar, HbA1c, and microalbumin assessment for diabetics.",
    testsCount: 5,
    fastingRequired: true,
    price: 399,
    mrp: 800,
    reportHours: 12,
    homeCollectionAvailable: true,
    sampleType: "Blood",
    includedParameters: ["Fasting Blood Sugar", "HbA1c Glycated Hemoglobin", "Average Blood Glucose", "Lipid Profile"],
  },
  {
    id: "lab-3",
    name: "Vitamin D3 & B12 Vitality Duo",
    description: "Identify fatigue, bone weakness, and nerve health deficiency.",
    testsCount: 2,
    fastingRequired: false,
    price: 549,
    mrp: 1200,
    reportHours: 18,
    homeCollectionAvailable: true,
    sampleType: "Blood",
    includedParameters: ["Vitamin D (25-OH)", "Vitamin B12 Cyanocobalamin"],
  }
];

export interface FamousLocalSpot {
  id: string;
  name: string;
  city: string;
  type: "FOOD" | "LANDMARK" | "SHOP" | "EXPERIENCE";
  tagline: string;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  address: string;
  timings: string;
  specialtyDishOrItem?: string;
}

export const FAMOUS_LOCAL_SPOTS: FamousLocalSpot[] = [
  {
    id: "fam-1",
    name: "Vidyarthi Bhavan",
    city: "Bengaluru",
    type: "FOOD",
    tagline: "Iconic Heritage Masala Dosa Since 1943",
    description: "Legendary restaurant in Gandhi Bazaar famed for crisp golden ghee masala dosas served with green chutney.",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviewsCount: 14200,
    address: "Gandhi Bazaar, Basavanagudi, Bengaluru",
    timings: "06:30 AM - 11:30 AM, 02:00 PM - 08:00 PM",
    specialtyDishOrItem: "Crispy Ghee Masala Dosa",
  },
  {
    id: "fam-2",
    name: "Lalbagh Botanical Garden",
    city: "Bengaluru",
    type: "LANDMARK",
    tagline: "Historic 240-Acre Haven & Glass House",
    description: "Home to over 1,000 species of flora, centuries-old trees, and the iconic Victorian Glass House.",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviewsCount: 28400,
    address: "Mavalli, Bengaluru",
    timings: "06:00 AM - 07:00 PM",
  },
  {
    id: "fam-3",
    name: "Commercial Street Silk & Handicrafts",
    city: "Bengaluru",
    type: "SHOP",
    tagline: "Bustling Fashion & Street Shopping Hub",
    description: "A shopper's paradise packed with traditional sarees, modern fashion, jewelry, and street delicacies.",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=500&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviewsCount: 9800,
    address: "Tasker Town, Commercial Street, Bengaluru",
    timings: "10:30 AM - 09:30 PM",
    specialtyDishOrItem: "Handloom Pure Silk & Silver Jewelry",
  }
];

// ============================================================================
// NEW SUPER-APP SECTIONS DATA
// ============================================================================

export interface ShopCategoryTile {
  id: string;
  name: string;
  emoji: string;
  categoryId: string;
  badge?: string;
  route: string;
  bgColor: string;
}

export const SHOP_BY_CATEGORY_TILES: ShopCategoryTile[] = [
  { id: "cat-groc", name: "Groceries", emoji: "🛒", categoryId: "grocery", badge: "Instant", route: "/category/grocery", bgColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" },
  { id: "cat-fruits", name: "Fresh Fruits", emoji: "🍎", categoryId: "fruits", badge: "Fresh", route: "/category/fruits", bgColor: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20" },
  { id: "cat-veg", name: "Vegetables", emoji: "🥦", categoryId: "vegetables", badge: "Daily", route: "/category/vegetables", bgColor: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20" },
  { id: "cat-dairy", name: "Dairy & Bread", emoji: "🥛", categoryId: "dairy-bakery", route: "/category/dairy-bakery", bgColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20" },
  { id: "cat-snacks", name: "Snacks & Munchies", emoji: "🍟", categoryId: "snacks", route: "/category/snacks", bgColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20" },
  { id: "cat-beverages", name: "Drinks & Juices", emoji: "🥤", categoryId: "beverages", route: "/category/beverages", bgColor: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20" },
  { id: "cat-meat", name: "Meat & Fish", emoji: "🍗", categoryId: "meat-fish", badge: "Cleaned", route: "/category/meat-fish", bgColor: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20" },
  { id: "cat-cosmetics", name: "Cosmetics & Beauty", emoji: "💄", categoryId: "beauty", route: "/category/beauty", bgColor: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20" },
  { id: "cat-baby", name: "Baby Care", emoji: "🍼", categoryId: "baby-care", route: "/category/baby-care", bgColor: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20" },
  { id: "cat-home", name: "Home & Kitchen", emoji: "🍳", categoryId: "home-kitchen", route: "/category/home-kitchen", bgColor: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20" },
  { id: "cat-elec", name: "Electronics", emoji: "📱", categoryId: "electronics", badge: "Top Deals", route: "/category/electronics", bgColor: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20" },
  { id: "cat-fashion", name: "Fashion Apparel", emoji: "👗", categoryId: "fashion", route: "/category/fashion", bgColor: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20" },
  { id: "cat-jewel", name: "Jewellery", emoji: "💍", categoryId: "jewellery", badge: "Hallmarked", route: "/category/jewellery", bgColor: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20" },
  { id: "cat-pharma", name: "Pharmacy & Meds", emoji: "💊", categoryId: "pharmacy", badge: "24/7", route: "/category/pharmacy", bgColor: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20" },
];

export interface PopularFoodDish {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  originalPrice?: number;
  rating: number;
  deliveryTime: string;
  isVeg: boolean;
  image: string;
  badge?: string;
  tags: string[];
}

export const POPULAR_FOOD_ITEMS: PopularFoodDish[] = [
  {
    id: "food-1",
    name: "Hyderabadi Dum Biryani",
    restaurant: "Bawarchi Royale",
    price: 269,
    originalPrice: 320,
    rating: 4.8,
    deliveryTime: "25-30 min",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60",
    badge: "Bestseller",
    tags: ["Biryani", "Spicy", "Basmati"]
  },
  {
    id: "food-2",
    name: "Butter Chicken with Butter Naan",
    restaurant: "Punjab Grill Hub",
    price: 299,
    originalPrice: 350,
    rating: 4.9,
    deliveryTime: "30 min",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60",
    badge: "Chef Special",
    tags: ["North Indian", "Rich Gravy"]
  },
  {
    id: "food-3",
    name: "Steamed Darjeeling Veg Momos",
    restaurant: "The Tibetan Kitchen",
    price: 129,
    originalPrice: 150,
    rating: 4.7,
    deliveryTime: "20 min",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&auto=format&fit=crop&q=60",
    tags: ["Momos", "Spicy Dip", "Street Food"]
  },
  {
    id: "food-4",
    name: "Farmhouse Cheese Burst Pizza",
    restaurant: "Crust & Co. Pizzeria",
    price: 349,
    originalPrice: 420,
    rating: 4.6,
    deliveryTime: "25 min",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
    badge: "Trending",
    tags: ["Italian", "Loaded Cheese", "Fresh Dough"]
  },
  {
    id: "food-5",
    name: "Gourmet Crispy Smash Burger",
    restaurant: "Burger Nation",
    price: 189,
    originalPrice: 229,
    rating: 4.5,
    deliveryTime: "20-25 min",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
    tags: ["Burgers", "Fast Food"]
  },
  {
    id: "food-6",
    name: "South Indian Royal Deluxe Thali",
    restaurant: "Udupi Sri Krishna",
    price: 179,
    originalPrice: 210,
    rating: 4.9,
    deliveryTime: "25 min",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=60",
    badge: "Popular",
    tags: ["Thali", "Pure Veg", "South Indian"]
  },
  {
    id: "food-7",
    name: "Crispy Masala Dosa with Chutneys",
    restaurant: "Mysore Cafe Corner",
    price: 99,
    originalPrice: 120,
    rating: 4.8,
    deliveryTime: "15-20 min",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60",
    tags: ["Breakfast", "Healthy", "Dosa"]
  },
  {
    id: "food-8",
    name: "Old Delhi Special Chaat Platter",
    restaurant: "Chandni Chowk Sweets",
    price: 89,
    originalPrice: 110,
    rating: 4.7,
    deliveryTime: "15 min",
    isVeg: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60",
    tags: ["Chaat", "Snack", "Street Food"]
  }
];

export interface SweetsItem {
  id: string;
  name: string;
  sweetShop: string;
  price: number;
  weightOrUnit: string;
  rating: number;
  image: string;
  badge?: string;
}

export const SWEETS_ITEMS: SweetsItem[] = [
  {
    id: "sw-1",
    name: "Hot Desi Ghee Gulab Jamun (2 pcs)",
    sweetShop: "Haldiram Heritage",
    price: 60,
    weightOrUnit: "2 pcs",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60",
    badge: "Must Try"
  },
  {
    id: "sw-2",
    name: "Pure Ghee Golden Jalebi (250g)",
    sweetShop: "Old Famous Jalebi Wala",
    price: 110,
    weightOrUnit: "250g",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=60",
    badge: "Crispy & Hot"
  },
  {
    id: "sw-3",
    name: "Royal Kesar Rasmalai (2 pcs)",
    sweetShop: "Brijwasi Sweets",
    price: 90,
    weightOrUnit: "2 pcs",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=60",
    badge: "Top Rated"
  },
  {
    id: "sw-4",
    name: "Kaju Katli Diamond Box (250g)",
    sweetShop: "Chhappan Bhog",
    price: 280,
    weightOrUnit: "250g",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=60",
    badge: "Festive Favorite"
  },
  {
    id: "sw-5",
    name: "Belgian Chocolate Truffle Cake (500g)",
    sweetShop: "The French Loaf Bakery",
    price: 499,
    weightOrUnit: "500g",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60",
    badge: "Fresh Baked"
  },
  {
    id: "sw-6",
    name: "Kolkata Spongy Rasgulla (4 pcs)",
    sweetShop: "KC Das Grandson",
    price: 95,
    weightOrUnit: "4 pcs",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "sw-7",
    name: "Malai Kulfi Falooda Sundae",
    sweetShop: "Kulfi Nation",
    price: 85,
    weightOrUnit: "1 serve",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "sw-8",
    name: "Shahi Tukda with Thick Rabri",
    sweetShop: "Karim's Heritage Desserts",
    price: 120,
    weightOrUnit: "1 plate",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60"
  }
];

export interface FashionItem {
  id: string;
  name: string;
  brand: string;
  gender: "Women" | "Men" | "Kids";
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  image: string;
  badge?: string;
}

export const FASHION_ITEMS: FashionItem[] = [
  {
    id: "fsh-1",
    name: "Embroidered Chanderi Silk Kurta Set",
    brand: "Libas Festive",
    gender: "Women",
    price: 1299,
    originalPrice: 2499,
    discount: "48% OFF",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=60",
    badge: "Trending"
  },
  {
    id: "fsh-2",
    name: "Floral Tiered Summer Maxi Dress",
    brand: "FabAlley",
    gender: "Women",
    price: 999,
    originalPrice: 1999,
    discount: "50% OFF",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "fsh-3",
    name: "100% Pure Linen Casual Shirt",
    brand: "Louis Philippe",
    gender: "Men",
    price: 1499,
    originalPrice: 2799,
    discount: "46% OFF",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60",
    badge: "Premium"
  },
  {
    id: "fsh-4",
    name: "Slim Fit Stretch Cotton Chinos",
    brand: "Arrow New York",
    gender: "Men",
    price: 1199,
    originalPrice: 2299,
    discount: "47% OFF",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "fsh-5",
    name: "Kids Pure Cotton Graphic Tees (Pack of 3)",
    brand: "Hopscotch Kids",
    gender: "Kids",
    price: 699,
    originalPrice: 1299,
    discount: "46% OFF",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&auto=format&fit=crop&q=60",
    badge: "Super Saver"
  },
  {
    id: "fsh-6",
    name: "Kids Festive Dhoti Kurta Set",
    brand: "Little Bansi",
    gender: "Kids",
    price: 899,
    originalPrice: 1599,
    discount: "43% OFF",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "fsh-7",
    name: "High-Rise Vintage Denim Jeans",
    brand: "Levi's",
    gender: "Women",
    price: 1899,
    originalPrice: 3199,
    discount: "40% OFF",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "fsh-8",
    name: "Classic Regular Fit Bomber Jacket",
    brand: "Roadster",
    gender: "Men",
    price: 1399,
    originalPrice: 2799,
    discount: "50% OFF",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60"
  }
];

export interface JewelleryItem {
  id: string;
  name: string;
  brand: string;
  metal: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  badge?: string;
}

export const JEWELLERY_ITEMS: JewelleryItem[] = [
  {
    id: "jew-1",
    name: "22K Gold Plated Temple Choker Set",
    brand: "Tanishq Heritage",
    metal: "Gold Plated",
    price: 2499,
    originalPrice: 4999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60",
    badge: "Hallmarked"
  },
  {
    id: "jew-2",
    name: "Pure 925 Sterling Silver Floral Payal (Pair)",
    brand: "Giva Silver",
    metal: "925 Silver",
    price: 1799,
    originalPrice: 2999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=60",
    badge: "Certified Silver"
  },
  {
    id: "jew-3",
    name: "Kundan & Meenakari Peacock Jhumkas",
    brand: "Zaveri Pearls",
    metal: "Brass & Kundan",
    price: 899,
    originalPrice: 1999,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "jew-4",
    name: "Solitaire Cubic Zirconia Stud Earrings",
    brand: "CaratLane Studio",
    metal: "18K Gold Plated",
    price: 1299,
    originalPrice: 2200,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=60",
    badge: "Bestseller"
  },
  {
    id: "jew-5",
    name: "Rose Gold Celestial Charm Bracelet",
    brand: "Mia by Tanishq",
    metal: "Rose Gold Plated",
    price: 1599,
    originalPrice: 2800,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1611591475819-797de233865c?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "jew-6",
    name: "Traditional Brass Bridal Bangles Set (Chuda)",
    brand: "Much-More Jewels",
    metal: "Traditional Lac & Brass",
    price: 1199,
    originalPrice: 2400,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1611591475819-797de233865c?w=500&auto=format&fit=crop&q=60"
  }
];

export interface CosmeticsItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  badge?: string;
}

export const COSMETICS_ITEMS: CosmeticsItem[] = [
  {
    id: "cos-1",
    name: "10% Vitamin C Radiance Face Serum (30ml)",
    brand: "The Derma Co",
    category: "Skin Care",
    price: 549,
    originalPrice: 699,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60",
    badge: "Dermat Tested"
  },
  {
    id: "cos-2",
    name: "Ultra Matte Velvet Liquid Lipstick - Nude Plum",
    brand: "Maybelline New York",
    category: "Makeup",
    price: 449,
    originalPrice: 650,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=60",
    badge: "16hr Longstay"
  },
  {
    id: "cos-3",
    name: "Matte Finish Water Gel Sunscreen SPF 50 PA++++",
    brand: "Aqualogica",
    category: "Sun Care",
    price: 399,
    originalPrice: 499,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60",
    badge: "No White Cast"
  },
  {
    id: "cos-4",
    name: "Rosemary & Biotin Anti-Hairfall Shampoo (300ml)",
    brand: "Mamaearth",
    category: "Hair Care",
    price: 329,
    originalPrice: 399,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "cos-5",
    name: "Intense 9-in-1 Smokey Eyeshadow Palette",
    brand: "Lakmé Absolute",
    category: "Makeup",
    price: 699,
    originalPrice: 999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&auto=format&fit=crop&q=60",
    badge: "Festive Glam"
  },
  {
    id: "cos-6",
    name: "72-Hr Hydrating Ceramide Moisturizer (100g)",
    brand: "Dot & Key",
    category: "Skin Care",
    price: 495,
    originalPrice: 595,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60"
  }
];

export interface DigitalServiceItem {
  id: string;
  title: string;
  description: string;
  iconEmoji: string;
  badge: string;
  route: string;
  features: string[];
}

export const DIGITAL_SERVICES: DigitalServiceItem[] = [
  {
    id: "ds-doc",
    title: "Doctor Consultation",
    description: "Connect with verified MBBS & specialist doctors in under 10 minutes",
    iconEmoji: "👨‍⚕️",
    badge: "Under 10 Mins",
    route: "/doctors",
    features: ["Video/Chat", "Digital Rx", "Top Specialists"]
  },
  {
    id: "ds-diag",
    title: "Diagnostic Lab Tests",
    description: "Certified home sample collection with digital reports in 6-12 hours",
    iconEmoji: "🔬",
    badge: "Free Home Sample",
    route: "/diagnostics",
    features: ["NABL Certified", "Fast Reports", "Full Body Checkups"]
  },
  {
    id: "ds-parcel",
    title: "Express Parcel Courier",
    description: "Intracity instant package, key, document, or gift delivery",
    iconEmoji: "📦",
    badge: "Instant Pickup",
    route: "/parcel",
    features: ["Live GPS Track", "Safe OTP Delivery", "Doorstep Pickup"]
  },
  {
    id: "ds-home",
    title: "Home Repairs & Urban Services",
    description: "Trusted electricians, plumbers, AC service & deep home cleaning",
    iconEmoji: "🛠️",
    badge: "Background Verified",
    route: "/services",
    features: ["Fixed Pricing", "Standard Warranty", "Same-Day Slots"]
  },
  {
    id: "ds-stay",
    title: "Hotels & Stays",
    description: "Verified budget, boutique, and luxury stays with zero cancellation fee",
    iconEmoji: "🏨",
    badge: "Zero Cancel Fee",
    route: "/stays",
    features: ["Instant Confirm", "Couple Friendly", "Free Breakfast"]
  },
  {
    id: "ds-bus",
    title: "Intercity Bus Tickets",
    description: "Book Volvo AC sleepers and luxury interstate bus tickets across India",
    iconEmoji: "🚌",
    badge: "Live Bus Track",
    route: "/buses",
    features: ["Seat Choice", "Live Tracking", "Emergency SOS"]
  },
  {
    id: "ds-ride",
    title: "EZY Share Ride & Auto",
    description: "Daily city commute share cabs, autos, and bike taxis at zero surge",
    iconEmoji: "🚗",
    badge: "Zero Surge",
    route: "/share-ride",
    features: ["Affordable Pool", "Door-to-Door", "Verified Drivers"]
  },
  {
    id: "ds-nurse",
    title: "Home Healthcare & Nurse",
    description: "Elder care, bedside nursing, post-op care & physiotherapy at home",
    iconEmoji: "🩺",
    badge: "Trained Caregivers",
    route: "/home-healthcare",
    features: ["Certified Nurses", "Flexible Shifts", "Medical Equipment"]
  }
];

export interface PopularLocalShopData {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  address: string;
  distance: string;
  isOpen: boolean;
  image: string;
  specialty: string;
}

export const POPULAR_LOCAL_SHOPS_DATA: PopularLocalShopData[] = [
  {
    id: "pls-1",
    name: "Haldiram Sweet Mart & Farsan",
    category: "Mithai & Snacks",
    rating: 4.8,
    reviewsCount: 3420,
    address: "MG Road, Central Market",
    distance: "1.2 km",
    isOpen: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60",
    specialty: "Fresh Desi Ghee Sweets & Dhokla"
  },
  {
    id: "pls-2",
    name: "Green Harvest Organic Grocers",
    category: "Daily Grocery & Supermarket",
    rating: 4.9,
    reviewsCount: 1850,
    address: "Indiranagar 100ft Road",
    distance: "0.8 km",
    isOpen: true,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60",
    specialty: "Hydroponic Greens & A2 Farm Milk"
  },
  {
    id: "pls-3",
    name: "Kalyan Heritage Silk & Sarees",
    category: "Clothing & Traditional Wear",
    rating: 4.7,
    reviewsCount: 2200,
    address: "Commercial Street, Cross Road",
    distance: "2.4 km",
    isOpen: true,
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=500&auto=format&fit=crop&q=60",
    specialty: "Pure Kanjeevaram & Banarasi Sarees"
  },
  {
    id: "pls-4",
    name: "Apollo 24x7 Wellness Pharmacy",
    category: "Pharmacy & Surgical Care",
    rating: 4.9,
    reviewsCount: 5120,
    address: "Koramangala 5th Block",
    distance: "0.5 km",
    isOpen: true,
    image: "https://images.unsplash.com/photo-1586015555751-63c25aa26bc7?w=500&auto=format&fit=crop&q=60",
    specialty: "Prescription Drugs & Health Monitors"
  },
  {
    id: "pls-5",
    name: "Third Wave Artisan Roastery Cafe",
    category: "Bakery & Gourmet Coffee",
    rating: 4.8,
    reviewsCount: 4100,
    address: "Church Street, City Center",
    distance: "1.9 km",
    isOpen: true,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=60",
    specialty: "Single Origin Brews & Sourdough"
  },
  {
    id: "pls-6",
    name: "Vijay Sales & Tech Hub",
    category: "Electronics & Mobile Repair",
    rating: 4.6,
    reviewsCount: 1650,
    address: "SP Road Electronic Market",
    distance: "3.1 km",
    isOpen: true,
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60",
    specialty: "Original Gadgets & Express Repair"
  }
];
