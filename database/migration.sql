 -- ============================================================
-- EMS Migration v2 — E-Commerce Support
-- ============================================================

USE `electronics_store`;

-- ─────────────────────────────────────────────────────
-- 1. Shto rolin Customer
-- ─────────────────────────────────────────────────────
INSERT INTO `Roles` (`emertimi`, `pershkrimi`)
VALUES ('Customer', 'Klient i regjistruar ne dyqan');

-- ─────────────────────────────────────────────────────
-- 2. Shto user_id në tabelën Customers
--    NULL = klient pa llogari (guest)
--    NOT NULL = klient i regjistruar
-- ─────────────────────────────────────────────────────
ALTER TABLE `Customers`
  ADD COLUMN `user_id` INT NULL AFTER `id`,
  ADD CONSTRAINT `fk_customers_user`
    FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
    ON DELETE SET NULL;

-- ─────────────────────────────────────────────────────
-- 3. Shto kolonën cart_session për guest users
--    Kjo na lejon të gjurmojmë porositë e guestëve
-- ─────────────────────────────────────────────────────
ALTER TABLE `Orders`
  ADD COLUMN `session_id` VARCHAR(255) NULL AFTER `user_id`;

-- ─────────────────────────────────────────────────────
-- 4. Shto kolonën source — nga ku erdhi porosia
--    'dashboard' = krijuar nga kasieri
--    'store'     = krijuar nga klienti online
-- ─────────────────────────────────────────────────────
ALTER TABLE `Orders`
  ADD COLUMN `source` ENUM('dashboard','store') NOT NULL DEFAULT 'dashboard' AFTER `statusi`;

-- ─────────────────────────────────────────────────────
-- VERIFIKIMI — duhet të shohësh të gjitha ndryshimet
-- ─────────────────────────────────────────────────────
SELECT id, emertimi FROM Roles ORDER BY id;
DESCRIBE Customers;
DESCRIBE Orders;

-- ============================================================
-- FUND migration_v2.sql
-- ============================================================