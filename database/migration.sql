-- ============================================================
-- Migration: add missing columns + productreviews table
-- Run once:
--   mysql -u root -p electronics_store < database/migration.sql
-- ============================================================

-- 1. orders — add metoda_pageses + adresa_dorezimit
ALTER TABLE `orders`
  ADD COLUMN `metoda_pageses` varchar(50) DEFAULT NULL AFTER `totali`;
ALTER TABLE `orders`
  ADD COLUMN `adresa_dorezimit` varchar(255) DEFAULT NULL AFTER `metoda_pageses`;

-- 2. suppliers — add vendi
ALTER TABLE `suppliers`
  ADD COLUMN `vendi` varchar(100) DEFAULT NULL AFTER `adresa`;

-- 3. warranties — add lloji
ALTER TABLE `warranties`
  ADD COLUMN `lloji` varchar(100) DEFAULT 'standard' AFTER `customer_id`;

-- 4. productreviews table
CREATE TABLE IF NOT EXISTS `productreviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `produkti_id` int NOT NULL,
  `klienti_id` int NOT NULL,
  `vleresimi` tinyint NOT NULL CHECK (`vleresimi` BETWEEN 1 AND 5),
  `komenti` text,
  `data_vleresimit` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_reviews_product` (`produkti_id`),
  KEY `fk_reviews_customer` (`klienti_id`),
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`produkti_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_customer` FOREIGN KEY (`klienti_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 5. userclaims table
CREATE TABLE IF NOT EXISTS `userclaims` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `claim_type` varchar(255) NOT NULL,
  `claim_value` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_userclaims_user` (`user_id`),
  CONSTRAINT `fk_userclaims_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 6. usertokens table
CREATE TABLE IF NOT EXISTS `usertokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `login_provider` varchar(128) NOT NULL DEFAULT 'Local',
  `name` varchar(128) NOT NULL,
  `value` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_usertokens_user` (`user_id`),
  CONSTRAINT `fk_usertokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================