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
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import UserLayout from "../components/UserLayout";

// Temporary mock cart data
const initialCart = [
  {
    id: 1,
    name: "Aashirvaad Atta 5kg",
    price: 245,
    vendor: "Sharma Grocery",
    quantity: 1,
    image: "🌾",
  },
  {
    id: 3,
    name: "Amul Taaza Milk 1L",
    price: 68,
    vendor: "Daily Needs",
    quantity: 2,
    image: "🥛",
  },
];

export default function CartPage() {
  const [cart, setCart] = useState(initialCart);
  const [promoCode, setPromoCode] = useState("");

  const updateQuantity = (id: number, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQ = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQ };
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const taxes = subtotal * 0.05;
  const total = subtotal + deliveryFee + taxes;

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Your Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 rounded-2xl border border-border">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added anything yet.
            </p>
            <Button>Continue Shopping</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4 flex gap-4 items-center">
                    <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center text-3xl shrink-0">
                      {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mb-1">
                        Sold by: {item.vendor}
                      </p>
                      <div className="font-bold text-primary">
                        ₹{item.price}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-muted/50 rounded-full p-1 border border-border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        ) : (
                          <Minus className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="w-4 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="secondary">Apply</Button>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Delivery Fee
                      </span>
                      <span>₹{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes (5%)</span>
                      <span>₹{taxes.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full h-12 text-lg">Checkout</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
