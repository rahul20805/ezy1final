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
  Clock,
  Edit2,
  Phone,
  Plus,
  ShieldCheck,
  Star,
  Stethoscope,
  Trash2,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { type StoredDoctor, useStoreData } from "../../../../lib/storeData";
import { ConfirmModal } from "../../../owner/ConfirmModal";
import { DataTable } from "../../../owner/DataTable";
import { ImageUploader } from "../../../owner/ImageUploader";

export function DoctorsManager() {
  const store = useStoreData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<StoredDoctor | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(10);
  const [hospitalName, setHospitalName] = useState("");
  const [consultationFee, setConsultationFee] = useState<number>(500);
  const [availability, setAvailability] = useState("Mon - Sat: 09:00 AM - 02:00 PM");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddDialog = () => {
    setEditingDoc(null);
    setName("");
    setSpecialization("General Physician");
    setQualification("MBBS, MD");
    setExperienceYears(10);
    setHospitalName("EzyHealth Multi-Specialty Clinic");
    setConsultationFee(500);
    setAvailability("Mon - Sat: 09:00 AM - 02:00 PM");
    setPhone("9876500000");
    setImage("");
    setBio("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (doc: StoredDoctor) => {
    setEditingDoc(doc);
    setName(doc.name);
    setSpecialization(doc.specialization);
    setQualification(doc.qualification);
    setExperienceYears(doc.experienceYears);
    setHospitalName(doc.hospitalName);
    setConsultationFee(doc.consultationFee);
    setAvailability(doc.availability);
    setPhone(doc.phone);
    setImage(doc.image || "");
    setBio(doc.bio || "");
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Doctor name is required.");
      return;
    }

    if (editingDoc) {
      store.updateDoctor(editingDoc.id, {
        name: name.trim(),
        specialization: specialization.trim(),
        qualification: qualification.trim(),
        experienceYears: Number(experienceYears),
        hospitalName: hospitalName.trim(),
        consultationFee: Number(consultationFee),
        availability: availability.trim(),
        phone: phone.trim(),
        image: image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80",
        bio: bio.trim(),
      });
      toast.success(`Doctor profile "${name}" updated!`);
    } else {
      store.addDoctor({
        name: name.trim(),
        specialization: specialization.trim(),
        qualification: qualification.trim(),
        experienceYears: Number(experienceYears),
        hospitalName: hospitalName.trim(),
        consultationFee: Number(consultationFee),
        availability: availability.trim(),
        rating: 5.0,
        totalReviews: 0,
        phone: phone.trim(),
        verified: true,
        image: image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80",
        bio: bio.trim(),
      });
      toast.success(`New Doctor "${name}" added to roster!`);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmId !== null) {
      store.deleteDoctor(deleteConfirmId);
      toast.success("Doctor profile removed.");
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredDoctor>
        title="Verified Doctors & Healthcare Specialists"
        description="Doctor profiles, qualifications, medical affiliations, consultation slots, and fees."
        data={store.doctors}
        searchPlaceholder="Search doctor name, specialization, hospital..."
        searchFilter={(item, query) =>
          item.name.toLowerCase().includes(query) ||
          item.specialization.toLowerCase().includes(query) ||
          item.hospitalName.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "specialization",
            label: "Specialization",
            options: [
              { label: "General Physician", value: "General Physician & Internal Medicine" },
              { label: "Pediatrician", value: "Pediatrician & Child Specialist" },
              { label: "Orthopedic", value: "Orthopedic & Joint Specialist" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Consultation Fee (Low to High)", value: "fee_asc" },
          { label: "Consultation Fee (High to Low)", value: "fee_desc" },
          { label: "Experience Years", value: "exp_desc" },
          { label: "Name (A-Z)", value: "name_asc" },
        ]}
        defaultSort="name_asc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "fee_asc") return list.sort((a, b) => a.consultationFee - b.consultationFee);
          if (sortVal === "fee_desc") return list.sort((a, b) => b.consultationFee - a.consultationFee);
          if (sortVal === "exp_desc") return list.sort((a, b) => b.experienceYears - a.experienceYears);
          return list.sort((a, b) => a.name.localeCompare(b.name));
        }}
        onAddNew={openAddDialog}
        addNewLabel="Add Doctor"
        pageSize={6}
        renderItem={(doc) => (
          <Card key={doc.id} className="rounded-3xl border-border bg-card p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={doc.image || "https://placehold.co/100x100?text=Doctor"}
                  alt={doc.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-border/80 flex-shrink-0 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-sm text-foreground line-clamp-1">{doc.name}</h3>
                    {doc.verified && <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-primary font-medium">{doc.specialization}</p>
                  <span className="text-[10px] text-muted-foreground">{doc.qualification}</span>
                </div>
              </div>

              <Badge variant="outline" className="text-[10px] font-bold">
                {doc.experienceYears} Yrs Exp
              </Badge>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs my-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Hospital / Clinic:</span>
                <span className="font-semibold text-foreground truncate max-w-[180px]">{doc.hospitalName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Availability:</span>
                <span className="font-mono text-muted-foreground">{doc.availability}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <div>
                <span className="font-display font-black text-base text-foreground">₹{doc.consultationFee}</span>
                <span className="text-[10px] text-muted-foreground"> / consult</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(doc)}
                  className="h-8 px-2.5 text-xs rounded-xl"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirmId(doc.id)}
                  className="h-8 px-2.5 text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl bg-card border-border shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">
                {editingDoc ? "Edit Doctor Profile" : "Register Doctor Specialist"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set doctor qualifications, hospital affiliations, consultation fees and hours.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Doctor Full Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Dr. Arvind Rao"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Specialization</Label>
                  <Input
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="rounded-xl text-xs"
                    placeholder="General Physician, Pediatric, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Qualification</Label>
                  <Input
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="rounded-xl text-xs"
                    placeholder="MBBS, MD"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Experience (Years)</Label>
                  <Input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Consultation Fee (₹)</Label>
                  <Input
                    type="number"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(Number(e.target.value))}
                    className="rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Hospital / Clinic Name</Label>
                <Input
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Availability Hours</Label>
                <Input
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Profile Photo</Label>
                <ImageUploader currentImage={image} onImageChange={setImage} label="Doctor Photo" />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold">
                {editingDoc ? "Save Changes" : "Register Doctor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Doctor Profile?"
        description="Are you sure you want to remove this doctor from the healthcare directory?"
      />
    </div>
  );
}
