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
import { ServerDataTable } from "../../ServerDataTable";

interface PartnerAppRecord {
  id: number;
  businessName: string;
  ownerName?: string;
  applicantName?: string;
  category: string;
  partnerType?: string;
  email: string;
  phone: string;
  city?: string;
  address?: string;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "MORE_INFORMATION_REQUIRED";
  createdAt?: string;
}

export function PartnerApplications() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedApp, setSelectedApp] = useState<PartnerAppRecord | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const openAppDetails = (app: PartnerAppRecord) => {
    setSelectedApp(app);
    setAdminNotes("");
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async (appId: number, nextStatus: PartnerAppRecord["status"]) => {
    try {
      const res = await fetch(`/api/partner-applications/${appId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, notes: adminNotes }),
      });

      if (!res.ok) throw new Error("Failed to update application status.");

      toast.success(`Application #${appId} marked as ${nextStatus}!`);
      setIsDetailOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    }
  };

  return (
    <div className="space-y-6">
      <ServerDataTable<PartnerAppRecord>
        title="Partner & Merchant Applications"
        description="Review merchant onboarding documents, verify compliance licenses, and approve store accounts directly in database."
        fetchUrl="/api/partner-applications"
        refreshTrigger={refreshTrigger}
        searchPlaceholder="Search applicant, business name, category, city..."
        filterOptions={[
          {
            key: "status",
            label: "Verification Status",
            options: [
              { label: "Pending", value: "PENDING" },
              { label: "Under Review", value: "UNDER_REVIEW" },
              { label: "Approved", value: "APPROVED" },
              { label: "Rejected", value: "REJECTED" },
            ],
          },
          {
            key: "category",
            label: "Category",
            options: [
              { label: "Grocery", value: "Grocery" },
              { label: "Pharmacy", value: "Pharmacy" },
              { label: "Services", value: "Services" },
              { label: "Healthcare", value: "Healthcare" },
              { label: "Transport", value: "Transport" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Application ID (Newest)", value: "id_desc", sortBy: "id", sortOrder: "desc" },
          { label: "Business Name (A-Z)", value: "businessName_asc", sortBy: "businessName", sortOrder: "asc" },
        ]}
        defaultSort="id_desc"
        defaultPageSize={25}
        renderItem={(app) => {
          const applicant = app.ownerName || app.applicantName || "Applicant";
          return (
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
                      <h3 className="font-display font-bold text-base text-foreground">
                        {app.businessName}
                      </h3>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {app.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Applicant:{" "}
                      <span className="font-medium text-foreground">
                        {applicant}
                      </span>{" "}
                      • Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Recent"}
                    </p>
                  </div>

                  <Badge
                    className={`text-[10px] uppercase font-bold ${
                      app.status === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : app.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                  >
                    {app.status}
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
                    <span className="truncate">{app.city || "India"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span className="truncate font-semibold text-emerald-600">
                      ID & Tax Verified
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAppDetails(app)}
                    className="h-8 px-2.5 text-xs rounded-xl"
                  >
                    Review Dossier
                  </Button>

                  {app.status === "PENDING" && (
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(app.id, "APPROVED")}
                        className="h-8 px-2.5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                        className="h-8 px-2 text-xs rounded-xl text-destructive hover:bg-destructive/10"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        }}
      />

      {/* Review Dossier Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg bg-card border-border shadow-2xl rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold">
              Merchant Application Dossier
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Review applicant details before approving access to the live platform.
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4 py-3 text-xs">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Business:</span>
                  <span className="font-bold text-foreground">{selectedApp.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-semibold text-foreground">
                    {selectedApp.ownerName || selectedApp.applicantName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-bold text-primary">{selectedApp.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact:</span>
                  <span>{selectedApp.phone} • {selectedApp.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{selectedApp.address || selectedApp.city}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Verification Audit Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Enter approval notes or reasons for revision..."
                  className="rounded-xl text-xs"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDetailOpen(false)}
              className="rounded-xl"
            >
              Close
            </Button>
            {selectedApp?.status === "PENDING" && (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => selectedApp && handleUpdateStatus(selectedApp.id, "REJECTED")}
                  className="rounded-xl"
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => selectedApp && handleUpdateStatus(selectedApp.id, "APPROVED")}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Approve Application
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
