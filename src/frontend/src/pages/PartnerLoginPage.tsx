import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  Stethoscope,
  Store,
  Truck,
  Wrench,
  Search
} from "lucide-react";
import Layout from "../components/Layout";
import { useState } from "react";

const partnerCategories = [
  {
    id: "shop_owner",
    label: "Retail & Food",
    icon: Store,
    types: [
      "Grocery store", "Medical store", "Restaurant", "Electronics shop", 
      "Clothing shop", "Beauty/wellness provider", "Fruit store", "Vegetable seller",
      "Dairy seller", "Meat/seafood seller", "Ice cream shop", "Local shop"
    ]
  },
  {
    id: "healthcare",
    label: "Healthcare",
    icon: Stethoscope,
    types: ["Hospital", "Doctor", "Clinic", "Pharmacy"]
  },
  {
    id: "driver",
    label: "Logistics & Transport",
    icon: Truck,
    types: ["Transport operator", "Auto/vehicle provider", "Delivery partner", "Cab driver"]
  },
  {
    id: "service_provider",
    label: "Home & Local Services",
    icon: Wrench,
    types: [
      "Maid", "Cleaner", "Technician", "Electrician", "Plumber", 
      "Carpenter", "Other local service provider"
    ]
  }
];

const perks = [
  "Free listing on India's fastest-growing super app",
  "Reach customers in your area instantly",
  "Digital payments & instant settlements",
  "Dedicated partner support 24/7",
];

export default function PartnerLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>("shop_owner");
  const [selectedSubType, setSelectedSubType] = useState<string>("Grocery store");
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = false;

  const handlePartnerLogin = async () => {
    await login();
    sessionStorage.setItem("onboardingRole", selectedRole);
    sessionStorage.setItem("onboardingSubType", selectedSubType);
    navigate({ to: "/partner-onboarding" });
  };

  const filteredCategories = partnerCategories.map(cat => ({
    ...cat,
    types: cat.types.filter(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(cat => cat.types.length > 0 || cat.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Layout>
      <div
        className="min-h-[calc(100vh-8rem)] bg-muted/30 flex items-center justify-center p-6"
        data-ocid="partner_login.page"
      >
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <Badge className="bg-secondary/15 text-secondary-foreground border-secondary/30 mb-4 text-sm px-4 py-1.5">
              Partner Portal
            </Badge>
            <h1 className="font-display font-bold text-3xl text-foreground">
              Grow Your Business with ezy<span className="text-primary">1</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Join thousands of vendors already earning more
            </p>
          </div>

          <Card className="shadow-elevated border-border mb-6">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-base font-display text-foreground">
                What type of partner are you?
              </CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search (e.g., Plumber, Doctor, Grocery...)" 
                  className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-background focus:border-primary outline-none text-sm transition-smooth"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 max-h-[40vh] overflow-y-auto">
              <div className="p-4 space-y-6">
                {filteredCategories.map(({ id, label, icon: Icon, types }) => (
                  <div key={id} className="space-y-3">
                    <div className="flex items-center gap-2 text-foreground font-display font-semibold">
                      <Icon className="w-4 h-4 text-secondary" />
                      {label}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {types.map(type => (
                        <button
                          key={type}
                          onClick={() => {
                            setSelectedRole(id);
                            setSelectedSubType(type);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            selectedRole === id && selectedSubType === type
                              ? "bg-secondary text-secondary-foreground border-secondary shadow-md"
                              : "bg-background text-muted-foreground border-border hover:border-secondary hover:text-foreground"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elevated border-border">
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-display font-semibold mb-3">Why partner with us?</h3>
                  <ul className="space-y-2">
                    {perks.map((perk) => (
                      <li
                        key={perk}
                        className="flex items-start gap-2.5 text-sm text-foreground"
                      >
                        <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-center">
                  <Button
                    className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-3 text-base font-semibold"
                    onClick={handlePartnerLogin}
                    disabled={isLoading}
                    data-ocid="partner_login.submit_button"
                  >
                    {isLoading ? "Connecting..." : "Join as Partner"}
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
