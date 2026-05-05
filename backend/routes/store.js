const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ─────────────────────────────────────────
// GET /api/store/products
// Të gjitha produktet aktive (publike)
// ─────────────────────────────────────────
router.get('/products', (req, res) => {
  const { kategoria_id, marka, min_cmimi, max_cmimi, search } = req.query;

  let sql = `
    SELECT 
      p.id, p.emri, p.marka, p.modeli, p.pershkrimi,
      p.cmimi, p.cmimi_zbritjes, p.sasia_stokut,
      p.garancia_muaj, p.foto_kryesore,
      c.emertimi AS kategoria
    FROM Products p
    LEFT JOIN Categories c ON p.kategoria_id = c.id
    WHERE p.is_active = 1 AND p.sasia_stokut > 0
  `;

  const params = [];

  // Filtrime opsionale
  if (kategoria_id) {
    sql += ' AND p.kategoria_id = ?';
    params.push(kategoria_id);
  }

  if (marka) {
    sql += ' AND p.marka = ?';
    params.push(marka);
  }

  if (min_cmimi) {
    sql += ' AND p.cmimi >= ?';
    params.push(min_cmimi);
  }

  if (max_cmimi) {
    sql += ' AND p.cmimi <= ?';
    params.push(max_cmimi);
  }

  if (search) {
    sql += ' AND (p.emri LIKE ? OR p.marka LIKE ? OR p.pershkrimi LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  sql += ' ORDER BY p.created_at DESC';

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(result);
  });
});

// ─────────────────────────────────────────
// GET /api/store/products/:id
// Një produkt i vetëm (publik)
// ─────────────────────────────────────────
router.get('/products/:id', (req, res) => {
  const sql = `
    SELECT 
      p.id, p.emri, p.marka, p.modeli, p.pershkrimi,
      p.cmimi, p.cmimi_zbritjes, p.sasia_stokut,
      p.garancia_muaj, p.foto_kryesore,
      c.emertimi AS kategoria, c.id AS kategoria_id
    FROM Products p
    LEFT JOIN Categories c ON p.kategoria_id = c.id
    WHERE p.id = ? AND p.is_active = 1
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Produkti nuk u gjet.' });
    res.json(result[0]);
  });
});

// ─────────────────────────────────────────
// GET /api/store/categories
// Të gjitha kategoritë (publike)
// ─────────────────────────────────────────
router.get('/categories', (req, res) => {
  const sql = `
    SELECT 
      c.id, c.emertimi, c.pershkrimi, c.ikona,
      c.kategoria_prind_id,
      COUNT(p.id) AS numri_produkteve
    FROM Categories c
    LEFT JOIN Products p ON c.id = p.kategoria_id AND p.is_active = 1
    GROUP BY c.id
    ORDER BY c.kategoria_prind_id, c.emertimi
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(result);
  });
});

// ─────────────────────────────────────────
// GET /api/store/categories/:id/products
// Produktet sipas kategorisë (publike)
// ─────────────────────────────────────────
router.get('/categories/:id/products', (req, res) => {
  const sql = `
    SELECT 
      p.id, p.emri, p.marka, p.cmimi, p.cmimi_zbritjes,
      p.sasia_stokut, p.foto_kryesore, p.garancia_muaj
    FROM Products p
    WHERE p.kategoria_id = ? AND p.is_active = 1 AND p.sasia_stokut > 0
    ORDER BY p.created_at DESC
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(result);
  });
});

module.exports = router;