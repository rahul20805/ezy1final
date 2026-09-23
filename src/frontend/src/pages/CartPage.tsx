import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, Tag } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import UserLayout from "../components/UserLayout";
import { useCartStore } from "../lib/cartStore";
import { toast } from "sonner";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, totalItems, totalAmount } = useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const cartList = Object.values(items);

  const handleApplyPromo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      toast.error("Please enter a promo code");
      return;
    }
    if (code === "EZYFIRST" || code === "WELCOME100") {
      setDiscount(100);
      setAppliedPromo(code);
      toast.success(`Coupon ${code} applied! ₹100 saved.`);
    } else if (code === "HEALTH20") {
      const disc = Math.round(totalAmount * 0.2);
      setDiscount(disc);
      setAppliedPromo(code);
      toast.success(`Coupon ${code} applied! 20% (₹${disc}) saved.`);
    } else if (code === "STAY500") {
      setDiscount(500);
      setAppliedPromo(code);
      toast.success(`Coupon ${code} applied! ₹500 saved.`);
    } else {
      toast.error("Invalid coupon code. Try 'EZYFIRST' or 'HEALTH20'");
    }
  };

  const handleRemovePromo = () => {
    setDiscount(0);
    setAppliedPromo(null);
    setPromoCode("");
    toast.info("Promo code removed");
  };

  const subtotal = totalAmount;
  const deliveryFee = subtotal > 0 ? (subtotal >= 500 ? 0 : 40) : 0;
  const taxes = Math.round(subtotal * 0.05);
  const total = Math.max(0, subtotal + deliveryFee + taxes - discount);

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-foreground">Your Shopping Cart</h1>
              <p className="text-xs text-muted-foreground">
                {totalItems} {totalItems === 1 ? "item" : "items"} ready for doorstep delivery
              </p>
            </div>
          </div>
          {cartList.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/category/grocery" as any })}
              className="text-xs"
            >
              Add More Items
            </Button>
          )}
        </div>

        {cartList.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-3xl border border-border p-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold font-display text-foreground mb-1">Your cart is empty</h2>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
              Looks like you haven't added anything to your cart yet. Explore fresh groceries, food, or electronics!
            </p>
            <Button
              onClick={() => navigate({ to: "/category/grocery" as any })}
              className="bg-primary text-primary-foreground font-bold text-xs rounded-xl px-6"
            >
              Explore Products
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3.5">
              {cartList.map(({ product, quantity }) => (
                <Card key={product.id} className="border-border bg-card shadow-xs rounded-2xl overflow-hidden">
                  <CardContent className="p-4 flex gap-4 items-center">
                    {product.image?.startsWith("http") ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 rounded-xl object-cover bg-muted shrink-0"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-muted/60 rounded-xl flex items-center justify-center text-2xl shrink-0">
                        {product.image || "📦"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-foreground truncate">{product.name}</h3>
                      <p className="text-[11px] text-muted-foreground truncate mb-1">
                        {product.category || "General Store"}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-primary">₹{product.price}</span>
                        {product.mrp && product.mrp > product.price && (
                          <span className="text-[11px] text-muted-foreground line-through">₹{product.mrp}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 rounded-full p-1 border border-border shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full hover:bg-background"
                        onClick={() => {
                          if (quantity === 1) {
                            removeItem(product.id);
                            toast.info(`Removed ${product.name}`);
                          } else {
                            updateQuantity(product.id, quantity - 1);
                          }
                        }}
                      >
                        {quantity === 1 ? (
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        ) : (
                          <Minus className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <span className="w-5 text-center font-bold text-xs text-foreground">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full hover:bg-background"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="sticky top-6 border-border bg-card shadow-xs rounded-3xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold font-display">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Promo Code Box */}
                  <form onSubmit={handleApplyPromo} className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Coupon (e.g. EZYFIRST)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="h-9 text-xs uppercase"
                      />
                      <Button type="submit" variant="secondary" className="h-9 px-3 text-xs font-bold">
                        Apply
                      </Button>
                    </div>
                    {appliedPromo && (
                      <div className="flex items-center justify-between text-xs bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          Code {appliedPromo} applied
                        </span>
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="text-xs text-rose-500 hover:underline font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </form>

                  <Separator />

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Items Subtotal</span>
                      <span className="font-semibold text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Fee</span>
                      <span>
                        {deliveryFee === 0 ? (
                          <span className="text-emerald-600 font-bold">FREE</span>
                        ) : (
                          `₹${deliveryFee}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Taxes & Fees (5%)</span>
                      <span className="font-semibold text-foreground">₹{taxes.toLocaleString("en-IN")}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Coupon Discount</span>
                        <span>-₹{discount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-base">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => navigate({ to: "/dashboard/checkout" })}
                    className="w-full h-11 text-sm font-bold bg-primary text-primary-foreground rounded-2xl gap-2 shadow-sm"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

