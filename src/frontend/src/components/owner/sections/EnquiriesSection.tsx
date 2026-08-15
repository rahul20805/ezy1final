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
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { type StoredEnquiry, useStoreData } from "../../../lib/storeData";
import { ConfirmModal } from "../ConfirmModal";
import { DataTable } from "../DataTable";

export function EnquiriesSection() {
  const store = useStoreData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<StoredEnquiry | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [newStatus, setNewStatus] = useState<StoredEnquiry["status"]>("new");

  // New Enquiry Form
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<StoredEnquiry["category"]>("General");

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddDialog = () => {
    setCustomerName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
    setCategory("General");
    setIsDialogOpen(true);
  };

  const handleCreateEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !subject.trim()) {
      toast.error("Please fill in customer name, phone and subject.");
      return;
    }

    store.addEnquiry({
      customerName: customerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
      category,
      status: "new",
    });

    toast.success("New customer enquiry recorded!");
    setIsDialogOpen(false);
  };

  const openDetails = (enquiry: StoredEnquiry) => {
    setSelectedEnquiry(enquiry);
    setNewStatus(enquiry.status);
    setResolutionNotes(enquiry.notes || "");
  };

  const handleUpdateStatus = () => {
    if (!selectedEnquiry) return;
    store.updateEnquiryStatus(selectedEnquiry.id, newStatus, resolutionNotes.trim());
    toast.success("Enquiry status updated successfully!");
    setSelectedEnquiry(null);
  };

  const handleDelete = () => {
    if (deleteConfirmId !== null) {
      store.deleteEnquiry(deleteConfirmId);
      toast.success("Enquiry deleted.");
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredEnquiry>
        title="Customer Enquiries & Custom Leads"
        description="Track customer questions, bulk order requests, custom workshops, and resolution status."
        data={store.enquiries}
        searchPlaceholder="Search by customer name, subject, phone, message..."
        searchFilter={(item, query) =>
          item.customerName.toLowerCase().includes(query) ||
          item.subject.toLowerCase().includes(query) ||
          item.phone.includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.message.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "New Leads", value: "new" },
              { label: "In Progress", value: "in_progress" },
              { label: "Resolved", value: "resolved" },
              { label: "Archived", value: "archived" },
            ],
          },
          {
            key: "category",
            label: "Category",
            options: [
              { label: "General", value: "General" },
              { label: "Bulk Order", value: "Bulk Order" },
              { label: "Custom Service", value: "Custom Service" },
              { label: "Support", value: "Support" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Newest First", value: "newest" },
          { label: "Oldest First", value: "oldest" },
        ]}
        defaultSort="newest"
        onSort={(items, sortVal) => {
          const list = [...items];
          if (sortVal === "oldest") return list.sort((a, b) => a.id - b.id);
          return list.sort((a, b) => b.id - a.id);
        }}
        onAddNew={openAddDialog}
        addNewLabel="Log New Enquiry"
        pageSize={6}
        renderItem={(item) => (
          <Card
            key={item.id}
            className="rounded-2xl border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-4 border-b border-border/60 flex items-center justify-between gap-2 bg-muted/20">
                <Badge variant="outline" className="text-[10px] font-semibold border-border">
                  {item.category}
                </Badge>
                <Badge
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                    item.status === "new"
                      ? "bg-purple-500 text-white"
                      : item.status === "in_progress"
                      ? "bg-amber-500 text-white"
                      : item.status === "resolved"
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.status.replace(/_/g, " ")}
                </Badge>
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-foreground line-clamp-1 leading-snug">
                    {item.subject}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 mt-1.5 leading-relaxed bg-muted/30 p-2.5 rounded-xl border border-border/40">
                    "{item.message}"
                  </p>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground pt-1 border-t border-border/60">
                  <div className="flex items-center gap-1.5 text-foreground font-semibold">
                    <User className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>{item.customerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 flex-shrink-0" />
                    <span>{item.phone}</span>
                  </div>
                  {item.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{item.email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-border/60 mt-2">
              <span className="text-[11px] text-muted-foreground">{item.createdAt}</span>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDetails(item)}
                  className="h-8 text-xs rounded-xl"
                >
                  View & Reply
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
          </Card>
        )}
      />

      {/* Log New Enquiry Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg bg-card border-border shadow-2xl rounded-3xl">
          <form onSubmit={handleCreateEnquiry}>
            <DialogHeader>
              <DialogTitle className="text-xl font-display font-bold">Log New Customer Enquiry</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Enter enquiry or lead details from phone calls, WhatsApp or walk-in customers.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Customer Full Name *</Label>
                <Input
                  required
                  placeholder="e.g. Kavita Singhal"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Phone Number *</Label>
                  <Input
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Category</Label>
                  <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                    <SelectTrigger className="rounded-xl text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General Question</SelectItem>
                      <SelectItem value="Bulk Order">Bulk Order</SelectItem>
                      <SelectItem value="Custom Service">Custom Service</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Partner Application">Partner Application</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Subject / Title *</Label>
                  <Input
                    required
                    placeholder="e.g. Bulk 100 Cups Quote"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Message / Query Description</Label>
                <Textarea
                  rows={3}
                  placeholder="Details of the request, timeline, delivery expectations..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="rounded-xl text-xs sm:text-sm"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold">
                Save Enquiry
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View & Update Enquiry Modal */}
      {selectedEnquiry && (
        <Dialog open={!!selectedEnquiry} onOpenChange={() => setSelectedEnquiry(null)}>
          <DialogContent className="max-w-lg bg-card border-border shadow-2xl rounded-3xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{selectedEnquiry.category}</Badge>
                <span className="text-xs text-muted-foreground">{selectedEnquiry.createdAt}</span>
              </div>
              <DialogTitle className="text-lg font-display font-bold mt-1">
                {selectedEnquiry.subject}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border text-xs space-y-1">
                <p className="font-semibold text-foreground">{selectedEnquiry.customerName}</p>
                <p className="text-muted-foreground">{selectedEnquiry.phone} {selectedEnquiry.email ? `• ${selectedEnquiry.email}` : ""}</p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Customer Message</Label>
                <p className="text-xs text-foreground bg-muted/30 p-3 rounded-2xl border border-border mt-1 whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Lead Status</Label>
                <Select value={newStatus} onValueChange={(val: any) => setNewStatus(val)}>
                  <SelectTrigger className="rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Lead</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved / Closed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Internal Resolution Notes</Label>
                <Textarea
                  rows={2}
                  placeholder="Record quote given, follow-up actions or closure notes..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="rounded-xl text-xs sm:text-sm"
                />
              </div>

              {/* Direct Quick Contact Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted"
                >
                  <Phone className="w-3.5 h-3.5 text-primary" /> Call Customer
                </a>
                <a
                  href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(selectedEnquiry.customerName)},%20thank%20you%20for%20contacting%20us%20regarding%20${encodeURIComponent(selectedEnquiry.subject)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                >
                  WhatsApp Reply
                </a>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedEnquiry(null)} className="rounded-xl">
                Close
              </Button>
              <Button size="sm" onClick={handleUpdateStatus} className="rounded-xl bg-primary text-primary-foreground">
                Save Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Enquiry?"
        description="Are you sure you want to delete this enquiry record?"
      />
    </div>
  );
}
