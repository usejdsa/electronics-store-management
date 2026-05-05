const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// GET — Admin
router.get('/', verifyToken, checkRole(['Admin']), (req, res) => {
  const sql = `
    SELECT o.*, 
      CONCAT(c.emri, ' ', c.mbiemri) AS customer_emri
    FROM Orders o
    LEFT JOIN Customers c ON o.customer_id = c.id
    ORDER BY o.created_at DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(result);
  });
});

// GET single — Admin
router.get('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  const sql = `
    SELECT o.*, od.id AS detail_id, od.sasia, od.cmimi_unit, od.zbritja,
      p.emri AS produkt_emri, p.marka,
      CONCAT(c.emri, ' ', c.mbiemri) AS customer_emri
    FROM Orders o
    LEFT JOIN OrderDetails od ON o.id = od.order_id
    LEFT JOIN Products p ON od.product_id = p.id
    LEFT JOIN Customers c ON o.customer_id = c.id
    WHERE o.id = ?
  `;
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Porosia nuk u gjet.' });
    res.json(result);
  });
});

// PUT statusi — Admin
router.put('/:id/status', verifyToken, checkRole(['Admin']), (req, res) => {
  const { statusi } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(statusi)) {
    return res.status(400).json({ message: 'Status i pavlefshëm.' });
  }

  db.query(
    'UPDATE Orders SET statusi = ? WHERE id = ?',
    [statusi, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Porosia nuk u gjet.' });
      res.json({ message: 'Statusi u përditësua.' });
    }
  );
});

// DELETE — vetëm Admin
router.delete('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  db.query('DELETE FROM Orders WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Porosia nuk u gjet.' });
    res.json({ message: 'Porosia u fshi.' });
  });
});

module.exports = router;