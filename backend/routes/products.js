const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

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

router.post('/', verifyToken, checkRole(['Admin']), (req, res) => {
  const { emri, kategoria_id, marka, modeli, pershkrimi, cmimi, cmimi_zbritjes, sasia_stokut, garancia_muaj, foto_kryesore } = req.body;
  if (!emri || !cmimi) return res.status(400).json({ message: 'Emri dhe cmimi jane te detyrueshme.' });

  const sql = `
    INSERT INTO Products (emri, kategoria_id, marka, modeli, pershkrimi, cmimi, cmimi_zbritjes, sasia_stokut, garancia_muaj, foto_kryesore)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [
    emri, kategoria_id || null, marka || null, modeli || null,
    pershkrimi || null, cmimi, cmimi_zbritjes || null,
    sasia_stokut || 0, garancia_muaj || 0, foto_kryesore || null
  ], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.status(201).json({ message: 'Produkti u shtua me sukses.', id: result.insertId });
  });
});

router.put('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  const { emri, kategoria_id, marka, modeli, pershkrimi, cmimi, cmimi_zbritjes, sasia_stokut, garancia_muaj, foto_kryesore } = req.body;
  if (!emri || !cmimi) return res.status(400).json({ message: 'Emri dhe cmimi jane te detyrueshme.' });

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
});

router.delete('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  db.query('DELETE FROM Products WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Produkti nuk u gjet.' });
    res.json({ message: 'Produkti u fshi me sukses.' });
  });
});

module.exports = router;