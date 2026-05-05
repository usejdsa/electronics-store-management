const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// GET — Admin dhe Technician
router.get('/', verifyToken, checkRole(['Admin', 'Technician']), (req, res) => {
  const sql = `
    SELECT i.*, p.emri AS produkt_emri, 
           CONCAT(u.emri, ' ', u.mbiemri) AS user_emri
    FROM Inventory i
    LEFT JOIN Products p ON i.product_id = p.id
    LEFT JOIN Users u ON i.user_id = u.id
    ORDER BY i.created_at DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(result);
  });
});

// POST — rregullim manual i stokut, vetëm Admin
router.post('/', verifyToken, checkRole(['Admin']), (req, res) => {
  const { product_id, lloji, sasia, shenime } = req.body;

  if (!product_id || !lloji || !sasia) {
    return res.status(400).json({ message: 'product_id, lloji dhe sasia jane te detyrueshme.' });
  }

  db.query(
    'INSERT INTO Inventory (product_id, lloji, sasia, referenca_lloji, shenime, user_id) VALUES (?, ?, ?, "Manual", ?, ?)',
    [product_id, lloji, sasia, shenime || null, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });

      // Përditëso stokun sipas llojit
      const operator = lloji === 'hyrje' ? '+' : '-';
      db.query(
        `UPDATE Products SET sasia_stokut = sasia_stokut ${operator} ? WHERE id = ?`,
        [sasia, product_id]
      );

      res.status(201).json({ message: 'Lëvizja e inventarit u regjistrua.', id: result.insertId });
    }
  );
});

module.exports = router;