import { query, queryOne, execute } from "../repositories/database.adapter.js";
import { Response } from "express";

const sseClients = new Map<number, Set<Response>>();

export const notificationService = {
  addSseClient(userId: number, res: Response) {
    if (!sseClients.has(userId)) {
      sseClients.set(userId, new Set());
    }
    sseClients.get(userId)!.add(res);

    res.on("close", () => {
      const set = sseClients.get(userId);
      if (set) {
        set.delete(res);
        if (set.size === 0) sseClients.delete(userId);
      }
    });
  },

  async getUserNotifications(userId: number, limit: number = 50, offset: number = 0) {
    const notifications = await query(
      "SELECT * FROM notifications WHERE userId = ? ORDER BY id DESC LIMIT ? OFFSET ?",
      [userId, limit, offset]
    );

    const unreadCountRow = await queryOne(
      "SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND isRead = 0",
      [userId]
    );

    return {
      notifications: notifications.map(n => ({
        ...n,
        isRead: Boolean(n.isRead)
      })),
      unreadCount: unreadCountRow?.count || 0
    };
  },

  async markAsRead(notificationId: number, userId: number) {
    await execute(
      "UPDATE notifications SET isRead = 1, readAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?",
      [notificationId, userId]
    );
    return { success: true };
  },

  async markAllAsRead(userId: number) {
    await execute(
      "UPDATE notifications SET isRead = 1, readAt = CURRENT_TIMESTAMP WHERE userId = ? AND isRead = 0",
      [userId]
    );
    return { success: true };
  },

  async deleteNotification(notificationId: number, userId: number) {
    await execute(
      "DELETE FROM notifications WHERE id = ? AND userId = ?",
      [notificationId, userId]
    );
    return { success: true };
  },

  async getUserPreferences(userId: number) {
    let prefs = await queryOne(
      "SELECT * FROM notification_preferences WHERE userId = ?",
      [userId]
    );

    if (!prefs) {
      await execute(
        "INSERT INTO notification_preferences (userId) VALUES (?)",
        [userId]
      );
      prefs = await queryOne(
        "SELECT * FROM notification_preferences WHERE userId = ?",
        [userId]
      );
    }

    return {
      preferences: {
        orders: Boolean(prefs.orders),
        delivery: Boolean(prefs.delivery),
        bookings: Boolean(prefs.bookings),
        bus: Boolean(prefs.bus),
        doctor: Boolean(prefs.doctor),
        hospital: Boolean(prefs.hospital),
        services: Boolean(prefs.services),
        offers: Boolean(prefs.offers),
        announcements: Boolean(prefs.announcements),
        pushEnabled: Boolean(prefs.pushEnabled),
        smsEnabled: Boolean(prefs.smsEnabled),
        emailEnabled: Boolean(prefs.emailEnabled)
      }
    };
  },

  async updateUserPreferences(userId: number, prefs: any) {
    await execute(
      `UPDATE notification_preferences SET 
        orders = ?, delivery = ?, bookings = ?, bus = ?, doctor = ?, hospital = ?, 
        services = ?, offers = ?, announcements = ?, pushEnabled = ?, smsEnabled = ?, emailEnabled = ?,
        updatedAt = CURRENT_TIMESTAMP
       WHERE userId = ?`,
      [
        prefs.orders ? 1 : 0,
        prefs.delivery ? 1 : 0,
        prefs.bookings ? 1 : 0,
        prefs.bus ? 1 : 0,
        prefs.doctor ? 1 : 0,
        prefs.hospital ? 1 : 0,
        prefs.services ? 1 : 0,
        prefs.offers ? 1 : 0,
        prefs.announcements ? 1 : 0,
        prefs.pushEnabled ? 1 : 0,
        prefs.smsEnabled ? 1 : 0,
        prefs.emailEnabled ? 1 : 0,
        userId
      ]
    );
    return this.getUserPreferences(userId);
  },

  async triggerNotification(options: {
    userId: number;
    type: string;
    category?: string;
    title: string;
    message: string;
    priority?: string;
    actionUrl?: string;
    data?: any;
  }) {
    const { userId, type, category = "SYSTEM", title, message, priority = "NORMAL", actionUrl, data } = options;

    const res = await execute(
      "INSERT INTO notifications (userId, type, category, title, message, priority, actionUrl, data, isRead) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)",
      [userId, type, category, title, message, priority, actionUrl || null, data ? JSON.stringify(data) : null]
    );

    const record = await queryOne("SELECT * FROM notifications WHERE id = ?", [res.lastID]);

    // Live broadcast via SSE
    const clients = sseClients.get(userId);
    if (clients && clients.size > 0) {
      const ssePayload = `data: ${JSON.stringify(record)}\n\n`;
      clients.forEach(client => {
        try {
          client.write(ssePayload);
        } catch {}
      });
    }

    return record;
  }
};
