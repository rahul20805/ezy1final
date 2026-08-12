const serviceCategories = [
  {
    id: 1,
    name: "Recharge & Bills",
    description: "Mobile Top-ups, DTH, Electricity, Water & More",
    icon: "Zap",
    color: "primary",
    route: "/dashboard/recharge"
  },
  {
    id: 2,
    name: "Travel & Bookings",
    description: "Book Flights, Buses, Trains, and Hotels Easily",
    icon: "MapPin",
    color: "secondary",
    route: "/dashboard/transport"
  },
  {
    id: 3,
    name: "Local Shopping",
    description: "Order Groceries, Fresh Produce, & Local Specialties",
    icon: "ShoppingBag",
    color: "accent",
    route: "/dashboard/shopping"
  },
  {
    id: 4,
    name: "Digital Services",
    description: "Access Online Government Services, Insurance, & More",
    icon: "Globe",
    color: "primary",
    route: "/dashboard/services"
  },
  {
    id: 5,
    name: "Food & Delivery",
    description: "Discover & Order from Local Restaurants",
    icon: "UtensilsCrossed",
    color: "secondary",
    route: "/dashboard/food"
  },
  {
    id: 6,
    name: "Financial Services",
    description: "Digital Payments, Microloans, & Investment Options",
    icon: "Landmark",
    color: "accent",
    route: "/dashboard"
  },
  {
    id: 7,
    name: "Healthcare",
    description: "Book Doctors, Order Medicines, Emergency Access",
    icon: "Stethoscope",
    color: "primary",
    route: "/dashboard/healthcare"
  },
  {
    id: 8,
    name: "Transport",
    description: "Bus Schedules, Ride Sharing, Live Tracking",
    icon: "Bus",
    color: "secondary",
    route: "/dashboard/transport"
  }
];
const doctors = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialty: "General Physician",
    hospital: "Apollo Clinic",
    city: "Mumbai",
    rating: 4.8,
    experience: 12,
    fee: 300,
    available: true
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiologist",
    hospital: "Fortis Hospital",
    city: "Delhi",
    rating: 4.9,
    experience: 18,
    fee: 800,
    available: true
  },
  {
    id: 3,
    name: "Dr. Anita Nair",
    specialty: "Pediatrician",
    hospital: "Rainbow Children's Clinic",
    city: "Bengaluru",
    rating: 4.7,
    experience: 9,
    fee: 400,
    available: true
  },
  {
    id: 4,
    name: "Dr. Suresh Patel",
    specialty: "Dermatologist",
    hospital: "Skin & Hair Clinic",
    city: "Ahmedabad",
    rating: 4.6,
    experience: 15,
    fee: 500,
    available: false
  },
  {
    id: 5,
    name: "Dr. Meena Reddy",
    specialty: "Gynecologist",
    hospital: "Maternity Care Centre",
    city: "Hyderabad",
    rating: 4.9,
    experience: 20,
    fee: 600,
    available: true
  },
  {
    id: 6,
    name: "Dr. Vikram Singh",
    specialty: "Orthopedic",
    hospital: "Bone & Joint Hospital",
    city: "Jaipur",
    rating: 4.5,
    experience: 14,
    fee: 700,
    available: true
  }
];
const appointments = [
  {
    id: 1,
    doctorId: 1,
    doctorName: "Dr. Priya Sharma",
    specialty: "General Physician",
    date: "2026-04-18",
    time: "10:30 AM",
    status: "confirmed",
    fee: 300
  },
  {
    id: 2,
    doctorId: 3,
    doctorName: "Dr. Anita Nair",
    specialty: "Pediatrician",
    date: "2026-04-22",
    time: "02:00 PM",
    status: "pending",
    fee: 400
  },
  {
    id: 3,
    doctorId: 2,
    doctorName: "Dr. Rajesh Kumar",
    specialty: "Cardiologist",
    date: "2026-03-10",
    time: "11:00 AM",
    status: "completed",
    fee: 800
  }
];
const busRoutes = [
  {
    id: 1,
    routeNumber: "KA-01-Express",
    from: "Bengaluru",
    to: "Mysuru",
    departure: "06:00",
    arrival: "09:30",
    fare: 180,
    seats: 12,
    operator: "KSRTC",
    type: "express"
  },
  {
    id: 2,
    routeNumber: "MH-42-Sleeper",
    from: "Mumbai",
    to: "Pune",
    departure: "22:00",
    arrival: "04:30",
    fare: 350,
    seats: 5,
    operator: "Maharashtra ST",
    type: "sleeper"
  },
  {
    id: 3,
    routeNumber: "RJ-07-Ordinary",
    from: "Jaipur",
    to: "Ajmer",
    departure: "08:15",
    arrival: "10:00",
    fare: 95,
    seats: 22,
    operator: "Rajasthan Roadways",
    type: "ordinary"
  },
  {
    id: 4,
    routeNumber: "DL-15-Express",
    from: "Delhi",
    to: "Agra",
    departure: "07:00",
    arrival: "10:30",
    fare: 250,
    seats: 8,
    operator: "DTC",
    type: "express"
  },
  {
    id: 5,
    routeNumber: "TN-23-Express",
    from: "Chennai",
    to: "Coimbatore",
    departure: "21:30",
    arrival: "06:00",
    fare: 420,
    seats: 3,
    operator: "Tamil Nadu ST",
    type: "sleeper"
  }
];
const rides = [
  {
    id: 1,
    from: "Indiranagar",
    to: "Whitefield",
    distance: 18,
    fare: 220,
    status: "completed",
    driverName: "Ramesh K.",
    driverRating: 4.7,
    vehicleType: "cab",
    requestedAt: "2026-04-10T14:32:00"
  },
  {
    id: 2,
    from: "Koramangala",
    to: "MG Road",
    distance: 6,
    fare: 80,
    status: "completed",
    driverName: "Sunil P.",
    driverRating: 4.9,
    vehicleType: "auto",
    requestedAt: "2026-04-08T09:15:00"
  },
  {
    id: 3,
    from: "HSR Layout",
    to: "Electronic City",
    distance: 14,
    fare: 130,
    status: "pending",
    vehicleType: "bike",
    requestedAt: "2026-04-14T08:00:00"
  }
];
const listings = [
  {
    id: 1,
    vendorId: 1,
    name: "Basmati Rice",
    description: "Premium aged basmati rice from Punjab",
    price: 120,
    category: "Grocery",
    available: true,
    unit: "per kg"
  },
  {
    id: 2,
    vendorId: 1,
    name: "Toor Dal",
    description: "High quality split pigeon peas",
    price: 95,
    category: "Grocery",
    available: true,
    unit: "per kg"
  },
  {
    id: 3,
    vendorId: 2,
    name: "Ashwagandha Capsules",
    description: "Pure organic ashwagandha root extract",
    price: 350,
    category: "Pharmacy",
    available: true,
    unit: "60 capsules"
  },
  {
    id: 4,
    vendorId: 4,
    name: "Full Meals Thali",
    description: "Rice, 2 curries, sambar, rasam & dessert",
    price: 80,
    category: "Food",
    available: true,
    unit: "per plate"
  }
];
const walletTransactions = [
  {
    id: 1,
    type: "credit",
    amount: 500,
    description: "Cashback on recharge — Jio ₹299 plan",
    date: "2026-04-12",
    status: "success",
    category: "cashback"
  },
  {
    id: 2,
    type: "debit",
    amount: 300,
    description: "Doctor appointment — Dr. Priya Sharma",
    date: "2026-04-10",
    status: "success",
    category: "booking"
  },
  {
    id: 3,
    type: "debit",
    amount: 220,
    description: "Cab ride — Indiranagar to Whitefield",
    date: "2026-04-10",
    status: "success",
    category: "payment"
  },
  {
    id: 4,
    type: "credit",
    amount: 1e3,
    description: "Wallet top-up via UPI",
    date: "2026-04-08",
    status: "success",
    category: "recharge"
  },
  {
    id: 5,
    type: "debit",
    amount: 95,
    description: "Grocery order — Sharma Kirana Store",
    date: "2026-04-06",
    status: "success",
    category: "payment"
  },
  {
    id: 6,
    type: "credit",
    amount: 50,
    description: "Referral bonus — Friend joined Ezy1",
    date: "2026-04-02",
    status: "success",
    category: "cashback"
  }
];
const testimonials = [
  {
    id: 1,
    name: "Priya S.",
    city: "Mumbai",
    text: "Ezy1 has simplified my daily life! I can handle all my bill payments and local shopping from one app.",
    rating: 5,
    role: "Homemaker"
  },
  {
    id: 2,
    name: "Rahul K.",
    city: "Jaipur",
    text: "Connecting with local services has never been easier. Ezy1 helps me support small businesses in my community.",
    rating: 5,
    role: "Small Business Owner"
  },
  {
    id: 3,
    name: "Geeta Devi",
    city: "Patna",
    text: "Even in our small town, Ezy1 works perfectly. I booked a doctor and paid electricity bill all in one place.",
    rating: 4,
    role: "Teacher"
  },
  {
    id: 4,
    name: "Arjun M.",
    city: "Bengaluru",
    text: "The AI recommendations are spot on. Found exactly the right local vendor for home repairs within minutes.",
    rating: 5,
    role: "Software Engineer"
  },
  {
    id: 5,
    name: "Lakshmi R.",
    city: "Coimbatore",
    text: "Booking buses and tracking rides is so smooth. Finally an app that understands Indian transport needs.",
    rating: 4,
    role: "College Student"
  }
];
const MOCK_WALLET_BALANCE = 1935;
const MOCK_USER_NAME = "Amit Verma";
const MOCK_USER_CITY = "Bengaluru";
export {
  MOCK_WALLET_BALANCE as M,
  appointments as a,
  busRoutes as b,
  MOCK_USER_CITY as c,
  doctors as d,
  MOCK_USER_NAME as e,
  listings as l,
  rides as r,
  serviceCategories as s,
  testimonials as t,
  walletTransactions as w
};
