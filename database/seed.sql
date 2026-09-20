-- =============================================
-- EZY1 PRODUCTION DATABASE SEED SCRIPT (PostgreSQL)
-- Generated: 2026-09-20T15:02:21.371Z
-- =============================================

SET session_replication_role = 'replica';

-- Users
INSERT INTO "User" (id, username, email, "passwordHash", name, phone, role, "walletBalance", "createdAt", "updatedAt") VALUES (1, 'admin', 'admin@ezy1.in', '8204d8c8926012ed89d2069ada27b825:6018f3c18b54f19b50fc4055a9b3556ed4232f56fab4cd116807f2f17f841195026123eb242f604a6201e1b0bd8cd26e613d6d46a97af9729b277dcbb929c66b', 'Platform Master Owner', '+91 98765 43210', 'SUPER_OWNER', 0, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO "User" (id, username, email, "passwordHash", name, phone, role, "walletBalance", "createdAt", "updatedAt") VALUES (2, 'sharma_grocery', 'sharma.kirana@partner.ezy1.in', 'edb59141992bded76645dc73f9d6c543:b890faa66e2b3706059ed8a2da9ab912b2a3abeffa268d7219264041f0f6ee760553aae1b9eabeb5a6cd913d4c5d9950961045d27f1eca2c8e6092b2b1692e8e', 'Ramesh Sharma', '9876543210', 'PARTNER', 0, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO "User" (id, username, email, "passwordHash", name, phone, role, "walletBalance", "createdAt", "updatedAt") VALUES (3, 'nair_pharma', 'nair.pharma@partner.ezy1.in', '47d47c9893d58e3da3149e1bf4b6a23c:ee5f7c3c5e8bad288b71886c49be3ecb64c92e1612108864dc93607a3317941cf56453b45b1fffc4bbdfe869a34563573f1673392216b35a1f5bd27365dd4c2b', 'Krishnan Nair', '9845012345', 'PARTNER', 0, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO "User" (id, username, email, "passwordHash", name, phone, role, "walletBalance", "createdAt", "updatedAt") VALUES (4, 'suresh_services', 'suresh.services@partner.ezy1.in', 'f08c26079b006747cc0d7734126080fb:4ba2d1efab1351358ee07f85e20106bdaeffefbd46a7d363abcb3dc158e1c8106ec3420f4a54ca4a9c5d7acb3ccda6c664d364bcbc0bbbcf8a312f6f9e7dcc11', 'Suresh Sharma', '9812345670', 'PARTNER', 0, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO "User" (id, username, email, "passwordHash", name, phone, role, "walletBalance", "createdAt", "updatedAt") VALUES (5, 'rajesh_transport', 'rajesh.transport@partner.ezy1.in', '0c9584654b1b1a6109737813b2158c2f:163c51bf94c8b6d29923b43117dcf74876212914b3fbb88cec5cd81fe81f4edbdef939f9425acbfa7b7134f8fb68809c2164bbf73a3edd387e9000c38545e7dd', 'Rajesh Kumar', '9900112233', 'PARTNER', 0, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO "User" (id, username, email, "passwordHash", name, phone, role, "walletBalance", "createdAt", "updatedAt") VALUES (6, 'dr_priya', 'dr.priya@partner.ezy1.in', '46c452dc7b32ac7fb2bdcb61c6d9f712:d7bfb80faa4aa3a5849e6be26778f53f453a041afd9faf2f5db7e885c17a18a875237d339926998292eeef8f00b45b0c7676836320086cc23f2000f62f9045d3', 'Dr. Priya Sharma', '9823456789', 'PARTNER', 0, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;


-- Products
INSERT INTO "Product" (id, "partnerId", "categoryId", name, description, price, "isAvailable", "createdAt", "updatedAt") VALUES (1, 1, 1, 'Aashirvaad Superior Sharbati Atta (5kg)', '100% whole wheat flour, naturally stone-ground for soft chapatis.', 255, true, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO "Product" (id, "partnerId", "categoryId", name, description, price, "isAvailable", "createdAt", "updatedAt") VALUES (2, 1, 1, 'Tata Salt Vacuum Evaporated (1kg)', 'Iodized crystal salt for daily healthy cooking.', 28, true, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO "Product" (id, "partnerId", "categoryId", name, description, price, "isAvailable", "createdAt", "updatedAt") VALUES (3, 1, 1, 'Fortune Sunlite Refined Sunflower Oil (1L)', 'Light and healthy cooking oil enriched with vitamins A & D.', 135, true, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO "Product" (id, "partnerId", "categoryId", name, description, price, "isAvailable", "createdAt", "updatedAt") VALUES (4, 2, 1, 'Chyawanprash Special Herbal Immune Booster (500g)', 'Traditional Ayurvedic formulation containing fresh Amla and over 40 herbs.', 340, true, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
INSERT INTO "Product" (id, "partnerId", "categoryId", name, description, price, "isAvailable", "createdAt", "updatedAt") VALUES (5, 2, 1, 'Digital Infrared Forehead Thermometer', 'Non-contact instant 1-second temperature measurement with fever alert display.', 899, true, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;


SET session_replication_role = 'DEFAULT';
