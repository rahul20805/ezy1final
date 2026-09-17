import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { QuickCommerceHeader } from "../components/QuickCommerceHeader";
import { StickyCartBar } from "../components/StickyCartBar";
import UserLayout from "../components/UserLayout";
import { useCategories, useProducts } from "../lib/backend-hooks";

export default function CommercePage() {
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Fallback to empty arrays if undefined
  const safeProducts = products || [];
  const safeCategories = categories || [];

  const displayedProducts = selectedCategory
    ? safeProducts.filter((p) => Array.isArray(p.categoryIds) && p.categoryIds.includes(selectedCategory))
    : safeProducts;

  return (
    <UserLayout>
      <div className="container pb-24 max-w-5xl">
        <QuickCommerceHeader />

        {/* Categories Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold font-display mb-4">
            Shop by Category
          </h2>

          {isLoadingCategories ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="w-20 h-20 rounded-2xl" />
                  <Skeleton className="w-16 h-3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              <div
                className={`flex flex-col items-center gap-2 cursor-pointer snap-start ${selectedCategory === null ? "opacity-100" : "opacity-60"}`}
                onClick={() => setSelectedCategory(null)}
              >
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl border-2 ${selectedCategory === null ? "border-primary" : "border-transparent"}`}
                >
                  🔥
                </div>
                <span className="text-xs font-semibold text-center whitespace-nowrap">
                  All Items
                </span>
              </div>

              {safeCategories.map((cat) => (
                <div
                  key={cat.id}
                  className={`flex flex-col items-center gap-2 cursor-pointer snap-start ${selectedCategory === cat.id ? "opacity-100" : "opacity-60 hover:opacity-100 transition-opacity"}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-muted flex items-center justify-center text-3xl border-2 ${selectedCategory === cat.id ? "border-primary" : "border-transparent"}`}
                  >
                    {cat.image}
                  </div>
                  <span className="text-xs font-medium text-center whitespace-nowrap w-20 truncate">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error State for API Connection */}
        {isErrorProducts && (
          <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive flex items-start gap-3 mb-8">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold mb-1">
                Unable to connect to EZY1 Backend
              </h3>
              <p className="text-sm opacity-90">
                Please make sure the backend Node.js server is running (`node
                src/server/src/index.js`).
              </p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-display">
              {selectedCategory
                ? safeCategories.find((c) => c.id === selectedCategory)?.name
                : "Trending Near You"}
            </h2>
            <span className="text-xs text-muted-foreground font-medium">
              {displayedProducts.length} items
            </span>
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="w-full aspect-square rounded-2xl" />
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-1/2 h-3" />
                  <Skeleton className="w-1/3 h-5 mt-4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!isLoadingProducts &&
            !isErrorProducts &&
            displayedProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4 opacity-50">🛒</div>
                <h3 className="font-bold text-lg mb-2">No items found</h3>
                <p className="text-muted-foreground text-sm">
                  We couldn't find any products in this category.
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Persistent global cart at bottom */}
      <StickyCartBar />
    </UserLayout>
  );
}
