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
} from "./components/ProtectedRoute";

// Lazy-loaded pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const PartnerLoginPage = lazy(() => import("./pages/PartnerLoginPage"));
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

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
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

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <UserRoute>
      <DashboardPage />
    </UserRoute>
  ),
});

const healthcareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/healthcare",
  component: () => (
    <UserRoute>
      <HealthcarePage />
    </UserRoute>
  ),
});

const transportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/transport",
  component: () => (
    <UserRoute>
      <TransportPage />
    </UserRoute>
  ),
});

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

const commerceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/commerce",
  component: () => (
    <UserRoute>
      <CommercePage />
    </UserRoute>
  ),
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/cart",
  component: () => (
    <UserRoute>
      <CartPage />
    </UserRoute>
  ),
});

const ownerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/owner",
  component: () => <OwnerPortalPage />,
});

const vendorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vendor-dashboard",
  component: () => <OwnerPortalPage />,
});

const driverDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/driver-dashboard",
  component: () => <OwnerPortalPage />,
});

const serviceProviderDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/service-provider-dashboard",
  component: () => <OwnerPortalPage />,
});

const partnerOnboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/partner-onboarding",
  component: () => <PartnerOnboardingPage />,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => <OwnerPortalPage />,
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
  ownerRoute,
  dashboardRoute,
  healthcareRoute,
  transportRoute,
  walletRoute,
  chatRoute,
  vendorDashboardRoute,
  driverDashboardRoute,
  serviceProviderDashboardRoute,
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
  navaeRedirectRoute,
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
