import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

async function main() {
  console.log("[Seed] Starting PostgreSQL database seeding via Prisma...");

  const jsonPath = path.resolve(__dirname, "../../ezy1_db.json");
  if (!fs.existsSync(jsonPath)) {
    console.warn(`[Seed] No ezy1_db.json file found at ${jsonPath}`);
    return;
  }

  const raw = fs.readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(raw);

  // 1. Categories
  console.log("[Seed] Seeding categories...");
  const categories = [
    { name: "Grocery & Kirana", slug: "grocery", description: "Hyperlocal grocery and daily essentials", icon: "ShoppingBag" },
    { name: "Fresh Fruits", slug: "fruits", description: "Farm fresh fruits delivered in 15 mins", icon: "Apple" },
    { name: "Vegetables", slug: "vegetables", description: "Local mandis fresh veggies", icon: "Carrot" },
    { name: "Restaurants & Food", slug: "restaurants", description: "Hot meals from local kitchens and cafes", icon: "Utensils" },
    { name: "Pharmacy & Medicines", slug: "pharmacy", description: "Prescription drugs and OTC wellness", icon: "Pill" },
    { name: "Local Services", slug: "services", description: "Electricians, plumbers, carpenters", icon: "Wrench" }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon
      }
    });
  }

  // 2. Users
  if (data.users && Array.isArray(data.users)) {
    console.log(`[Seed] Seeding ${data.users.length} users...`);
    for (const u of data.users) {
      const email = u.email || `user_${u.id}@ezy1.site`;
      const username = u.username || `user_${u.id}`;
      await prisma.user.upsert({
        where: { id: u.id },
        update: {},
        create: {
          id: u.id,
          name: u.name || "User",
          username,
          email,
          phone: u.phone || null,
          city: u.city || "Bengaluru",
          passwordHash: u.passwordHash,
          role: (u.role || "CUSTOMER").toUpperCase() as any,
          walletBalance: u.walletBalance || 0
        }
      }).catch(() => {});
    }
  }

  // 3. Partners
  if (data.partners && Array.isArray(data.partners)) {
    console.log(`[Seed] Seeding ${data.partners.length} partners...`);
    for (const p of data.partners) {
      const partnerUserId = p.partnerUserId || `EZY-P-${10000 + p.id}`;
      const email = p.email || `partner_${p.id}@partner.ezy1.site`;
      await prisma.partner.upsert({
        where: { partnerUserId },
        update: {},
        create: {
          id: p.id,
          partnerUserId,
          businessName: p.businessName || "Partner Business",
          ownerName: p.name || p.ownerName || "Owner",
          category: p.category || "Grocery",
          phone: p.phone || `987650000${p.id}`,
          email,
          city: p.city || "Bengaluru",
          passwordHash: p.passwordHash,
          mustChangePassword: Boolean(p.mustChangePassword)
        }
      }).catch(() => {});
    }
  }

  console.log("[Seed] Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("[Seed] Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
