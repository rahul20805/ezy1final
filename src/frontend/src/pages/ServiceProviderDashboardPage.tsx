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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle,
  Clock,
  Edit2,
  IndianRupee,
  MapPin,
  Plus,
  Star,
  Trash2,
  User,
  Wrench,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import VendorLayout from "../components/VendorLayout";

const SP_INFO = {
  name: "Suresh Electricals",
  providerName: "Suresh Nair",
  serviceType: "Electrician",
  rating: 4.7,
  totalJobs: 187,
};

interface ServiceOffering {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

interface ServiceRequest {
  id: number;
  customer: string;
  service: string;
  location: string;
  date: string;
  status: "pending" | "accepted" | "rejected" | "completed";
}

interface ServiceHistory {
  id: number;
  customer: string;
  service: string;
  date: string;
  amount: number;
  review: string;
  rating: number;
}

const INITIAL_SERVICES: ServiceOffering[] = [
  {
    id: 1,
    name: "Home Wiring Repair",
    description: "Fix faulty home wiring and circuit breakers",
    price: 600,
    available: true,
  },
  {
    id: 2,
    name: "Fan Installation",
    description: "Install ceiling or wall fans including wiring",
    price: 350,
    available: true,
  },
  {
    id: 3,
    name: "Switchboard Replacement",
    description: "Replace old modular switchboards and sockets",
    price: 450,
    available: false,
  },
];

const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 1,
    customer: "Priya S.",
    service: "Home Wiring Repair",
    location: "Koramangala, Bengaluru",
    date: "Apr 15, 2:00 PM",
    status: "pending",
  },
  {
    id: 2,
    customer: "Rahul K.",
    service: "Fan Installation",
    location: "HSR Layout, Bengaluru",
    date: "Apr 16, 10:00 AM",
    status: "pending",
  },
  {
    id: 3,
    customer: "Anita M.",
    service: "Switchboard Replacement",
    location: "Jayanagar, Bengaluru",
    date: "Apr 14, 4:00 PM",
    status: "accepted",
  },
];

const SERVICE_HISTORY: ServiceHistory[] = [
  {
    id: 1,
    customer: "Geeta Devi",
    service: "Home Wiring Repair",
    date: "Apr 10",
    amount: 600,
    review: "Very professional work. Highly recommend!",
    rating: 5,
  },
  {
    id: 2,
    customer: "Arjun M.",
    service: "Fan Installation",
    date: "Apr 8",
    amount: 350,
    review: "Done quickly and cleanly. Good service.",
    rating: 4,
  },
  {
    id: 3,
    customer: "Lakshmi R.",
    service: "Switchboard Replacement",
    date: "Apr 5",
    amount: 450,
    review: "Excellent work, very punctual.",
    rating: 5,
  },
];

interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  available: boolean;
}

const EMPTY_FORM: ServiceFormData = {
  name: "",
  description: "",
  price: "",
  available: true,
};

const REQ_STATUS_CFG = {
  pending: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  },
  accepted: {
    label: "Accepted",
    className: "bg-green-500/10 text-green-700 border-green-500/20",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  completed: {
    label: "Completed",
    className: "bg-secondary/10 text-secondary border-secondary/20",
  },
};

const INITIAL_TIMESLOTS = [
  { id: 1, time: "09:00 AM", available: true },
  { id: 2, time: "10:00 AM", available: true },
  { id: 3, time: "11:00 AM", available: false },
  { id: 4, time: "12:00 PM", available: true },
  { id: 5, time: "02:00 PM", available: true },
  { id: 6, time: "03:00 PM", available: false },
  { id: 7, time: "04:00 PM", available: true },
  { id: 8, time: "05:00 PM", available: true },
];

export default function ServiceProviderDashboardPage() {
  const [services, setServices] = useState<ServiceOffering[]>(INITIAL_SERVICES);
  const [requests, setRequests] = useState<ServiceRequest[]>(INITIAL_REQUESTS);
  const [timeSlots, setTimeSlots] = useState(INITIAL_TIMESLOTS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState("services");

  function openAddForm() {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(svc: ServiceOffering) {
    setFormData({
      name: svc.name,
      description: svc.description,
      price: String(svc.price),
      available: svc.available,
    });
    setEditingId(svc.id);
    setShowForm(true);
  }

  function handleSave() {
    if (editingId !== null) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                available: formData.available,
              }
            : s,
        ),
      );
    } else {
      setServices((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          available: formData.available,
        },
      ]);
    }
    setShowForm(false);
    setEditingId(null);
  }

  function handleDelete(id: number) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  function handleToggle(id: number) {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, available: !s.available } : s)),
    );
  }

  function handleRequestAction(id: number, action: "accepted" | "rejected") {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r)),
    );
  }

  function handleToggleSlot(id: number) {
    setTimeSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, available: !s.available } : s)),
    );
  }

  return (
    <VendorLayout title="Service Provider Dashboard">
      {/* Header info */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
            <Wrench className="w-7 h-7 text-accent" />
          </div>
          <div>
            <div className="font-display font-bold text-lg text-foreground">
              {SP_INFO.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {SP_INFO.providerName} · {SP_INFO.serviceType}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-foreground">
                {SP_INFO.rating}
              </span>
              <span className="text-xs text-muted-foreground">
                ({SP_INFO.totalJobs} jobs)
              </span>
            </div>
          </div>
        </div>
        <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
          ● Active
        </Badge>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        data-ocid="sp_dashboard.tabs"
      >
        <TabsList className="mb-5">
          <TabsTrigger value="services" data-ocid="sp_dashboard.tab.services">
            My Services
          </TabsTrigger>
          <TabsTrigger value="requests" data-ocid="sp_dashboard.tab.requests">
            Service Requests
            {requests.filter((r) => r.status === "pending").length > 0 && (
              <Badge className="ml-2 text-xs bg-primary text-primary-foreground border-0 px-1.5 py-0">
                {requests.filter((r) => r.status === "pending").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="slots" data-ocid="sp_dashboard.tab.slots">
            Time Slots
          </TabsTrigger>
          <TabsTrigger value="history" data-ocid="sp_dashboard.tab.history">
            History
          </TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              {services.length} services offered
            </span>
            <Button
              size="sm"
              className="gap-2"
              onClick={openAddForm}
              data-ocid="sp_dashboard.add_service_button"
            >
              <Plus className="w-4 h-4" /> Add Service
            </Button>
          </div>

          {showForm && (
            <Card
              className="mb-4 border-2 border-accent/20"
              data-ocid="sp_dashboard.service_form"
            >
              <CardContent className="p-5 space-y-4">
                <h3 className="font-display font-semibold text-foreground">
                  {editingId ? "Edit Service" : "New Service"}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Service Name</Label>
                    <Input
                      placeholder="e.g. Fan Installation"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      data-ocid="sp_dashboard.service_name.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Price per Hour (₹)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 400"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      data-ocid="sp_dashboard.service_price.input"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe what this service includes..."
                    rows={2}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    data-ocid="sp_dashboard.service_description.textarea"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={formData.available}
                    onCheckedChange={(v) =>
                      setFormData({ ...formData, available: v })
                    }
                    data-ocid="sp_dashboard.service_availability.switch"
                  />
                  <Label>Currently Available</Label>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowForm(false)}
                    data-ocid="sp_dashboard.service_cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSave}
                    data-ocid="sp_dashboard.service_save_button"
                  >
                    {editingId ? "Save Changes" : "Add Service"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {services.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="sp_dashboard.services_empty_state"
            >
              <Wrench className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-body text-sm">
                No services yet. Add your first service above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map((svc, i) => (
                <Card
                  key={svc.id}
                  data-ocid={`sp_dashboard.service.item.${i + 1}`}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-semibold text-sm text-foreground truncate">
                          {svc.name}
                        </span>
                        {!svc.available && (
                          <Badge
                            variant="outline"
                            className="text-xs text-muted-foreground"
                          >
                            Unavailable
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {svc.description}
                      </p>
                      <span className="text-sm font-bold text-accent mt-1 block">
                        ₹{svc.price}
                        <span className="font-normal text-muted-foreground text-xs">
                          /hr
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={svc.available}
                        onCheckedChange={() => handleToggle(svc.id)}
                        data-ocid={`sp_dashboard.availability_toggle.${i + 1}`}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditForm(svc)}
                        data-ocid={`sp_dashboard.edit_button.${i + 1}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-ocid={`sp_dashboard.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent data-ocid="sp_dashboard.delete_dialog">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove service?</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{svc.name}" will be permanently removed from your
                              offerings.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-ocid="sp_dashboard.delete_cancel_button">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(svc.id)}
                              data-ocid="sp_dashboard.delete_confirm_button"
                            >
                              Remove
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

        {/* Service Requests */}
        <TabsContent value="requests">
          <div className="space-y-4">
            {requests.map((req, i) => {
              const cfg = REQ_STATUS_CFG[req.status];
              return (
                <Card
                  key={req.id}
                  data-ocid={`sp_dashboard.request.item.${i + 1}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="font-display font-semibold text-sm text-foreground">
                            {req.customer}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          {req.service}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {req.location}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Clock className="w-3 h-3" />
                          {req.date}
                        </div>
                      </div>
                      <Badge className={`text-xs ${cfg.className}`}>
                        {cfg.label}
                      </Badge>
                    </div>
                    {req.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-1 text-green-700 border-green-500/30 hover:bg-green-500/10"
                          onClick={() =>
                            handleRequestAction(req.id, "accepted")
                          }
                          data-ocid={`sp_dashboard.accept_request_button.${i + 1}`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() =>
                            handleRequestAction(req.id, "rejected")
                          }
                          data-ocid={`sp_dashboard.reject_request_button.${i + 1}`}
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

        {/* Time Slots Tab */}
        <TabsContent value="slots">
          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-lg">Daily Availability</h3>
                  <p className="text-sm text-muted-foreground">Toggle the slots you are available to be booked.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                  setTimeSlots(prev => prev.map(s => ({ ...s, available: true })))
                }}>Enable All</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timeSlots.map((slot) => (
                  <div 
                    key={slot.id} 
                    className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-smooth ${slot.available ? 'border-primary/50 bg-primary/5' : 'border-border bg-muted/30 opacity-60'}`}
                    onClick={() => handleToggleSlot(slot.id)}
                  >
                    <span className="text-sm font-medium">{slot.time}</span>
                    <Checkbox checked={slot.available} onCheckedChange={() => handleToggleSlot(slot.id)} />
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t flex justify-end">
                <Button>Save Schedule</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history">
          {SERVICE_HISTORY.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="sp_dashboard.history_empty_state"
            >
              <Wrench className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-body text-sm">No completed services yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {SERVICE_HISTORY.map((item, i) => (
                <Card
                  key={item.id}
                  data-ocid={`sp_dashboard.history.item.${i + 1}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <div className="font-display font-semibold text-sm text-foreground">
                          {item.customer}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.service} · {item.date}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-sm text-foreground">
                          <IndianRupee className="w-3 h-3 inline" />
                          {item.amount}
                        </div>
                        <div className="flex items-center gap-0.5 justify-end mt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${star <= item.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {item.review && (
                      <p className="text-xs text-muted-foreground italic bg-muted/40 rounded-lg px-3 py-2">
                        "{item.review}"
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </VendorLayout>
  );
}
