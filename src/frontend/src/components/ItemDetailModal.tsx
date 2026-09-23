import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCartStore } from "../lib/cartStore";
import { useRequireAuth } from "./AuthPromptModal";
import { ImageViewerModal } from "./ui/ImageViewerModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  X,
  Star,
  Clock,
  MapPin,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  Maximize2,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Building2,
  Car,
  Package,
  Wrench,
  Bus,
  Compass,
  BedDouble,
  Tag,
  ArrowRight,
  Info,
} from "lucide-react";

export type DetailItemType =
  | "product"
  | "food"
  | "sweets"
  | "fashion"
  | "jewellery"
  | "cosmetics"
  | "doctor"
  | "hospital"
  | "stay"
  | "tour"
  | "bus"
  | "ride"
  | "parcel"
  | "service"
  | "spot"
  | "shop"
  | "coupon"
  | "general";

export interface ItemDetailData {
  id: string | number;
  type?: DetailItemType;
  name?: string;
  title?: string;
  image?: string;
  images?: string[];
  price?: number;
  originalPrice?: number;
  discount?: string;
  badge?: string;
  rating?: number;
  reviewsCount?: number;
  description?: string;
  category?: string;
  categoryId?: string;
  unit?: string;
  weightOrUnit?: string;
  deliveryTime?: string;
  deliveryMinutes?: number;
  brand?: string;
  restaurant?: string;
  cuisine?: string;
  isVeg?: boolean;
  metal?: string;
  gender?: string;
  // Doctor specific
  specialty?: string;
  qualifications?: string;
  hospital?: string;
  fee?: number;
  experience?: string;
  availability?: string;
  // Hospital specific
  availableBeds?: { icu?: number; oxygen?: number; general?: number; ventilator?: number };
  emergencyPhone?: string;
  address?: string;
  city?: string;
  // Stay specific
  pricePerNight?: number;
  availableRooms?: number;
  amenities?: string[];
  stayType?: string;
  // Tour specific
  duration?: string;
  agencyName?: string;
  destination?: string;
  inclusions?: string[];
  includedAmenities?: string;
  // Bus specific
  operatorName?: string;
  operator?: string;
  busType?: string;
  departureTime?: string;
  arrivalTime?: string;
  sourceCity?: string;
  destinationCity?: string;
  runningStatus?: string;
  availableSeats?: number;
  fare?: number;
  // Service specific
  features?: string[];
  warranty?: string;
  iconEmoji?: string;
  route?: string;
  // Shop specific
  distance?: string;
  specialtyShop?: string;
  // Coupon specific
  code?: string;
  desc?: string;
  tags?: string[];
  sweetShop?: string;
  [key: string]: any;
}

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItemDetailData | null;
}

export function ItemDetailModal({ isOpen, onClose, item }: ItemDetailModalProps) {
  const navigate = useNavigate();
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const { requireAuth } = useRequireAuth();

  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!isOpen || !item) return null;

  // Determine normalized properties
  const itemName = item.name || item.title || (item.code ? `Coupon ${item.code}` : "Item Details");
  const itemPrice = item.price ?? item.fare ?? item.pricePerNight ?? item.fee;
  const itemType: DetailItemType =
    item.type ||
    (item.specialty && item.fee ? "doctor" : undefined) ||
    (item.availableBeds ? "hospital" : undefined) ||
    (item.pricePerNight ? "stay" : undefined) ||
    (item.duration && item.agencyName ? "tour" : undefined) ||
    (item.operatorName || item.departureTime ? "bus" : undefined) ||
    (item.code && item.discount ? "coupon" : undefined) ||
    (item.specialtyShop || item.distance ? "shop" : undefined) ||
    (item.cuisine ? "food" : undefined) ||
    (item.metal ? "jewellery" : undefined) ||
    (item.gender ? "fashion" : undefined) ||
    "product";

  // Calculate cart numeric id
  const rawId = String(item.id || item.code || itemName);
  const numId = Math.abs(
    rawId.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)
  );
  const cartItem = items[numId];
  const currentQty = cartItem ? cartItem.quantity : 0;

  // Images list
  const primaryImg =
    item.image ||
    (item.images && item.images[0]) ||
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";

  const allImages = item.images && item.images.length > 0 ? item.images : [primaryImg];

  const handleAddToCart = () => {
    addItem({
      id: numId,
      name: itemName,
      description: item.description || itemName,
      price: itemPrice || 0,
      mrp: item.originalPrice || itemPrice || 0,
      image: primaryImg,
      images: allImages,
      category: item.category || item.categoryId || "general",
      categoryIds: [],
      vendorId: 1,
      stockCount: 50,
      inStock: true,
      isAvailable: true,
      rating: item.rating,
      totalReviews: item.reviewsCount,
    });
    toast.success(`Added ${itemName} to cart!`);
  };

  const handleIncreaseQty = () => {
    if (currentQty === 0) {
      handleAddToCart();
    } else {
      updateQuantity(numId, currentQty + 1);
    }
  };

  const handleDecreaseQty = () => {
    if (currentQty <= 1) {
      removeItem(numId);
      toast.info(`Removed ${itemName} from cart`);
    } else {
      updateQuantity(numId, currentQty - 1);
    }
  };

  const handleBuyNow = () => {
    if (currentQty === 0) {
      addItem({
        id: numId,
        name: itemName,
        description: item.description || itemName,
        price: itemPrice || 0,
        mrp: item.originalPrice || itemPrice || 0,
        image: primaryImg,
        images: allImages,
        category: item.category || item.categoryId || "general",
        categoryIds: [],
        vendorId: 1,
        stockCount: 50,
        inStock: true,
        isAvailable: true,
        rating: item.rating,
        totalReviews: item.reviewsCount,
      });
    }
    onClose();
    navigate({ to: "/dashboard/checkout" as any });
  };

  const handleBookDoctor = () => {
    onClose();
    requireAuth(() => navigate({ to: "/doctors" as any }));
  };

  const handleHospitalAction = () => {
    onClose();
    navigate({ to: "/hospitals" as any });
  };

  const handleBookStay = () => {
    onClose();
    requireAuth(() => navigate({ to: "/stays" as any }));
  };

  const handleBookTour = () => {
    onClose();
    requireAuth(() => navigate({ to: "/travel" as any }));
  };

  const handleSelectBusSeats = () => {
    onClose();
    requireAuth(() => navigate({ to: "/bus" as any }));
  };

  const handleApplyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code ${code} copied! Applicable at checkout.`);
    onClose();
  };

  return (
    <>
      {/* Detail Modal Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      >
        {/* Modal Dialog Card */}
        <div
          className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-card rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden text-foreground animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 min-w-0">
              {item.badge && (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-extrabold uppercase px-2 py-0.5 shrink-0">
                  {item.badge}
                </Badge>
              )}
              {item.category && (
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider truncate">
                  {item.category}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-muted/80 hover:bg-muted text-foreground flex items-center justify-center transition-colors"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Top Media & Zoom Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              {/* Product / Place Image with Click-to-Zoom */}
              <div className="space-y-2">
                <div
                  className="relative aspect-square w-full rounded-2xl overflow-hidden bg-muted/30 border border-border group cursor-zoom-in"
                  onClick={() => setIsZoomOpen(true)}
                  title="Click to zoom image"
                >
                  <img
                    src={allImages[activeImgIndex] || primaryImg}
                    alt={itemName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Zoom indicator tag */}
                  <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Click to Zoom</span>
                  </span>

                  {/* Veg / Non-Veg badge if food */}
                  {item.isVeg !== undefined && (
                    <span
                      className={`absolute top-2.5 left-2.5 w-5 h-5 rounded-md bg-card/90 border-2 flex items-center justify-center ${
                        item.isVeg ? "border-emerald-600" : "border-rose-600"
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          item.isVeg ? "bg-emerald-600" : "bg-rose-600"
                        }`}
                      />
                    </span>
                  )}
                </div>

                {/* Multiple Images Thumbnail Strip */}
                {allImages.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImgIndex(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                          activeImgIndex === idx
                            ? "border-primary shadow-sm scale-105"
                            : "border-border opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Core Details Column */}
              <div className="space-y-3.5 flex flex-col justify-between">
                <div>
                  {item.brand && (
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                      {item.brand}
                    </span>
                  )}
                  {item.restaurant && (
                    <span className="text-xs font-semibold text-muted-foreground block">
                      👨‍🍳 {item.restaurant}
                    </span>
                  )}

                  <h3 className="text-xl sm:text-2xl font-display font-extrabold text-foreground leading-snug">
                    {itemName}
                  </h3>

                  {(item.unit || item.weightOrUnit) && (
                    <span className="text-xs text-muted-foreground block mt-0.5">
                      Net Qty / Pack: <strong>{item.unit || item.weightOrUnit}</strong>
                    </span>
                  )}

                  {/* Rating & Reviews */}
                  {item.rating && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-lg text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{item.rating}</span>
                      </div>
                      {item.reviewsCount && (
                        <span className="text-xs text-muted-foreground font-medium">
                          ({item.reviewsCount} verified reviews)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price Section */}
                  {itemPrice !== undefined && (
                    <div className="flex items-baseline gap-2.5 mt-3 pt-3 border-t border-border">
                      <span className="text-2xl font-black text-foreground">₹{itemPrice}</span>
                      {item.originalPrice && item.originalPrice > itemPrice && (
                        <>
                          <span className="text-sm line-through text-muted-foreground">
                            ₹{item.originalPrice}
                          </span>
                          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                            Save ₹{item.originalPrice - itemPrice}
                          </span>
                        </>
                      )}
                      {item.discount && (
                        <Badge className="bg-rose-500/15 text-rose-600 border-rose-500/20 text-xs font-bold">
                          {item.discount}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Express Delivery / Time Info */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 text-xs">
                    {(item.deliveryMinutes || item.deliveryTime) && (
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {item.deliveryMinutes
                            ? `Delivered in ${item.deliveryMinutes} mins`
                            : item.deliveryTime}
                        </span>
                      </div>
                    )}
                    {item.cuisine && (
                      <span className="bg-muted px-2 py-1 rounded-lg font-medium text-foreground">
                        Cuisine: {item.cuisine}
                      </span>
                    )}
                    {item.metal && (
                      <span className="bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-lg font-bold">
                        Purity: {item.metal}
                      </span>
                    )}
                  </div>
                </div>

                {/* Micro guarantees */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/80 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    <span>100% Genuine & Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant Doorstep Return</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialized Details Tabs / Blocks based on item type */}

            {/* 1. Doctor Details Block */}
            {itemType === "doctor" && (
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Specialist Credentials
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Specialty:</span>
                    <span className="font-bold text-foreground">{item.specialty}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Hospital Affiliation:</span>
                    <span className="font-bold text-foreground">{item.hospital || "EZY Health Network"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Consultation Fee:</span>
                    <span className="font-bold text-foreground">₹{item.fee}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Daily Slots:</span>
                    <span className="font-bold text-emerald-600">Available Today (10 AM - 7 PM)</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Hospital Beds Telemetry Block */}
            {itemType === "hospital" && (
              <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-rose-600" /> Live Hospital Bed Telemetry
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-card border border-border">
                    <span className="text-[10px] text-muted-foreground block">ICU Beds</span>
                    <span className="text-base font-black text-rose-600">
                      {item.availableBeds?.icu ?? 4} Available
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-card border border-border">
                    <span className="text-[10px] text-muted-foreground block">Oxygen Beds</span>
                    <span className="text-base font-black text-amber-600">
                      {item.availableBeds?.oxygen ?? 12} Available
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-card border border-border">
                    <span className="text-[10px] text-muted-foreground block">General Beds</span>
                    <span className="text-base font-black text-emerald-600">
                      {item.availableBeds?.general ?? 25} Available
                    </span>
                  </div>
                </div>
                {item.address && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{item.address}</span>
                  </p>
                )}
              </div>
            )}

            {/* 3. Hotel Stay Details Block */}
            {itemType === "stay" && (
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-amber-600" /> Stay Highlights & Amenities
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    item.amenities || [
                      "Free High-Speed Wi-Fi",
                      "AC Deluxe Rooms",
                      "Complimentary Breakfast",
                      "24/7 Room Service",
                      "Power Backup",
                      "Free Cancellation",
                    ]
                  ).map((amenity, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold bg-card border border-border px-2.5 py-1 rounded-lg text-foreground"
                    >
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-border">
                  <span className="text-muted-foreground">Location: {item.address || "City Center"}</span>
                  <span className="font-bold text-emerald-600">
                    {item.availableRooms ?? 5} rooms available
                  </span>
                </div>
              </div>
            )}

            {/* 4. Tour Package Details Block */}
            {itemType === "tour" && (
              <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20 space-y-3">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-600" /> Tour Itinerary & Inclusions
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Operator:</span>
                    <span className="font-bold">{item.agencyName || "Verified Partner"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Duration:</span>
                    <span className="font-bold">{item.duration}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Includes:{" "}
                  <strong>
                    {item.includedAmenities ||
                      (item.inclusions?.join(" • ") ??
                        "Hotel stay, AC coach travel, guided sightseeing, breakfast & entry permits")}
                  </strong>
                </p>
              </div>
            )}

            {/* 5. Regional Bus Details Block */}
            {itemType === "bus" && (
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Bus className="w-4 h-4 text-blue-600" /> Bus Schedule & Route Info
                </h4>
                <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border text-center">
                  <div>
                    <span className="font-extrabold text-base text-foreground block">
                      {item.departureTime || "--:--"}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.sourceCity || "Origin"}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    <span>{item.busType || "AC Volvo Multi-Axle"}</span>
                    <div className="w-16 h-0.5 bg-border my-1 mx-auto" />
                    <span className="text-emerald-600 font-bold">
                      {item.runningStatus || "On Time"}
                    </span>
                  </div>
                  <div>
                    <span className="font-extrabold text-base text-foreground block">
                      {item.arrivalTime || "--:--"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.destinationCity || "Destination"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Carrier: {item.operatorName || item.operator}</span>
                  <span className="font-bold text-sky-600">
                    {item.availableSeats ?? 14} seats remaining
                  </span>
                </div>
              </div>
            )}

            {/* Description Paragraph */}
            {item.description && (
              <div className="space-y-1.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Description
                </h4>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}

            {/* Coupon Code Block */}
            {itemType === "coupon" && item.code && (
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block">Promo Code</span>
                  <span className="font-mono font-black text-xl text-primary">{item.code}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <Button
                  onClick={() => handleApplyCoupon(item.code!)}
                  className="rounded-xl font-bold text-xs bg-primary text-primary-foreground"
                >
                  Copy & Apply
                </Button>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 sm:p-5 border-t border-border bg-card/95 backdrop-blur-md flex items-center justify-between gap-3">
            {/* Left Price / Info in footer */}
            <div className="min-w-0">
              {itemPrice !== undefined ? (
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    {itemType === "stay"
                      ? "Price per night"
                      : itemType === "tour"
                      ? "Price per person"
                      : itemType === "bus"
                      ? "Ticket fare"
                      : "Total Price"}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-foreground">
                    ₹{itemPrice}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-semibold text-muted-foreground">
                  Verified Local Listing
                </span>
              )}
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Product / Food / Fashion / Jewellery / Cosmetics / Sweets Actions */}
              {(itemType === "product" ||
                itemType === "food" ||
                itemType === "sweets" ||
                itemType === "fashion" ||
                itemType === "jewellery" ||
                itemType === "cosmetics" ||
                itemType === "general") && (
                <>
                  {currentQty > 0 ? (
                    <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 p-1 rounded-xl">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleDecreaseQty}
                        className="w-8 h-8 rounded-lg text-primary hover:bg-primary/20"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </Button>
                      <span className="font-extrabold text-sm min-w-[20px] text-center text-primary">
                        {currentQty}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleIncreaseQty}
                        className="w-8 h-8 rounded-lg text-primary hover:bg-primary/20"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleAddToCart}
                      className="rounded-xl font-bold text-xs sm:text-sm h-11 px-4 sm:px-5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all gap-1.5"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </Button>
                  )}

                  <Button
                    onClick={handleBuyNow}
                    className="rounded-xl font-bold text-xs sm:text-sm h-11 px-5 sm:px-6 bg-primary text-primary-foreground shadow-md hover:bg-primary/95 transition-all gap-1"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </>
              )}

              {/* Doctor Booking Action */}
              {itemType === "doctor" && (
                <Button
                  onClick={handleBookDoctor}
                  className="rounded-xl font-bold text-xs sm:text-sm h-11 px-6 bg-primary text-primary-foreground shadow-md gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </Button>
              )}

              {/* Hospital Beds / SOS Actions */}
              {itemType === "hospital" && (
                <>
                  <Button
                    variant="outline"
                    asChild
                    className="rounded-xl font-bold text-xs h-11 px-4 border-rose-500/40 text-rose-600 gap-1.5"
                  >
                    <a href="tel:108">
                      <PhoneCall className="w-4 h-4" />
                      <span>108 SOS</span>
                    </a>
                  </Button>
                  <Button
                    onClick={handleHospitalAction}
                    className="rounded-xl font-bold text-xs sm:text-sm h-11 px-5 bg-rose-600 hover:bg-rose-700 text-white shadow-md gap-1.5"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Check & Book Beds</span>
                  </Button>
                </>
              )}

              {/* Stay Booking Action */}
              {itemType === "stay" && (
                <Button
                  onClick={handleBookStay}
                  className="rounded-xl font-bold text-xs sm:text-sm h-11 px-6 bg-primary text-primary-foreground shadow-md gap-1.5"
                >
                  <BedDouble className="w-4 h-4" />
                  <span>Book Stay Now</span>
                </Button>
              )}

              {/* Tour Booking Action */}
              {itemType === "tour" && (
                <Button
                  onClick={handleBookTour}
                  className="rounded-xl font-bold text-xs sm:text-sm h-11 px-6 bg-primary text-primary-foreground shadow-md gap-1.5"
                >
                  <Compass className="w-4 h-4" />
                  <span>Book Tour Package</span>
                </Button>
              )}

              {/* Bus Ticket Action */}
              {itemType === "bus" && (
                <Button
                  onClick={handleSelectBusSeats}
                  className="rounded-xl font-bold text-xs sm:text-sm h-11 px-6 bg-primary text-primary-foreground shadow-md gap-1.5"
                >
                  <Bus className="w-4 h-4" />
                  <span>Select Seats & Book</span>
                </Button>
              )}

              {/* Ride / Parcel / Service Actions */}
              {(itemType === "ride" || itemType === "parcel" || itemType === "service") && (
                <Button
                  onClick={() => {
                    onClose();
                    if (item.route) {
                      navigate({ to: item.route as any });
                    }
                  }}
                  className="rounded-xl font-bold text-xs sm:text-sm h-11 px-6 bg-primary text-primary-foreground shadow-md gap-1.5"
                >
                  <span>Book / Request Service</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}

              {/* Spot / Shop Action */}
              {(itemType === "spot" || itemType === "shop") && (
                <Button
                  onClick={() => {
                    onClose();
                    navigate({ to: itemType === "spot" ? "/famous" : "/local-shops" });
                  }}
                  className="rounded-xl font-bold text-xs sm:text-sm h-11 px-6 bg-primary text-primary-foreground shadow-md gap-1.5"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Explore Details</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Fullscreen / Pinch Zoom Lightbox */}
      <ImageViewerModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        images={allImages}
        initialIndex={activeImgIndex}
        title={itemName}
        subtitle={item.brand || item.restaurant || item.category || "EZY1 Item Preview"}
      />
    </>
  );
}
