import { create } from "zustand";
import { toast } from "sonner";
import {
  type NotificationItem,
  type NotificationPreferences,
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationById,
  fetchNotificationPreferences,
  updateNotificationPreferences,
  getAuthToken,
} from "./api";

interface NotificationStore {
  notifications: NotificationItem[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  isLoading: boolean;
  filterCategory: string;
  sseConnected: boolean;
  sseSource: EventSource | null;

  setFilterCategory: (category: string) => void;
  loadNotifications: (category?: string) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  loadPreferences: () => Promise<void>;
  savePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  initSseConnection: () => void;
  closeSseConnection: () => void;
  addNotificationRealtime: (notif: NotificationItem) => void;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  orders: 1,
  delivery: 1,
  bookings: 1,
  bus: 1,
  doctor: 1,
  hospital: 1,
  services: 1,
  offers: 1,
  announcements: 1,
  pushEnabled: 1,
  smsEnabled: 1,
  emailEnabled: 1,
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  preferences: DEFAULT_PREFERENCES,
  isLoading: false,
  filterCategory: "all",
  sseConnected: false,
  sseSource: null,

  setFilterCategory: (category: string) => {
    set({ filterCategory: category });
    get().loadNotifications(category);
  },

  loadNotifications: async (category?: string) => {
    set({ isLoading: true });
    try {
      const selectedCategory = category !== undefined ? category : get().filterCategory;
      const data = await fetchNotifications({
        category: selectedCategory === "all" ? undefined : selectedCategory,
      });
      set({
        notifications: data.notifications || [],
        unreadCount: data.unreadCount || 0,
        isLoading: false,
      });
    } catch (err) {
      // If unauthorized or local demo mode, fallback gracefully
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: number) => {
    try {
      await markNotificationAsRead(id);
      set((state) => {
        const updated = state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: 1 } : n
        );
        const unread = updated.filter((n) => !n.isRead).length;
        return { notifications: updated, unreadCount: unread };
      });
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  },

  markAllAsRead: async () => {
    try {
      await markAllNotificationsAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: 1 })),
        unreadCount: 0,
      }));
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  },

  deleteNotification: async (id: number) => {
    try {
      await deleteNotificationById(id);
      set((state) => {
        const filtered = state.notifications.filter((n) => n.id !== id);
        const unread = filtered.filter((n) => !n.isRead).length;
        return { notifications: filtered, unreadCount: unread };
      });
      toast.info("Notification removed");
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  },

  loadPreferences: async () => {
    try {
      const data = await fetchNotificationPreferences();
      if (data.preferences) {
        set({ preferences: data.preferences });
      }
    } catch (err) {
      console.error("Failed to load preferences", err);
    }
  },

  savePreferences: async (prefs: Partial<NotificationPreferences>) => {
    try {
      const data = await updateNotificationPreferences(prefs);
      if (data.preferences) {
        set({ preferences: data.preferences });
        toast.success("Notification preferences saved");
      }
    } catch (err) {
      toast.error("Failed to save preferences");
    }
  },

  addNotificationRealtime: (notif: NotificationItem) => {
    set((state) => {
      // Check for duplicate
      if (state.notifications.some((n) => n.id === notif.id)) return state;
      return {
        notifications: [notif, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    });

    // Pop visual toast
    const iconMap: Record<string, string> = {
      CRITICAL: "🚨",
      HIGH: "⚡",
      NORMAL: "🔔",
      MARKETING: "🎁",
    };
    const icon = iconMap[notif.priority] || "🔔";

    if (notif.priority === "CRITICAL") {
      toast.error(`${icon} ${notif.title}`, {
        description: notif.message,
        duration: 8000,
      });
    } else if (notif.priority === "HIGH") {
      toast.warning(`${icon} ${notif.title}`, {
        description: notif.message,
        duration: 6000,
      });
    } else {
      toast.info(`${icon} ${notif.title}`, {
        description: notif.message,
        duration: 4000,
      });
    }
  },

  initSseConnection: () => {
    const currentSource = get().sseSource;
    if (currentSource) {
      currentSource.close();
    }

    const token = getAuthToken();
    const streamUrl = `/api/notifications/stream${token ? `?token=${token}` : ""}`;

    try {
      const eventSource = new EventSource(streamUrl);

      eventSource.onopen = () => {
        set({ sseConnected: true, sseSource: eventSource });
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "NEW_NOTIFICATION" && data.notification) {
            get().addNotificationRealtime(data.notification);
          }
        } catch (e) {
          // heartbeat or non-json message
        }
      };

      eventSource.onerror = () => {
        set({ sseConnected: false });
        eventSource.close();
      };
    } catch (err) {
      console.error("SSE connection error", err);
    }
  },

  closeSseConnection: () => {
    const src = get().sseSource;
    if (src) {
      src.close();
      set({ sseSource: null, sseConnected: false });
    }
  },
}));
