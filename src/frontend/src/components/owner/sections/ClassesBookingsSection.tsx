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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Edit2,
  Eye,
  EyeOff,
  GraduationCap,
  MapPin,
  Plus,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { type StoredBooking, useStoreData } from "../../../lib/storeData";
import { ConfirmModal } from "../ConfirmModal";
import { DataTable } from "../DataTable";
import { ImageUploader } from "../ImageUploader";

export function ClassesBookingsSection() {
  const store = useStoreData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<StoredBooking | null>(
    null,
  );

  // Form State
  const [title, setTitle] = useState("");
  const [type, setType] = useState<StoredBooking["type"]>("workshop");
  const [category, setCategory] = useState("Art & Craft");
  const [instructorOrDoctor, setInstructorOrDoctor] = useState("");
  const [price, setPrice] = useState<number>(500);
  const [schedule, setSchedule] = useState("");
  const [duration, setDuration] = useState("2 Hours");
  const [capacity, setCapacity] = useState<number>(15);
  const [enrolledCount, setEnrolledCount] = useState<number>(0);
  const [status, setStatus] = useState<StoredBooking["status"]>("CONFIRMED");
  const [published, setPublished] = useState(true);
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddDialog = () => {
    setEditingBooking(null);
    setTitle("");
    setType("workshop");
    setCategory("Art & Craft");
    setInstructorOrDoctor("Alka Yadav");
    setPrice(800);
    setSchedule("Saturdays & Sundays at 11:00 AM");
    setDuration("2 Hours");
    setCapacity(15);
    setEnrolledCount(0);
    setStatus("CONFIRMED");
    setPublished(true);
    setImage(
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80",
    );
    setLocation("Studio 4B, Indiranagar, Bengaluru");
    setDescription(
      "Interactive workshop covering basics, materials, and live hands-on practice.",
    );
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: StoredBooking) => {
    setEditingBooking(item);
    setTitle(item.title);
    setType(item.type);
    setCategory(item.category);
    setInstructorOrDoctor(item.instructorOrDoctor);
    setPrice(item.price);
    setSchedule(item.schedule);
    setDuration(item.duration);
    setCapacity(item.capacity);
    setEnrolledCount(item.enrolledCount);
    setStatus(item.status);
    setPublished(item.published);
    setImage(item.image || "");
    setLocation(item.location || "");
    setDescription(item.description || "");
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (editingBooking) {
      store.updateBooking(editingBooking.id, {
        title: title.trim(),
        type,
        category,
        instructorOrDoctor: instructorOrDoctor.trim(),
        price: Number(price),
        schedule: schedule.trim(),
        duration: duration.trim(),
        capacity: Number(capacity),
        enrolledCount: Number(enrolledCount),
        status,
        published,
        image,
        location: location.trim(),
        description: description.trim(),
      });
      toast.success(`Booking/Class "${title}" updated successfully!`);
    } else {
      store.addBooking({
        title: title.trim(),
        type,
        category,
        instructorOrDoctor: instructorOrDoctor.trim(),
        price: Number(price),
        schedule: schedule.trim(),
        duration: duration.trim(),
        capacity: Number(capacity),
        enrolledCount: Number(enrolledCount),
        status,
        published,
        image,
        location: location.trim(),
        description: description.trim(),
      });
      toast.success(`New Class/Booking "${title}" created!`);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmId !== null) {
      store.deleteBooking(deleteConfirmId);
      toast.success("Class/Booking session deleted.");
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredBooking>
        title="Classes, Workshops & Bookings"
        description="Manage pottery sessions, art classes, doctor appointments, consultations and capacities."
        data={store.bookings}
        searchPlaceholder="Search by title, instructor, category..."
        searchFilter={(item, query) =>
          item.title.toLowerCase().includes(query) ||
          item.instructorOrDoctor.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          (item.location?.toLowerCase().includes(query) ?? false)
        }
        filterOptions={[
          {
            key: "type",
            label: "Type",
            options: [
              { label: "Workshop", value: "workshop" },
              { label: "Class", value: "class" },
              { label: "Doctor / Health", value: "doctor" },
              { label: "Consultation", value: "consultation" },
            ],
          },
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Open for Booking", value: "open" },
              { label: "Full / Sold Out", value: "full" },
              { label: "Completed", value: "completed" },
              { label: "Cancelled", value: "cancelled" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Newest First", value: "newest" },
          { label: "Price: Low to High", value: "price_asc" },
          { label: "Price: High to Low", value: "price_desc" },
          { label: "Most Enrolled", value: "enrolled_desc" },
        ]}
        defaultSort="newest"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "price_asc")
            return list.sort((a, b) => a.price - b.price);
          if (sortVal === "price_desc")
            return list.sort((a, b) => b.price - a.price);
          if (sortVal === "enrolled_desc")
            return list.sort((a, b) => b.enrolledCount - a.enrolledCount);
          return list.sort((a, b) => b.id - a.id);
        }}
        onAddNew={openAddDialog}
        addNewLabel="Add Class / Booking"
        pageSize={6}
        renderItem={(item) => {
          const fillPercentage = Math.round(
            (item.enrolledCount / (item.capacity || 1)) * 100,
          );

          return (
            <Card
              key={item.id}
              className={`rounded-2xl overflow-hidden border transition-all duration-200 hover:shadow-md ${
                item.published
                  ? "border-border/80 bg-card"
                  : "border-border/50 bg-muted/20 opacity-80"
              }`}
            >
              {/* Image & Type Badge */}
              <div className="relative aspect-video bg-muted/60 overflow-hidden group">
                <img
                  src={
                    item.image || "https://placehold.co/600x400?text=Booking"
                  }
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/600x400?text=Class";
                  }}
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                  <Badge className="bg-primary text-primary-foreground font-semibold text-[10px] uppercase">
                    {item.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-card/90 backdrop-blur-xs text-[10px] font-semibold border-border"
                  >
                    {item.category}
                  </Badge>
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <Badge
                    className={`text-[10px] uppercase font-bold ${
                      item.status === "CONFIRMED" || item.status === "PENDING"
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>

              {/* Booking Body */}
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-foreground line-clamp-1 leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <UserCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{item.instructorOrDoctor}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{item.schedule}</span>
                  </div>
                  {item.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1 pt-1 border-t border-border/60">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">
                      Enrolled Capacity
                    </span>
                    <span className="font-semibold text-foreground">
                      {item.enrolledCount} / {item.capacity} ({fillPercentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        fillPercentage >= 100 ? "bg-destructive" : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <div>
                    <span className="font-display font-black text-lg text-foreground">
                      ₹{item.price}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-1">
                      / person
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        store.toggleBookingPublish(item.id);
                        toast.success(
                          item.published
                            ? `"${item.title}" hidden from public website.`
                            : `"${item.title}" published live!`,
                        );
                      }}
                      className="h-8 px-2 text-xs rounded-xl"
                      title={item.published ? "Hide" : "Publish"}
                    >
                      {item.published ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(item)}
                      className="h-8 px-2 text-xs rounded-xl"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="h-8 px-2 text-destructive hover:bg-destructive/10 rounded-xl"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }}
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border shadow-2xl custom-scrollbar rounded-3xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold text-foreground">
                {editingBooking
                  ? "Edit Class or Booking"
                  : "Create New Class / Workshop"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set schedules, fee, capacity, instructor and live details.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Title / Session Name *
                </Label>
                <Input
                  required
                  placeholder="e.g., Weekend Clay Pottery Workshop"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Type</Label>
                  <Select
                    value={type}
                    onValueChange={(val: any) => setType(val)}
                  >
                    <SelectTrigger className="rounded-xl text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="class">Class</SelectItem>
                      <SelectItem value="doctor">
                        Doctor Consultation
                      </SelectItem>
                      <SelectItem value="consultation">
                        Specialist Consultation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Category</Label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-xl text-sm"
                    placeholder="Art & Craft, Healthcare..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Instructor / Doctor Name *
                  </Label>
                  <Input
                    required
                    value={instructorOrDoctor}
                    onChange={(e) => setInstructorOrDoctor(e.target.value)}
                    className="rounded-xl text-sm"
                    placeholder="e.g. Dr. Rao / Alka Yadav"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Fee / Price (₹) *
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="rounded-xl font-display font-bold text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Max Capacity</Label>
                  <Input
                    type="number"
                    min={1}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Enrolled Count
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={enrolledCount}
                    onChange={(e) => setEnrolledCount(Number(e.target.value))}
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Schedule / Timing
                  </Label>
                  <Input
                    placeholder="e.g., Sat & Sun, 10:00 AM - 1:00 PM"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Duration</Label>
                  <Input
                    placeholder="e.g., 2 Hours, 45 Mins"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Venue / Location
                </Label>
                <Input
                  placeholder="e.g., Studio 4B, Indiranagar / Online Google Meet"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Session Description
                </Label>
                <Textarea
                  rows={2}
                  placeholder="Outline syllabus, materials provided, who can attend..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl text-xs sm:text-sm"
                />
              </div>

              <ImageUploader
                label="Banner / Cover Image"
                value={image}
                onChange={setImage}
                previewHeight="h-40"
              />

              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border">
                <div>
                  <Label className="text-xs font-semibold">
                    Publish Live on Website
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Allow customers to discover and book
                  </p>
                </div>
                <Switch checked={published} onCheckedChange={setPublished} />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2 border-t border-border">
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
                {editingBooking ? "Save Changes" : "Create Session"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Session?"
        description="Are you sure you want to delete this class/booking? All enrollment records will be cleared."
      />
    </div>
  );
}
