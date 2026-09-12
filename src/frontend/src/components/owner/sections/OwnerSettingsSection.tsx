import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Clock,
  CreditCard,
  Download,
  FileCode,
  Globe,
  HelpCircle,
  Lock,
  Phone,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Shield,
  Sparkles,
  Truck,
  Upload,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { usePartnerAuth } from "../../../lib/partnerAuthStore";
import { type OwnerSettings, useStoreData } from "../../../lib/storeData";
import { ConfirmModal } from "../ConfirmModal";
import { ImageUploader } from "../ImageUploader";

export function OwnerSettingsSection() {
  const store = useStoreData();
  const {
    currentPartner,
    partners,
    addPartner,
    updatePartner,
    deletePartner,
    resetPartnersToDefault,
  } = usePartnerAuth();

  const isSuperOwner = currentPartner?.role === "super_owner";

  // Form State
  const [formData, setFormData] = useState<OwnerSettings>({
    ...store.settings,
  });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");

  // New Partner Account Dialog State
  const [newPartnerId, setNewPartnerId] = useState("");
  const [newPartnerPassword, setNewPartnerPassword] = useState("");
  const [newPartnerBusiness, setNewPartnerBusiness] = useState("");
  const [newPartnerOwner, setNewPartnerOwner] = useState("");
  const [newPartnerCategory, setNewPartnerCategory] = useState<any>("Grocery");
  const [newPartnerPhone, setNewPartnerPhone] = useState("");

  const handleChange = <K extends keyof OwnerSettings>(
    key: K,
    value: OwnerSettings[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveAllSettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings(formData);
    toast.success(
      "Owner Settings saved & immediately synchronized with live website!",
    );
  };

  const handleExportJson = () => {
    const dataStr = store.exportDatabaseJson();
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ezy1-database-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Complete database JSON backup downloaded!");
  };

  const handleImportJson = () => {
    if (!importJsonText.trim()) {
      toast.error("Please paste valid JSON data.");
      return;
    }
    const success = store.importDatabaseJson(importJsonText);
    if (success) {
      setFormData({ ...store.settings });
      toast.success("Database restored successfully from JSON backup!");
      setIsImportModalOpen(false);
      setImportJsonText("");
    } else {
      toast.error("Failed to parse JSON backup. Please check format.");
    }
  };

  const handleCreatePartnerAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newPartnerId.trim() ||
      !newPartnerPassword.trim() ||
      !newPartnerBusiness.trim()
    ) {
      toast.error("Partner ID, Password and Business Name are required.");
      return;
    }

    if (
      partners.some(
        (p) => p.id.toLowerCase() === newPartnerId.trim().toLowerCase(),
      )
    ) {
      toast.error("A partner with this Admin/Login ID already exists.");
      return;
    }

    addPartner({
      id: newPartnerId.trim().toLowerCase(),
      password: newPartnerPassword.trim(),
      businessName: newPartnerBusiness.trim(),
      ownerName: newPartnerOwner.trim() || newPartnerBusiness.trim(),
      category: newPartnerCategory,
      role: "partner",
      phone: newPartnerPhone.trim() || "9876543210",
      email: `${newPartnerId.trim()}@partner.ezy1.in`,
      city: "Bengaluru",
      vendorId: Date.now(),
      status: "active",
      permissions: {
        canManageShop: true,
        canManageServices: newPartnerCategory === "Services",
        canManageBookings:
          newPartnerCategory === "Workshops" ||
          newPartnerCategory === "Healthcare",
        canManageOrders: true,
        canManageEnquiries: true,
        canManageCustomers: true,
        canManageGallery: true,
        canManageReviews: true,
        canManageWebsiteContent: false,
        canManageCategories: false,
        canManageOwnerSettings: false,
      },
    });

    toast.success(
      `New Partner Account "${newPartnerId}" created with individual access!`,
    );
    setNewPartnerId("");
    setNewPartnerPassword("");
    setNewPartnerBusiness("");
    setNewPartnerOwner("");
    setNewPartnerPhone("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
            Master Owner & Platform Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Configure business identity, WhatsApp, delivery rules, UPI payments,
            SEO, store policies, and manage partner logins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            className="text-xs h-9 rounded-xl gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Backup DB
          </Button>
          <Button
            type="button"
            onClick={handleSaveAllSettings}
            className="text-xs h-9 rounded-xl bg-primary text-primary-foreground font-semibold gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" /> Save All Settings
          </Button>
        </div>
      </div>

      <form onSubmit={handleSaveAllSettings}>
        <Tabs defaultValue="business" className="space-y-6">
          <TabsList className="bg-muted/80 p-1 rounded-2xl flex-wrap h-auto gap-1">
            <TabsTrigger
              value="business"
              className="rounded-xl text-xs gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" /> Business Info
            </TabsTrigger>
            <TabsTrigger
              value="delivery"
              className="rounded-xl text-xs gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" /> Delivery & Hours
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="rounded-xl text-xs gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" /> Payments & UPI
            </TabsTrigger>
            <TabsTrigger value="seo" className="rounded-xl text-xs gap-1.5">
              <Search className="w-3.5 h-3.5" /> SEO & Social
            </TabsTrigger>
            <TabsTrigger
              value="policies"
              className="rounded-xl text-xs gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" /> Policies
            </TabsTrigger>
            {isSuperOwner && (
              <TabsTrigger
                value="partners"
                className="rounded-xl text-xs gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" /> Partner Logins (
                {partners.length})
              </TabsTrigger>
            )}
            <TabsTrigger
              value="database"
              className="rounded-xl text-xs gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> DB Tools
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Business Info */}
          <TabsContent value="business">
            <Card className="rounded-3xl border-border bg-card shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-display font-bold">
                  Business Identification & Contact
                </CardTitle>
                <CardDescription className="text-xs">
                  This information appears across the website header, footer,
                  invoices and WhatsApp click-to-chat.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Brand Display Name *
                    </Label>
                    <Input
                      value={formData.brandName}
                      onChange={(e) =>
                        handleChange("brandName", e.target.value)
                      }
                      className="rounded-xl text-sm font-display font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Tagline</Label>
                    <Input
                      value={formData.tagline}
                      onChange={(e) => handleChange("tagline", e.target.value)}
                      className="rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Official WhatsApp Number (Click-to-Chat) *
                    </Label>
                    <Input
                      placeholder="+919876543210"
                      value={formData.whatsappNumber}
                      onChange={(e) =>
                        handleChange("whatsappNumber", e.target.value)
                      }
                      className="rounded-xl text-sm font-mono text-emerald-600 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Customer Support Phone
                    </Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Support Email
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Store Address
                    </Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      City & State
                    </Label>
                    <Input
                      value={`${formData.city}, ${formData.state}`}
                      onChange={(e) => {
                        const parts = e.target.value.split(",");
                        handleChange("city", parts[0]?.trim() || "");
                        handleChange("state", parts[1]?.trim() || "");
                      }}
                      className="rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      GST / Tax Registration Number
                    </Label>
                    <Input
                      value={formData.gstNumber}
                      onChange={(e) =>
                        handleChange("gstNumber", e.target.value)
                      }
                      className="rounded-xl font-mono text-sm uppercase"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: Delivery & Hours */}
          <TabsContent value="delivery">
            <Card className="rounded-3xl border-border bg-card shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-display font-bold">
                  Operational Hours & Delivery Rules
                </CardTitle>
                <CardDescription className="text-xs">
                  Set delivery fees, free delivery limits, radius and business
                  working hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Operational Hours Text
                    </Label>
                    <Input
                      value={formData.openingHours}
                      onChange={(e) =>
                        handleChange("openingHours", e.target.value)
                      }
                      className="rounded-xl text-sm"
                      placeholder="Mon - Sun: 6:00 AM - 11:30 PM"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border">
                    <div>
                      <Label className="text-xs font-semibold">
                        Open For Orders Today
                      </Label>
                      <p className="text-[11px] text-muted-foreground">
                        Accept live orders on site
                      </p>
                    </div>
                    <Switch
                      checked={formData.isOpenToday}
                      onCheckedChange={(val) =>
                        handleChange("isOpenToday", val)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Min Order Amount (₹)
                    </Label>
                    <Input
                      type="number"
                      value={formData.minimumOrderAmount}
                      onChange={(e) =>
                        handleChange(
                          "minimumOrderAmount",
                          Number(e.target.value),
                        )
                      }
                      className="rounded-xl font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Free Delivery Above (₹)
                    </Label>
                    <Input
                      type="number"
                      value={formData.freeDeliveryThreshold}
                      onChange={(e) =>
                        handleChange(
                          "freeDeliveryThreshold",
                          Number(e.target.value),
                        )
                      }
                      className="rounded-xl font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Standard Delivery Fee (₹)
                    </Label>
                    <Input
                      type="number"
                      value={formData.standardDeliveryFee}
                      onChange={(e) =>
                        handleChange(
                          "standardDeliveryFee",
                          Number(e.target.value),
                        )
                      }
                      className="rounded-xl font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Service Delivery Radius (km)
                    </Label>
                    <Input
                      type="number"
                      value={formData.deliveryRadiusKm}
                      onChange={(e) =>
                        handleChange("deliveryRadiusKm", Number(e.target.value))
                      }
                      className="rounded-xl font-bold"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: Payments & UPI */}
          <TabsContent value="payments">
            <Card className="rounded-3xl border-border bg-card shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-display font-bold">
                  Payment Methods & UPI Gateway
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure UPI IDs for QR code / Intent payments and toggle
                  supported checkout options.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Business UPI ID (GPay / PhonePe / Paytm) *
                  </Label>
                  <Input
                    value={formData.upiId}
                    onChange={(e) => handleChange("upiId", e.target.value)}
                    className="rounded-xl font-mono text-sm font-bold text-primary max-w-md"
                    placeholder="ezy1business@okhdfcbank"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Used to receive direct UPI payments from customers at
                    checkout.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border">
                    <div>
                      <Label className="text-xs font-semibold">
                        Enable Instant UPI
                      </Label>
                      <p className="text-[11px] text-muted-foreground">
                        GPay, PhonePe, Paytm, BHIM
                      </p>
                    </div>
                    <Switch
                      checked={formData.enableUpi}
                      onCheckedChange={(val) => handleChange("enableUpi", val)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border">
                    <div>
                      <Label className="text-xs font-semibold">
                        Enable Cash on Delivery (COD)
                      </Label>
                      <p className="text-[11px] text-muted-foreground">
                        Collect cash/UPI upon delivery
                      </p>
                    </div>
                    <Switch
                      checked={formData.enableCod}
                      onCheckedChange={(val) => handleChange("enableCod", val)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border">
                    <div>
                      <Label className="text-xs font-semibold">
                        Enable In-App Wallet
                      </Label>
                      <p className="text-[11px] text-muted-foreground">
                        Allow instant checkout using Ezy1 balance
                      </p>
                    </div>
                    <Switch
                      checked={formData.enableWallet}
                      onCheckedChange={(val) =>
                        handleChange("enableWallet", val)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border">
                    <div>
                      <Label className="text-xs font-semibold">
                        Enable Online Card Payments
                      </Label>
                      <p className="text-[11px] text-muted-foreground">
                        Debit & Credit card gateway
                      </p>
                    </div>
                    <Switch
                      checked={formData.enableOnlineCards}
                      onCheckedChange={(val) =>
                        handleChange("enableOnlineCards", val)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: SEO & Social */}
          <TabsContent value="seo">
            <Card className="rounded-3xl border-border bg-card shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-display font-bold">
                  SEO Metadata & Social Handles
                </CardTitle>
                <CardDescription className="text-xs">
                  Optimize search engine indexing and link your official social
                  channels.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Meta SEO Title
                  </Label>
                  <Input
                    value={formData.metaTitle}
                    onChange={(e) => handleChange("metaTitle", e.target.value)}
                    className="rounded-xl text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Meta SEO Description
                  </Label>
                  <Textarea
                    rows={2}
                    value={formData.metaDescription}
                    onChange={(e) =>
                      handleChange("metaDescription", e.target.value)
                    }
                    className="rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Instagram URL
                    </Label>
                    <Input
                      value={formData.instagramUrl}
                      onChange={(e) =>
                        handleChange("instagramUrl", e.target.value)
                      }
                      className="rounded-xl text-xs"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Facebook URL
                    </Label>
                    <Input
                      value={formData.facebookUrl}
                      onChange={(e) =>
                        handleChange("facebookUrl", e.target.value)
                      }
                      className="rounded-xl text-xs"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">YouTube URL</Label>
                    <Input
                      value={formData.youtubeUrl}
                      onChange={(e) =>
                        handleChange("youtubeUrl", e.target.value)
                      }
                      className="rounded-xl text-xs"
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: Policies */}
          <TabsContent value="policies">
            <Card className="rounded-3xl border-border bg-card shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-display font-bold">
                  Store Policies & Legal Terms
                </CardTitle>
                <CardDescription className="text-xs">
                  Customize return windows, cancellation charges, terms of
                  service and privacy guarantees.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Return & Replacement Policy
                    </Label>
                    <Textarea
                      rows={3}
                      value={formData.returnPolicy}
                      onChange={(e) =>
                        handleChange("returnPolicy", e.target.value)
                      }
                      className="rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Order Cancellation Policy
                    </Label>
                    <Textarea
                      rows={3}
                      value={formData.cancellationPolicy}
                      onChange={(e) =>
                        handleChange("cancellationPolicy", e.target.value)
                      }
                      className="rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Terms & Conditions
                    </Label>
                    <Textarea
                      rows={3}
                      value={formData.termsAndConditions}
                      onChange={(e) =>
                        handleChange("termsAndConditions", e.target.value)
                      }
                      className="rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Privacy Policy
                    </Label>
                    <Textarea
                      rows={3}
                      value={formData.privacyPolicy}
                      onChange={(e) =>
                        handleChange("privacyPolicy", e.target.value)
                      }
                      className="rounded-xl text-xs"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 6: Partner Accounts Manager (Super Owner Only) */}
          {isSuperOwner && (
            <TabsContent value="partners" className="space-y-6">
              {/* Add New Partner Form */}
              <Card className="rounded-3xl border-border bg-card shadow-xs">
                <CardHeader>
                  <CardTitle className="text-base font-display font-bold">
                    Create New Partner Login & Access
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Issue individual credentials to store owners, healthcare
                    providers, drivers and service specialists.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">
                        Unique Login / Admin ID *
                      </Label>
                      <Input
                        required
                        placeholder="e.g. sharma_kirana"
                        value={newPartnerId}
                        onChange={(e) => setNewPartnerId(e.target.value)}
                        className="rounded-xl font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">
                        Password *
                      </Label>
                      <Input
                        type="text"
                        required
                        placeholder="e.g. partner123"
                        value={newPartnerPassword}
                        onChange={(e) => setNewPartnerPassword(e.target.value)}
                        className="rounded-xl font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">
                        Business / Store Name *
                      </Label>
                      <Input
                        required
                        placeholder="e.g. Sharma Kirana Store"
                        value={newPartnerBusiness}
                        onChange={(e) => setNewPartnerBusiness(e.target.value)}
                        className="rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">
                        Owner Full Name
                      </Label>
                      <Input
                        placeholder="e.g. Ramesh Sharma"
                        value={newPartnerOwner}
                        onChange={(e) => setNewPartnerOwner(e.target.value)}
                        className="rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">
                        Category Domain
                      </Label>
                      <select
                        value={newPartnerCategory}
                        onChange={(e) =>
                          setNewPartnerCategory(e.target.value as any)
                        }
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs"
                      >
                        <option value="Grocery">Retail & Grocery</option>
                        <option value="Pharmacy">Pharmacy & Healthcare</option>
                        <option value="Services">Home & Local Services</option>
                        <option value="Transport">Logistics & Transport</option>
                        <option value="Workshops">Workshops & Classes</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold">
                        Contact Phone
                      </Label>
                      <Input
                        placeholder="9876543210"
                        value={newPartnerPhone}
                        onChange={(e) => setNewPartnerPhone(e.target.value)}
                        className="rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleCreatePartnerAccount}
                    className="mt-4 text-xs h-9 rounded-xl bg-primary text-primary-foreground font-semibold"
                  >
                    Create & Authorize Partner
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Partner Accounts List */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-base">
                  Active Partner Credentials Directory
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {partners.map((partner) => (
                    <Card
                      key={partner.id}
                      className="rounded-2xl border-border bg-card p-4 shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display font-bold text-sm text-foreground">
                              {partner.businessName}
                            </h4>
                            <Badge
                              variant="outline"
                              className="text-[10px] uppercase font-bold"
                            >
                              {partner.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {partner.ownerName}
                          </p>
                        </div>
                        <Badge
                          className={`text-[10px] uppercase font-bold ${
                            partner.role === "super_owner"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {partner.role.replace(/_/g, " ")}
                        </Badge>
                      </div>

                      <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs font-mono mt-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Admin ID:
                          </span>
                          <span className="font-bold text-foreground">
                            {partner.id}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Password:
                          </span>
                          <span className="font-bold text-primary">
                            {partner.password}
                          </span>
                        </div>
                      </div>

                      {partner.role !== "super_owner" && (
                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60 mt-3">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              deletePartner(partner.id);
                              toast.success(`Partner "${partner.id}" removed.`);
                            }}
                            className="h-7 text-xs text-destructive hover:bg-destructive/10 rounded-lg"
                          >
                            Revoke Access
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}

          {/* TAB 7: Database Backup / Restore / Reset */}
          <TabsContent value="database">
            <Card className="rounded-3xl border-border bg-card shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-display font-bold">
                  Database Management & Reset Tools
                </CardTitle>
                <CardDescription className="text-xs">
                  Export complete data backup to JSON, restore from past backup
                  file, or reset to original clean seed data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-border bg-muted/20 space-y-2">
                    <h4 className="font-semibold text-xs text-foreground">
                      Export Backup (JSON)
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Downloads all products, orders, services, customers and
                      settings to a JSON file.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleExportJson}
                      className="w-full text-xs h-8 rounded-xl gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download JSON Backup
                    </Button>
                  </div>

                  <div className="p-4 rounded-2xl border border-border bg-muted/20 space-y-2">
                    <h4 className="font-semibold text-xs text-foreground">
                      Restore From Backup
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Paste a previously exported JSON backup to instantly
                      restore full database state.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsImportModalOpen(true)}
                      className="w-full text-xs h-8 rounded-xl gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" /> Import JSON Data
                    </Button>
                  </div>

                  <div className="p-4 rounded-2xl border border-destructive/30 bg-destructive/5 space-y-2">
                    <h4 className="font-semibold text-xs text-destructive">
                      Reset to Clean Seeds
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Resets all products, categories, orders and settings back
                      to original clean demo seeds.
                    </p>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setIsResetConfirmOpen(true)}
                      className="w-full text-xs h-8 rounded-xl gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset All Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>

      {/* Import JSON Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          store.resetToDefaults();
          resetPartnersToDefault();
          setFormData({ ...store.settings });
          toast.success(
            "Database and Partner credentials reset to default seeds!",
          );
          setIsResetConfirmOpen(false);
        }}
        title="Reset Entire Database to Default Seeds?"
        description="This will restore all default products, categories, services, demo orders and owner credentials. Custom changes will be overwritten."
      />

      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-lg">
              Restore Database from JSON
            </h3>
            <p className="text-xs text-muted-foreground">
              Paste the contents of your exported `.json` backup file below.
            </p>
            <Textarea
              rows={8}
              placeholder="Paste JSON here..."
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="font-mono text-xs rounded-xl"
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsImportModalOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleImportJson}
                className="rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                Import & Restore
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
