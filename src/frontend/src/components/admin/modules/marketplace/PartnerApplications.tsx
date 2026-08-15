import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  FileCheck,
  FileText,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { usePartnerAuth } from "../../../../lib/partnerAuthStore";
import { type StoredPartnerApplication, useStoreData } from "../../../../lib/storeData";
import { DataTable } from "../../../owner/DataTable";

export function PartnerApplications() {
  const store = useStoreData();
  const { addPartner } = usePartnerAuth();

  const [selectedApp, setSelectedApp] = useState<StoredPartnerApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const openAppDetails = (app: StoredPartnerApplication) => {
    setSelectedApp(app);
    setAdminNotes(app.notes || "");
    setIsDetailOpen(true);
  };

  const handleApprove = (app: StoredPartnerApplication) => {
    // 1. Update application status
    store.updateApplicationStatus(app.id, "APPROVED", adminNotes || "KYC documents verified & approved.");

    // 2. Generate secure partner credentials
    const generatedId = app.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 16);

    const generatedPassword = "partner" + Math.floor(100 + Math.random() * 900);

    // 3. Add to verified partners directory
    addPartner({
      id: generatedId,
      password: generatedPassword,
      businessName: app.businessName,
      ownerName: app.applicantName,
      category: app.category as any,
      role: "partner",
      phone: app.phone,
      email: app.email,
      city: app.city,
      status: "active",
      permissions: {
        canManageShop: true,
        canManageServices: app.category === "Services",
        canManageBookings: app.category === "Workshops" || app.category === "Healthcare",
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

    // 4. Register shop in catalog
    store.addShop({
      businessName: app.businessName,
      ownerName: app.applicantName,
      category: app.category,
      city: app.city,
      address: app.address,
      phone: app.phone,
      email: app.email,
      status: "active",
      rating: 5.0,
      totalOrders: 0,
      totalRevenue: 0,
      openingHours: "08:00 AM - 09:00 PM",
      deliveryRadiusKm: 10,
      verified: true,
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
    });

    toast.success(`Application Approved! Partner Account generated: ID="${generatedId}", Pass="${generatedPassword}"`);
    setIsDetailOpen(false);
  };

  const handleReject = (app: StoredPartnerApplication) => {
    store.updateApplicationStatus(app.id, "REJECTED", adminNotes || "Application did not meet compliance requirements.");
    toast.error(`Application #${app.id} Rejected.`);
    setIsDetailOpen(false);
  };

  const handleRequestInfo = (app: StoredPartnerApplication) => {
    store.updateApplicationStatus(app.id, "MORE_INFORMATION_REQUIRED", adminNotes || "Please upload updated FSSAI / GST proof.");
    toast.info(`Requested additional information from applicant.`);
    setIsDetailOpen(false);
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredPartnerApplication>
        title="Partner & Merchant Applications"
        description="Review merchant onboarding documents, verify compliance licenses, and approve store accounts."
        data={store.partnerApplications}
        searchPlaceholder="Search applicant, business name, category, city..."
        searchFilter={(item, query) =>
          item.applicantName.toLowerCase().includes(query) ||
          item.businessName.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "status",
            label: "Verification Status",
            options: [
              { label: "Pending", value: "PENDING" },
              { label: "Under Review", value: "UNDER_REVIEW" },
              { label: "Approved", value: "APPROVED" },
              { label: "Rejected", value: "REJECTED" },
              { label: "More Info Req", value: "MORE_INFORMATION_REQUIRED" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Application ID", value: "id_desc" },
          { label: "Business Name (A-Z)", value: "name_asc" },
        ]}
        defaultSort="id_desc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "name_asc") return list.sort((a, b) => a.businessName.localeCompare(b.businessName));
          return list.sort((a, b) => b.id - a.id);
        }}
        pageSize={6}
        renderItem={(app) => (
          <Card
            key={app.id}
            className={`rounded-3xl border transition-all hover:shadow-md ${
              app.status === "PENDING"
                ? "border-amber-500/40 bg-amber-500/5"
                : app.status === "APPROVED"
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-border bg-card"
            }`}
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base text-foreground">{app.businessName}</h3>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold">
                      {app.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Applicant: <span className="font-medium text-foreground">{app.applicantName}</span> • Applied: {app.appliedAt}
                  </p>
                </div>

                <Badge
                  className={`text-[10px] uppercase font-bold ${
                    app.status === "APPROVED"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : app.status === "PENDING"
                      ? "bg-amber-500/10 text-amber-600"
                      : app.status === "UNDER_REVIEW"
                      ? "bg-blue-500/10 text-blue-600"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {app.status.replace(/_/g, " ")}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{app.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{app.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{app.city}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <FileText className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">{app.documentsSubmitted.length} Document(s) attached</span>
                </div>
              </div>

              {app.notes && (
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Notes:</span> {app.notes}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAppDetails(app)}
                  className="h-8 px-3 text-xs rounded-xl"
                >
                  Review Documents & Notes
                </Button>

                {app.status !== "APPROVED" && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(app)}
                      className="h-8 px-3 text-xs rounded-xl bg-primary text-primary-foreground font-semibold gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Activate
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      />

      {/* Review Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg bg-card border-border shadow-2xl rounded-3xl">
          {selectedApp && (
            <div>
              <DialogHeader>
                <DialogTitle className="text-lg font-display font-bold">
                  Review Application #{selectedApp.id}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {selectedApp.businessName} • {selectedApp.applicantName} ({selectedApp.category})
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2">
                  <h4 className="font-bold text-foreground">Submitted Compliance Documents:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.documentsSubmitted.map((doc, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs px-2.5 py-1 rounded-xl font-mono">
                        📄 {doc}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Admin Verification Notes / Feedback</Label>
                  <Textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Enter notes or additional requirements..."
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="flex-wrap gap-2 justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRequestInfo(selectedApp)}
                  className="rounded-xl text-xs"
                >
                  <HelpCircle className="w-3.5 h-3.5 mr-1" /> Request More Info
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(selectedApp)}
                    className="rounded-xl text-xs text-destructive hover:bg-destructive/10"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(selectedApp)}
                    className="rounded-xl text-xs bg-primary text-primary-foreground font-semibold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve & Create Account
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
