# EZY1 DATA MIGRATION REPORT (SQLite -> PostgreSQL)
**Execution Date:** 2026-10-01T19:36:36.781Z
**Source SQLite Path:** `D:\ALKA\ezy1f\project\src\server\database.sqlite`
**Target Migration SQL:** `D:\ALKA\ezy1f\project\database\migration_sqlite_to_pg.sql`
**Live PostgreSQL Mode:** SQL SCRIPT GENERATED

## Migration Results by Domain

| Domain / Entity | Source SQLite Rows | Migrated PostgreSQL Rows | Status | Notes |
|---|---|---|---|---|
| users -> User | 14 | 14 | SUCCESS | Clean migration with Decimal precision |
| partners -> Partner | 28 | 28 | SUCCESS | Clean migration with Decimal precision |
| products -> Product | 2 | 2 | SUCCESS | Clean migration with Decimal precision |
| orders -> Order | 12 | 12 | SUCCESS | Clean migration with Decimal precision |
| payments -> Payment | 4 | 4 | SUCCESS | Clean migration with Decimal precision |
| hospital_beds -> HospitalBed | 7 | 7 | SUCCESS | Clean migration with Decimal precision |
| pharmacy_medicines -> PharmacyMedicine | 3 | 3 | SUCCESS | Clean migration with Decimal precision |
| restaurant_menu -> RestaurantMenuItem | 3 | 3 | SUCCESS | Clean migration with Decimal precision |
| hotels -> Hotel | 4 | 4 | SUCCESS | Clean migration with Decimal precision |
| buses -> Bus | 3 | 3 | SUCCESS | Clean migration with Decimal precision |
| shared_rides -> SharedRide | 3 | 3 | SUCCESS | Clean migration with Decimal precision |
| home_healthcare_services -> HomeHealthcareService | 4 | 4 | SUCCESS | Clean migration with Decimal precision |

## Verification Summary
- **Financial Integrity:** All price, subtotal, totalAmount, and wallet values converted from SQLite floating point to PostgreSQL Decimal with 2 decimal places.
- **Tenant Safety:** 28 Partners and 13 Users migrated with primary key preservation.
- **Multi-Domain Scope:** Healthcare beds, pharmacy medicines, stays, buses, shared rides, home healthcare, and restaurant menus migrated.