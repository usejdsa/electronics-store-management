const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|avif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype) || file.mimetype === 'image/avif';
  if (ext && mime) cb(null, true);
  else cb(new Error('Only image files are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', verifyToken, checkRole(['Admin', 'Technician', 'Cashier']), (req, res) => {
  const sql = `
    SELECT p.*, c.emertimi AS kategoria_emri
    FROM Products p
    LEFT JOIN Categories c ON p.kategoria_id = c.id
    ORDER BY p.id DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(result);
  });
});

router.get('/:id', verifyToken, checkRole(['Admin', 'Technician', 'Cashier']), (req, res) => {
  db.query('SELECT * FROM Products WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(result[0]);
  });
});

router.post('/', verifyToken, checkRole(['Admin']), upload.single('foto'), (req, res) => {
  const { emri, kategoria_id, marka, modeli, pershkrimi, cmimi, cmimi_zbritjes, sasia_stokut, garancia_muaj } = req.body;
  if (!emri || !cmimi) return res.status(400).json({ message: 'Emri dhe cmimi jane te detyrueshme.' });

  let foto_kryesore = null;
  if (req.file) {
    foto_kryesore = `http://localhost:5000/uploads/${req.file.filename}`;
  } else if (req.body.foto_kryesore) {
    foto_kryesore = req.body.foto_kryesore;
  }

  const sql = `
    INSERT INTO Products (emri, kategoria_id, marka, modeli, pershkrimi, cmimi, cmimi_zbritjes, sasia_stokut, garancia_muaj, foto_kryesore)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [
    emri, kategoria_id || null, marka || null, modeli || null,
    pershkrimi || null, cmimi, cmimi_zbritjes || null,
    sasia_stokut || 0, garancia_muaj || 0, foto_kryesore
  ], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.status(201).json({ message: 'Produkti u shtua me sukses.', id: result.insertId });
  });
});

router.put('/:id', verifyToken, checkRole(['Admin']), upload.single('foto'), (req, res) => {
  const { emri, kategoria_id, marka, modeli, pershkrimi, cmimi, cmimi_zbritjes, sasia_stokut, garancia_muaj } = req.body;
  if (!emri || !cmimi) return res.status(400).json({ message: 'Emri dhe cmimi jane te detyrueshme.' });

  // If a new file is uploaded, use it; otherwise keep existing or use foto_kryesore from body
  const getExistingAndUpdate = (foto_kryesore) => {
    const sql = `
      UPDATE Products SET
        emri = ?, kategoria_id = ?, marka = ?, modeli = ?,
        pershkrimi = ?, cmimi = ?, cmimi_zbritjes = ?,
        sasia_stokut = ?, garancia_muaj = ?, foto_kryesore = ?
      WHERE id = ?
    `;
    db.query(sql, [
      emri, kategoria_id || null, marka || null, modeli || null,
      pershkrimi || null, cmimi, cmimi_zbritjes || null,
      sasia_stokut || 0, garancia_muaj || 0, foto_kryesore || null,
      req.params.id
    ], (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Produkti nuk u gjet.' });
      res.json({ message: 'Produkti u perditesua me sukses.' });
    });
  };

  if (req.file) {
    const newFoto = `http://localhost:5000/uploads/${req.file.filename}`;
    getExistingAndUpdate(newFoto);
  } else if (req.body.foto_kryesore !== undefined) {
    getExistingAndUpdate(req.body.foto_kryesore || null);
  } else {
    // Keep current foto
    db.query('SELECT foto_kryesore FROM Products WHERE id = ?', [req.params.id], (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      const existing = rows[0]?.foto_kryesore || null;
      getExistingAndUpdate(existing);
    });
  }
});

router.delete('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  db.query('DELETE FROM Products WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Produkti nuk u gjet.' });
    res.json({ message: 'Produkti u fshi me sukses.' });
  });
});

module.exports = router;