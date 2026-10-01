import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { partnerRouter } from "./partner.routes.js";
import { productRouter } from "./product.routes.js";
import { orderRouter } from "./order.routes.js";
import { paymentRouter } from "./payment.routes.js";
import { notificationRouter } from "./notification.routes.js";
import { adminRouter } from "./admin.routes.js";
import { superappRouter } from "./superapp.routes.js";
import {
  restaurantRouter,
  pharmacyRouter,
  hospitalRouter,
  deliveryRouter,
  servicesPartnerRouter,
  ownerRouter,
} from "./partner-verticals.routes.js";

export const apiRouter = Router();

// Mount modules
apiRouter.use("/auth", authRouter);
apiRouter.use("/partner", partnerRouter);
apiRouter.use("/restaurant", restaurantRouter);
apiRouter.use("/pharmacy", pharmacyRouter);
apiRouter.use("/hospital", hospitalRouter);
apiRouter.use("/delivery", deliveryRouter);
apiRouter.use("/services", servicesPartnerRouter);
apiRouter.use("/owner", ownerRouter);
apiRouter.use("/payments", paymentRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/admin", adminRouter);

// Flat super-app routes (products, categories, vendors, orders, stays, travel, buses, hospitals)
apiRouter.use("/", productRouter);
apiRouter.use("/", orderRouter);
apiRouter.use("/", superappRouter);
