import { useMemo } from "react";
import { CATALOG_ITEMS, type CatalogItem } from "../ecosystem-data";
import { type StoredProduct, useStoreData } from "./storeData";

export function mapCategoryToSlug(category: string): string {
  if (!category) return "grocery";
  const lower = category.toLowerCase().trim();
  if (
    lower.includes("groc") ||
    lower.includes("atta") ||
    lower.includes("rice") ||
    lower.includes("dal") ||
    lower.includes("staple") ||
    lower.includes("oil") ||
    lower.includes("flour")
  ) {
    return "grocery";
  }
  if (lower.includes("fruit") || lower.includes("apple") || lower.includes("mango")) {
    return "fruits";
  }
  if (
    lower.includes("veg") ||
    lower.includes("onion") ||
    lower.includes("potato") ||
    lower.includes("tomato")
  ) {
    return "vegetables";
  }
  if (
    lower.includes("dairy") ||
    lower.includes("milk") ||
    lower.includes("butter") ||
    lower.includes("cheese") ||
    lower.includes("paneer") ||
    lower.includes("curd") ||
    lower.includes("egg") ||
    lower.includes("bread")
  ) {
    return "dairy";
  }
  if (lower.includes("bake") || lower.includes("cake") || lower.includes("cookie") || lower.includes("biscuit")) {
    return "bakery";
  }
  if (
    lower.includes("sweet") ||
    lower.includes("mithai") ||
    lower.includes("dessert") ||
    lower.includes("ladoo") ||
    lower.includes("gulab")
  ) {
    return "sweets";
  }
  if (
    lower.includes("food") ||
    lower.includes("restaur") ||
    lower.includes("dine") ||
    lower.includes("biryani") ||
    lower.includes("pizza") ||
    lower.includes("burger") ||
    lower.includes("meal") ||
    lower.includes("curry")
  ) {
    return "food";
  }
  if (
    lower.includes("pharm") ||
    lower.includes("med") ||
    lower.includes("dolo") ||
    lower.includes("paracetamol") ||
    lower.includes("tablet") ||
    lower.includes("capsule") ||
    lower.includes("syrup") ||
    lower.includes("first aid")
  ) {
    return "pharmacy";
  }
  if (lower.includes("ayur") || lower.includes("herbal")) {
    return "ayurveda";
  }
  if (
    lower.includes("beaut") ||
    lower.includes("cosmet") ||
    lower.includes("skin") ||
    lower.includes("shampoo") ||
    lower.includes("makeup") ||
    lower.includes("perfume")
  ) {
    return "beauty";
  }
  if (
    lower.includes("fash") ||
    lower.includes("cloth") ||
    lower.includes("shirt") ||
    lower.includes("dress") ||
    lower.includes("kurti") ||
    lower.includes("jeans")
  ) {
    return "fashion";
  }
  if (
    lower.includes("jewel") ||
    lower.includes("gold") ||
    lower.includes("silver") ||
    lower.includes("necklace") ||
    lower.includes("ring")
  ) {
    return "jewellery";
  }
  if (
    lower.includes("electr") ||
    lower.includes("gadget") ||
    lower.includes("phone") ||
    lower.includes("charger") ||
    lower.includes("headphone")
  ) {
    return "electronics";
  }
  if (
    lower.includes("service") ||
    lower.includes("repair") ||
    lower.includes("clean") ||
    lower.includes("plumb") ||
    lower.includes("electr")
  ) {
    return "cleaning";
  }
  return "grocery";
}

export function storedProductToCatalogItem(p: StoredProduct): CatalogItem {
  const catSlug = mapCategoryToSlug(p.category);
  return {
    id: `prod-${p.id}`,
    categoryId: catSlug,
    name: p.name,
    description: p.description || p.name,
    price: p.price,
    mrp: p.mrp || Math.round(p.price * 1.15),
    unit: p.unit || (p.stockCount ? `${p.stockCount} in stock` : "1 unit"),
    rating: p.rating || 4.8,
    reviewCount: p.totalReviews || 18,
    deliveryMinutes: 15,
    image:
      (p.images && p.images[0]) ||
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
    isVeg: true,
    brand: p.vendorName || "Local Verified Store",
    tags: [p.category, ...(p.tags || []), p.subcategory || ""].filter(Boolean) as string[],
  };
}

/**
 * Merges static CATALOG_ITEMS with store.products.
 * Any product added or edited in store.products (by Admin, Owner, or Partner)
 * takes priority and is displayed dynamically to all users.
 */
export function getMergedCatalog(storedProducts: StoredProduct[]): CatalogItem[] {
  if (!storedProducts || storedProducts.length === 0) {
    return CATALOG_ITEMS;
  }

  // Map of static items by normalized name & by id
  const staticItems = [...CATALOG_ITEMS];
  const storedCatalogItems: CatalogItem[] = [];

  storedProducts.forEach((p) => {
    // Only show published and available products
    if (p.published !== false) {
      storedCatalogItems.push(storedProductToCatalogItem(p));
    }
  });

  // Combine: Stored items take precedence at the front of the catalog
  const storedNames = new Set(
    storedCatalogItems.map((item) => item.name.toLowerCase().trim()),
  );

  // Keep static items that haven't been superseded by a stored item with the same name
  const filteredStatic = staticItems.filter(
    (item) => !storedNames.has(item.name.toLowerCase().trim()),
  );

  return [...storedCatalogItems, ...filteredStatic];
}

/**
 * React Hook providing the reactive dynamic catalog for all user pages.
 * Updates in real-time whenever an Admin, Owner, or Partner adds or edits a product.
 */
export function useDynamicCatalog() {
  const products = useStoreData((state) => state.products);
  const shops = useStoreData((state) => state.shops);
  const services = useStoreData((state) => state.services);
  const doctors = useStoreData((state) => state.doctors);
  const hospitals = useStoreData((state) => state.hospitals);

  const catalog = useMemo(() => {
    return getMergedCatalog(products);
  }, [products]);

  const getByCategory = (categoryId: string) => {
    return catalog.filter((item) => item.categoryId === categoryId);
  };

  const getFeatured = () => {
    return catalog.slice(0, 12);
  };

  const getFoodItems = () => {
    return catalog.filter(
      (item) =>
        item.categoryId === "food" ||
        item.tags.some((t) => t.toLowerCase().includes("food") || t.toLowerCase().includes("restaurant")),
    );
  };

  const getSweetsItems = () => {
    return catalog.filter(
      (item) =>
        item.categoryId === "sweets" ||
        item.tags.some((t) => t.toLowerCase().includes("sweet") || t.toLowerCase().includes("mithai")),
    );
  };

  const getCosmeticsItems = () => {
    return catalog.filter(
      (item) =>
        item.categoryId === "beauty" ||
        item.tags.some((t) => t.toLowerCase().includes("beauty") || t.toLowerCase().includes("cosmetics")),
    );
  };

  const getFashionItems = () => {
    return catalog.filter(
      (item) =>
        item.categoryId === "fashion" ||
        item.tags.some((t) => t.toLowerCase().includes("fashion") || t.toLowerCase().includes("clothing")),
    );
  };

  const getJewelleryItems = () => {
    return catalog.filter(
      (item) =>
        item.categoryId === "jewellery" ||
        item.tags.some((t) => t.toLowerCase().includes("jewellery") || t.toLowerCase().includes("gold")),
    );
  };

  return {
    catalog,
    products,
    shops,
    services,
    doctors,
    hospitals,
    getByCategory,
    getFeatured,
    getFoodItems,
    getSweetsItems,
    getCosmeticsItems,
    getFashionItems,
    getJewelleryItems,
  };
}
