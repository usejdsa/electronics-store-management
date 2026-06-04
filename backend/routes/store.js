const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/store/products — with filters, sort, pagination
router.get('/products', (req, res) => {
  const { kategoria_id, search, min_cmimi, max_cmimi, sort, page = 1, limit = 12 } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const params = [];
  const countParams = [];

  let where = 'WHERE 1=1';

  // Support parent categories: if selected category has children, include all children too
  if (kategoria_id) {
    where += ' AND (p.kategoria_id = ? OR c.kategoria_prind_id = ?)';
    params.push(kategoria_id, kategoria_id);
    countParams.push(kategoria_id, kategoria_id);
  }
  if (search) {
    where += ' AND (p.emri LIKE ? OR p.marka LIKE ? OR p.modeli LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
    countParams.push(term, term, term);
  }
  if (min_cmimi) {
    where += ' AND COALESCE(p.cmimi_zbritjes, p.cmimi) >= ?';
    params.push(parseFloat(min_cmimi));
    countParams.push(parseFloat(min_cmimi));
  }
  if (max_cmimi) {
    where += ' AND COALESCE(p.cmimi_zbritjes, p.cmimi) <= ?';
    params.push(parseFloat(max_cmimi));
    countParams.push(parseFloat(max_cmimi));
  }

  let orderBy = 'ORDER BY p.id DESC';
  if (sort === 'price_asc')  orderBy = 'ORDER BY COALESCE(p.cmimi_zbritjes, p.cmimi) ASC';
  if (sort === 'price_desc') orderBy = 'ORDER BY COALESCE(p.cmimi_zbritjes, p.cmimi) DESC';
  if (sort === 'name_asc')   orderBy = 'ORDER BY p.emri ASC';
  if (sort === 'name_desc')  orderBy = 'ORDER BY p.emri DESC';

  const countSql = `SELECT COUNT(*) AS total FROM products p LEFT JOIN categories c ON p.kategoria_id = c.id ${where}`;
  const dataSql = `
    SELECT p.id, p.emri, p.marka, p.modeli, p.pershkrimi,
           p.cmimi, p.cmimi_zbritjes, p.sasia_stokut,
           p.garancia_muaj, p.foto_kryesore,
           c.emertimi AS kategoria
    FROM products p
    LEFT JOIN categories c ON p.kategoria_id = c.id
    ${where} ${orderBy}
    LIMIT ? OFFSET ?
  `;

  db.query(countSql, countParams, (err, countResult) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    const total = countResult[0].total;

    params.push(parseInt(limit), offset);
    db.query(dataSql, params, (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      res.json({ products: result, total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) });
    });
  });
});

// GET /api/store/products/:id
router.get('/products/:id', (req, res) => {
  const sql = `
    SELECT p.id, p.emri, p.marka, p.modeli, p.pershkrimi,
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

// GET /api/store/categories — includes product count for parent categories (counts children too)
router.get('/categories', (req, res) => {
  const sql = `
    SELECT c.id, c.emertimi, c.pershkrimi, c.kategoria_prind_id,
           (
             SELECT COUNT(*)
             FROM products p2
             LEFT JOIN categories c2 ON p2.kategoria_id = c2.id
             WHERE p2.kategoria_id = c.id
                OR c2.kategoria_prind_id = c.id
           ) AS numri_produkteve
    FROM categories c
    ORDER BY COALESCE(c.kategoria_prind_id, c.id), c.id
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    res.json(result);
  });
});

// GET /api/store/price-range — min/max price for filter UI
router.get('/price-range', (req, res) => {
  db.query('SELECT MIN(COALESCE(cmimi_zbritjes, cmimi)) AS min_p, MAX(COALESCE(cmimi_zbritjes, cmimi)) AS max_p FROM products', (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    res.json({ min: Math.floor(result[0].min_p || 0), max: Math.ceil(result[0].max_p || 9999) });
  });
});

module.exports = router;