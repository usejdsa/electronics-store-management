-- Migration: Set foto_kryesore for existing products using uploaded images
-- Run this if you already have the database set up and just need to update photo URLs

UPDATE `products` SET `foto_kryesore` = 'http://localhost:5000/uploads/SonyHeadphones.png'
  WHERE `id` = 4;
UPDATE `products` SET `foto_kryesore` = 'http://localhost:5000/uploads/Playstation5.png'
  WHERE `id` = 5;
UPDATE `products` SET `foto_kryesore` = 'http://localhost:5000/uploads/SamsungS24.avif'
  WHERE `id` = 6;
UPDATE `products` SET `foto_kryesore` = 'http://localhost:5000/uploads/WirelessMouse.webp'
  WHERE `id` = 7;
UPDATE `products` SET `foto_kryesore` = 'http://localhost:5000/uploads/SamsungLaptop.jpg'
  WHERE `id` = 9;
UPDATE `products` SET `foto_kryesore` = 'http://localhost:5000/uploads/Playstation5.png'
  WHERE `id` = 12;
UPDATE `products` SET `foto_kryesore` = 'http://localhost:5000/uploads/SamsungS24.avif'
  WHERE `id` = 13;
UPDATE `products` SET `foto_kryesore` = 'http://localhost:5000/uploads/WirelessMouse.webp'
  WHERE `id` = 14;
UPDATE `products` SET `foto_kryesore` = 'http://localhost:5000/uploads/LaptopUltrabook.png'
  WHERE `id` = 15;