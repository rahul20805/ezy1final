import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronRight,
  CreditCard,
  MapPin,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../lib/AuthContext";

import { useCartStore } from "../lib/cartStore";
import { useLocationStore, LocationData } from "../lib/locationStore";
import { LocationModal } from "../components/location/LocationModal";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { isAuthenticated, identity } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { currentLocation, savedAddresses, setLocation } = useLocationStore();
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(currentLocation);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI");
  const [isProcessing, setIsProcessing] = useState(false);

  const { items, totalItems, totalAmount, clearCart } = useCartStore();

  const deliveryFee = totalItems > 0 ? 30 : 0;
  const toPay = totalAmount + deliveryFee;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: identity ? identity.getPrincipal().toText() : "guest-user",
          vendorId: Object.values(items)[0]?.product?.vendorId || 1,
          totalAmount: toPay,
          deliveryAddress: selectedLocation.formattedAddress || "Bengaluru",
          location: selectedLocation,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      setTimeout(() => {
        clearCart();
        setStep(3);
        setIsProcessing(false);
        toast.success("Order confirmed successfully!");
      }, 1000);
    } catch (err) {
      console.error("Payment or order error:", err);
      toast.error("Payment processing failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to checkout</h2>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-2xl font-display font-bold mb-6">
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Step 1: Address */}
            <Card
              className={`border-border ${step === 1 ? "ring-2 ring-primary ring-offset-2" : "opacity-70"}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    1
                  </div>
                  <h2 className="text-lg font-bold">Delivery Address</h2>
                </div>

                {step === 1 ? (
                  <div className="space-y-3">
                    {/* Active Selected Location Card */}
                    <div className="p-4 border-2 rounded-2xl border-primary bg-primary/5 flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-foreground">
                            {selectedLocation.locality || selectedLocation.city || "Selected Address"}
                          </span>
                          <Badge className="text-[10px] bg-primary text-primary-foreground">
                            Active Delivery Location
                          </Badge>
                          {selectedLocation.source && (
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              {selectedLocation.source}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 break-words">
                          {selectedLocation.formattedAddress}
                        </p>
                      </div>
                    </div>

                    {/* Saved Addresses List (if more exist) */}
                    {savedAddresses.filter(
                      (a) => a.formattedAddress !== selectedLocation.formattedAddress
                    ).length > 0 && (
                      <div className="space-y-2 pt-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Or Choose From Saved Locations
                        </p>
                        <div className="space-y-2">
                          {savedAddresses
                            .filter((a) => a.formattedAddress !== selectedLocation.formattedAddress)
                            .map((addr, idx) => (
                              <div
                                key={idx}
                                onClick={() => setSelectedLocation(addr)}
                                className="p-3 border rounded-xl border-border hover:border-primary/60 transition-colors flex items-center justify-between gap-3 cursor-pointer text-xs"
                              >
                                <div className="min-w-0 flex-1">
                                  <span className="font-semibold text-foreground">
                                    {addr.locality || addr.city || "Saved Address"}
                                  </span>
                                  <p className="text-muted-foreground truncate text-[11px] mt-0.5">
                                    {addr.formattedAddress}
                                  </p>
                                </div>
                                <Button variant="outline" size="sm" className="text-xs h-7">
                                  Select
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsLocationModalOpen(true)}
                        className="w-full sm:w-auto text-xs gap-1.5"
                      >
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>Change / Search on Map</span>
                      </Button>
                      <Button
                        className="w-full sm:w-auto text-xs"
                        onClick={() => setStep(2)}
                      >
                        Deliver Here & Continue to Payment
                      </Button>
                    </div>

                    <LocationModal
                      open={isLocationModalOpen}
                      onOpenChange={setIsLocationModalOpen}
                      onSelectLocation={(loc) => setSelectedLocation(loc)}
                    />
                  </div>
                ) : (
                  <div className="pl-11 flex justify-between items-center">
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="text-sm font-semibold truncate">
                        {selectedLocation.locality || selectedLocation.city || "Delivery Address"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {selectedLocation.formattedAddress}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep(1)}
                    >
                      Change
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Payment */}
            <Card
              className={`border-border ${step === 2 ? "ring-2 ring-primary ring-offset-2" : "opacity-70"}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    2
                  </div>
                  <h2 className="text-lg font-bold">Payment Method</h2>
                </div>

                {step === 2 && (
                  <div className="space-y-3">
                    <div
                      className="p-3 border rounded-xl border-border hover:border-primary/50 flex items-center gap-3 cursor-pointer"
                      onClick={() => setPaymentMethod("UPI")}
                    >
                      <input
                        type="radio"
                        name="payment"
                        className="mt-0.5"
                        checked={paymentMethod === "UPI"}
                        readOnly
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          UPI (GPay, PhonePe, Paytm)
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] text-green-600 border-green-600 bg-green-50"
                      >
                        Recommended
                      </Badge>
                    </div>
                    <div
                      className="p-3 border rounded-xl border-border hover:border-primary/50 flex items-center gap-3 cursor-pointer"
                      onClick={() => setPaymentMethod("Wallet")}
                    >
                      <input
                        type="radio"
                        name="payment"
                        className="mt-0.5"
                        checked={paymentMethod === "Wallet"}
                        readOnly
                      />
                      <div>
                        <p className="font-semibold text-sm">Ezy1 Wallet</p>
                        <p className="text-xs text-muted-foreground">
                          Balance: ₹1,935
                        </p>
                      </div>
                    </div>
                    <div
                      className="p-3 border rounded-xl border-border hover:border-primary/50 flex items-center gap-3 cursor-pointer"
                      onClick={() => setPaymentMethod("COD")}
                    >
                      <input
                        type="radio"
                        name="payment"
                        className="mt-0.5"
                        checked={paymentMethod === "COD"}
                        readOnly
                      />
                      <div>
                        <p className="font-semibold text-sm">
                          Cash on Delivery
                        </p>
                      </div>
                    </div>
                    <Button
                      className="mt-4 w-full"
                      onClick={handlePayment}
                      disabled={isProcessing || totalItems === 0}
                    >
                      {isProcessing ? "Processing..." : `Pay ₹${toPay}`}
                    </Button>

                    <p className="text-[11px] text-muted-foreground text-center pt-2 leading-relaxed">
                      By placing this order, you agree to EZY1&apos;s{" "}
                      <a
                        href="/legal/ezy1-user-terms-and-conditions.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium inline-flex items-center gap-0.5"
                      >
                        Terms &amp; Conditions
                        <span className="text-[9px]">↗</span>
                      </a>{" "}
                      and{" "}
                      <a
                        href="/legal/ezy1-universal-privacy-policy.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium inline-flex items-center gap-0.5"
                      >
                        Privacy Policy
                        <span className="text-[9px]">↗</span>
                      </a>.
                    </p>
                  </div>
                )}
                {step === 3 && (
                  <div className="pl-11">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Paid via{" "}
                      {paymentMethod}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {step === 3 && (
              <Card className="border-green-500 bg-green-50">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-800">
                    Order Placed Successfully!
                  </h2>
                  <p className="text-sm text-green-700">
                    Your order has been sent to the vendor. You can track it in
                    your dashboard.
                  </p>
                  <Link to="/dashboard">
                    <Button className="mt-4 bg-green-600 hover:bg-green-700">
                      Go to Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-20 border-border">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-bold text-lg border-b pb-2">
                  Order Summary
                </h3>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    Items Total ({totalItems})
                  </span>
                  <span className="font-medium">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">₹{deliveryFee}</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center font-bold text-lg">
                  <span>To Pay</span>
                  <span className="text-primary">₹{toPay}</span>
                </div>

                <div className="border-t pt-3 space-y-1.5 text-[11px] text-muted-foreground text-center">
                  <p className="flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Consumer Protection &amp; Safe Checkout</span>
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-muted-foreground">
                    <a
                      href="/legal/ezy1-user-terms-and-conditions.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary underline"
                    >
                      User Terms (PDF)
                    </a>
                    <span>•</span>
                    <a
                      href="/legal/ezy1-universal-privacy-policy.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary underline"
                    >
                      Privacy (PDF)
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
