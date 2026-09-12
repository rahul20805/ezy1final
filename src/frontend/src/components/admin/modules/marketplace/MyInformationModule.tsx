import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Eye,
  FileSpreadsheet,
  History,
  Image as ImageIcon,
  Layers,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Star,
  Stethoscope,
  Store,
  Trash2,
  Truck,
  Wrench,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePartnerAuth } from "../../../../lib/partnerAuthStore";

interface VendorData {
  id: number;
  userId: number;
  businessName: string;
  ownerName: string;
  category: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  status: string;
  rating: number;
  totalOrders: number;
  totalRevenue: number;
  openingHours: string;
  deliveryRadiusKm: number;
  verified: boolean;
  image: string;
  joinedAt?: string;
  // Polymorphic fields
  departments?: string;
  totalBeds?: number;
  availableBeds?: number;
  icuBedsAvailable?: number;
  hasEmergency24x7?: boolean;
  emergencyPhone?: string;
  facilities?: string;
  doctorName?: string;
  specialization?: string;
  qualifications?: string;
  experienceYears?: number;
  consultationFee?: number;
  timings?: string;
  available?: boolean;
  serviceType?: string;
  pricePerHour?: number;
  serviceArea?: string;
  vehicleType?: string;
  routeName?: string;
  fare?: number;
  availableSeats?: number;
  licenseNumber?: string;
}

interface ChangeLogEntry {
  id: number;
  vendorId: number;
  userId: number;
  partnerName: string;
  fieldChanged: string;
  previousValue: string;
  newValue: string;
  timestamp: string;
  operation: string;
  status: string;
}

interface ServiceItem {
  id: number;
  vendorId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
}

export function MyInformationModule() {
  const { currentPartner, token } = usePartnerAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [changes, setChanges] = useState<ChangeLogEntry[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeTab, setActiveTab] = useState("profile");

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFieldKey, setEditFieldKey] = useState<string>("");
  const [editFieldLabel, setEditFieldLabel] = useState<string>("");
  const [editFieldValue, setEditFieldValue] = useState<string>("");
  const [editFieldType, setEditFieldType] = useState<"text" | "number" | "textarea">("text");

  // Service Modal State (Add / Edit)
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [serviceName, setServiceName] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceAvailable, setServiceAvailable] = useState(true);

  // Vendor ID to manage
  const targetVendorId = vendor?.id || currentPartner?.vendorId || 1;

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      const vId = currentPartner?.vendorId && currentPartner.vendorId > 0 ? currentPartner.vendorId : 1;
      const res = await fetch(`/api/vendors/${vId}`);
      if (!res.ok) throw new Error("Could not fetch vendor profile");
      const data = await res.json();
      setVendor(data);

      // Fetch Change Logs
      if (token) {
        const changesRes = await fetch(`/api/vendors/${vId}/changes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (changesRes.ok) {
          const changesData = await changesRes.json();
          if (changesData.success) {
            setChanges(changesData.changes || []);
          }
        }
      }

      // Fetch Services for this partner
      const servicesRes = await fetch(`/api/services?vendorId=${vId}`);
      if (servicesRes.ok) {
        const sData = await servicesRes.json();
        setServices(Array.isArray(sData) ? sData : []);
      }
    } catch (err: any) {
      console.error("Failed to load partner details:", err);
      toast.error("Unable to load latest partner data from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, [currentPartner?.vendorId, token]);

  // Open Edit Modal for a specific field
  const handleOpenEdit = (
    key: string,
    label: string,
    currentVal: any,
    type: "text" | "number" | "textarea" = "text",
  ) => {
    setEditFieldKey(key);
    setEditFieldLabel(label);
    setEditFieldValue(currentVal !== undefined && currentVal !== null ? String(currentVal) : "");
    setEditFieldType(type);
    setEditModalOpen(true);
  };

  // Save single field edit
  const handleSaveField = async () => {
    if (!vendor) return;

    // Basic frontend validations
    if (editFieldKey === "email" && editFieldValue.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editFieldValue.trim())) {
        toast.error("Please enter a valid email address.");
        return;
      }
    }

    if (editFieldKey === "phone" && editFieldValue.trim()) {
      const cleaned = editFieldValue.replace(/[^\d+]/g, "");
      if (cleaned.length < 8) {
        toast.error("Please enter a valid phone number.");
        return;
      }
    }

    if (editFieldType === "number") {
      const parsedNum = Number(editFieldValue);
      if (isNaN(parsedNum) || parsedNum < 0) {
        toast.error("Please enter a valid non-negative number.");
        return;
      }
    }

    try {
      setSaving(true);
      const parsedValue =
        editFieldType === "number" ? Number(editFieldValue) : editFieldValue.trim();

      const payload = {
        [editFieldKey]: parsedValue,
      };

      const res = await fetch(`/api/vendors/${vendor.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to save your changes. Please try again.");
      }

      // Success
      toast.success("Changes saved successfully.");
      setVendor(data.vendor);
      setEditModalOpen(false);

      // Re-fetch change history
      if (token) {
        const changesRes = await fetch(`/api/vendors/${vendor.id}/changes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (changesRes.ok) {
          const cData = await changesRes.json();
          if (cData.changes) setChanges(cData.changes);
        }
      }
    } catch (err: any) {
      console.error("Save failed:", err);
      toast.error(err.message || "Unable to save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Toggle boolean fields (e.g. 24x7 emergency, available status)
  const handleToggleBooleanField = async (key: string, currentValue: boolean) => {
    if (!vendor) return;
    try {
      setSaving(true);
      const payload = { [key]: !currentValue };
      const res = await fetch(`/api/vendors/${vendor.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to save your changes. Please try again.");
      }
      toast.success("Changes saved successfully.");
      setVendor(data.vendor);

      if (token) {
        const changesRes = await fetch(`/api/vendors/${vendor.id}/changes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (changesRes.ok) {
          const cData = await changesRes.json();
          if (cData.changes) setChanges(cData.changes);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Unable to save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Services Management Handlers
  const handleOpenAddService = () => {
    setEditingServiceId(null);
    setServiceName("");
    setServiceDesc("");
    setServicePrice("");
    setServiceAvailable(true);
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (s: ServiceItem) => {
    setEditingServiceId(s.id);
    setServiceName(s.name);
    setServiceDesc(s.description || "");
    setServicePrice(String(s.price));
    setServiceAvailable(s.isAvailable !== false);
    setServiceModalOpen(true);
  };

  const handleSaveService = async () => {
    if (!vendor) return;
    if (!serviceName.trim()) {
      toast.error("Service name is required.");
      return;
    }
    const priceNum = Number(servicePrice);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Please provide a valid price.");
      return;
    }

    try {
      setSaving(true);
      if (editingServiceId) {
        // Update
        const res = await fetch(`/api/services/${editingServiceId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: serviceName.trim(),
            description: serviceDesc.trim(),
            price: priceNum,
            isAvailable: serviceAvailable,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to update service.");
        toast.success("Service updated successfully.");
      } else {
        // Create
        const res = await fetch(`/api/services`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vendorId: vendor.id,
            name: serviceName.trim(),
            description: serviceDesc.trim(),
            price: priceNum,
            category: vendor.category || "Services",
            isAvailable: serviceAvailable,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to create service.");
        toast.success("Service added successfully.");
      }

      setServiceModalOpen(false);
      // Re-fetch services
      const servicesRes = await fetch(`/api/services?vendorId=${vendor.id}`);
      if (servicesRes.ok) {
        const sData = await servicesRes.json();
        setServices(Array.isArray(sData) ? sData : []);
      }
    } catch (err: any) {
      toast.error(err.message || "Unable to save service.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    if (!confirm("Are you sure you want to remove this service from your catalog?")) return;
    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete service.");
      toast.success("Service removed successfully.");
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete service.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center space-y-4 min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">
          Loading authoritative partner information from database...
        </p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
        <h3 className="text-lg font-bold">Partner Record Not Found</h3>
        <p className="text-sm text-muted-foreground">
          No database record found for partner ID {targetVendorId}.
        </p>
        <Button onClick={fetchVendorData} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Retry
        </Button>
      </div>
    );
  }

  const isHealthcare = vendor.category?.toLowerCase() === "healthcare" || vendor.category?.toLowerCase() === "hospital";
  const isDoctor = !!vendor.doctorName || !!vendor.specialization;
  const isServices = vendor.category?.toLowerCase() === "services";
  const isTransport = vendor.category?.toLowerCase() === "transport";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Summary Card */}
      <Card className="border-border shadow-subtle overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 border-b border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={vendor.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80"}
                alt={vendor.businessName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-background shadow-md"
              />
              <button
                onClick={() => handleOpenEdit("image", "Business Profile Image URL", vendor.image, "text")}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-primary-foreground shadow-sm hover:scale-110 transition-transform"
                title="Replace image"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  {vendor.businessName}
                </h2>
                <Badge variant="secondary" className="font-semibold text-xs">
                  {vendor.category}
                </Badge>
                {vendor.verified ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Partner
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Verification Pending
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <span>Partner ID: <strong>#{vendor.id}</strong></span>
                <span>•</span>
                <span>Owner: <strong>{vendor.ownerName}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" /> {vendor.rating.toFixed(1)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              onClick={fetchVendorData}
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl text-xs w-full md:w-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Database View
            </Button>
          </div>
        </div>

        {/* Live Metrics strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border border-b border-border bg-muted/20">
          <div className="p-4 text-center">
            <p className="text-xs text-muted-foreground font-medium">Orders / Bookings</p>
            <p className="text-lg font-bold text-foreground mt-0.5">{vendor.totalOrders || 0}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-muted-foreground font-medium">Operational Status</p>
            <p className="text-lg font-bold text-emerald-600 mt-0.5 capitalize">
              {vendor.status || "Active"}
            </p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-muted-foreground font-medium">Operating Hours</p>
            <p className="text-sm font-semibold text-foreground mt-1 truncate">
              {vendor.openingHours || "09:00 AM - 09:00 PM"}
            </p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-muted-foreground font-medium">Audit History</p>
            <p className="text-lg font-bold text-primary mt-0.5">{changes.length} Updates Logged</p>
          </div>
        </div>
      </Card>

      {/* 2. My Information Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-2xl flex-wrap h-auto gap-1">
          <TabsTrigger value="profile" className="rounded-xl text-xs font-semibold gap-1.5 py-2">
            <Store className="w-3.5 h-3.5" /> Business Profile
          </TabsTrigger>
          <TabsTrigger value="operations" className="rounded-xl text-xs font-semibold gap-1.5 py-2">
            <Clock className="w-3.5 h-3.5" /> Operations & Timings
          </TabsTrigger>
          {isHealthcare && (
            <TabsTrigger value="healthcare" className="rounded-xl text-xs font-semibold gap-1.5 py-2">
              <Building2 className="w-3.5 h-3.5" /> Hospital & Beds
            </TabsTrigger>
          )}
          {isDoctor && (
            <TabsTrigger value="doctor" className="rounded-xl text-xs font-semibold gap-1.5 py-2">
              <Stethoscope className="w-3.5 h-3.5" /> Doctor Consultations
            </TabsTrigger>
          )}
          {isServices && (
            <TabsTrigger value="services_cat" className="rounded-xl text-xs font-semibold gap-1.5 py-2">
              <Wrench className="w-3.5 h-3.5" /> Services & Rates
            </TabsTrigger>
          )}
          {isTransport && (
            <TabsTrigger value="transport_cat" className="rounded-xl text-xs font-semibold gap-1.5 py-2">
              <Truck className="w-3.5 h-3.5" /> Fleet & Routes
            </TabsTrigger>
          )}
          <TabsTrigger value="catalog" className="rounded-xl text-xs font-semibold gap-1.5 py-2">
            <Layers className="w-3.5 h-3.5" /> Services Catalog ({services.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl text-xs font-semibold gap-1.5 py-2">
            <History className="w-3.5 h-3.5" /> Change History ({changes.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Business Profile */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span>Core Business Information</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Changes save directly to database without code redeployment
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 divide-y divide-border">
              {/* Field: Business Name */}
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Business / Brand Name
                  </Label>
                  <p className="text-base font-bold text-foreground mt-0.5">{vendor.businessName}</p>
                </div>
                <Button
                  onClick={() => handleOpenEdit("businessName", "Business Name", vendor.businessName, "text")}
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1.5 text-xs self-start sm:self-auto"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </Button>
              </div>

              {/* Field: Description */}
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="max-w-2xl">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Public Description / About
                  </Label>
                  <p className="text-sm text-foreground mt-1 leading-relaxed">
                    {vendor.description || "No public description provided."}
                  </p>
                </div>
                <Button
                  onClick={() => handleOpenEdit("description", "Public Description", vendor.description, "textarea")}
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1.5 text-xs self-start sm:self-auto flex-shrink-0"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </Button>
              </div>

              {/* Field: Owner Name */}
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Authorized Owner / Contact Person
                  </Label>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{vendor.ownerName}</p>
                </div>
                <Button
                  onClick={() => handleOpenEdit("ownerName", "Owner Name", vendor.ownerName, "text")}
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1.5 text-xs self-start sm:self-auto"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </Button>
              </div>

              {/* Field: Phone */}
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Customer Contact Phone
                  </Label>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{vendor.phone}</p>
                </div>
                <Button
                  onClick={() => handleOpenEdit("phone", "Customer Contact Phone", vendor.phone, "text")}
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1.5 text-xs self-start sm:self-auto"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </Button>
              </div>

              {/* Field: Email */}
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Business Email
                  </Label>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{vendor.email}</p>
                </div>
                <Button
                  onClick={() => handleOpenEdit("email", "Business Email", vendor.email, "text")}
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1.5 text-xs self-start sm:self-auto"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </Button>
              </div>

              {/* Field: Address & City */}
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Physical Address & City
                  </Label>
                  <p className="text-sm font-semibold text-foreground mt-0.5">
                    {vendor.address}, {vendor.city}
                  </p>
                </div>
                <div className="flex gap-2 self-start sm:self-auto">
                  <Button
                    onClick={() => handleOpenEdit("address", "Street Address", vendor.address, "text")}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Address
                  </Button>
                  <Button
                    onClick={() => handleOpenEdit("city", "Operating City", vendor.city, "text")}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs"
                  >
                    <Edit2 className="w-3 h-3" /> Edit City
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: Operations & Timings */}
        <TabsContent value="operations" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold">Operational Schedules & Delivery Coverage</CardTitle>
            </CardHeader>
            <CardContent className="p-6 divide-y divide-border">
              {/* Opening Hours */}
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Operating Hours / Timings
                  </Label>
                  <p className="text-base font-bold text-foreground mt-0.5">{vendor.openingHours}</p>
                </div>
                <Button
                  onClick={() => handleOpenEdit("openingHours", "Operating Hours", vendor.openingHours, "text")}
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1.5 text-xs self-start sm:self-auto"
                >
                  <Edit2 className="w-3 h-3" /> Edit Hours
                </Button>
              </div>

              {/* Delivery Radius */}
              <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Delivery / Service Radius
                  </Label>
                  <p className="text-base font-bold text-foreground mt-0.5">
                    {vendor.deliveryRadiusKm || 10} Kilometers
                  </p>
                </div>
                <Button
                  onClick={() => handleOpenEdit("deliveryRadiusKm", "Service Radius (km)", vendor.deliveryRadiusKm, "number")}
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1.5 text-xs self-start sm:self-auto"
                >
                  <Edit2 className="w-3 h-3" /> Edit Radius
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: Healthcare / Hospital Specific */}
        {isHealthcare && (
          <TabsContent value="healthcare" className="space-y-4">
            <Card className="border-border shadow-xs">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" /> Hospital Facilities & Live Bed Tracking
                </CardTitle>
                <CardDescription className="text-xs">
                  Real-time bed counts and emergency information shown directly to patients
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 divide-y divide-border">
                {/* Available General Beds */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Currently Available General Beds
                    </Label>
                    <p className="text-xl font-black text-emerald-600 mt-0.5">
                      {vendor.availableBeds || 0} Beds Available
                    </p>
                    <span className="text-xs text-muted-foreground">
                      Total Capacity: {vendor.totalBeds || 0} Beds
                    </span>
                  </div>
                  <div className="flex gap-2 self-start sm:self-auto">
                    <Button
                      onClick={() => handleOpenEdit("availableBeds", "Available General Beds", vendor.availableBeds, "number")}
                      variant="outline"
                      size="sm"
                      className="rounded-xl gap-1.5 text-xs"
                    >
                      <Edit2 className="w-3 h-3" /> Update Available Beds
                    </Button>
                    <Button
                      onClick={() => handleOpenEdit("totalBeds", "Total Bed Capacity", vendor.totalBeds, "number")}
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-xs text-muted-foreground"
                    >
                      Edit Total Capacity
                    </Button>
                  </div>
                </div>

                {/* ICU Beds Available */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Available ICU / Ventilator Beds
                    </Label>
                    <p className="text-xl font-black text-rose-600 mt-0.5">
                      {vendor.icuBedsAvailable || 0} ICU Beds Available
                    </p>
                  </div>
                  <Button
                    onClick={() => handleOpenEdit("icuBedsAvailable", "Available ICU Beds", vendor.icuBedsAvailable, "number")}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs self-start sm:self-auto"
                  >
                    <Edit2 className="w-3 h-3" /> Update ICU Beds
                  </Button>
                </div>

                {/* 24x7 Emergency Status */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      24x7 Emergency Trauma Unit Status
                    </Label>
                    <p className="text-sm font-bold text-foreground mt-0.5">
                      {vendor.hasEmergency24x7 ? "Active 24x7 Emergency" : "Standard Hours Only"}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleToggleBooleanField("hasEmergency24x7", !!vendor.hasEmergency24x7)}
                    variant={vendor.hasEmergency24x7 ? "default" : "outline"}
                    size="sm"
                    className="rounded-xl text-xs self-start sm:self-auto"
                  >
                    {vendor.hasEmergency24x7 ? "Disable 24x7 Status" : "Enable 24x7 Emergency"}
                  </Button>
                </div>

                {/* Emergency Phone */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Emergency Ambulance & Trauma Hotline
                    </Label>
                    <p className="text-base font-bold text-rose-600 mt-0.5">
                      {vendor.emergencyPhone || vendor.phone}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleOpenEdit("emergencyPhone", "Emergency Hotline Phone", vendor.emergencyPhone || vendor.phone, "text")}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs self-start sm:self-auto"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Hotline
                  </Button>
                </div>

                {/* Departments List */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="max-w-2xl">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Hospital Departments
                    </Label>
                    <p className="text-sm text-foreground mt-1">
                      {vendor.departments || "Cardiology, Emergency, ICU, General Medicine"}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleOpenEdit("departments", "Departments (comma separated)", vendor.departments, "textarea")}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs self-start sm:self-auto flex-shrink-0"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Departments
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* TAB: Doctor Specific */}
        {isDoctor && (
          <TabsContent value="doctor" className="space-y-4">
            <Card className="border-border shadow-xs">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" /> Doctor Practice & Consultation Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 divide-y divide-border">
                {/* Specialization */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Specialization & Qualifications
                    </Label>
                    <p className="text-base font-bold text-foreground mt-0.5">{vendor.specialization}</p>
                    <span className="text-xs text-muted-foreground">{vendor.qualifications}</span>
                  </div>
                  <div className="flex gap-2 self-start sm:self-auto">
                    <Button
                      onClick={() => handleOpenEdit("specialization", "Doctor Specialization", vendor.specialization, "text")}
                      variant="outline"
                      size="sm"
                      className="rounded-xl gap-1.5 text-xs"
                    >
                      <Edit2 className="w-3 h-3" /> Edit Specialty
                    </Button>
                    <Button
                      onClick={() => handleOpenEdit("qualifications", "Doctor Qualifications", vendor.qualifications, "text")}
                      variant="outline"
                      size="sm"
                      className="rounded-xl gap-1.5 text-xs"
                    >
                      <Edit2 className="w-3 h-3" /> Edit Degrees
                    </Button>
                  </div>
                </div>

                {/* Consultation Fee */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Consultation Fee (₹)
                    </Label>
                    <p className="text-xl font-bold text-primary mt-0.5">
                      ₹{vendor.consultationFee || 300}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleOpenEdit("consultationFee", "Consultation Fee (₹)", vendor.consultationFee, "number")}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs self-start sm:self-auto"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Fee
                  </Button>
                </div>

                {/* Consultation Timings */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Clinic Consultation Hours
                    </Label>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {vendor.timings || vendor.openingHours}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleOpenEdit("timings", "Consultation Timings", vendor.timings || vendor.openingHours, "text")}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs self-start sm:self-auto"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Timings
                  </Button>
                </div>

                {/* Availability Status */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Appointment Booking Status
                    </Label>
                    <p className="text-sm font-bold text-foreground mt-0.5">
                      {vendor.available !== false ? "Accepting Appointments" : "Currently Unavailable"}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleToggleBooleanField("available", vendor.available !== false)}
                    variant={vendor.available !== false ? "default" : "outline"}
                    size="sm"
                    className="rounded-xl text-xs self-start sm:self-auto"
                  >
                    {vendor.available !== false ? "Mark Unavailable" : "Mark Available"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* TAB: Home Services Specific */}
        {isServices && (
          <TabsContent value="services_cat" className="space-y-4">
            <Card className="border-border shadow-xs">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-primary" /> Service Professional Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 divide-y divide-border">
                {/* Service Type */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Primary Trade / Service Specialty
                    </Label>
                    <p className="text-base font-bold text-foreground mt-0.5">
                      {vendor.serviceType || "Electrician & Appliance Specialist"}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleOpenEdit("serviceType", "Primary Trade", vendor.serviceType, "text")}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs self-start sm:self-auto"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Trade
                  </Button>
                </div>

                {/* Hourly Rate */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Standard Hourly / Inspection Rate (₹)
                    </Label>
                    <p className="text-xl font-bold text-primary mt-0.5">
                      ₹{vendor.pricePerHour || 299} / hr
                    </p>
                  </div>
                  <Button
                    onClick={() => handleOpenEdit("pricePerHour", "Hourly Rate (₹)", vendor.pricePerHour, "number")}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs self-start sm:self-auto"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Rate
                  </Button>
                </div>

                {/* Service Area */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Primary Service Zones
                    </Label>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {vendor.serviceArea || "All City Zones"}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleOpenEdit("serviceArea", "Service Area", vendor.serviceArea, "text")}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs self-start sm:self-auto"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Area
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* TAB: Transport Specific */}
        {isTransport && (
          <TabsContent value="transport_cat" className="space-y-4">
            <Card className="border-border shadow-xs">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" /> Vehicle Fleet & Route Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 divide-y divide-border">
                {/* Vehicle Type */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Vehicle Fleet Category
                    </Label>
                    <p className="text-base font-bold text-foreground mt-0.5">
                      {vendor.vehicleType || "Sedan / AC Cab"}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleOpenEdit("vehicleType", "Vehicle Category", vendor.vehicleType, "text")}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs self-start sm:self-auto"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Vehicle
                  </Button>
                </div>

                {/* Route Name */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Route / Service Corridor
                    </Label>
                    <p className="text-base font-bold text-foreground mt-0.5">
                      {vendor.routeName || "Citywide & Airport Express"}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleOpenEdit("routeName", "Route Name", vendor.routeName, "text")}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs self-start sm:self-auto"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Route
                  </Button>
                </div>

                {/* Standard Fare */}
                <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Base Fare (₹)
                    </Label>
                    <p className="text-xl font-bold text-primary mt-0.5">
                      ₹{vendor.fare || 499}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleOpenEdit("fare", "Base Fare (₹)", vendor.fare, "number")}
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-xs self-start sm:self-auto"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Fare
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* TAB 4: Services Catalog (Add / Edit / Delete) */}
        <TabsContent value="catalog" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Services Catalog</CardTitle>
                <CardDescription className="text-xs">
                  Manage individual bookable services and price offerings
                </CardDescription>
              </div>
              <Button onClick={handleOpenAddService} size="sm" className="rounded-xl gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" /> Add Service
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {services.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Layers className="w-8 h-8 mx-auto opacity-40 mb-2" />
                  <p className="text-sm font-medium">No services registered yet.</p>
                  <Button onClick={handleOpenAddService} variant="outline" size="sm" className="mt-3 rounded-xl text-xs">
                    Create First Service
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {services.map((s) => (
                    <div key={s.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-foreground">{s.name}</h4>
                          <Badge variant="outline" className="text-[10px]">
                            ₹{s.price}
                          </Badge>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              s.isAvailable !== false ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                        </div>
                        {s.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 max-w-xl line-clamp-1">
                            {s.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => handleOpenEditService(s)}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs rounded-lg"
                        >
                          <Edit2 className="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteService(s.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs rounded-lg text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: Change History (Audit Trail) */}
        <TabsContent value="history" className="space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-primary" /> Immutable Change Audit Log
              </CardTitle>
              <CardDescription className="text-xs">
                Complete historical record of all profile changes made by partner #{targetVendorId}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {changes.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <History className="w-8 h-8 mx-auto opacity-40 mb-2" />
                  <p className="text-sm font-medium">No historical changes recorded yet.</p>
                </div>
              ) : (
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Field Changed</th>
                      <th className="py-3 px-4">Previous Value</th>
                      <th className="py-3 px-4">New Value</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {changes.map((c) => (
                      <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap text-muted-foreground">
                          {new Date(c.timestamp).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3 px-4 font-bold text-foreground capitalize">
                          {c.fieldChanged}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground max-w-[200px] truncate" title={c.previousValue}>
                          {c.previousValue || "—"}
                        </td>
                        <td className="py-3 px-4 font-semibold text-emerald-600 max-w-[200px] truncate" title={c.newValue}>
                          {c.newValue}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                            {c.status || "Applied"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Field Edit Dialog Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Edit {editFieldLabel}</DialogTitle>
            <DialogDescription className="text-xs">
              Saving updates this field immediately in the database and propagates changes to customer pages.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{editFieldLabel}</Label>
              {editFieldType === "textarea" ? (
                <Textarea
                  rows={4}
                  value={editFieldValue}
                  onChange={(e) => setEditFieldValue(e.target.value)}
                  className="rounded-xl text-sm"
                  placeholder={`Enter ${editFieldLabel}...`}
                />
              ) : (
                <Input
                  type={editFieldType}
                  value={editFieldValue}
                  onChange={(e) => setEditFieldValue(e.target.value)}
                  className="rounded-xl text-sm"
                  placeholder={`Enter ${editFieldLabel}...`}
                />
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              className="rounded-xl text-xs"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveField}
              disabled={saving}
              className="rounded-xl text-xs gap-1.5 font-bold bg-primary text-primary-foreground"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Service Modal */}
      <Dialog open={serviceModalOpen} onOpenChange={setServiceModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingServiceId ? "Edit Service" : "Add New Service Offering"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure services that customers can discover and book on Ezy1.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Service Name *</Label>
              <Input
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g. AC Filter Deep Cleaning"
                className="rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Price (₹) *</Label>
              <Input
                type="number"
                value={servicePrice}
                onChange={(e) => setServicePrice(e.target.value)}
                placeholder="e.g. 499"
                className="rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Description</Label>
              <Textarea
                rows={3}
                value={serviceDesc}
                onChange={(e) => setServiceDesc(e.target.value)}
                placeholder="Details about what's included..."
                className="rounded-xl text-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="srv-avail"
                checked={serviceAvailable}
                onChange={(e) => setServiceAvailable(e.target.checked)}
                className="rounded border-border"
              />
              <Label htmlFor="srv-avail" className="text-xs cursor-pointer">
                Service is available for booking
              </Label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setServiceModalOpen(false)}
              className="rounded-xl text-xs"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveService}
              disabled={saving}
              className="rounded-xl text-xs gap-1.5 font-bold"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {editingServiceId ? "Save Changes" : "Create Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
