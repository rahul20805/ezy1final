import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCheck,
  Trash2,
  Settings,
  ShoppingBag,
  Truck,
  Bus,
  Stethoscope,
  Wrench,
  Tag,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Radio,
  CheckCircle2,
  Clock,
  SendHorizontal,
} from "lucide-react";
import UserLayout from "../components/UserLayout";
import { useNotificationStore } from "../lib/notificationStore";
import { triggerTestNotification, type NotificationItem } from "../lib/api";
import { toast } from "sonner";

const CATEGORIES = [
  { id: "all", label: "All", icon: Bell },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "bus", label: "Bus & Transport", icon: Bus },
  { id: "doctor", label: "Healthcare", icon: Stethoscope },
  { id: "services", label: "Services", icon: Wrench },
  { id: "offers", label: "Offers & Promos", icon: Tag },
  { id: "announcements", label: "System Alerts", icon: AlertCircle },
];

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    filterCategory,
    setFilterCategory,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sseConnected,
  } = useNotificationStore();

  const [isTriggeringTest, setIsTriggeringTest] = useState(false);

  useEffect(() => {
    loadNotifications(filterCategory);
  }, [filterCategory]);

  const handleTestEvent = async (type: string, title?: string, msg?: string, prio = "HIGH") => {
    setIsTriggeringTest(true);
    try {
      const res = await triggerTestNotification({
        type,
        customTitle: title,
        customMessage: msg,
        priority: prio,
      });
      if (res.success) {
        toast.success(`Triggered event: ${type}`);
        loadNotifications(filterCategory);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to trigger event");
    } finally {
      setIsTriggeringTest(false);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return dateStr;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return (
          <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px] uppercase font-bold">
            Critical Alert
          </Badge>
        );
      case "HIGH":
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] uppercase font-bold">
            Important
          </Badge>
        );
      case "MARKETING":
        return (
          <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] uppercase font-bold">
            Offer
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] uppercase text-muted-foreground">
            Update
          </Badge>
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "orders":
        return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
      case "delivery":
        return <Truck className="w-4 h-4 text-blue-500" />;
      case "bus":
        return <Bus className="w-4 h-4 text-amber-500" />;
      case "doctor":
      case "hospital":
        return <Stethoscope className="w-4 h-4 text-rose-500" />;
      case "services":
        return <Wrench className="w-4 h-4 text-teal-500" />;
      case "offers":
        return <Tag className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <UserLayout title="Notifications & Live Alerts">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-card to-muted/40 border border-border shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">Intelligent Notification Center</h2>
              {unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground font-bold px-2 py-0.5">
                  {unreadCount} Unread
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 font-medium ${
                  sseConnected ? "text-emerald-500" : "text-amber-500"
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${sseConnected ? "animate-pulse" : ""}`} />
                {sseConnected ? "Live Real-Time SSE Active" : "Connecting Live Stream..."}
              </span>
              <span>•</span>
              <span>Central Event Engine</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-9 gap-1.5"
                onClick={() => markAllAsRead()}
              >
                <CheckCheck className="w-3.5 h-3.5 text-primary" />
                Mark all read
              </Button>
            )}
            <Link to="/dashboard/settings">
              <Button variant="ghost" size="sm" className="text-xs h-9 gap-1.5 text-muted-foreground">
                <Settings className="w-3.5 h-3.5" />
                Preferences
              </Button>
            </Link>
          </div>
        </div>

        {/* Live Test Event Dispatcher (For demo and verification testing) */}
        <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Test Real-Time Event Dispatcher:
            </span>
            <span className="text-[11px] text-muted-foreground">Simulate live system triggers</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 gap-1 bg-background hover:bg-emerald-500/10 hover:text-emerald-600"
              disabled={isTriggeringTest}
              onClick={() =>
                handleTestEvent(
                  "DELIVERY_NEARBY",
                  "Rider is Arriving! 🛵",
                  "Delivery partner Manoj is 300m away with your order #ORD-8419.",
                  "CRITICAL"
                )
              }
            >
              <Truck className="w-3 h-3" />
              Delivery Nearby (Critical)
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 gap-1 bg-background hover:bg-amber-500/10 hover:text-amber-600"
              disabled={isTriggeringTest}
              onClick={() =>
                handleTestEvent(
                  "BUS_APPROACHING",
                  "Bus Approaching Stop! 🚌",
                  "Bus 412 (Delhi - Gurugram) will reach IFFCO Chowk in 4 mins.",
                  "HIGH"
                )
              }
            >
              <Bus className="w-3 h-3" />
              Bus Approaching
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 gap-1 bg-background hover:bg-rose-500/10 hover:text-rose-600"
              disabled={isTriggeringTest}
              onClick={() =>
                handleTestEvent(
                  "DOCTOR_APPOINTMENT_REMINDER",
                  "Doctor Appointment in 30 Mins 🩺",
                  "Consultation with Dr. Aditi Verma starts at 4:30 PM at City Care Hospital.",
                  "HIGH"
                )
              }
            >
              <Stethoscope className="w-3 h-3" />
              Doctor Reminder
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 gap-1 bg-background hover:bg-purple-500/10 hover:text-purple-600"
              disabled={isTriggeringTest}
              onClick={() =>
                handleTestEvent(
                  "COUPON_AVAILABLE",
                  "Weekend Super Sale! 🎁",
                  "Use promo code EZY50 for flat ₹50 discount on grocery orders above ₹300.",
                  "MARKETING"
                )
              }
            >
              <Tag className="w-3 h-3" />
              Flash Coupon
            </Button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = filterCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-smooth shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Notifications Feed */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border bg-card/50">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">You're all caught up!</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              No new alerts in this category. Live system updates and order tracking alerts will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => {
              const isUnread = !item.isRead;
              return (
                <Card
                  key={item.id}
                  className={`border transition-all duration-200 overflow-hidden ${
                    isUnread
                      ? "border-primary/40 bg-primary/5 shadow-xs"
                      : "border-border bg-card hover:bg-muted/30"
                  }`}
                >
                  <CardContent className="p-4 flex gap-3.5 sm:gap-4 items-start">
                    {/* Category Icon Disc */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                        isUnread ? "bg-card border border-primary/30" : "bg-muted"
                      }`}
                    >
                      {getCategoryIcon(item.category)}
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-semibold text-foreground ${isUnread ? "font-bold" : ""}`}>
                            {item.title}
                          </h4>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0 animate-ping" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {getPriorityBadge(item.priority)}
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(item.createdAt)}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {item.message}
                      </p>

                      {/* Card Action Row */}
                      <div className="flex items-center justify-between gap-2 pt-2">
                        {item.actionUrl ? (
                          <Link to={item.actionUrl as any}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 gap-1 text-primary hover:text-primary font-medium"
                              onClick={() => markAsRead(item.id)}
                            >
                              <span>View Details</span>
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </Link>
                        ) : (
                          <div />
                        )}

                        <div className="flex items-center gap-1 ml-auto">
                          {isUnread && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
                              onClick={() => markAsRead(item.id)}
                              title="Mark as read"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Mark read</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-500"
                            onClick={() => deleteNotification(item.id)}
                            title="Delete notification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
