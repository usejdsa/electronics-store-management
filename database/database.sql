-- ============================================================
-- Electronics Store Management System (EMS)
-- Database Schema - v2
-- 15 Tabela
-- ============================================================

CREATE DATABASE IF NOT EXISTS `electronics_store`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `electronics_store`;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. IDENTITY SYSTEM
-- ============================================================

CREATE TABLE IF NOT EXISTS `Roles` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `emertimi`    VARCHAR(50)   NOT NULL,   -- Admin, Technician, Cashier
  `pershkrimi`  VARCHAR(255)      NULL,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roles_emertimi` (`emertimi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---
CREATE TABLE IF NOT EXISTS `Users` (
  `id`             INT           NOT NULL AUTO_INCREMENT,
  `emri`           VARCHAR(100)  NOT NULL,
  `mbiemri`        VARCHAR(100)  NOT NULL,
  `email`          VARCHAR(255)  NOT NULL,
  `password_hash`  VARCHAR(255)  NOT NULL,
  `is_active`      TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---
CREATE TABLE IF NOT EXISTS `UserRoles` (
  `user_id`     INT       NOT NULL,
  `role_id`     INT       NOT NULL,
  `assigned_at` DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `role_id`),
  CONSTRAINT `fk_userroles_user` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_userroles_role` FOREIGN KEY (`role_id`) REFERENCES `Roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---
CREATE TABLE IF NOT EXISTS `RefreshTokens` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `user_id`     INT           NOT NULL,
  `token`       VARCHAR(512)  NOT NULL,
  `expires_at`  DATETIME      NOT NULL,
  `revoked`     TINYINT(1)    NOT NULL DEFAULT 0,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_refreshtokens_token` (`token`),
  CONSTRAINT `fk_refreshtokens_user` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 2. KATALOGU
-- ============================================================

CREATE TABLE IF NOT EXISTS `Categories` (
  `id`                  INT           NOT NULL AUTO_INCREMENT,
  `emertimi`            VARCHAR(255)  NOT NULL,
  `pershkrimi`          TEXT              NULL,
  `kategoria_prind_id`  INT               NULL,
  `ikona`               VARCHAR(255)      NULL,
  `created_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_categories_parent` FOREIGN KEY (`kategoria_prind_id`) REFERENCES `Categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---
CREATE TABLE IF NOT EXISTS `Products` (
  `id`              INT             NOT NULL AUTO_INCREMENT,
  `emri`            VARCHAR(255)    NOT NULL,
  `kategoria_id`    INT                 NULL,
  `marka`           VARCHAR(100)        NULL,
  `modeli`          VARCHAR(100)        NULL,
  `pershkrimi`      LONGTEXT            NULL,
  `cmimi`           DECIMAL(10,2)   NOT NULL,
  `cmimi_zbritjes`  DECIMAL(10,2)       NULL,
  `sasia_stokut`    INT             NOT NULL DEFAULT 0,
  `garancia_muaj`   INT                 NULL DEFAULT 0,
  `foto_kryesore`   VARCHAR(255)        NULL,
  `is_active`       TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`kategoria_id`) REFERENCES `Categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 3. KLIENTET DHE SHITJET
-- ============================================================

CREATE TABLE IF NOT EXISTS `Customers` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `emri`        VARCHAR(100)  NOT NULL,
  `mbiemri`     VARCHAR(100)  NOT NULL,
  `email`       VARCHAR(255)      NULL,
  `telefoni`    VARCHAR(30)       NULL,
  `adresa`      VARCHAR(255)      NULL,
  `qyteti`      VARCHAR(100)      NULL,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_customers_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---
CREATE TABLE IF NOT EXISTS `Orders` (
  `id`          INT             NOT NULL AUTO_INCREMENT,
  `customer_id` INT                 NULL,
  `user_id`     INT                 NULL,
  `statusi`     ENUM('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `totali`      DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  `shenime`     TEXT                NULL,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_orders_user`     FOREIGN KEY (`user_id`)     REFERENCES `Users`     (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---
CREATE TABLE IF NOT EXISTS `OrderDetails` (
  `id`          INT             NOT NULL AUTO_INCREMENT,
  `order_id`    INT             NOT NULL,
  `product_id`  INT             NOT NULL,
  `sasia`       INT             NOT NULL DEFAULT 1,
  `cmimi_unit`  DECIMAL(10,2)   NOT NULL,
  `zbritja`     DECIMAL(10,2)       NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_orderdetails_order`   FOREIGN KEY (`order_id`)   REFERENCES `Orders`   (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orderdetails_product` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 4. LOGJISTIKA
-- ============================================================

CREATE TABLE IF NOT EXISTS `Suppliers` (
  `id`              INT           NOT NULL AUTO_INCREMENT,
  `emri_kompanise`  VARCHAR(255)  NOT NULL,
  `kontakti`        VARCHAR(100)      NULL,
  `email`           VARCHAR(255)      NULL,
  `telefoni`        VARCHAR(30)       NULL,
  `adresa`          VARCHAR(255)      NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---
-- Pa PurchaseOrderDetails — totali ruhet direkt ketu
CREATE TABLE IF NOT EXISTS `PurchaseOrders` (
  `id`              INT             NOT NULL AUTO_INCREMENT,
  `supplier_id`     INT             NOT NULL,
  `user_id`         INT                 NULL,
  `product_id`      INT             NOT NULL,   -- produkti i blerë
  `sasia`           INT             NOT NULL DEFAULT 1,
  `cmimi_blerjes`   DECIMAL(10,2)   NOT NULL,   -- çmimi për njësi
  `totali`          DECIMAL(10,2)   NOT NULL,   -- sasia * cmimi_blerjes
  `statusi`         ENUM('draft','ordered','received','cancelled') NOT NULL DEFAULT 'draft',
  `data_porosis`    DATE                NULL,
  `data_arritjes`   DATE                NULL,
  `shenime`         TEXT                NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_po_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `Suppliers` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_po_user`     FOREIGN KEY (`user_id`)     REFERENCES `Users`     (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_po_product`  FOREIGN KEY (`product_id`)  REFERENCES `Products`  (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---
CREATE TABLE IF NOT EXISTS `Inventory` (
  `id`              INT           NOT NULL AUTO_INCREMENT,
  `product_id`      INT           NOT NULL,
  `lloji`           ENUM('hyrje','dalje','rregullim') NOT NULL,
  `sasia`           INT           NOT NULL,
  `referenca_lloji` VARCHAR(50)       NULL,   -- 'Order', 'PurchaseOrder', 'Manual'
  `referenca_id`    INT               NULL,
  `shenime`         VARCHAR(255)      NULL,
  `user_id`         INT               NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_inventory_product` FOREIGN KEY (`product_id`) REFERENCES `Products` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_inventory_user`    FOREIGN KEY (`user_id`)    REFERENCES `Users`    (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 5. PAS-SHITJA
-- ============================================================

CREATE TABLE IF NOT EXISTS `Warranties` (
  `id`              INT       NOT NULL AUTO_INCREMENT,
  `product_id`      INT       NOT NULL,
  `order_detail_id` INT       NOT NULL,
  `customer_id`     INT       NOT NULL,
  `data_fillimit`   DATE      NOT NULL,
  `data_skadimit`   DATE      NOT NULL,
  `statusi`         ENUM('aktive','skaduar','anuluar') NOT NULL DEFAULT 'aktive',
  `created_at`      DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_warranties_product`     FOREIGN KEY (`product_id`)      REFERENCES `Products`     (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_warranties_orderdetail` FOREIGN KEY (`order_detail_id`) REFERENCES `OrderDetails` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_warranties_customer`    FOREIGN KEY (`customer_id`)     REFERENCES `Customers`    (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---
CREATE TABLE IF NOT EXISTS `ServiceRequests` (
  `id`              INT           NOT NULL AUTO_INCREMENT,
  `customer_id`     INT           NOT NULL,
  `product_id`      INT           NOT NULL,
  `warranty_id`     INT               NULL,
  `technician_id`   INT               NULL,
  `problemi`        TEXT          NOT NULL,
  `diagnoza`        TEXT              NULL,
  `statusi`         ENUM('hapur','ne_proces','zgjidhur','mbyllur','anuluar') NOT NULL DEFAULT 'hapur',
  `prioriteti`      ENUM('i_ulet','normal','i_larte','urgjent')             NOT NULL DEFAULT 'normal',
  `data_pranim`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_perfundim`  DATETIME          NULL,
  `cmimi_servisit`  DECIMAL(10,2)     NULL DEFAULT 0.00,
  `shenime`         TEXT              NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sr_customer`   FOREIGN KEY (`customer_id`)   REFERENCES `Customers`  (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_sr_product`    FOREIGN KEY (`product_id`)    REFERENCES `Products`   (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_sr_warranty`   FOREIGN KEY (`warranty_id`)   REFERENCES `Warranties` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sr_technician` FOREIGN KEY (`technician_id`) REFERENCES `Users`      (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 6. AUDIT LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS `AuditLogs` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `user_id`     INT               NULL,
  `veprimi`     VARCHAR(100)  NOT NULL,   -- 'DELETE_PRODUCT', 'CHANGE_PRICE', etj.
  `tabela`      VARCHAR(100)      NULL,
  `rekord_id`   INT               NULL,
  `vlera_para`  JSON              NULL,
  `vlera_pas`   JSON              NULL,
  `ip_adresa`   VARCHAR(45)       NULL,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_auditlogs_user` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 7. SEED DATA
-- ============================================================

INSERT INTO `Roles` (`emertimi`, `pershkrimi`) VALUES
  ('Admin',      'Qasje e plote ne sistem'),
  ('Technician', 'Menaxhon kerkesat e servisit'),
  ('Cashier',    'Krijon porosi dhe menaxhon shitjet');

INSERT INTO `Categories` (`emertimi`, `pershkrimi`, `kategoria_prind_id`) VALUES
  ('Elektronike', 'Te gjitha produktet elektronike', NULL),
  ('Telefona',    'Telefona celulare dhe aksesore',  1),
  ('Laptope',     'Laptope dhe aksesore',            1),
  ('Gaming',      'Konzola dhe aksesore gaming',     1),
  ('Audio',       'Kufje, altoparlante, mikrofona',  1),
  ('Periferike',  'Mouse, tastiere, monitore',       1);

INSERT INTO `Products` (`emri`, `kategoria_id`, `marka`, `cmimi`, `sasia_stokut`, `garancia_muaj`) VALUES
  ('Headphones Pro',     5, 'Sony',    400.00, 10, 24),
  ('PlayStation 5',      4, 'Sony',    550.00,  5, 12),
  ('Samsung Galaxy S24', 2, 'Samsung', 400.00, 15, 24),
  ('Wireless Mouse',     6, 'Logitech', 50.00, 30, 12),
  ('Laptop UltraBook',   3, 'Dell',    800.00,  8, 24);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- FUND - 12 tabela
-- ============================================================

