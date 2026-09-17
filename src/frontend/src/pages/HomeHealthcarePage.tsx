import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useRequireAuth } from "../components/AuthPromptModal";
import { useAuth } from "../lib/AuthContext";
import { toast } from "sonner";
import {
  Stethoscope,
  Clock,
  Star,
  MapPin,
  ShieldCheck,
  Calendar,
  Home,
  HeartPulse,
  Activity,
  UserCheck
} from "lucide-react";

interface HomeService {
  id: number;
  serviceName: string;
  category: string;
  description: string;
  fee: number;
  duration: string;
  rating: number;
  image: string;
  providerName: string;
  availableSlots: string;
}

export default function HomeHealthcarePage() {
  const { user } = useAuth();
  const { requireAuth } = useRequireAuth();
  const [services, setServices] = useState<HomeService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<HomeService | null>(null);

  // Booking Form State
  const [patientName, setPatientName] = useState(user?.name || "");
  const [patientPhone, setPatientPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("Flat 402, Green Glen Layout, Bellandur");
  const [appointmentDate, setAppointmentDate] = useState("Today");
  const [timeSlot, setTimeSlot] = useState("11:30 AM");
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        const res = await fetch("/api/healthcare/home");
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error("Failed to load healthcare services");
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const handleBookClick = (svc: HomeService) => {
    requireAuth(() => {
      setSelectedService(svc);
      setBookingSuccess(null);
    });
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    if (!patientName || !patientPhone || !address) {
      toast.error("Please enter patient name, phone and address");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/healthcare/home/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          patientName,
          patientPhone,
          address,
          appointmentDate,
          timeSlot,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingSuccess(data);
        toast.success("Home visit scheduled successfully!");
      } else {
        toast.error(data.error || "Failed to schedule visit");
      }
    } catch (err) {
      toast.error("Error booking service");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-20">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-teal-500/15 via-background to-cyan-500/10 border-b border-border py-8 px-4 sm:px-6">
          <div className="container max-w-7xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-teal-600 text-white font-bold text-xs px-2.5 py-0.5">
                👨‍⚕️ EZY Doctor at Home
              </Badge>
              <span className="text-xs text-muted-foreground font-semibold">
                Home Doctor Visits • Nurses • Physiotherapy • Elderly Care • Diagnostics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground">
              Doctor Consultations & Certified Care at Your Home
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Skip hospital queues. Get experienced doctors, certified nurses, and licensed physiotherapists at your doorstep with verified medical credentials.
            </p>
          </div>
        </div>

        {/* Services List */}
        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600" />
              Verified Home Healthcare Services ({services.length})
            </h2>
            <span className="text-xs text-muted-foreground">Certified Medical Professionals</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm text-muted-foreground">Loading healthcare specialists...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((svc) => (
                <Card key={svc.id} className="rounded-3xl border-border bg-card overflow-hidden hover:shadow-subtle transition-smooth flex flex-col sm:flex-row">
                  <img src={svc.image} alt={svc.serviceName} className="w-full sm:w-48 h-48 sm:h-auto object-cover bg-muted flex-shrink-0" />
                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <Badge variant="outline" className="text-[10px] font-bold text-teal-600 border-teal-500/30 uppercase">
                          {svc.category.replace(/_/g, " ")}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          ★ {svc.rating}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-foreground mb-1">{svc.serviceName}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{svc.description}</p>
                      
                      <div className="text-[11px] text-muted-foreground space-y-1 bg-muted/40 p-2.5 rounded-xl">
                        <div className="flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-primary" />
                          <span>Provider: <b>{svc.providerName}</b></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span>Slots: {svc.availableSlots}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Consultation Fee</span>
                        <span className="text-lg font-black text-foreground">₹{svc.fee}</span>
                      </div>
                      <Button
                        onClick={() => handleBookClick(svc)}
                        className="rounded-xl font-bold text-xs bg-primary text-primary-foreground h-9 px-4"
                      >
                        Book Home Visit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Schedule Dialog */}
        <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display font-black text-lg">
                {bookingSuccess ? "Appointment Confirmed! 🩺" : `Schedule ${selectedService?.serviceName}`}
              </DialogTitle>
            </DialogHeader>

            {bookingSuccess ? (
              <div className="space-y-4 py-3">
                <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-center space-y-1">
                  <span className="text-xs font-bold text-teal-600 block">Home Visit Appointment ID</span>
                  <span className="text-lg font-mono font-black text-foreground">EZY-CARE-#{bookingSuccess.bookingId}</span>
                  <p className="text-xs text-muted-foreground pt-1">
                    Specialist will visit {patientName} at {address}
                  </p>
                </div>
                <div className="text-xs space-y-1.5 text-muted-foreground">
                  <div className="flex justify-between"><span>Service:</span> <b className="text-foreground">{selectedService?.serviceName}</b></div>
                  <div className="flex justify-between"><span>Date & Slot:</span> <b className="text-foreground">{appointmentDate} at {timeSlot}</b></div>
                  <div className="flex justify-between"><span>Consultation Fee:</span> <b className="text-foreground font-bold">₹{selectedService?.fee}</b></div>
                </div>
                <Button onClick={() => setSelectedService(null)} className="w-full rounded-xl font-bold text-xs bg-primary text-primary-foreground">
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-3 py-2">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Patient Name</Label>
                  <Input
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Contact Phone Number</Label>
                  <Input
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Home Address / Landmark</Label>
                  <Input
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Visit Date</Label>
                    <Input
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Time Slot</Label>
                    <Input
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Fee (Pay Doctor at Home):</span>
                  <span className="text-base font-bold text-foreground">
                    ₹{selectedService?.fee}
                  </span>
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl font-bold text-xs bg-primary text-primary-foreground"
                  >
                    {isSubmitting ? "Scheduling..." : "Schedule Home Visit"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
