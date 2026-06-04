const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// GET all reviews (Admin)
router.get('/', verifyToken, checkRole(['Admin']), (req, res) => {
  const sql = `
    SELECT pr.*, p.emri AS produkt_emri,
           CONCAT(c.emri, ' ', c.mbiemri) AS customer_emri
    FROM ProductReviews pr
    LEFT JOIN Products p ON pr.produkti_id = p.id
    LEFT JOIN Customers c ON pr.klienti_id = c.id
    ORDER BY pr.data_vleresimit DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(result);
  });
});

// GET reviews for a specific product (public-ish, used by store)
router.get('/product/:productId', (req, res) => {
  const sql = `
    SELECT pr.*, CONCAT(c.emri, ' ', c.mbiemri) AS customer_emri
    FROM ProductReviews pr
    LEFT JOIN Customers c ON pr.klienti_id = c.id
    WHERE pr.produkti_id = ?
    ORDER BY pr.data_vleresimit DESC
  `;
  db.query(sql, [req.params.productId], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(result);
  });
});

// POST — Customer posts a review
router.post('/', verifyToken, (req, res) => {
  const { produkti_id, vleresimi, komenti } = req.body;
  if (!produkti_id || !vleresimi) {
    return res.status(400).json({ message: 'produkti_id dhe vleresimi jane te detyrueshme.' });
  }
  if (vleresimi < 1 || vleresimi > 5) {
    return res.status(400).json({ message: 'Vleresimi duhet te jete nder 1-5.' });
  }

  // Get customer record for this user
  db.query('SELECT id FROM Customers WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (rows.length === 0) return res.status(403).json({ message: 'Vetem klientet mund te lene komente.' });

    const klienti_id = rows[0].id;
    db.query(
      'INSERT INTO ProductReviews (produkti_id, klienti_id, vleresimi, komenti) VALUES (?, ?, ?, ?)',
      [produkti_id, klienti_id, vleresimi, komenti || null],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'DB error', error: err });
        res.status(201).json({ message: 'Review u shtua.', id: result.insertId });
      }
    );
  });
});

// DELETE — Admin only
router.delete('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  db.query('DELETE FROM ProductReviews WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Review nuk u gjet.' });
    res.json({ message: 'Review u fshi.' });
  });
});

module.exports = router;