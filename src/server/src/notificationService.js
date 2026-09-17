import { openDb } from "./db.js";

// Standardized Notification Event Types
export const EVENT_TYPES = {
  // Commerce & Orders
  ORDER_CREATED: "ORDER_CREATED",
  ORDER_ACCEPTED: "ORDER_ACCEPTED",
  ORDER_REJECTED: "ORDER_REJECTED",
  ORDER_PREPARING: "ORDER_PREPARING",
  ORDER_READY: "ORDER_READY",
  ORDER_DELIVERED: "ORDER_DELIVERED",
  ORDER_CANCELLED: "ORDER_CANCELLED",

  // Delivery & Tracking
  DELIVERY_ASSIGNED: "DELIVERY_ASSIGNED",
  DELIVERY_STARTED: "DELIVERY_STARTED",
  DELIVERY_NEARBY: "DELIVERY_NEARBY",

  // Bookings & Services
  BOOKING_CREATED: "BOOKING_CREATED",
  BOOKING_CONFIRMED: "BOOKING_CONFIRMED",
  BOOKING_REMINDER: "BOOKING_REMINDER",
  BOOKING_STARTED: "BOOKING_STARTED",
  BOOKING_COMPLETED: "BOOKING_COMPLETED",
  SERVICE_BOOKED: "SERVICE_BOOKED",
  SERVICE_PROVIDER_ASSIGNED: "SERVICE_PROVIDER_ASSIGNED",
  SERVICE_PROVIDER_ON_THE_WAY: "SERVICE_PROVIDER_ON_THE_WAY",
  SERVICE_PROVIDER_ARRIVED: "SERVICE_PROVIDER_ARRIVED",
  SERVICE_COMPLETED: "SERVICE_COMPLETED",

  // Healthcare
  DOCTOR_BOOKING_CONFIRMED: "DOCTOR_BOOKING_CONFIRMED",
  DOCTOR_APPOINTMENT_REMINDER: "DOCTOR_APPOINTMENT_REMINDER",
  HOSPITAL_BED_AVAILABLE: "HOSPITAL_BED_AVAILABLE",
  HOSPITAL_BOOKING_CONFIRMED: "HOSPITAL_BOOKING_CONFIRMED",

  // Transport & Bus Tracking
  BUS_BOOKED: "BUS_BOOKED",
  BUS_DELAYED: "BUS_DELAYED",
  BUS_APPROACHING: "BUS_APPROACHING",
  BUS_DEPARTED: "BUS_DEPARTED",
  BUS_ARRIVED: "BUS_ARRIVED",

  // Wallet & Marketing
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  COUPON_AVAILABLE: "COUPON_AVAILABLE",
  COUPON_EXPIRING: "COUPON_EXPIRING",
  PRICE_DROP: "PRICE_DROP",

  // System & Account
  ACCOUNT_LOGIN: "ACCOUNT_LOGIN",
  EZY1_LAUNCH: "EZY1_LAUNCH",
  SYSTEM_ALERT: "SYSTEM_ALERT"
};

// Map event types to preference categories
export const EVENT_CATEGORY_MAP = {
  ORDER_CREATED: "orders",
  ORDER_ACCEPTED: "orders",
  ORDER_REJECTED: "orders",
  ORDER_PREPARING: "orders",
  ORDER_READY: "orders",
  ORDER_DELIVERED: "orders",
  ORDER_CANCELLED: "orders",
  PAYMENT_SUCCESS: "orders",

  DELIVERY_ASSIGNED: "delivery",
  DELIVERY_STARTED: "delivery",
  DELIVERY_NEARBY: "delivery",

  BOOKING_CREATED: "bookings",
  BOOKING_CONFIRMED: "bookings",
  BOOKING_REMINDER: "bookings",
  BOOKING_STARTED: "bookings",
  BOOKING_COMPLETED: "bookings",

  SERVICE_BOOKED: "services",
  SERVICE_PROVIDER_ASSIGNED: "services",
  SERVICE_PROVIDER_ON_THE_WAY: "services",
  SERVICE_PROVIDER_ARRIVED: "services",
  SERVICE_COMPLETED: "services",

  DOCTOR_BOOKING_CONFIRMED: "doctor",
  DOCTOR_APPOINTMENT_REMINDER: "doctor",
  HOSPITAL_BED_AVAILABLE: "hospital",
  HOSPITAL_BOOKING_CONFIRMED: "hospital",

  BUS_BOOKED: "bus",
  BUS_DELAYED: "bus",
  BUS_APPROACHING: "bus",
  BUS_DEPARTED: "bus",
  BUS_ARRIVED: "bus",

  COUPON_AVAILABLE: "offers",
  COUPON_EXPIRING: "offers",
  PRICE_DROP: "offers",

  ACCOUNT_LOGIN: "announcements",
  EZY1_LAUNCH: "announcements",
  SYSTEM_ALERT: "announcements"
};

// Notification Templates with Dynamic Natural Variations
const TEMPLATES = {
  ORDER_CREATED: {
    priority: "HIGH",
    variants: [
      {
        title: "Order Placed Successfully! 🛍️",
        message: "Your order #{orderNumber} for ₹{amount} has been received and sent to {vendorName}."
      },
      {
        title: "We've Got Your Order! 📦",
        message: "Order #{orderNumber} is confirmed with {vendorName}. Total: ₹{amount}."
      }
    ],
    actionUrl: "/dashboard/cart"
  },
  ORDER_ACCEPTED: {
    priority: "HIGH",
    variants: [
      {
        title: "Order Accepted! 👨‍🍳",
        message: "{vendorName} has accepted your order #{orderNumber} and is preparing it."
      }
    ],
    actionUrl: "/dashboard/cart"
  },
  ORDER_PREPARING: {
    priority: "NORMAL",
    variants: [
      {
        title: "Order Being Prepared 🔥",
        message: "Your items from {vendorName} are being packed fresh for order #{orderNumber}."
      }
    ],
    actionUrl: "/dashboard/cart"
  },
  ORDER_READY: {
    priority: "HIGH",
    variants: [
      {
        title: "Order Packed & Ready! 🎁",
        message: "Order #{orderNumber} is ready for pickup or dispatch at {vendorName}."
      }
    ],
    actionUrl: "/dashboard/cart"
  },
  DELIVERY_ASSIGNED: {
    priority: "HIGH",
    variants: [
      {
        title: "Delivery Partner Assigned 🛵",
        message: "{partnerName} ({partnerPhone}) will be delivering your order #{orderNumber}."
      }
    ],
    actionUrl: "/dashboard/cart"
  },
  DELIVERY_STARTED: {
    priority: "HIGH",
    variants: [
      {
        title: "Order Out for Delivery! 🚀",
        message: "{partnerName} is heading towards your location. Estimated arrival: {eta}."
      }
    ],
    actionUrl: "/dashboard/cart"
  },
  DELIVERY_NEARBY: {
    priority: "CRITICAL",
    variants: [
      {
        title: "Delivery Partner Arriving! 📍",
        message: "{partnerName} is less than 500m away. Please be ready to receive order #{orderNumber}."
      }
    ],
    actionUrl: "/dashboard/cart"
  },
  ORDER_DELIVERED: {
    priority: "NORMAL",
    variants: [
      {
        title: "Order Delivered! 🎊",
        message: "Your order #{orderNumber} has been delivered safely. Enjoy your purchase!"
      }
    ],
    actionUrl: "/dashboard/cart"
  },
  BUS_BOOKED: {
    priority: "HIGH",
    variants: [
      {
        title: "Bus Ticket Confirmed 🚌",
        message: "Your trip on Bus {busNumber} ({route}) for Seat(s) {seatNumbers} is confirmed for {departureTime}."
      }
    ],
    actionUrl: "/dashboard/transport"
  },
  BUS_APPROACHING: {
    priority: "CRITICAL",
    variants: [
      {
        title: "Bus Approaching Stop! ⏱️",
        message: "Bus {busNumber} is approximately {eta} away from your boarding stop: {stopName}."
      }
    ],
    actionUrl: "/dashboard/transport"
  },
  BUS_DELAYED: {
    priority: "HIGH",
    variants: [
      {
        title: "Bus Delay Update ⚠️",
        message: "Bus {busNumber} on route {route} is delayed by approx {delayMinutes} mins due to traffic."
      }
    ],
    actionUrl: "/dashboard/transport"
  },
  DOCTOR_BOOKING_CONFIRMED: {
    priority: "HIGH",
    variants: [
      {
        title: "Doctor Appointment Confirmed 🩺",
        message: "Appointment with Dr. {doctorName} ({specialty}) is scheduled for {slotTime}."
      }
    ],
    actionUrl: "/dashboard/healthcare"
  },
  DOCTOR_APPOINTMENT_REMINDER: {
    priority: "HIGH",
    variants: [
      {
        title: "Upcoming Doctor Appointment Reminder ⏰",
        message: "Your appointment with Dr. {doctorName} starts in {timeRemaining} at {hospitalName}."
      }
    ],
    actionUrl: "/dashboard/healthcare"
  },
  SERVICE_BOOKED: {
    priority: "HIGH",
    variants: [
      {
        title: "Home Service Booked 🛠️",
        message: "Your request for {serviceName} on {serviceDate} has been successfully registered."
      }
    ],
    actionUrl: "/services"
  },
  SERVICE_PROVIDER_ON_THE_WAY: {
    priority: "HIGH",
    variants: [
      {
        title: "Service Expert On The Way 🚗",
        message: "{providerName} is travelling to your address for {serviceName}. ETA: {eta}."
      }
    ],
    actionUrl: "/services"
  },
  PAYMENT_SUCCESS: {
    priority: "NORMAL",
    variants: [
      {
        title: "Payment Successful 💳",
        message: "Payment of ₹{amount} for {purpose} was completed successfully."
      }
    ],
    actionUrl: "/dashboard/wallet"
  },
  COUPON_AVAILABLE: {
    priority: "MARKETING",
    variants: [
      {
        title: "Exclusive Discount For You! 🎁",
        message: "Use code {couponCode} to get {discountText} on your next order."
      }
    ],
    actionUrl: "/dashboard/commerce"
  },
  SYSTEM_ALERT: {
    priority: "CRITICAL",
    variants: [
      {
        title: "EZY1 System Alert ℹ️",
        message: "{alertMessage}"
      }
    ],
    actionUrl: "/dashboard"
  }
};

// Real-Time SSE Active Connections Pool: Map<userId, Set<express.Response>>
const activeSseClients = new Map();

export function addSseClient(userId, res) {
  if (!activeSseClients.has(userId)) {
    activeSseClients.set(userId, new Set());
  }
  activeSseClients.get(userId).add(res);

  res.on("close", () => {
    const clients = activeSseClients.get(userId);
    if (clients) {
      clients.delete(res);
      if (clients.size === 0) {
        activeSseClients.delete(userId);
      }
    }
  });
}

export function broadcastSse(userId, data) {
  const clients = activeSseClients.get(userId);
  if (clients && clients.size > 0) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    for (const client of clients) {
      try {
        client.write(payload);
      } catch (err) {
        console.error("[SSE] Failed writing to client", err);
      }
    }
  }
}

// In-Memory Non-Blocking Notification Queue
const notificationQueue = [];
let isProcessingQueue = false;

// Process Queue items asynchronously
async function processQueue() {
  if (isProcessingQueue || notificationQueue.length === 0) return;
  isProcessingQueue = true;

  while (notificationQueue.length > 0) {
    const job = notificationQueue.shift();
    try {
      await executeNotification(job);
    } catch (err) {
      console.error("[NOTIFICATION ENGINE] Delivery failed:", err.message);
      // Exponential retry support for critical notifications
      if (job.retryCount < 3 && job.priority === "CRITICAL") {
        job.retryCount = (job.retryCount || 0) + 1;
        setTimeout(() => notificationQueue.push(job), 1000 * Math.pow(2, job.retryCount));
      }
    }
  }

  isProcessingQueue = false;
}

// Render dynamic template variables
function interpolate(text, data = {}) {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return data[key] !== undefined ? String(data[key]) : match;
  });
}

// Core Execution Worker
async function executeNotification(event) {
  const { userId, eventId, type, customTitle, customMessage, data = {}, actionUrl } = event;
  const db = await openDb();

  // 1. Anti-Spam & Deduplication Idempotency Check
  if (eventId) {
    const existing = await db.get(
      "SELECT id FROM notifications WHERE userId = ? AND eventId = ? AND type = ?",
      [userId, eventId, type]
    );
    if (existing) {
      console.log(`[NOTIFICATION] Ignored duplicate event: ${eventId} (${type}) for User ${userId}`);
      return null;
    }
  }

  // 2. Bus Tracking Threshold Check to prevent flood
  if (type === EVENT_TYPES.BUS_APPROACHING) {
    const recentBusAlert = await db.get(
      `SELECT id FROM notifications 
       WHERE userId = ? AND type = ? AND createdAt > datetime('now', '-2 minutes')`,
      [userId, type]
    );
    if (recentBusAlert) {
      console.log(`[NOTIFICATION] Throttled high-frequency bus alert for User ${userId}`);
      return null;
    }
  }

  // 3. User Preference Checking
  const category = EVENT_CATEGORY_MAP[type] || "announcements";
  const userPrefs = await db.get(
    "SELECT * FROM notification_preferences WHERE userId = ?",
    [userId]
  );

  if (userPrefs) {
    // If marketing/promotions are turned off and category is offers, suppress
    if (category === "offers" && userPrefs.offers === 0) {
      console.log(`[NOTIFICATION] User ${userId} opted out of promotional offers`);
      return null;
    }
    // If specific category is turned off, check
    if (userPrefs[category] === 0 && event.priority !== "CRITICAL") {
      console.log(`[NOTIFICATION] User ${userId} opted out of category: ${category}`);
      return null;
    }
  }

  // 4. Template Engine & Variation Selection
  const templateConfig = TEMPLATES[type] || {
    priority: "NORMAL",
    variants: [{ title: customTitle || "Notification", message: customMessage || "" }],
    actionUrl: actionUrl || "/dashboard"
  };

  const priority = event.priority || templateConfig.priority || "NORMAL";
  const variants = templateConfig.variants;
  const selectedVariant = variants[Math.floor(Math.random() * variants.length)];

  const finalTitle = customTitle || interpolate(selectedVariant.title, data);
  const finalMessage = customMessage || interpolate(selectedVariant.message, data);
  const finalActionUrl = actionUrl || templateConfig.actionUrl || "/dashboard";

  // 5. Persist to Database
  const result = await db.run(
    `INSERT INTO notifications (userId, eventId, type, category, title, message, priority, data, actionUrl, isRead)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      userId,
      eventId || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type,
      category,
      finalTitle,
      finalMessage,
      priority,
      JSON.stringify(data),
      finalActionUrl
    ]
  );

  const inserted = await db.get("SELECT * FROM notifications WHERE id = ?", [result.lastID]);

  // 6. Broadcast via SSE Stream to active clients
  broadcastSse(userId, {
    type: "NEW_NOTIFICATION",
    notification: inserted
  });

  console.log(`[NOTIFICATION ENGINE] Delivered [${priority}] to User ${userId}: "${finalTitle}"`);
  return inserted;
}

// Public API to trigger an event asynchronously (Non-blocking)
export function triggerNotificationEvent(event) {
  notificationQueue.push({
    ...event,
    retryCount: 0,
    queuedAt: Date.now()
  });
  setImmediate(processQueue);
}

// Synchronous dispatch helper (when caller needs the result immediately)
export async function dispatchNotificationSync(event) {
  return await executeNotification(event);
}

// Get User Notifications with Filtering and Pagination
export async function getUserNotifications(userId, { category, unreadOnly, limit = 50, offset = 0 } = {}) {
  const db = await openDb();
  let query = "SELECT * FROM notifications WHERE userId = ?";
  const params = [userId];

  if (category && category !== "all") {
    query += " AND category = ?";
    params.push(category);
  }

  if (unreadOnly) {
    query += " AND isRead = 0";
  }

  query += " ORDER BY id DESC LIMIT ? OFFSET ?";
  params.push(Number(limit), Number(offset));

  const items = await db.all(query, params);
  const unreadCount = await db.get(
    "SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND isRead = 0",
    [userId]
  );

  return {
    notifications: items,
    unreadCount: unreadCount ? unreadCount.count : 0
  };
}

// Mark Notification as Read
export async function markAsRead(notificationId, userId) {
  const db = await openDb();
  await db.run(
    "UPDATE notifications SET isRead = 1, readAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?",
    [notificationId, userId]
  );
  return { success: true };
}

// Mark All Notifications as Read
export async function markAllAsRead(userId) {
  const db = await openDb();
  await db.run(
    "UPDATE notifications SET isRead = 1, readAt = CURRENT_TIMESTAMP WHERE userId = ? AND isRead = 0",
    [userId]
  );
  return { success: true };
}

// Delete Notification
export async function deleteNotification(notificationId, userId) {
  const db = await openDb();
  await db.run(
    "DELETE FROM notifications WHERE id = ? AND userId = ?",
    [notificationId, userId]
  );
  return { success: true };
}

// Preferences: Get & Update
export async function getUserPreferences(userId) {
  const db = await openDb();
  let prefs = await db.get("SELECT * FROM notification_preferences WHERE userId = ?", [userId]);
  if (!prefs) {
    await db.run("INSERT INTO notification_preferences (userId) VALUES (?)", [userId]);
    prefs = await db.get("SELECT * FROM notification_preferences WHERE userId = ?", [userId]);
  }
  return prefs;
}

export async function updateUserPreferences(userId, newPrefs) {
  const db = await openDb();
  const allowedFields = [
    "orders", "delivery", "bookings", "bus", "doctor",
    "hospital", "services", "offers", "announcements",
    "pushEnabled", "smsEnabled", "emailEnabled"
  ];

  const setClauses = [];
  const params = [];

  for (const field of allowedFields) {
    if (newPrefs[field] !== undefined) {
      setClauses.push(`${field} = ?`);
      params.push(newPrefs[field] ? 1 : 0);
    }
  }

  if (setClauses.length > 0) {
    params.push(userId);
    await db.run(
      `UPDATE notification_preferences SET ${setClauses.join(", ")}, updatedAt = CURRENT_TIMESTAMP WHERE userId = ?`,
      params
    );
  }

  return await getUserPreferences(userId);
}

// Register Push Token
export async function registerPushToken(userId, token, deviceInfo) {
  const db = await openDb();
  await db.run(
    `INSERT INTO push_tokens (userId, token, deviceInfo) 
     VALUES (?, ?, ?) 
     ON CONFLICT(token) DO UPDATE SET userId = excluded.userId, deviceInfo = excluded.deviceInfo`,
    [userId, token, deviceInfo || "web-browser"]
  );
  return { success: true, message: "Push token registered" };
}

// Deregister Push Token
export async function deregisterPushToken(userId, token) {
  const db = await openDb();
  if (token) {
    await db.run("DELETE FROM push_tokens WHERE userId = ? AND token = ?", [userId, token]);
  } else {
    await db.run("DELETE FROM push_tokens WHERE userId = ?", [userId]);
  }
  return { success: true, message: "Push token deregistered" };
}
