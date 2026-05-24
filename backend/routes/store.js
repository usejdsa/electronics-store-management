const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/store/products
router.get('/products', (req, res) => {
  const { kategoria_id, search } = req.query;

  let sql = `
    SELECT 
      p.id, p.emri, p.marka, p.modeli, p.pershkrimi,
      p.cmimi, p.cmimi_zbritjes, p.sasia_stokut,
      p.garancia_muaj, p.foto_kryesore,
      c.emertimi AS kategoria
    FROM products p
    LEFT JOIN categories c ON p.kategoria_id = c.id
    WHERE 1=1
  `;

  const params = [];

  if (kategoria_id) {
    sql += ' AND p.kategoria_id = ?';
    params.push(kategoria_id);
  }

  if (search) {
    sql += ' AND (p.emri LIKE ? OR p.marka LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term);
  }

  sql += ' ORDER BY p.id DESC';

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    res.json(result);
  });
});

// GET /api/store/products/:id
router.get('/products/:id', (req, res) => {
  const sql = `
    SELECT 
      p.id, p.emri, p.marka, p.modeli, p.pershkrimi,
      p.cmimi, p.cmimi_zbritjes, p.sasia_stokut,
      p.garancia_muaj, p.foto_kryesore,
      c.emertimi AS kategoria, c.id AS kategoria_id
    FROM products p
    LEFT JOIN categories c ON p.kategoria_id = c.id
    WHERE p.id = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Produkti nuk u gjet.' });
    res.json(result[0]);
  });
});

// GET /api/store/categories
router.get('/categories', (req, res) => {
  const sql = `
    SELECT 
      c.id, c.emertimi, c.pershkrimi,
      COUNT(p.id) AS numri_produkteve
    FROM categories c
    LEFT JOIN products p ON c.id = p.kategoria_id
    GROUP BY c.id
    ORDER BY c.emertimi
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    res.json(result);
  });
});

module.exports = router;