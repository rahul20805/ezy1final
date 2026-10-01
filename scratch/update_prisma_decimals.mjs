import fs from "fs";
import path from "path";

const schemaPath = path.resolve("backend/prisma/schema.prisma");
let content = fs.readFileSync(schemaPath, "utf8");

// Financial fields map to Decimal definitions
const replacements = [
  { from: /walletBalance\s+Float\s+@default\(0\.0\)/g, to: "walletBalance      Decimal       @default(0.0) @db.Decimal(12, 2)" },
  { from: /commissionRate\s+Float\s+@default\(10\.0\)/g, to: "commissionRate    Decimal       @default(10.0) @db.Decimal(5, 2)" },
  { from: /pendingSettlement\s+Float\s+@default\(0\.0\)/g, to: "pendingSettlement Decimal       @default(0.0) @db.Decimal(12, 2)" },
  { from: /price\s+Float\b/g, to: "price           Decimal       @db.Decimal(10, 2)" },
  { from: /mrp\s+Float\?/g, to: "mrp             Decimal?      @db.Decimal(10, 2)" },
  { from: /subtotal\s+Float\b/g, to: "subtotal          Decimal       @db.Decimal(12, 2)" },
  { from: /deliveryFee\s+Float\s+@default\(0\.0\)/g, to: "deliveryFee       Decimal       @default(0.0) @db.Decimal(10, 2)" },
  { from: /discountAmount\s+Float\s+@default\(0\.0\)/g, to: "discountAmount    Decimal       @default(0.0) @db.Decimal(10, 2)" },
  { from: /totalAmount\s+Float\b/g, to: "totalAmount       Decimal       @db.Decimal(12, 2)" },
  { from: /unitPrice\s+Float\b/g, to: "unitPrice         Decimal       @db.Decimal(10, 2)" },
  { from: /totalPrice\s+Float\b/g, to: "totalPrice        Decimal       @db.Decimal(12, 2)" },
  { from: /amount\s+Float\b/g, to: "amount            Decimal       @db.Decimal(12, 2)" },
  { from: /grossSales\s+Float\b/g, to: "grossSales        Decimal       @db.Decimal(12, 2)" },
  { from: /platformFee\s+Float\b/g, to: "platformFee       Decimal       @db.Decimal(12, 2)" },
  { from: /taxDeduction\s+Float\s+@default\(0\.0\)/g, to: "taxDeduction      Decimal       @default(0.0) @db.Decimal(12, 2)" },
  { from: /netPayout\s+Float\b/g, to: "netPayout         Decimal       @db.Decimal(12, 2)" },
  { from: /dailyRate\s+Float\s+@default\(1500\)/g, to: "dailyRate         Decimal       @default(1500.0) @db.Decimal(10, 2)" },
  { from: /consultationFee\s+Float\s+@default\(500\)/g, to: "consultationFee   Decimal       @default(500.0) @db.Decimal(10, 2)" },
  { from: /earnings\s+Float\s+@default\(60\.0\)/g, to: "earnings          Decimal       @default(60.0) @db.Decimal(10, 2)" },
  { from: /pricePerNight\s+Float\b/g, to: "pricePerNight     Decimal       @db.Decimal(10, 2)" },
  { from: /originalPrice\s+Float\?/g, to: "originalPrice     Decimal?      @db.Decimal(10, 2)" },
  { from: /pricePerSeat\s+Float\b/g, to: "pricePerSeat      Decimal       @db.Decimal(10, 2)" },
  { from: /discountValue\s+Float\b/g, to: "discountValue     Decimal       @db.Decimal(10, 2)" },
  { from: /minOrderValue\s+Float\s+@default\(0\.0\)/g, to: "minOrderValue     Decimal       @default(0.0) @db.Decimal(10, 2)" },
  { from: /maxDiscount\s+Float\?/g, to: "maxDiscount       Decimal?      @db.Decimal(10, 2)" }
];

let modified = content;
for (const r of replacements) {
  modified = modified.replace(r.from, r.to);
}

fs.writeFileSync(schemaPath, modified, "utf8");
console.log("Successfully converted monetary Float fields to Decimal in", schemaPath);
