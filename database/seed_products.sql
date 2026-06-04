INSERT INTO `products`
  (`emri`, `kategoria_id`, `marka`, `modeli`, `pershkrimi`,
   `cmimi`, `cmimi_zbritjes`, `sasia_stokut`, `garancia_muaj`, `foto_kryesore`)
VALUES

-- ── Telefona (2) ───────────────────────────────────────────
('iPhone 15 Pro',            2, 'Apple',     'A3290',
 'Smartphone premium me çip A17 Pro, ekran Super Retina XDR 6.1", kamera 48 MP dhe USB-C.',
 1299.00, 1199.00, 20, 24, '/src/assets/products/iPhone 15 Pro.jpg'),

('Samsung Galaxy S25 Ultra', 2, 'Samsung',   'SM-S938B',
 'Telefon flagship me S Pen, ekran Dynamic AMOLED 6.9", kamera 200 MP dhe batteri 5000 mAh.',
 1399.00, NULL,    15, 24, '/src/assets/products/SamsungS24.avif'),

('Apple Watch Series 9',     2, 'Apple',     'MR8X3',
 'Smartwatch me ekran Always-On Retina, çip S9, GPS, monitorim shëndeti 24/7 dhe watchOS 10.',
  429.00, NULL,    14, 12, '/src/assets/products/Apple Watch Series 9.jpg'),

-- ── Laptop (3) ────────────────────────────────────────────
('MacBook Air M3',           3, 'Apple',     'MRXN3',
 'Laptop ultra i hollë me çip Apple M3, ekran Liquid Retina 13.6" dhe deri 18h batteri.',
 1499.00, NULL,    10, 24, '/src/assets/products/MacBook Air M3.jpg'),

('Lenovo ThinkPad X1 Carbon', 3, 'Lenovo',   'Gen 12',
 'Laptop biznesi 14" me ekran IPS 2K, procesor Intel Core Ultra 7 dhe peshë vetëm 1.12 kg.',
 1899.00, 1749.00,  6, 24, '/src/assets/products/LaptopUltrabook.png'),

('HP Pavilion 15',           3, 'HP',        'EG3051NR',
 'Laptop i përshtatshëm për studentë, AMD Ryzen 5, 16 GB RAM, SSD 512 GB, ekran FHD 15.6".',
  649.00,  599.00, 14, 12, '/src/assets/products/SamsungLaptop.jpg'),

('iPad Pro 11" M4',          3, 'Apple',     'MVVH3',
 'Tablet me çip M4, ekran Liquid Retina Ultra XDR 11", kamera TrueDepth 12 MP dhe USB-C 4.',
 1099.00, NULL,    11, 24, '/src/assets/products/iPad Pro 11 M4.webp'),

-- ── Gaming (4) ─────────────────────────────────────────────
('Xbox Series X',            4, 'Microsoft', 'RRT-00001',
 'Konzola e gjeneratës së re 4K/120fps, SSD 1 TB, Game Pass e gatshme.',
  549.00, NULL,    18, 12, '/src/assets/products/Xbox Series X.jpg'),

('Gaming Chair DXRacer',     4, 'DXRacer',   'FH08',
 'Karrige gaming ergonomike, jastëk lumbar dhe koke, rregullim 4D i krahëve, deri 150 kg.',
  299.00, 269.00,   8, 24, '/src/assets/products/Gaming Chair DXRacer.jpg'),

-- ── Audio (5) ──────────────────────────────────────────────
('Apple AirPods Pro 2',      5, 'Apple',     'MTJV3',
 'Kufje true wireless me ANC adaptiv, audio spatial, ndërtim rezistent ndaj ujit (IPX4).',
  279.00, 249.00,  30, 12, '/src/assets/products/Apple AirPods Pro 2.avif'),

('JBL Charge 5',             5, 'JBL',       'JBLCHARGE5BLK',
 'Altoparlant Bluetooth portativ me IP67, bas të fuqishëm dhe 20h luajtje muzike.',
  179.00, NULL,    25, 12, '/src/assets/products/JBL Charge 5.jpg'),

('Sony WH-1000XM5',          5, 'Sony',      'WH1000XM5/B',
 'Kufje over-ear me ANC industrie-leading, 30h batteri dhe mikrofon me 8 kapsula.',
  349.00, 299.00,  17, 24, '/src/assets/products/SonyHeadphones.png'),

-- ── Periferike (6) ─────────────────────────────────────────
('Logitech MX Master 3S',    6, 'Logitech',  '910-006556',
 'Mouse premium me sensor 8000 DPI, scroll elektromagnetik MagSpeed dhe ndërtim ergonomik.',
   99.00,  89.00,  35, 24, '/src/assets/products/WirelessMouse.webp'),

('Razer BlackWidow V4',      6, 'Razer',     'RZ03-04691800',
 'Tastierë mekanike gaming, çelësa Razer Green tactile, RGB Chroma, USB pass-through.',
  149.00, NULL,    20, 24, '/src/assets/products/Razer BlackWidow V4.jpg'),

('Samsung 27" 4K Monitor',   6, 'Samsung',   'LU27B850UXUXXE',
 'Monitor 27 inch IPS 4K UHD, USB-C 90W, HDR10+, 60Hz, sRGB 99% për dizajn profesional.',
  499.00, 449.00,   9, 24, '/src/assets/products/Samsung 27inch 4K Monitor.jpg'),

('Logitech C920 Webcam',     6, 'Logitech',  '960-000764',
 'Kamera Full HD 1080p/30fps me mikrofon stereo dual, autofocus dhe clip universal.',
   89.00,  79.00,  28, 12, '/src/assets/products/Logitech C920 Webcam.jpg'),

-- ── Elektronike e pergjithshme (1) ──────────────────────────
('Anker Power Bank 26800mAh', 1, 'Anker',    'A1277',
 'Bateri portative 26800 mAh, USB-C PD 65W, ngarkon 3 pajisje njëkohësisht.',
   69.00,  59.00,  40, 12, '/src/assets/products/Anker Power Bank 26800mAh.webp'),

('TP-Link Wi-Fi 6 Router',   1, 'TP-Link',   'AX5400',
 'Router Wi-Fi 6 dualband 5400 Mbps, 8 antena, MU-MIMO, OneMesh dhe port WAN Gigabit.',
  129.00, 109.00,  16, 24, '/src/assets/products/TP-Link Wi-Fi 6 Router.jpg');
