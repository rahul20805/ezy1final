import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "../lib/cartStore";
import type { Product } from "../types";

export function ProductCard({ product }: { product: Product }) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items[product.id];
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="relative border border-border/60 rounded-[20px] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-primary/30 transition-all duration-500 bg-card flex flex-col group hover:-translate-y-1">
      {product.mrp > product.price && (
        <div className="absolute top-0 left-0 bg-[#e8f3ef] text-[#24963f] font-bold text-[10px] px-2 py-1 z-10 rounded-br-lg shadow-sm">
          {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
        </div>
      )}

      <div className="aspect-square bg-muted/20 relative flex items-center justify-center p-4">
        {/* If image is an emoji (for mock), render as text. Otherwise img tag */}
        {product.images[0].length <= 2 ? (
          <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
            {product.images[0]}
          </div>
        ) : (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Floating Add Button logic */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 shadow-sm rounded-lg overflow-hidden bg-background border border-primary/20">
          {quantity === 0 ? (
            <Button
              size="sm"
              className="h-8 px-6 text-sm font-bold bg-[#fff0f3] text-primary hover:bg-[#ffe1e6] border-0"
              onClick={() => addItem(product)}
            >
              ADD
            </Button>
          ) : (
            <div className="flex items-center h-8 bg-primary text-primary-foreground font-bold">
              <button
                className="px-2 h-full hover:bg-black/20"
                onClick={() => updateQuantity(product.id, quantity - 1)}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-sm w-6 text-center">{quantity}</span>
              <button
                className="px-2 h-full hover:bg-black/20"
                onClick={() => updateQuantity(product.id, quantity + 1)}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 pt-6 flex flex-col flex-1">
        <p className="text-xs text-muted-foreground font-medium mb-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> 10
          MINS
        </p>
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-[11px] text-muted-foreground mb-3">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-end gap-1.5">
            <span className="font-bold text-base leading-none">
              ₹{product.price}
            </span>
            {product.mrp > product.price && (
              <span className="text-[11px] text-muted-foreground line-through leading-none mb-0.5">
                ₹{product.mrp}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
