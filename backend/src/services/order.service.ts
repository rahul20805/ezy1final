import { query, queryOne, execute } from "../repositories/database.adapter.js";
import { generateRandomOrderNumber } from "../utils/crypto.utils.js";
import { emailService } from "./email.service.js";
import { notificationService } from "./notification.service.js";

export const orderService = {
  async createOrder(userId: number, data: {
    vendorId: number;
    items: Array<{ productId: number; quantity: number; price?: number }>;
    totalAmount?: number;
    deliveryAddress?: any;
    orderSource?: string;
    idempotencyKey?: string;
    customerEmail?: string;
    customerName?: string;
    customerPhone?: string;
    paymentMethod?: string;
    paymentStatus?: string;
  }) {
    const { vendorId, items, deliveryAddress, orderSource, idempotencyKey } = data;
    if (!vendorId || !items || items.length === 0) {
      throw new Error("Invalid order: vendorId and non-empty items array are required");
    }

    // Idempotency check: if already processed with this key, return existing order
    if (idempotencyKey) {
      const existing = await queryOne(
        "SELECT * FROM orders WHERE itemsJson LIKE ? AND userId = ?",
        [`%${idempotencyKey}%`, userId]
      );
      if (existing) {
        return {
          ...existing,
          isIdempotentReplay: true
        };
      }
    }

    // Server-side price calculation to prevent client manipulation
    let calculatedTotal = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      const product = await queryOne("SELECT id, name, price, available FROM products WHERE id = ?", [item.productId]);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} no longer exists`);
      }
      if (!product.available) {
        throw new Error(`Product "${product.name}" is currently out of stock`);
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      const unitPrice = Number(product.price);
      const itemTotal = unitPrice * qty;
      calculatedTotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        unitPrice,
        quantity: qty,
        totalPrice: itemTotal
      });
    }

    // Resolve customer contact details
    let resolvedEmail = data.customerEmail;
    let resolvedName = data.customerName;
    let resolvedPhone = data.customerPhone;

    if (!resolvedEmail || !resolvedName) {
      try {
        const userRow = await queryOne("SELECT name, email, phone FROM users WHERE id = ?", [userId]);
        if (userRow) {
          if (!resolvedEmail) resolvedEmail = userRow.email;
          if (!resolvedName) resolvedName = userRow.name;
          if (!resolvedPhone) resolvedPhone = userRow.phone;
        }
      } catch {}
    }

    const orderNumber = generateRandomOrderNumber("ORD");
    const itemsJson = JSON.stringify({
      orderNumber,
      items: validatedItems,
      deliveryAddress,
      idempotencyKey,
      customerEmail: resolvedEmail,
      customerName: resolvedName,
      customerPhone: resolvedPhone,
      paymentMethod: data.paymentMethod || "UPI / Razorpay",
      paymentStatus: data.paymentStatus || "pending"
    });

    const res = await execute(
      "INSERT INTO orders (userId, vendorId, status, totalAmount, orderSource, itemsJson) VALUES (?, ?, 'pending', ?, ?, ?)",
      [userId, vendorId, calculatedTotal, orderSource || "WEB", itemsJson]
    );

    const order = await queryOne("SELECT * FROM orders WHERE id = ?", [res.lastID]);
    const completeOrder = {
      ...order,
      orderNumber,
      items: validatedItems,
      customerEmail: resolvedEmail,
      customerName: resolvedName,
      customerPhone: resolvedPhone,
      paymentMethod: data.paymentMethod || "UPI / Razorpay",
      deliveryAddress
    };

    // Asynchronously dispatch Order Confirmation Email via Brevo
    if (resolvedEmail && resolvedEmail.includes("@")) {
      emailService.sendOrderConfirmationEmail({
        order: completeOrder,
        customerEmail: resolvedEmail,
        customerName: resolvedName
      }).catch(err => console.warn("[ORDER EMAIL DISPATCH WARN]", err));
    }

    // In-app Notification
    notificationService.triggerNotification({
      userId,
      type: "ORDER_CREATED",
      category: "ORDERS",
      title: `Order Placed #${orderNumber}`,
      message: `Your order for ₹${calculatedTotal.toFixed(2)} has been placed successfully.`,
      actionUrl: "/my-orders",
      data: { orderId: order.id, orderNumber }
    }).catch(() => {});

    return completeOrder;
  },

  async getOrders(filter: { userId?: number; vendorId?: number; status?: string }) {
    let sql = "SELECT o.*, u.name as customerName, u.phone as customerPhone, v.businessName as vendorName FROM orders o LEFT JOIN users u ON o.userId = u.id LEFT JOIN vendors v ON o.vendorId = v.id WHERE 1=1";
    const params: any[] = [];

    if (filter.userId) {
      sql += " AND o.userId = ?";
      params.push(filter.userId);
    }

    if (filter.vendorId) {
      sql += " AND o.vendorId = ?";
      params.push(filter.vendorId);
    }

    if (filter.status) {
      sql += " AND LOWER(o.status) = LOWER(?)";
      params.push(filter.status);
    }

    sql += " ORDER BY o.id DESC";
    const rows = await query(sql, params);

    return rows.map(r => {
      let parsed = {};
      try {
        if (r.itemsJson) parsed = JSON.parse(r.itemsJson);
      } catch {}
      return {
        ...r,
        ...parsed
      };
    });
  },

  async getOrderById(orderId: number, userId?: number, vendorId?: number) {
    let sql = "SELECT o.*, u.name as customerName, u.phone as customerPhone, u.email as customerEmail, v.businessName as vendorName FROM orders o LEFT JOIN users u ON o.userId = u.id LEFT JOIN vendors v ON o.vendorId = v.id WHERE o.id = ?";
    const params: any[] = [orderId];

    if (userId) {
      sql += " AND o.userId = ?";
      params.push(userId);
    } else if (vendorId) {
      sql += " AND o.vendorId = ?";
      params.push(vendorId);
    }

    const order = await queryOne(sql, params);
    if (!order) throw new Error("Order not found or unauthorized");

    let parsed = {};
    try {
      if (order.itemsJson) parsed = JSON.parse(order.itemsJson);
    } catch {}

    return {
      ...order,
      ...parsed
    };
  },

  async updateOrderStatus(orderId: number, status: string, actorId?: number) {
    const validStatuses = ["pending", "confirmed", "processing", "out_for_delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status.toLowerCase())) {
      throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(", ")}`);
    }

    const order = await queryOne("SELECT * FROM orders WHERE id = ?", [orderId]);
    if (!order) throw new Error("Order not found");

    await execute("UPDATE orders SET status = ? WHERE id = ?", [status.toLowerCase(), orderId]);

    // Record audit log
    await execute(
      "INSERT INTO audit_logs (actorId, action, resource, oldValue, newValue) VALUES (?, 'ORDER_STATUS_UPDATE', ?, ?, ?)",
      [actorId || null, `Order:${orderId}`, order.status, status.toLowerCase()]
    );

    return queryOne("SELECT * FROM orders WHERE id = ?", [orderId]);
  }
};
