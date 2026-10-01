import { Request, Response } from "express";
import { superappService } from "../services/superapp.service.js";
import { query, queryOne, execute } from "../repositories/database.adapter.js";
import { AuthRequest } from "../types/index.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export const superappController = {
  // Stays & Hotels
  async getHotels(req: Request, res: Response) {
    try {
      const city = req.query.city ? String(req.query.city) : undefined;
      const data = await superappService.getHotels(city);
      res.json(data);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async bookHotel(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id || 1;
      const booking = await superappService.bookHotel(userId, req.body);
      sendSuccess(res, booking, "Hotel booked successfully", 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  // Travel Packages
  async getTravelPackages(req: Request, res: Response) {
    try {
      const destination = req.query.destination ? String(req.query.destination) : undefined;
      const data = await superappService.getTravelPackages(destination);
      res.json(data);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async bookTravelPackage(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id || 1;
      const booking = await superappService.bookTravelPackage(userId, req.body);
      sendSuccess(res, booking, "Tour package booked successfully", 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  // Buses
  async getBuses(req: Request, res: Response) {
    try {
      const { sourceCity, destinationCity } = req.query;
      const data = await superappService.getBuses(
        sourceCity ? String(sourceCity) : undefined,
        destinationCity ? String(destinationCity) : undefined
      );
      res.json(data);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  // Shared Rides
  async getSharedRides(req: Request, res: Response) {
    try {
      const { fromLocation, toLocation } = req.query;
      const data = await superappService.getSharedRides(
        fromLocation ? String(fromLocation) : undefined,
        toLocation ? String(toLocation) : undefined
      );
      res.json(data);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  // Hospitals & Doctors
  async getHospitals(req: Request, res: Response) {
    try {
      const hospitals = await query("SELECT * FROM vendors WHERE category = 'Hospital' OR category = 'Healthcare'");
      if (hospitals.length > 0) return res.json(hospitals);
      res.json([
        { id: 1, businessName: "Apollo Multi-Specialty Hospital", city: "Bengaluru", rating: 4.8, address: "Bannerghatta Road", phone: "+91 80 2630 4050" },
        { id: 2, businessName: "Manipal Hospital", city: "Bengaluru", rating: 4.7, address: "HAL Airport Road", phone: "+91 80 2502 4444" }
      ]);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async getDoctors(req: Request, res: Response) {
    try {
      const partnerId = req.query.partnerId ? Number(req.query.partnerId) : undefined;
      const doctors = await superappService.getHospitalDoctors(partnerId);
      res.json(doctors);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async getHospitalBeds(req: Request, res: Response) {
    try {
      const partnerId = req.query.partnerId ? Number(req.query.partnerId) : undefined;
      const beds = await superappService.getHospitalBeds(partnerId);
      res.json(beds);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  // Pharmacy Medicines
  async getMedicines(req: Request, res: Response) {
    try {
      const partnerId = req.query.partnerId ? Number(req.query.partnerId) : undefined;
      const medicines = await superappService.getPharmacyMedicines(partnerId);
      res.json(medicines);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  // Restaurant Menu
  async getRestaurantMenu(req: Request, res: Response) {
    try {
      const partnerId = req.query.partnerId ? Number(req.query.partnerId) : undefined;
      const menu = await superappService.getRestaurantMenu(partnerId);
      res.json(menu);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  // Services
  async getServices(req: Request, res: Response) {
    try {
      const services = await query("SELECT * FROM vendors WHERE category = 'Services' OR category = 'Local Services'");
      if (services.length > 0) return res.json(services);
      res.json([
        { id: 1, businessName: "Express Electrical & Plumbing Services", city: "Bengaluru", rating: 4.8, phone: "+91 98765 43210" },
        { id: 2, businessName: "Urban Home Appliance Repair", city: "Bengaluru", rating: 4.7, phone: "+91 98765 43211" }
      ]);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  // Partner Applications
  async createPartnerApplication(req: Request, res: Response) {
    try {
      const { business_name, partner_type, category, owner_name, address, city, district, state, pincode } = req.body;
      const resDb = await execute(
        "INSERT INTO partner_applications (user_id, business_name, partner_type, category, owner_name, address, city, district, state, pincode, status) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')",
        [business_name || "New Partner", partner_type || "VENDOR", category || "General", owner_name || "Owner", address || "", city || "", district || "", state || "", pincode || ""]
      );
      sendSuccess(res, { id: resDb.lastID, status: "PENDING" }, "Partner application submitted successfully", 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async getPartnerApplications(req: Request, res: Response) {
    try {
      const apps = await query("SELECT * FROM partner_applications ORDER BY id DESC");
      res.json(apps);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  // Location Geocoding
  async reverseGeocode(req: Request, res: Response) {
    const lat = req.query.lat || "12.9716";
    const lng = req.query.lng || "77.5946";
    res.json({
      success: true,
      address: {
        formattedAddress: "MG Road, Bengaluru, Karnataka 560001",
        city: "Bengaluru",
        locality: "Central Business District",
        pincode: "560001",
        state: "Karnataka",
        country: "India",
        latitude: Number(lat),
        longitude: Number(lng)
      }
    });
  },

  async searchAddress(req: Request, res: Response) {
    const q = String(req.query.q || "");
    res.json({
      success: true,
      results: [
        {
          formattedAddress: `${q}, Bengaluru, Karnataka 560001`,
          city: "Bengaluru",
          pincode: "560001",
          latitude: 12.9716,
          longitude: 77.5946
        }
      ]
    });
  },

  // WhatsApp Webhook
  async whatsappWebhook(req: Request, res: Response) {
    res.json({
      success: true,
      received: true,
      status: "DELIVERED",
      timestamp: new Date().toISOString()
    });
  }
};
