import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  Car,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Settings,
  Store,
  User,
  Wrench,
  Upload,
  CreditCard,
  Map,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import { setCurrentRole } from "../lib/auth";

const STEPS = ["Business Info", "Location & Ops", "Docs & Bank", "Review"];

export default function PartnerOnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string>("shop_owner");
  const [selectedSubType, setSelectedSubType] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [gpsMocked, setGpsMocked] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem("onboardingRole");
    const subType = sessionStorage.getItem("onboardingSubType");
    if (role) setSelectedRole(role);
    if (subType) setSelectedSubType(subType);
  }, []);

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    gps: "",
    radius: "",
    hours: "",
    identityDoc: "",
    businessDoc: "",
    bankAccount: "",
    ifsc: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGPSClick = () => {
    setGpsMocked(true);
    handleChange("gps", "12.9716° N, 77.5946° E");
  };

  const [applicationId, setApplicationId] = useState("");

  async function handleSubmit() {
    try {
      const response = await fetch("http://localhost:3000/api/partner-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1, // Mock user ID for now
          business_name: formData.businessName,
          partner_type: selectedRole,
          category: selectedSubType,
          owner_name: formData.ownerName,
          address: formData.address,
          city: formData.city,
          district: "Unknown", // Add if needed
          state: "Unknown", // Add if needed
          pincode: "Unknown", // Add if needed
          latitude: formData.gps ? parseFloat(formData.gps.split(",")[0]) : 0,
          longitude: formData.gps ? parseFloat(formData.gps.split(",")[1]) : 0,
          operating_hours: formData.hours,
          service_area: formData.city,
          delivery_radius: parseFloat(formData.radius) || 0
        })
      });
      const data = await response.json();
      if (data && data.id) {
        setApplicationId(`EZY1-APP-${data.id.toString().padStart(6, '0')}`);
      }
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      alert("Failed to submit application");
    }
  }

  function goToDashboard() {
    if (selectedRole === "driver") {
      navigate({ to: "/driver-dashboard" });
    } else if (selectedRole === "service_provider") {
      navigate({ to: "/service-provider-dashboard" });
    } else {
      navigate({ to: "/vendor-dashboard" });
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-display font-bold text-2xl text-foreground mb-3">
            Application Submitted Successfully!
          </h2>
          <div className="bg-muted p-4 rounded-lg mb-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Application ID</p>
            <p className="font-mono font-bold text-lg">{applicationId || "EZY1-PENDING"}</p>
          </div>
          <p className="text-muted-foreground mb-2 font-body">
            Status: <span className="font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">Pending Verification</span>
          </p>
          <p className="text-sm text-muted-foreground mb-6 font-body">
            Our team will verify your information. You will receive your EZY1 partner login credentials after approval.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
            <Clock className="w-4 h-4" />
            <span>Estimated verification time: 24–48 hours</span>
          </div>
          <Button className="w-full h-12 text-base font-semibold" variant="outline" onClick={() => navigate({ to: "/" })}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-subtle sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Store className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">
              ezy<span className="text-primary">1</span>
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            Partner Registration
          </Badge>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <Badge className="mb-3">{selectedSubType || "Partner"} Onboarding</Badge>
          <h1 className="text-3xl font-display font-bold">Complete your profile</h1>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((label, i) => {
            const num = i + 1;
            const isActive = step === num;
            const isDone = step > num;
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-smooth ${isDone ? "bg-primary border-primary text-primary-foreground" : isActive ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border text-muted-foreground"}`}>
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : num}
                  </div>
                  <span className={`absolute -bottom-6 text-xs whitespace-nowrap font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-1 w-12 sm:w-20 mx-2 rounded transition-smooth ${step > num ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-card p-6 rounded-2xl border border-border shadow-sm">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-display font-bold border-b pb-2 mb-4">Business Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Business / Shop Name</Label>
                  <Input value={formData.businessName} onChange={(e) => handleChange("businessName", e.target.value)} placeholder="e.g. Sharma Traders" />
                </div>
                <div className="space-y-1.5">
                  <Label>Owner Name</Label>
                  <Input value={formData.ownerName} onChange={(e) => handleChange("ownerName", e.target.value)} placeholder="e.g. Rahul Sharma" />
                </div>
                <div className="space-y-1.5">
                  <Label>Mobile Number</Label>
                  <Input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+91" />
                </div>
                <div className="space-y-1.5">
                  <Label>Email Address</Label>
                  <Input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="name@company.com" />
                </div>
              </div>
              <Button className="w-full mt-4" onClick={() => setStep(2)}>Next Step <ChevronRight className="w-4 h-4 ml-1" /></Button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-display font-bold border-b pb-2 mb-4">Location & Operations</h2>
              <div className="space-y-1.5">
                <Label>Full Address</Label>
                <Textarea value={formData.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="Shop No, Building, Street..." />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>City</Label>
                  <Input value={formData.city} onChange={(e) => handleChange("city", e.target.value)} placeholder="e.g. Bengaluru" />
                </div>
                <div className="space-y-1.5">
                  <Label>GPS Location</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={formData.gps} placeholder="Lat, Long" className="bg-muted/50" />
                    <Button type="button" variant="outline" className="shrink-0" onClick={handleGPSClick}>
                      <Map className="w-4 h-4 mr-2" />
                      {gpsMocked ? "Updated" : "Locate"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Delivery/Service Radius (km)</Label>
                  <Input type="number" value={formData.radius} onChange={(e) => handleChange("radius", e.target.value)} placeholder="e.g. 5" />
                </div>
                <div className="space-y-1.5">
                  <Label>Operating Hours</Label>
                  <Input value={formData.hours} onChange={(e) => handleChange("hours", e.target.value)} placeholder="e.g. 9 AM - 9 PM" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1" onClick={() => setStep(3)}>Next Step <ChevronRight className="w-4 h-4 ml-1" /></Button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-display font-bold border-b pb-2 mb-4">Verification & Banking</h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Identity Verification (Aadhar/PAN)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition cursor-pointer">
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <span className="text-xs text-muted-foreground block">Upload Front & Back</span>
                    <Input type="file" className="hidden" id="id-upload" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Business Documents (FSSAI/GST)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition cursor-pointer">
                    <FileText className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <span className="text-xs text-muted-foreground block">Upload Registration</span>
                    <Input type="file" className="hidden" id="biz-upload" />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-1.5">
                  <Label>Bank Account Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input className="pl-9" value={formData.bankAccount} onChange={(e) => handleChange("bankAccount", e.target.value)} placeholder="0000 0000 0000" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>IFSC Code</Label>
                  <Input value={formData.ifsc} onChange={(e) => handleChange("ifsc", e.target.value)} placeholder="e.g. SBIN0001234" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                <Button className="flex-1" onClick={() => setStep(4)}>Review <ChevronRight className="w-4 h-4 ml-1" /></Button>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-display font-bold border-b pb-2 mb-4">Review Application</h2>
              
              <div className="bg-muted/30 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-semibold">{selectedSubType}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Business Name</span>
                  <span className="font-semibold">{formData.businessName || "—"}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Owner</span>
                  <span className="font-semibold">{formData.ownerName || "—"}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">City</span>
                  <span className="font-semibold">{formData.city || "—"}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-muted-foreground">Bank A/C</span>
                  <span className="font-semibold">{formData.bankAccount ? `****${formData.bankAccount.slice(-4)}` : "—"}</span>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm text-yellow-700 flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <p>By submitting, you agree to the Ezy1 Partner Terms. Your account will remain in "Pending Verification" until an admin reviews your documents.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>Edit</Button>
                <Button className="flex-[2] bg-primary text-primary-foreground" onClick={handleSubmit}>
                  Submit Application <CheckCircle2 className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
