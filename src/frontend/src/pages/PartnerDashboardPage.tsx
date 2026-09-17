/**
 * EZY1 — Unified Partner Dashboard Page
 * Auto-routes the authenticated partner to their specific service portal
 * based on providerType stored in the JWT / partnerAuthStore.
 */
import { Navigate } from "@tanstack/react-router";
import { usePartnerAuth } from "../lib/partnerAuthStore";

import GroceryPartnerPortal from "./partner/GroceryPartnerPortal";
import HospitalPartnerPortal from "./partner/HospitalPartnerPortal";
import PharmacyPartnerPortal from "./partner/PharmacyPartnerPortal";
import RestaurantPartnerPortal from "./partner/RestaurantPartnerPortal";
import DeliveryPartnerPortal from "./partner/DeliveryPartnerPortal";
import ServiceProviderPortal from "./partner/ServiceProviderPortal";
import AdminPartnerPortal from "./partner/AdminPartnerPortal";

export default function PartnerDashboardPage() {
  const { isAuthenticated, currentPartner } = usePartnerAuth();

  if (!isAuthenticated || !currentPartner) {
    return <Navigate to="/partner-login" />;
  }

  const pt = (currentPartner.providerType || currentPartner.partnerType || "GROCERY").toUpperCase();
  const role = (currentPartner.role || "").toUpperCase();

  // Owners get owner control centre
  if (role === "OWNER" || role === "SUPER_OWNER" || pt === "OWNER") {
    return <Navigate to="/owner" />;
  }

  // Admins get admin console
  if (role === "ADMIN" || role === "SUPER_ADMIN" || pt === "ADMIN") {
    return <AdminPartnerPortal />;
  }

  switch (pt) {
    case "GROCERY":
    case "VENDOR":
    case "FRUIT":
    case "VEGETABLE":
    case "KIRANA":
      return <GroceryPartnerPortal />;

    case "HOSPITAL":
    case "CLINIC":
    case "HEALTHCARE":
      return <HospitalPartnerPortal />;

    case "PHARMACY":
    case "CHEMIST":
    case "MEDICAL":
      return <PharmacyPartnerPortal />;

    case "RESTAURANT":
    case "FOOD":
    case "CAFE":
      return <RestaurantPartnerPortal />;

    case "DELIVERY":
    case "DRIVER":
    case "LOGISTICS":
      return <DeliveryPartnerPortal />;

    case "SERVICE_PROVIDER":
    case "SERVICES":
    case "HOME_SERVICES":
      return <ServiceProviderPortal />;

    default:
      return <GroceryPartnerPortal />;
  }
}
