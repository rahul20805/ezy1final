export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: "user" | "customer" | "vendor" | "service_partner" | "admin" | "guest";
  createdAt: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  city: string;
  rating: number;
  experience: number;
  fee: number;
  available: boolean;
  avatar?: string;
}

export interface Appointment {
  id: number;
  doctorId: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  fee: number;
}

export interface BusRoute {
  id: number;
  routeNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  fare: number;
  seats: number;
  operator: string;
  type: "express" | "ordinary" | "sleeper";
}

export interface RideRequest {
  id: number;
  from: string;
  to: string;
  distance: number;
  fare: number;
  status: "pending" | "accepted" | "ongoing" | "completed" | "cancelled";
  driverName?: string;
  driverRating?: number;
  vehicleType: "auto" | "bike" | "cab";
  requestedAt: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
}

export interface OperatingHours {
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export interface Vendor {
  id: number;
  businessName: string;
  ownerName: string;
  category: string;
  city: string;
  address: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  rating: number;
  totalOrders: number;
  joinedAt: string;
  location?: Location;
  operatingHours?: OperatingHours;
  deliveryRadiusKm?: number;
  totalReviews?: number;
}

export interface Listing {
  id: number;
  vendorId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  unit?: string;
}

export interface WalletTransaction {
  id: number;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "success" | "pending" | "failed";
  category: "recharge" | "booking" | "payment" | "refund" | "cashback";
}

export interface AdminApproval {
  id: number;
  vendorId: number;
  vendorName: string;
  category: string;
  city: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

export interface Testimonial {
  id: number;
  name: string;
  city: string;
  text: string;
  rating: number;
  role: string;
}

export type UserRole = "user" | "customer" | "vendor" | "service_partner" | "admin" | "guest";

export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  image?: string;
  parentCategoryId?: number;
  icon?: string;
  color?: string;
  itemCount?: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  mrp: number;
  image?: string;
  images: string[];
  category: string;
  categoryIds: number[];
  vendorId: number;
  stockCount: number;
  inStock: boolean;
  isAvailable: boolean;
  rating?: number;
  totalReviews?: number;
}

export interface Worker {
  id: number;
  name: string;
  category: string;
  rating: number;
  totalReviews: number;
  pricePerHour: number;
  isAvailable: boolean;
  registeredAt: string;
}

export interface ServiceBooking {
  id: number;
  workerId: number;
  userId: string;
  scheduledAt: string;
  status: "requested" | "accepted" | "inProgress" | "completed" | "cancelled";
  totalAmount: number;
  address: string;
  createdAt: string;
}

export interface Review {
  id: number;
  targetId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  validUntil: string;
  isActive: boolean;
}

export interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: number;
  userId: string;
  vendorId: number;
  items: CartItem[];
  totalAmount: number;
  status: "placed" | "confirmed" | "preparing" | "ready" | "outForDelivery" | "delivered" | "cancelled" | "refunded";
  deliveryAddress: string;
  createdAt: string;
}
