import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle,
  Edit2,
  IndianRupee,
  Package,
  Plus,
  ShoppingCart,
  Star,
  Trash2,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import VendorLayout from "../components/VendorLayout";
import { listings as mockListings } from "../mock-data";
import type { Listing } from "../types";

const VENDOR_STATUS: "pending" | "approved" | "rejected" = "pending";
const VENDOR_NAME = "Sharma Kirana Store";

const MOCK_ORDERS = [
  {
    id: 1,
    customer: "Ravi Kumar",
    item: "Basmati Rice × 5kg",
    date: "2026-04-14",
    status: "pending" as const,
    amount: 600,
  },
  {
    id: 2,
    customer: "Sunita Devi",
    item: "Toor Dal × 2kg",
    date: "2026-04-13",
    status: "completed" as const,
    amount: 190,
  },
  {
    id: 3,
    customer: "Arjun M.",
    item: "Basmati Rice × 2kg",
    date: "2026-04-12",
    status: "completed" as const,
    amount: 240,
  },
  {
    id: 4,
    customer: "Priya S.",
    item: "Toor Dal × 1kg",
    date: "2026-04-11",
    status: "rejected" as const,
    amount: 95,
  },
];

const EARNINGS = { today: 830, week: 4200, month: 14500 };
const EARNINGS_HISTORY = [
  {
    id: 1,
    customer: "Ravi Kumar",
    item: "Basmati Rice × 5kg",
    amount: 600,
    date: "2026-04-14",
  },
  {
    id: 2,
    customer: "Sunita Devi",
    item: "Toor Dal × 2kg",
    amount: 190,
    date: "2026-04-13",
  },
  {
    id: 3,
    customer: "Arjun M.",
    item: "Basmati Rice × 2kg",
    amount: 240,
    date: "2026-04-12",
  },
];

const STATUS_CONFIG = {
  pending: {
    label: "Pending Approval",
    className: "bg-muted text-muted-foreground border-border",
  },
  approved: {
    label: "Active",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const ORDER_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground border-border",
  },
  completed: {
    label: "Completed",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

interface ListingFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  available: boolean;
}

const EMPTY_FORM: ListingFormData = {
  title: "",
  description: "",
  price: "",
  category: "",
  available: true,
};

export default function VendorDashboardPage() {
  const [listings, setListings] = useState<Listing[]>(
    mockListings.filter((l) => l.vendorId === 1),
  );
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ListingFormData>(EMPTY_FORM);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [activeTab, setActiveTab] = useState("listings");

  const stats = {
    totalListings: listings.length,
    activeOrders: orders.filter((o) => o.status === "pending").length,
    earnings: EARNINGS.month,
    rating: 4.5,
  };

  function openAddForm() {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(listing: Listing) {
    setFormData({
      title: listing.name,
      description: listing.description,
      price: String(listing.price),
      category: listing.category,
      available: listing.available,
    });
    setEditingId(listing.id);
    setShowForm(true);
  }

  function handleSave() {
    if (editingId !== null) {
      setListings((prev) =>
        prev.map((l) =>
          l.id === editingId
            ? {
                ...l,
                name: formData.title,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                available: formData.available,
              }
            : l,
        ),
      );
    } else {
      const newListing: Listing = {
        id: Date.now(),
        vendorId: 1,
        name: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        available: formData.available,
      };
      setListings((prev) => [...prev, newListing]);
    }
    setShowForm(false);
    setEditingId(null);
  }

  function handleDelete(id: number) {
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  function handleToggleAvailable(id: number) {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, available: !l.available } : l)),
    );
  }

  function handleOrderAction(id: number, action: "completed" | "rejected") {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: action } : o)),
    );
  }

  const statusCfg = STATUS_CONFIG[VENDOR_STATUS];

  return (
    <VendorLayout title="Vendor Dashboard">
      {/* Status banner */}
      {VENDOR_STATUS === "pending" && (
        <div
          className="mb-5 flex items-center gap-3 bg-muted border border-border rounded-xl px-4 py-3"
          data-ocid="vendor_dashboard.pending_banner"
        >
          <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <p className="text-sm font-body text-foreground">
            <span className="font-semibold">
              Your application is under review.
            </span>{" "}
            Ezy1 team will verify and activate your account within 24–48 hours.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            {VENDOR_NAME}
          </h2>
          <Badge className={`mt-1 text-xs ${statusCfg.className}`}>
            ● {statusCfg.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Star className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">{stats.rating}</span>
          <span>rating</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Package}
          label="Total Listings"
          value={String(stats.totalListings)}
          color="text-secondary"
          bg="bg-secondary/10"
          ocid="vendor_dashboard.stat.listings"
        />
        <StatCard
          icon={ShoppingCart}
          label="Active Orders"
          value={String(stats.activeOrders)}
          color="text-primary"
          bg="bg-primary/10"
          ocid="vendor_dashboard.stat.orders"
        />
        <StatCard
          icon={IndianRupee}
          label="Total Earnings"
          value={`₹${stats.earnings.toLocaleString("en-IN")}`}
          color="text-accent"
          bg="bg-accent/10"
          ocid="vendor_dashboard.stat.earnings"
        />
        <StatCard
          icon={Star}
          label="Rating"
          value={String(stats.rating)}
          color="text-primary"
          bg="bg-primary/10"
          ocid="vendor_dashboard.stat.rating"
        />
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        data-ocid="vendor_dashboard.tabs"
      >
        <TabsList className="mb-5">
          <TabsTrigger
            value="listings"
            data-ocid="vendor_dashboard.tab.listings"
          >
            My Listings
          </TabsTrigger>
          <TabsTrigger value="orders" data-ocid="vendor_dashboard.tab.orders">
            Orders / Requests
          </TabsTrigger>
          <TabsTrigger
            value="earnings"
            data-ocid="vendor_dashboard.tab.earnings"
          >
            Earnings
          </TabsTrigger>
        </TabsList>

        {/* Listings Tab */}
        <TabsContent value="listings">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              {listings.length} listings
            </span>
            <Button
              size="sm"
              className="gap-2"
              onClick={openAddForm}
              data-ocid="vendor_dashboard.add_listing_button"
            >
              <Plus className="w-4 h-4" /> Add New Listing
            </Button>
          </div>

          {/* Inline form */}
          {showForm && (
            <Card
              className="mb-4 border-2 border-primary/20"
              data-ocid="vendor_dashboard.listing_form"
            >
              <CardContent className="p-5 space-y-4">
                <h3 className="font-display font-semibold text-foreground">
                  {editingId ? "Edit Listing" : "New Listing"}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Title</Label>
                    <Input
                      placeholder="Product name"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      data-ocid="vendor_dashboard.listing_title.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 120"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      data-ocid="vendor_dashboard.listing_price.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) =>
                        setFormData({ ...formData, category: v })
                      }
                    >
                      <SelectTrigger data-ocid="vendor_dashboard.listing_category.select">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grocery">Grocery</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3 pt-5">
                    <Switch
                      checked={formData.available}
                      onCheckedChange={(v) =>
                        setFormData({ ...formData, available: v })
                      }
                      data-ocid="vendor_dashboard.listing_availability.switch"
                    />
                    <Label>Available</Label>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the product..."
                    rows={2}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    data-ocid="vendor_dashboard.listing_description.textarea"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowForm(false)}
                    data-ocid="vendor_dashboard.listing_cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSave}
                    data-ocid="vendor_dashboard.listing_save_button"
                  >
                    {editingId ? "Save Changes" : "Add Listing"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {listings.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="vendor_dashboard.listings_empty_state"
            >
              <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-body">
                No listings yet. Add your first product above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((listing, i) => (
                <Card
                  key={listing.id}
                  data-ocid={`vendor_dashboard.listing.item.${i + 1}`}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-semibold text-sm text-foreground truncate">
                          {listing.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {listing.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {listing.description}
                      </p>
                      <span className="text-sm font-bold text-primary mt-1 block">
                        ₹{listing.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={listing.available}
                        onCheckedChange={() =>
                          handleToggleAvailable(listing.id)
                        }
                        data-ocid={`vendor_dashboard.availability_toggle.${i + 1}`}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditForm(listing)}
                        data-ocid={`vendor_dashboard.edit_button.${i + 1}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-ocid={`vendor_dashboard.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent data-ocid="vendor_dashboard.delete_dialog">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete listing?</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{listing.name}" will be permanently removed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-ocid="vendor_dashboard.delete_cancel_button">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(listing.id)}
                              data-ocid="vendor_dashboard.delete_confirm_button"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <div className="space-y-3">
            {orders.map((order, i) => {
              const cfg = ORDER_STATUS_CONFIG[order.status];
              return (
                <Card
                  key={order.id}
                  data-ocid={`vendor_dashboard.order.item.${i + 1}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <div className="font-display font-semibold text-sm text-foreground">
                          {order.customer}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {order.item}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.date}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-foreground">
                          ₹{order.amount}
                        </span>
                        <Badge className={`text-xs ${cfg.className}`}>
                          {cfg.label}
                        </Badge>
                      </div>
                    </div>
                    {order.status === "pending" && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-1 text-primary border-primary/30 hover:bg-primary/10"
                          onClick={() =>
                            handleOrderAction(order.id, "completed")
                          }
                          data-ocid={`vendor_dashboard.order_accept_button.${i + 1}`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() =>
                            handleOrderAction(order.id, "rejected")
                          }
                          data-ocid={`vendor_dashboard.order_reject_button.${i + 1}`}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card data-ocid="vendor_dashboard.earnings.today">
              <CardContent className="p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Today</div>
                <div className="font-display font-bold text-lg text-foreground">
                  ₹{EARNINGS.today.toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>
            <Card data-ocid="vendor_dashboard.earnings.week">
              <CardContent className="p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  This Week
                </div>
                <div className="font-display font-bold text-lg text-foreground">
                  ₹{EARNINGS.week.toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>
            <Card data-ocid="vendor_dashboard.earnings.month">
              <CardContent className="p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  This Month
                </div>
                <div className="font-display font-bold text-lg text-primary">
                  ₹{EARNINGS.month.toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>
          </div>
          <h3 className="font-display font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-secondary" /> Recent
            Transactions
          </h3>
          <div className="space-y-2">
            {EARNINGS_HISTORY.map((t, i) => (
              <Card
                key={t.id}
                data-ocid={`vendor_dashboard.earnings_tx.item.${i + 1}`}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {t.customer}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.item} · {t.date}
                    </div>
                  </div>
                  <span className="font-bold text-sm text-primary">
                    +₹{t.amount}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </VendorLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
  ocid,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
  ocid: string;
}) {
  return (
    <Card data-ocid={ocid}>
      <CardContent className="p-4 flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground truncate">{label}</div>
          <div className="font-display font-bold text-base text-foreground">
            {value}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
