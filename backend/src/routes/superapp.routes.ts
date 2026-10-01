import { Router } from "express";
import { superappController } from "../controllers/superapp.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";

export const superappRouter = Router();

// Stays & Hotels
superappRouter.get("/stays", superappController.getHotels);
superappRouter.get("/hotels", superappController.getHotels);
superappRouter.post("/stays/bookings", optionalAuth, superappController.bookHotel);
superappRouter.post("/hotels/bookings", optionalAuth, superappController.bookHotel);

// Travel & Tours
superappRouter.get("/travel", superappController.getTravelPackages);
superappRouter.get("/explore", superappController.getTravelPackages);
superappRouter.post("/travel/bookings", optionalAuth, superappController.bookTravelPackage);

// Buses
superappRouter.get("/buses", superappController.getBuses);
superappRouter.get("/bus", superappController.getBuses);

// Shared Rides
superappRouter.get("/rides/shared", superappController.getSharedRides);
superappRouter.get("/share-ride", superappController.getSharedRides);

// Hospitals & Doctors
superappRouter.get("/hospitals", superappController.getHospitals);
superappRouter.get("/doctors", superappController.getDoctors);
superappRouter.get("/hospital/beds", superappController.getHospitalBeds);
superappRouter.get("/hospital/doctors", superappController.getDoctors);

// Pharmacy
superappRouter.get("/pharmacy/medicines", superappController.getMedicines);

// Restaurant Menu
superappRouter.get("/restaurant/menu", superappController.getRestaurantMenu);

// Services
superappRouter.get("/services", superappController.getServices);

// Partner Applications
superappRouter.post("/partner-applications", superappController.createPartnerApplication);
superappRouter.get("/partner-applications", superappController.getPartnerApplications);

// Location
superappRouter.get("/location/reverse-geocode", superappController.reverseGeocode);
superappRouter.get("/location/search", superappController.searchAddress);

// WhatsApp Webhook
superappRouter.post("/whatsapp/webhook", superappController.whatsappWebhook);
