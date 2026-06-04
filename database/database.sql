-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: electronics_store
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auditlogs`
--

DROP TABLE IF EXISTS `auditlogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditlogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `veprimi` varchar(100) NOT NULL,
  `tabela` varchar(100) DEFAULT NULL,
  `rekord_id` int DEFAULT NULL,
  `vlera_para` json DEFAULT NULL,
  `vlera_pas` json DEFAULT NULL,
  `ip_adresa` varchar(45) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_auditlogs_user` (`user_id`),
  CONSTRAINT `fk_auditlogs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditlogs`
--

LOCK TABLES `auditlogs` WRITE;
/*!40000 ALTER TABLE `auditlogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `auditlogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emertimi` varchar(255) NOT NULL,
  `pershkrimi` text,
  `kategoria_prind_id` int DEFAULT NULL,
  `ikona` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_categories_parent` (`kategoria_prind_id`),
  CONSTRAINT `fk_categories_parent` FOREIGN KEY (`kategoria_prind_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Elektronik','Te gjitha produktet elektronike',NULL,NULL,'2026-05-01 22:02:37'),(2,'Telefona','Telefona celulare dhe aksesore',1,NULL,'2026-05-01 22:02:37'),(3,'Laptope','Laptope dhe aksesore',1,NULL,'2026-05-01 22:02:37'),(4,'Gaming','Konzola dhe aksesore gaming',1,NULL,'2026-05-01 22:02:37'),(5,'Audio','Kufje, altoparlante, mikrofona',1,NULL,'2026-05-01 22:02:37'),(6,'Periferike','Mouse, tastiere, monitore',1,NULL,'2026-05-01 22:02:37');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `emri` varchar(100) NOT NULL,
  `mbiemri` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefoni` varchar(30) DEFAULT NULL,
  `adresa` varchar(255) DEFAULT NULL,
  `qyteti` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_customers_email` (`email`),
  KEY `fk_customers_user` (`user_id`),
  CONSTRAINT `fk_customers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (12,4,'Usejd','Salihu','usejd@store.com',NULL,NULL,NULL,'2026-05-23 14:47:10'),(13,5,'random','customer','customer@store.com',NULL,NULL,NULL,'2026-05-30 22:59:41');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `lloji` enum('hyrje','dalje','rregullim') NOT NULL,
  `sasia` int NOT NULL,
  `referenca_lloji` varchar(50) DEFAULT NULL,
  `referenca_id` int DEFAULT NULL,
  `shenime` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_inventory_product` (`product_id`),
  KEY `fk_inventory_user` (`user_id`),
  CONSTRAINT `fk_inventory_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_inventory_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,4,'hyrje',20,'PurchaseOrder',1,NULL,3,'2026-06-04 13:38:29');
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderdetails`
--

DROP TABLE IF EXISTS `orderdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderdetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `sasia` int NOT NULL DEFAULT '1',
  `cmimi_unit` decimal(10,2) NOT NULL,
  `zbritja` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk_orderdetails_order` (`order_id`),
  KEY `fk_orderdetails_product` (`product_id`),
  CONSTRAINT `fk_orderdetails_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orderdetails_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetails`
--

LOCK TABLES `orderdetails` WRITE;
/*!40000 ALTER TABLE `orderdetails` DISABLE KEYS */;
INSERT INTO `orderdetails` VALUES (3,12,15,1,800.00,0.00),(4,13,12,1,550.00,0.00),(5,14,15,3,799.95,0.00);
/*!40000 ALTER TABLE `orderdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `statusi` enum('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `source` enum('dashboard','store') NOT NULL DEFAULT 'dashboard',
  `totali` decimal(10,2) NOT NULL DEFAULT '0.00',
  `shenime` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_orders_customer` (`customer_id`),
  KEY `fk_orders_user` (`user_id`),
  CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (12,12,NULL,NULL,'pending','dashboard',800.00,NULL,'2026-05-30 12:33:16','2026-05-30 12:33:16'),(13,13,NULL,NULL,'shipped','dashboard',550.00,NULL,'2026-05-30 23:00:09','2026-06-03 23:28:26'),(14,12,NULL,NULL,'pending','dashboard',1600.00,NULL,'2026-06-03 23:45:25','2026-06-03 23:45:25');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emri` varchar(255) NOT NULL,
  `kategoria_id` int DEFAULT NULL,
  `marka` varchar(100) DEFAULT NULL,
  `modeli` varchar(100) DEFAULT NULL,
  `pershkrimi` longtext,
  `cmimi` decimal(10,2) NOT NULL,
  `cmimi_zbritjes` decimal(10,2) DEFAULT NULL,
  `sasia_stokut` int DEFAULT '0',
  `garancia_muaj` int DEFAULT NULL,
  `foto_kryesore` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'iPhone 15 Pro',2,'Apple','A3290','Smartphone premium me ├ºip A17 Pro, ekran Super Retina XDR 6.1\", kamera 48 MP dhe USB-C.',1299.00,1199.00,20,24,'/src/assets/products/iPhone 15 Pro.jpg'),(2,'Samsung Galaxy S25 Ultra',2,'Samsung','SM-S938B','Telefon flagship me S Pen, ekran Dynamic AMOLED 6.9\", kamera 200 MP dhe batteri 5000 mAh.',1399.00,NULL,15,24,'/src/assets/products/SamsungS24.avif'),(3,'Apple Watch Series 9',2,'Apple','MR8X3','Smartwatch me ekran Always-On Retina, ├ºip S9, GPS, monitorim sh├½ndeti 24/7 dhe watchOS 10.',429.00,NULL,14,12,'/src/assets/products/Apple Watch Series 9.jpg'),(4,'MacBook Air M3',3,'Apple','MRXN3','Laptop ultra i holl├½ me ├ºip Apple M3, ekran Liquid Retina 13.6\" dhe deri 18h batteri.',1499.00,NULL,30,24,'/src/assets/products/MacBook Air M3.jpg'),(5,'Lenovo ThinkPad X1 Carbon',3,'Lenovo','Gen 12','Laptop biznesi 14\" me ekran IPS 2K, procesor Intel Core Ultra 7 dhe pesh├½ vet├½m 1.12 kg.',1899.00,1749.00,6,24,'/src/assets/products/LaptopUltrabook.png'),(6,'HP Pavilion 15',3,'HP','EG3051NR','Laptop i p├½rshtatsh├½m p├½r student├½, AMD Ryzen 5, 16 GB RAM, SSD 512 GB, ekran FHD 15.6\".',649.00,599.00,14,12,'/src/assets/products/SamsungLaptop.jpg'),(7,'iPad Pro 11\" M4',3,'Apple','MVVH3','Tablet me ├ºip M4, ekran Liquid Retina Ultra XDR 11\", kamera TrueDepth 12 MP dhe USB-C 4.',1099.00,NULL,11,24,'/src/assets/products/iPad Pro 11 M4.webp'),(8,'Xbox Series X',4,'Microsoft','RRT-00001','Konzola e gjenerat├½s s├½ re 4K/120fps, SSD 1 TB, Game Pass e gatshme.',549.00,NULL,18,12,'/src/assets/products/Xbox Series X.jpg'),(9,'Gaming Chair DXRacer',4,'DXRacer','FH08','Karrige gaming ergonomike, jast├½k lumbar dhe koke, rregullim 4D i krah├½ve, deri 150 kg.',299.00,269.00,8,24,'/src/assets/products/Gaming Chair DXRacer.jpg'),(10,'Apple AirPods Pro 2',5,'Apple','MTJV3','Kufje true wireless me ANC adaptiv, audio spatial, nd├½rtim rezistent ndaj ujit (IPX4).',279.00,249.00,30,12,'/src/assets/products/Apple AirPods Pro 2.avif'),(11,'JBL Charge 5',5,'JBL','JBLCHARGE5BLK','Altoparlant Bluetooth portativ me IP67, bas t├½ fuqish├½m dhe 20h luajtje muzike.',179.00,NULL,25,12,'/src/assets/products/JBL Charge 5.jpg'),(12,'Sony WH-1000XM5',5,'Sony','WH1000XM5/B','Kufje over-ear me ANC industrie-leading, 30h batteri dhe mikrofon me 8 kapsula.',349.00,299.00,17,24,'/src/assets/products/SonyHeadphones.png'),(13,'Logitech MX Master 3S',6,'Logitech','910-006556','Mouse premium me sensor 8000 DPI, scroll elektromagnetik MagSpeed dhe nd├½rtim ergonomik.',99.00,89.00,35,24,'/src/assets/products/WirelessMouse.webp'),(14,'Razer BlackWidow V4',6,'Razer','RZ03-04691800','Tastier├½ mekanike gaming, ├ºel├½sa Razer Green tactile, RGB Chroma, USB pass-through.',149.00,NULL,20,24,'/src/assets/products/Razer BlackWidow V4.jpg'),(15,'Samsung 27\" 4K Monitor',6,'Samsung','LU27B850UXUXXE','Monitor 27 inch IPS 4K UHD, USB-C 90W, HDR10+, 60Hz, sRGB 99% p├½r dizajn profesional.',499.00,449.00,9,24,'/src/assets/products/Samsung 27inch 4K Monitor.jpg'),(16,'Logitech C920 Webcam',6,'Logitech','960-000764','Kamera Full HD 1080p/30fps me mikrofon stereo dual, autofocus dhe clip universal.',89.00,79.00,28,12,'/src/assets/products/Logitech C920 Webcam.jpg'),(17,'Anker Power Bank 26800mAh',1,'Anker','A1277','Bateri portative 26800 mAh, USB-C PD 65W, ngarkon 3 pajisje nj├½koh├½sisht.',69.00,59.00,40,12,'/src/assets/products/Anker Power Bank 26800mAh.webp'),(18,'TP-Link Wi-Fi 6 Router',1,'TP-Link','AX5400','Router Wi-Fi 6 dualband 5400 Mbps, 8 antena, MU-MIMO, OneMesh dhe port WAN Gigabit.',129.00,109.00,16,24,'/src/assets/products/TP-Link Wi-Fi 6 Router.jpg');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchaseorders`
--

DROP TABLE IF EXISTS `purchaseorders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchaseorders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `product_id` int NOT NULL,
  `sasia` int NOT NULL DEFAULT '1',
  `cmimi_blerjes` decimal(10,2) NOT NULL,
  `totali` decimal(10,2) NOT NULL,
  `statusi` enum('draft','ordered','received','cancelled') NOT NULL DEFAULT 'draft',
  `data_porosis` date DEFAULT NULL,
  `data_arritjes` date DEFAULT NULL,
  `shenime` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_po_supplier` (`supplier_id`),
  KEY `fk_po_user` (`user_id`),
  KEY `fk_po_product` (`product_id`),
  CONSTRAINT `fk_po_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_po_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_po_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchaseorders`
--

LOCK TABLES `purchaseorders` WRITE;
/*!40000 ALTER TABLE `purchaseorders` DISABLE KEYS */;
INSERT INTO `purchaseorders` VALUES (1,1,3,4,20,500.00,10000.00,'received',NULL,NULL,'diqka diqka','2026-06-04 13:36:30');
/*!40000 ALTER TABLE `purchaseorders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refreshtokens`
--

DROP TABLE IF EXISTS `refreshtokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refreshtokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(512) NOT NULL,
  `expires_at` datetime NOT NULL,
  `revoked` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_refreshtokens_token` (`token`),
  KEY `fk_refreshtokens_user` (`user_id`),
  CONSTRAINT `fk_refreshtokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refreshtokens`
--

LOCK TABLES `refreshtokens` WRITE;
/*!40000 ALTER TABLE `refreshtokens` DISABLE KEYS */;
INSERT INTO `refreshtokens` VALUES (1,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc4NDIyMjg1LCJleHAiOjE3NzkwMjcwODV9.S_tbJc4sS2PdprOKT4eQwXBCH7aAp19OjBQxJ1cq2Ts','2026-05-17 16:11:25',1,'2026-05-10 16:11:25'),(2,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc4NDIzOTM0LCJleHAiOjE3NzkwMjg3MzR9.PpAgAX1MlJeFSk5WBKor_aMOZtnjszVsMEIthhJjMQY','2026-05-17 16:38:55',1,'2026-05-10 16:38:54'),(3,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc4NDM4NzQzLCJleHAiOjE3NzkwNDM1NDN9.nw-IYCWgLw64wgMdEqbmqg7Ld9Lf1fk7a0qUjPXi0oc','2026-05-17 20:45:43',1,'2026-05-10 20:45:43'),(4,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc4NDM4Nzk3LCJleHAiOjE3NzkwNDM1OTd9.CgXhv5XbLZUSRRhME_i92XA9PqWckvFIMEgTJ42XGo8','2026-05-17 20:46:37',1,'2026-05-10 20:46:37'),(5,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc4OTU4MDE0LCJleHAiOjE3Nzk1NjI4MTR9.2UejE42RnqZfrsPdkt-hXfk6cOqxIZACZgrw0CrErhM','2026-05-23 21:00:15',1,'2026-05-16 21:00:14'),(6,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc4OTY0MTU4LCJleHAiOjE3Nzk1Njg5NTh9.dKgyRMpFSCSxZN9NpgWgyWLHCLLpOfgL8EswTu4Vo3Q','2026-05-23 22:42:39',1,'2026-05-16 22:42:38'),(7,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc5MDk0NTAxLCJleHAiOjE3Nzk2OTkzMDF9.9MWD2-DGypgajWY2fEJ9v6rM_-lFJM_r5NTxVKjPS6Y','2026-05-25 10:55:02',1,'2026-05-18 10:55:01'),(8,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc5NDUzNjg3LCJleHAiOjE3ODAwNTg0ODd9.lSGr7kRXssaeZfiLnROcBmJTel1_Eo-c_EkA0L1tdBE','2026-05-29 14:41:28',1,'2026-05-22 14:41:27'),(9,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzc5NTQwNDQyLCJleHAiOjE3ODAxNDUyNDJ9.MPKOEY3kW60Bu6_XpTdNlwZgu4JEJCA0FElZogFR1Qk','2026-05-30 14:47:23',0,'2026-05-23 14:47:22'),(10,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc5NTQwNjYxLCJleHAiOjE3ODAxNDU0NjF9.YWecP6LaLMnqM4jJ4YHMsjKBzX293dYX11a-IdkDjt4','2026-05-30 14:51:01',1,'2026-05-23 14:51:01'),(11,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzc5NTQwNjk1LCJleHAiOjE3ODAxNDU0OTV9.KOxR5JMJ_IAUq-cEdRmZnTvRlvlyQxcc5iwq-Y4HH5U','2026-05-30 14:51:36',1,'2026-05-23 14:51:35'),(12,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc5NTQwOTYwLCJleHAiOjE3ODAxNDU3NjB9.4V9K-P3eAk7qQizBpuL30J-MVkP271XKkXY0JBUqjec','2026-05-30 14:56:01',1,'2026-05-23 14:56:00'),(13,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzc5NTQwOTkwLCJleHAiOjE3ODAxNDU3OTB9.O94rv_eCO2csyGYWY36ba4mT9La69QvwcYMBu6mTof0','2026-05-30 14:56:31',1,'2026-05-23 14:56:30'),(14,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc5NTQxMDk1LCJleHAiOjE3ODAxNDU4OTV9.wJj31JvrSqMdV9CL5sQx6RyZcLYWX7ptlquDyG8r_dY','2026-05-30 14:58:16',1,'2026-05-23 14:58:15'),(15,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzc5NTQxNjc0LCJleHAiOjE3ODAxNDY0NzR9.AIB1dsvs1TxYtXkEXYmuwYt4ddEzufSYuRnOrOLtTzM','2026-05-30 15:07:55',1,'2026-05-23 15:07:54'),(16,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzc5NTQxODA1LCJleHAiOjE3ODAxNDY2MDV9.r0ksvcBlu_NtgllBIzlRkOhY-nLUokrWlevGIvlqcfY','2026-05-30 15:10:05',1,'2026-05-23 15:10:05'),(17,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc5NTQxODM5LCJleHAiOjE3ODAxNDY2Mzl9.tvvFRhpeKCXzN9qZhvsWRaXtaWY1p35RjCr3wQuqe8U','2026-05-30 15:10:40',1,'2026-05-23 15:10:39'),(18,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzc5NTQxODYwLCJleHAiOjE3ODAxNDY2NjB9.37zclS-gu9vyGRSTVm9Ng6d-pfOyD95A_UWp4nCR9hM','2026-05-30 15:11:01',1,'2026-05-23 15:11:00'),(19,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc5NTQxODc4LCJleHAiOjE3ODAxNDY2Nzh9.boG8aE1tWMX0L6CDnwKINrGmNhOsZ5gKcexrCCKHO_M','2026-05-30 15:11:19',1,'2026-05-23 15:11:18'),(20,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzc5NTQxODkzLCJleHAiOjE3ODAxNDY2OTN9.zKyyEhtFudxbfffWaIDRd4e4j6iwYFR3KxuSRklPyXM','2026-05-30 15:11:34',1,'2026-05-23 15:11:33'),(21,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzgwMDgyOTk0LCJleHAiOjE3ODA2ODc3OTR9.1BiYU5AjDx_AfisXhG1iPXqrQsIqC5BcBFkSs6y7Jvg','2026-06-05 21:29:55',1,'2026-05-29 21:29:54'),(22,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzgwMTM3MTgxLCJleHAiOjE3ODA3NDE5ODF9.aOAjjfNXEI0cEEqM8ngq3qkhqPHg7sbIitsR8tXf-Tk','2026-06-06 12:33:01',1,'2026-05-30 12:33:01'),(23,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzgwMTM5NDA2LCJleHAiOjE3ODA3NDQyMDZ9.RljmolkDc_cO6sLjzSoZOKSv27eUpAK3GVt7SI40N-U','2026-06-06 13:10:06',1,'2026-05-30 13:10:06'),(24,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzgwMTc0Njk3LCJleHAiOjE3ODA3Nzk0OTd9.1QBGqTyDJstSxPicW9Ht0EFgk34yoGUpU3-yaYUGqxU','2026-06-06 22:58:18',1,'2026-05-30 22:58:17'),(25,5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzgwMTc0Nzk1LCJleHAiOjE3ODA3Nzk1OTV9.ewHBpnzcDkOte_j6Gd-csP8lXJ50A0wUQ96v9yffzp4','2026-06-06 22:59:55',1,'2026-05-30 22:59:55'),(26,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzgwMTc0ODIzLCJleHAiOjE3ODA3Nzk2MjN9.RLstOKMPp54ndwzJc_pVb1ys9HCApqtKZKqcdpxbGV8','2026-06-06 23:00:24',1,'2026-05-30 23:00:23'),(27,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzgwMTgzMzgyLCJleHAiOjE3ODA3ODgxODJ9.plAOqFc64GZmL2hoMHSKnQid-Yt4b5RsyiwKlYnBERM','2026-06-07 01:23:03',1,'2026-05-31 01:23:02'),(28,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzgwNDEwMjgxLCJleHAiOjE3ODEwMTUwODF9.sr5R1YrJYAw93dwpMEfuvvAtGAHngN7vqvGvUyLz3iw','2026-06-09 16:24:41',0,'2026-06-02 16:24:41'),(29,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzgwNTIyMDE1LCJleHAiOjE3ODExMjY4MTV9.7KNpKzj90-XLcYppsWFoWDmfgtntJP1iSw0LGS_SZKc','2026-06-10 23:26:55',1,'2026-06-03 23:26:55'),(30,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzgwNTIyMDkzLCJleHAiOjE3ODExMjY4OTN9.NuO8E2hBcm5z1dbfFZqfIgrG3h3jb-G8Xx0sdtk0kyM','2026-06-10 23:28:13',0,'2026-06-03 23:28:13'),(31,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzgwNTU5MzQ0LCJleHAiOjE3ODExNjQxNDR9.E2OY2hzModn0BB6UYNrMbDbyg0o78itpv-znsajpBY0','2026-06-11 09:49:04',0,'2026-06-04 09:49:04'),(32,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzgwNTcwMzEyLCJleHAiOjE3ODExNzUxMTJ9.kvwrmYlnCV5hgIgs9HxPxJD05AhdsjpvgUijHbuKoo4','2026-06-11 12:51:52',0,'2026-06-04 12:51:52'),(33,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzgwNTcyNTQwLCJleHAiOjE3ODExNzczNDB9.RQlJtqVgg4snu8r6MuSvIrhN1yOTGuaVUbQRsH8RWIk','2026-06-11 13:29:01',0,'2026-06-04 13:29:00');
/*!40000 ALTER TABLE `refreshtokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emertimi` varchar(50) NOT NULL,
  `pershkrimi` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roles_emertimi` (`emertimi`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin','Qasje e plote ne sistem','2026-05-01 22:02:37'),(2,'Technician','Menaxhon kerkesat e servisit','2026-05-01 22:02:37'),(3,'Cashier','Krijon porosi dhe menaxhon shitjet','2026-05-01 22:02:37'),(4,'Customer','Klient i regjistruar ne dyqan','2026-05-06 13:58:20');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicerequests`
--

DROP TABLE IF EXISTS `servicerequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicerequests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `product_id` int NOT NULL,
  `warranty_id` int DEFAULT NULL,
  `technician_id` int DEFAULT NULL,
  `problemi` text NOT NULL,
  `diagnoza` text,
  `statusi` enum('hapur','ne_proces','zgjidhur','mbyllur','anuluar') NOT NULL DEFAULT 'hapur',
  `prioriteti` enum('i_ulet','normal','i_larte','urgjent') NOT NULL DEFAULT 'normal',
  `data_pranim` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_perfundim` datetime DEFAULT NULL,
  `cmimi_servisit` decimal(10,2) DEFAULT '0.00',
  `shenime` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_sr_customer` (`customer_id`),
  KEY `fk_sr_product` (`product_id`),
  KEY `fk_sr_warranty` (`warranty_id`),
  KEY `fk_sr_technician` (`technician_id`),
  CONSTRAINT `fk_sr_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_sr_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_sr_technician` FOREIGN KEY (`technician_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sr_warranty` FOREIGN KEY (`warranty_id`) REFERENCES `warranties` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicerequests`
--

LOCK TABLES `servicerequests` WRITE;
/*!40000 ALTER TABLE `servicerequests` DISABLE KEYS */;
/*!40000 ALTER TABLE `servicerequests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emri_kompanise` varchar(255) NOT NULL,
  `kontakti` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefoni` varchar(30) DEFAULT NULL,
  `adresa` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'kosovako','345','ver@ljnvle','3452345','krbevoer','2026-05-02 22:56:14');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userroles`
--

DROP TABLE IF EXISTS `userroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userroles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  `assigned_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `fk_userroles_role` (`role_id`),
  CONSTRAINT `fk_userroles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_userroles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userroles`
--

LOCK TABLES `userroles` WRITE;
/*!40000 ALTER TABLE `userroles` DISABLE KEYS */;
INSERT INTO `userroles` VALUES (3,1,'2026-05-10 16:10:20'),(4,3,'2026-05-23 15:11:24'),(4,4,'2026-05-23 15:11:24'),(5,4,'2026-05-30 22:59:41');
/*!40000 ALTER TABLE `userroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emri` varchar(100) NOT NULL,
  `mbiemri` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'Admin','User','admin@store.com','$2b$10$xSk.G/7VMilv4V/z/2yGBO6aEyKrlWa.Qo8zPziVrr6Lng/gbLehi',1,'2026-05-10 16:10:05','2026-05-10 16:10:05'),(4,'Usejd','Salihu','usejd@store.com','$2b$10$Ku00FO3Lv6ZRZiIA6G9Y1.z8kC.To1GTaR8UzBdEJnYoLwp/Rxg5y',1,'2026-05-23 14:47:10','2026-05-23 14:47:10'),(5,'random','customer','customer@store.com','$2b$10$h69r4js/5noZ5Q1uPTXT6eb9aRdoWUr2nEw4Elxf4Ug/H3bseA4Zm',0,'2026-05-30 22:59:41','2026-06-04 13:29:54');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warranties`
--

DROP TABLE IF EXISTS `warranties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warranties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `order_detail_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `data_fillimit` date NOT NULL,
  `data_skadimit` date NOT NULL,
  `statusi` enum('aktive','skaduar','anuluar') NOT NULL DEFAULT 'aktive',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_warranties_product` (`product_id`),
  KEY `fk_warranties_orderdetail` (`order_detail_id`),
  KEY `fk_warranties_customer` (`customer_id`),
  CONSTRAINT `fk_warranties_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_warranties_orderdetail` FOREIGN KEY (`order_detail_id`) REFERENCES `orderdetails` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_warranties_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warranties`
--

LOCK TABLES `warranties` WRITE;
/*!40000 ALTER TABLE `warranties` DISABLE KEYS */;
/*!40000 ALTER TABLE `warranties` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-04 13:45:07
