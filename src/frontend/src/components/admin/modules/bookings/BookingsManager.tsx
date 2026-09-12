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
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  User,
  Users,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { type StoredBooking, useStoreData } from "../../../../lib/storeData";
import { ConfirmModal } from "../../../owner/ConfirmModal";
import { DataTable } from "../../../owner/DataTable";
import { ImageUploader } from "../../../owner/ImageUploader";

export function BookingsManager() {
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
  const [price, setPrice] = useState<number>(1000);
  const [schedule, setSchedule] = useState("");
  const [duration, setDuration] = useState("2 Hours");
  const [capacity, setCapacity] = useState<number>(10);
  const [status, setStatus] = useState<StoredBooking["status"]>("CONFIRMED");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(true);

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddDialog = () => {
    setEditingBooking(null);
    setTitle("");
    setType("workshop");
    setCategory("Art & Craft");
    setInstructorOrDoctor("Alka Yadav");
    setPrice(1200);
    setSchedule("Every Saturday, 10:00 AM - 1:00 PM");
    setDuration("3 Hours");
    setCapacity(12);
    setStatus("CONFIRMED");
    setLocation("Studio 4B, Indiranagar, Bengaluru");
    setDescription("");
    setImage("");
    setPublished(true);
    setIsDialogOpen(true);
  };

  const openEditDialog = (booking: StoredBooking) => {
    setEditingBooking(booking);
    setTitle(booking.title);
    setType(booking.type);
    setCategory(booking.category);
    setInstructorOrDoctor(booking.instructorOrDoctor);
    setPrice(booking.price);
    setSchedule(booking.schedule);
    setDuration(booking.duration);
    setCapacity(booking.capacity);
    setStatus(booking.status);
    setLocation(booking.location || "");
    setDescription(booking.description || "");
    setImage(booking.image || "");
    setPublished(booking.published);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Session Title is required.");
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
        status,
        location: location.trim(),
        description: description.trim(),
        image:
          image ||
          "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80",
        published,
      });
      toast.success(`Booking session "${title}" updated!`);
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
        enrolledCount: 0,
        status,
        location: location.trim(),
        description: description.trim(),
        image:
          image ||
          "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80",
        published,
      });
      toast.success(`New Session "${title}" created and published!`);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmId !== null) {
      store.deleteBooking(deleteConfirmId);
      toast.success("Booking session removed.");
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredBooking>
        title="Classes, Workshops & Consultation Bookings"
        description="Manage masterclasses, pottery studio slots, doctor appointments, capacity enrollment, and pricing."
        data={store.bookings}
        searchPlaceholder="Search session title, mentor, category, location..."
        searchFilter={(item, query) =>
          item.title.toLowerCase().includes(query) ||
          item.instructorOrDoctor.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          (item.location || "").toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "type",
            label: "Session Type",
            options: [
              { label: "Workshop", value: "workshop" },
              { label: "Class", value: "class" },
              { label: "Doctor Consult", value: "doctor" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Price (High to Low)", value: "price_desc" },
          { label: "Capacity (High to Low)", value: "cap_desc" },
          { label: "Title (A-Z)", value: "title_asc" },
        ]}
        defaultSort="title_asc"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "price_desc")
            return list.sort((a, b) => b.price - a.price);
          if (sortVal === "cap_desc")
            return list.sort((a, b) => b.capacity - a.capacity);
          return list.sort((a, b) => a.title.localeCompare(b.title));
        }}
        onAddNew={openAddDialog}
        addNewLabel="Add New Session"
        pageSize={6}
        renderItem={(booking) => {
          const progressPercent = Math.round(
            (booking.enrolledCount / booking.capacity) * 100,
          );

          return (
            <Card
              key={booking.id}
              className={`rounded-3xl border transition-all hover:shadow-md ${
                booking.published
                  ? "border-border/80 bg-card"
                  : "border-border/50 bg-muted/20 opacity-70"
              }`}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        booking.image ||
                        "https://placehold.co/100x100?text=Booking"
                      }
                      alt={booking.title}
                      className="w-14 h-14 rounded-2xl object-cover border border-border/80 flex-shrink-0 shadow-xs"
                    />
                    <div>
                      <h3 className="font-display font-bold text-sm text-foreground line-clamp-1">
                        {booking.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="text-foreground font-medium">
                          {booking.instructorOrDoctor}
                        </span>
                        <span>• {booking.duration}</span>
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-bold"
                  >
                    {booking.type}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{booking.schedule}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">
                      {booking.location || "Online"}
                    </span>
                  </div>
                </div>

                {/* Capacity Progress */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Enrollment Capacity
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {booking.enrolledCount} / {booking.capacity} seats (
                      {progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        progressPercent >= 90
                          ? "bg-rose-500"
                          : progressPercent >= 60
                            ? "bg-amber-500"
                            : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span className="font-display font-black text-base text-foreground">
                    ₹{booking.price}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(booking)}
                      className="h-8 px-2.5 text-xs rounded-xl"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(booking.id)}
                      className="h-8 px-2.5 text-destructive hover:bg-destructive/10 rounded-xl"
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
        <DialogContent className="max-w-xl bg-card border-border shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">
                {editingBooking
                  ? "Edit Session Details"
                  : "Create New Class / Booking Slot"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set session title, mentor/instructor, schedule, capacity limit,
                and fee.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">
                  Session / Class Title *
                </Label>
                <Input
                  required
                  placeholder="e.g. Pottery & Clay Art Mastery Weekend Workshop"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Type</Label>
                  <Select
                    value={type}
                    onValueChange={(val: any) => setType(val)}
                  >
                    <SelectTrigger className="rounded-xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workshop">Art & Workshop</SelectItem>
                      <SelectItem value="class">Class</SelectItem>
                      <SelectItem value="doctor">Doctor Consult</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">
                    Instructor / Doctor
                  </Label>
                  <Input
                    value={instructorOrDoctor}
                    onChange={(e) => setInstructorOrDoctor(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">
                    Fee / Price (₹) *
                  </Label>
                  <Input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">
                    Schedule Days & Time
                  </Label>
                  <Input
                    placeholder="Sat & Sun: 10:00 AM - 1:00 PM"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">
                    Capacity Limit (Seats)
                  </Label>
                  <Input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">
                  Studio / Clinic Location
                </Label>
                <Input
                  placeholder="Studio 4B, Indiranagar, Bengaluru"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">
                  Cover Banner Image
                </Label>
                <ImageUploader
                  currentImage={image}
                  onImageChange={setImage}
                  label="Session Banner"
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
                {editingBooking ? "Save Changes" : "Publish Session"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Session Slot?"
        description="Are you sure you want to remove this booking session? Enrolled customers will be notified."
      />
    </div>
  );
}
