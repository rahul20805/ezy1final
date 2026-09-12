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
import {
  Clock,
  Edit2,
  Phone,
  Plus,
  Power,
  ShieldCheck,
  Star,
  Stethoscope,
  Trash2,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { ConfirmModal } from "../../../owner/ConfirmModal";
import { ImageUploader } from "../../../owner/ImageUploader";
import { ServerDataTable } from "../../ServerDataTable";

interface DoctorRecord {
  id: number;
  name: string;
  specialty: string;
  hospital?: string;
  city?: string;
  rating?: number;
  experience?: number;
  fee?: number;
  available?: boolean;
  phone?: string;
  timings?: string;
}

export function DoctorsManager() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DoctorRecord | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(10);
  const [hospitalName, setHospitalName] = useState("");
  const [consultationFee, setConsultationFee] = useState<number>(500);
  const [timings, setTimings] = useState("Mon - Sat: 09:00 AM - 02:00 PM");
  const [phone, setPhone] = useState("");

  const openAddDialog = () => {
    setEditingDoc(null);
    setName("");
    setSpecialization("General Physician");
    setExperienceYears(10);
    setHospitalName("EzyHealth Clinic");
    setConsultationFee(500);
    setTimings("Mon - Sat: 09:00 AM - 02:00 PM");
    setPhone("9876500000");
    setIsDialogOpen(true);
  };

  const openEditDialog = (doc: DoctorRecord) => {
    setEditingDoc(doc);
    setName(doc.name);
    setSpecialization(doc.specialty);
    setExperienceYears(doc.experience || 10);
    setHospitalName(doc.hospital || "");
    setConsultationFee(doc.fee || 500);
    setTimings(doc.timings || "Mon - Sat: 09:00 AM - 02:00 PM");
    setPhone(doc.phone || "");
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Doctor name is required.");
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("ezy1_token") || localStorage.getItem("token")
        : null;

    try {
      if (editingDoc) {
        const res = await fetch(`/api/vendors/${editingDoc.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            doctorName: name.trim(),
            specialization: specialization.trim(),
            experienceYears: Number(experienceYears),
            businessName: hospitalName.trim() || undefined,
            consultationFee: Number(consultationFee),
            phone: phone.trim(),
            timings: timings.trim(),
          }),
        });

        if (!res.ok) throw new Error("Failed to update doctor profile.");
        toast.success(`Doctor profile "${name}" updated!`);
      } else {
        const res = await fetch("/api/partner-applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessName: hospitalName.trim() || `${name}'s Clinic`,
            ownerName: name.trim(),
            category: "Healthcare",
            partnerType: "doctor",
            email: `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}@doctor.ezy1.in`,
            phone: phone.trim(),
            operatingHours: timings.trim(),
          }),
        });

        if (!res.ok) throw new Error("Failed to register doctor profile.");
        toast.success(`New Doctor "${name}" registered into database!`);
      }

      setIsDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to save doctor.");
    }
  };

  const toggleAvailability = async (doc: DoctorRecord) => {
    const nextAvail = doc.available === false ? true : false;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("ezy1_token") || localStorage.getItem("token")
        : null;

    try {
      const res = await fetch(`/api/vendors/${doc.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ available: nextAvail }),
      });

      if (!res.ok) throw new Error("Could not update availability.");
      toast.success(`Doctor marked ${nextAvail ? "AVAILABLE" : "UNAVAILABLE"}`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <ServerDataTable<DoctorRecord>
        title="Verified Medical Practitioners & Doctors"
        description="Roster of verified doctors, consulting physicians, department specialists, and clinical practitioners."
        fetchUrl="/api/doctors"
        refreshTrigger={refreshTrigger}
        onAddNew={openAddDialog}
        addNewLabel="Add Doctor Profile"
        searchPlaceholder="Search doctor name, specialty, hospital, city..."
        sortOptions={[
          { label: "Doctor Name (A-Z)", value: "name_asc", sortBy: "name", sortOrder: "asc" },
          { label: "Fee (Low to High)", value: "fee_asc", sortBy: "consultationFee", sortOrder: "asc" },
          { label: "Fee (High to Low)", value: "fee_desc", sortBy: "consultationFee", sortOrder: "desc" },
          { label: "Highest Rated", value: "rating_desc", sortBy: "rating", sortOrder: "desc" },
        ]}
        defaultSort="name_asc"
        defaultPageSize={25}
        renderItem={(doc) => {
          const isAvail = doc.available !== false;
          return (
            <Card
              key={doc.id}
              className={`rounded-3xl border transition-all hover:shadow-md ${
                isAvail ? "border-border/80 bg-card" : "border-muted bg-muted/20 opacity-75"
              }`}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-bold text-base text-foreground line-clamp-1">
                          {doc.name}
                        </h3>
                        <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      </div>
                      <p className="text-xs font-medium text-primary mt-0.5">
                        {doc.specialty}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {doc.hospital || "Independent Practice"}
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={`text-[10px] font-bold ${
                      isAvail ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isAvail ? "On Duty" : "Off Duty"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                    <span className="font-semibold text-foreground">
                      {doc.rating || 4.9} / 5.0
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{doc.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{doc.timings || "Daily: 9AM - 5PM"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="font-bold text-primary">₹{doc.fee || 500}</span>
                    <span>/ consult</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(doc)}
                    className="h-8 px-2.5 text-xs rounded-xl gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAvailability(doc)}
                    className={`h-8 px-2.5 text-xs rounded-xl font-semibold ${
                      isAvail ? "hover:text-destructive" : "text-emerald-600"
                    }`}
                  >
                    <Power className="w-3.5 h-3.5 mr-1" />
                    {isAvail ? "Set Off-Duty" : "Set On-Duty"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }}
      />

      {/* Edit Doctor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border shadow-2xl rounded-3xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-lg font-display font-bold">
                {editingDoc ? "Edit Doctor Profile" : "Register Doctor Profile"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Verified doctor credentials and OPD consulting fees.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Doctor Name *</Label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Priya Sharma"
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Specialization</Label>
                  <Input
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Cardiologist"
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Fee (₹)</Label>
                  <Input
                    type="number"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(Number(e.target.value))}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Hospital / Clinic Name</Label>
                <Input
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="e.g. Metro Care Hospital"
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Phone</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Experience (Years)</Label>
                  <Input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Availability Timings</Label>
                <Input
                  value={timings}
                  onChange={(e) => setTimings(e.target.value)}
                  placeholder="Mon - Sat: 09:00 AM - 02:00 PM"
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                {editingDoc ? "Update Profile" : "Register Doctor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
