import CommonTypes "types/common";
import UserTypes "types/users";
import HealthcareTypes "types/healthcare";
import TransportTypes "types/transport";
import VendorTypes "types/vendors";
import WalletTypes "types/wallet";
import CommerceTypes "types/commerce";
import UsersApiMixin "mixins/users-api";
import HealthcareApiMixin "mixins/healthcare-api";
import TransportApiMixin "mixins/transport-api";
import VendorsApiMixin "mixins/vendors-api";
import WalletApiMixin "mixins/wallet-api";
import CommerceApiMixin "mixins/commerce-api";
import HealthcareLib "lib/healthcare";
import TransportLib "lib/transport";
import VendorsLib "lib/vendors";
import CommerceLib "lib/commerce";
import ServicesTypes "types/services";
import ServicesApiMixin "mixins/services-api";
import ServicesLib "lib/services";
import List "mo:core/List";
import Time "mo:core/Time";

actor {
  // --- Users ---
  let users = List.empty<UserTypes.User>();

  // --- Healthcare ---
  let doctors = List.empty<HealthcareTypes.Doctor>();
  let appointments = List.empty<HealthcareTypes.Appointment>();
  let nextAppointmentId = { var val : Nat = 0 };

  // --- Transport ---
  let busRoutes = List.empty<TransportTypes.BusRoute>();
  let rideRequests = List.empty<TransportTypes.RideRequest>();
  let nextRideId = { var val : Nat = 0 };

  // --- Vendors & Admin ---
  let vendors = List.empty<VendorTypes.Vendor>();
  let approvals = List.empty<VendorTypes.AdminApproval>();
  let nextVendorId = { var val : Nat = 6 }; // seeded with 6 vendors
  let nextListingId = { var val : Nat = 12 }; // seeded with 12 listings
  let bootstrapAdmin = { var val : ?CommonTypes.UserId = null };

  // --- Wallet ---
  let wallets = List.empty<WalletTypes.Wallet>();

  // --- Commerce ---
  let products = List.empty<CommerceTypes.Product>();
  let categories = List.empty<CommerceTypes.ProductCategory>();
  let carts = List.empty<CommerceTypes.Cart>();
  let orders = List.empty<CommerceTypes.Order>();
  let nextProductId = { var val : Nat = 3 }; // Seeded with 2 products
  let nextOrderId = { var val : Nat = 1 };

  // --- Home Services ---
  let workers = List.empty<ServicesTypes.Worker>();
  let serviceBookings = List.empty<ServicesTypes.ServiceBooking>();
  let nextWorkerId = { var val : Nat = 3 }; // seeded with 2 workers
  let nextBookingId = { var val : Nat = 1 };

  // --- Seed mock data on init ---
  do {
    let now = Time.now();
    HealthcareLib.seedDoctors(doctors);
    TransportLib.seedBusRoutes(busRoutes);
    VendorsLib.seedVendors(vendors, approvals, now);
    CommerceLib.seedCategories(categories);
    CommerceLib.seedProducts(products);
    ServicesLib.seedWorkers(workers, now);
  };

  include UsersApiMixin(users, wallets);
  include HealthcareApiMixin(doctors, appointments, nextAppointmentId);
  include TransportApiMixin(busRoutes, rideRequests, nextRideId);
  include VendorsApiMixin(vendors, approvals, users, nextVendorId, nextListingId, bootstrapAdmin);
  include WalletApiMixin(wallets);
  include CommerceApiMixin(products, categories, carts, orders, nextProductId, nextOrderId);
  include ServicesApiMixin(workers, serviceBookings, nextWorkerId, nextBookingId);
};
