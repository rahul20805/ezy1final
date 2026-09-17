import { Skeleton } from "@/components/ui/skeleton";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import {
  AdminRoute,
  UserRoute,
  VendorRoute,
  PartnerRoute,
  HospitalRoute,
  PharmacyRoute,
  DeliveryRoute,
  ServiceProviderRoute,
  OwnerRoute,
} from "./components/ProtectedRoute";
import { AuthPromptProvider } from "./components/AuthPromptModal";

// Lazy-loaded pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const PartnerLoginPage = lazy(() => import("./pages/PartnerLoginPage"));
const PartnerDashboardPage = lazy(() => import("./pages/PartnerDashboardPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const HealthcarePage = lazy(() => import("./pages/HealthcarePage"));
const TransportPage = lazy(() => import("./pages/TransportPage"));
const WalletPage = lazy(() => import("./pages/WalletPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const VendorDashboardPage = lazy(() => import("./pages/VendorDashboardPage"));
const DriverDashboardPage = lazy(() => import("./pages/DriverDashboardPage"));
const ServiceProviderDashboardPage = lazy(
  () => import("./pages/ServiceProviderDashboardPage"),
);
const PartnerOnboardingPage = lazy(
  () => import("./pages/PartnerOnboardingPage"),
);
const AdminPage = lazy(() => import("./pages/AdminPage"));
const OwnerPortalPage = lazy(() => import("./pages/OwnerPortalPage"));
const MyDashboardPage = lazy(() => import("./pages/MyDashboardPage"));
const CommercePage = lazy(() => import("./pages/CommercePage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const HomeServicesPage = lazy(() => import("./pages/HomeServicesPage"));
const VendorStorefrontPage = lazy(() => import("./pages/VendorStorefrontPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

// Super-App Dedicated Category & Local Pages
const CategoryDetailPage = lazy(() => import("./pages/CategoryDetailPage"));
const HospitalsPage = lazy(() => import("./pages/HospitalsPage"));
const DoctorsPage = lazy(() => import("./pages/DoctorsPage"));
const DiagnosticsPage = lazy(() => import("./pages/DiagnosticsPage"));
const ParcelPage = lazy(() => import("./pages/ParcelPage"));
const LocalFamousPage = lazy(() => import("./pages/LocalFamousPage"));
const OmniSearchPage = lazy(() => import("./pages/OmniSearchPage"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));
const MyBookingsPage = lazy(() => import("./pages/MyBookingsPage"));

// Additional Services (Stay, Travel, Bus, Share Ride, Home Healthcare)
const StaysPage = lazy(() => import("./pages/StaysPage"));
const TravelPage = lazy(() => import("./pages/TravelPage"));
const BusTransportPage = lazy(() => import("./pages/BusTransportPage"));
const ShareRidePage = lazy(() => import("./pages/ShareRidePage"));
const HomeHealthcarePage = lazy(() => import("./pages/HomeHealthcarePage"));

import { NAVAEIN_URL } from "./config/links";

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-3">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

// Root layout with AuthPromptProvider to enable explore-without-login
const rootRoute = createRootRoute({
  component: () => (
    <AuthPromptProvider>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </AuthPromptProvider>
  ),
});

// Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <LandingPage />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage />,
});

const partnerLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/partner-login",
  component: () => <PartnerLoginPage />,
});

const partnerAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/partner",
  component: () => <PartnerLoginPage />,
});

const partnerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/partner-dashboard",
  component: () => (
    <PartnerRoute>
      <PartnerDashboardPage />
    </PartnerRoute>
  ),
});

// Guest-accessible browsing routes
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => <DashboardPage />,
});

const healthcareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/healthcare",
  component: () => <HealthcarePage />,
});

const transportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/transport",
  component: () => <TransportPage />,
});

const commerceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/commerce",
  component: () => <CommercePage />,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/cart",
  component: () => <CartPage />,
});

// New Consumer-First Super-App Ecosystem Routes
const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/category/$categoryId",
  component: () => <CategoryDetailPage />,
});

const hospitalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hospitals",
  component: () => <HospitalsPage />,
});

const doctorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/doctors",
  component: () => <DoctorsPage />,
});

const diagnosticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/diagnostics",
  component: () => <DiagnosticsPage />,
});

const parcelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/parcel",
  component: () => <ParcelPage />,
});

const famousRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/famous",
  component: () => <LocalFamousPage />,
});

const localShopsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/local-shops",
  component: () => <LocalFamousPage />,
});

const omniSearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: () => <OmniSearchPage />,
});

const myOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-orders",
  component: () => (
    <UserRoute>
      <MyOrdersPage />
    </UserRoute>
  ),
});

const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-bookings",
  component: () => (
    <UserRoute>
      <MyBookingsPage />
    </UserRoute>
  ),
});

// Stays, Travel, Buses, Share Ride, Home Healthcare Routes
const staysRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stays",
  component: () => <StaysPage />,
});

const hotelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hotels",
  component: () => <StaysPage />,
});

const travelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/travel",
  component: () => <TravelPage />,
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/explore",
  component: () => <TravelPage />,
});

const busRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bus",
  component: () => <BusTransportPage />,
});

const busesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/buses",
  component: () => <BusTransportPage />,
});

const shareRideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/share-ride",
  component: () => <ShareRidePage />,
});

const homeHealthcareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home-healthcare",
  component: () => <HomeHealthcarePage />,
});

const doctorAtHomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/doctor-at-home",
  component: () => <HomeHealthcarePage />,
});

// Authenticated user-only management routes
const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/wallet",
  component: () => (
    <UserRoute>
      <WalletPage />
    </UserRoute>
  ),
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/chat",
  component: () => (
    <UserRoute>
      <ChatPage />
    </UserRoute>
  ),
});

const myDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-dashboard",
  component: () => (
    <UserRoute>
      <MyDashboardPage />
    </UserRoute>
  ),
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/checkout",
  component: () => (
    <UserRoute>
      <CheckoutPage />
    </UserRoute>
  ),
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/notifications",
  component: () => (
    <UserRoute>
      <NotificationsPage />
    </UserRoute>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/settings",
  component: () => (
    <UserRoute>
      <SettingsPage />
    </UserRoute>
  ),
});

// Direct consumer route aliases
const walletDirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallet",
  component: () => (
    <UserRoute>
      <WalletPage />
    </UserRoute>
  ),
});

const cartDirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: () => <CartPage />,
});

const notificationsDirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: () => (
    <UserRoute>
      <NotificationsPage />
    </UserRoute>
  ),
});

const settingsDirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <UserRoute>
      <SettingsPage />
    </UserRoute>
  ),
});

const myAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-account",
  component: () => (
    <UserRoute>
      <MyDashboardPage />
    </UserRoute>
  ),
});

const paymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payments",
  component: () => (
    <UserRoute>
      <WalletPage />
    </UserRoute>
  ),
});

const homeServicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: () => <HomeServicesPage />,
});

const vendorStorefrontRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: () => <VendorStorefrontPage />,
});

// Provider and Partner Portal Routes
const ownerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/owner",
  component: () => (
    <OwnerRoute>
      <OwnerPortalPage />
    </OwnerRoute>
  ),
});

const vendorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vendor-dashboard",
  component: () => (
    <VendorRoute>
      <VendorDashboardPage />
    </VendorRoute>
  ),
});

const driverDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/driver-dashboard",
  component: () => (
    <DeliveryRoute>
      <DriverDashboardPage />
    </DeliveryRoute>
  ),
});

const serviceProviderDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/service-provider-dashboard",
  component: () => (
    <ServiceProviderRoute>
      <ServiceProviderDashboardPage />
    </ServiceProviderRoute>
  ),
});

const hospitalDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hospital-dashboard",
  component: () => (
    <HospitalRoute>
      <PartnerDashboardPage />
    </HospitalRoute>
  ),
});

const pharmacyDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pharmacy-dashboard",
  component: () => (
    <PharmacyRoute>
      <PartnerDashboardPage />
    </PharmacyRoute>
  ),
});

const partnerOnboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/partner-onboarding",
  component: () => <PartnerOnboardingPage />,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <AdminRoute>
      <AdminPage />
    </AdminRoute>
  ),
});

const navaeRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store/navae",
  component: () => {
    if (typeof window !== "undefined") {
      window.location.href = NAVAEIN_URL;
    }
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <p className="text-sm font-medium">Redirecting to NavaeIn ({NAVAEIN_URL})...</p>
      </div>
    );
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  partnerLoginRoute,
  partnerAliasRoute,
  partnerDashboardRoute,
  ownerRoute,
  dashboardRoute,
  healthcareRoute,
  transportRoute,
  walletRoute,
  chatRoute,
  vendorDashboardRoute,
  driverDashboardRoute,
  serviceProviderDashboardRoute,
  hospitalDashboardRoute,
  pharmacyDashboardRoute,
  partnerOnboardingRoute,
  adminRoute,
  myDashboardRoute,
  commerceRoute,
  cartRoute,
  checkoutRoute,
  homeServicesRoute,
  vendorStorefrontRoute,
  notificationsRoute,
  settingsRoute,
  walletDirectRoute,
  cartDirectRoute,
  notificationsDirectRoute,
  settingsDirectRoute,
  myAccountRoute,
  paymentsRoute,
  navaeRedirectRoute,
  // New Super-App Ecosystem Routes
  categoryRoute,
  hospitalsRoute,
  doctorsRoute,
  diagnosticsRoute,
  parcelRoute,
  famousRoute,
  localShopsRoute,
  omniSearchRoute,
  myOrdersRoute,
  myBookingsRoute,
  staysRoute,
  hotelsRoute,
  travelRoute,
  exploreRoute,
  busRoute,
  busesRoute,
  shareRideRoute,
  homeHealthcareRoute,
  doctorAtHomeRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

