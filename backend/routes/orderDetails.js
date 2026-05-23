const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// GET all — Admin, Cashier
router.get('/', verifyToken, checkRole(['Admin', 'Cashier']), (req, res) => {
  db.query('SELECT * FROM OrderDetails ORDER BY id DESC', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// CREATE — Admin, Cashier
router.post('/', verifyToken, checkRole(['Admin', 'Cashier']), (req, res) => {
  const { order_id, product_id, sasia, cmimi_unit, zbritja } = req.body;
  const sql = `
    INSERT INTO OrderDetails (order_id, product_id, sasia, cmimi_unit, zbritja)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [order_id, product_id, sasia, cmimi_unit, zbritja || 0], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Created', insertId: result.insertId });
  });
});

// UPDATE — Admin, Cashier
router.put('/:id', verifyToken, checkRole(['Admin', 'Cashier']), (req, res) => {
  const { id } = req.params;
  const order_id = Number(req.body.order_id);
  const product_id = Number(req.body.product_id);
  const sasia = Number(req.body.sasia);
  const cmimi_unit = Number(req.body.cmimi_unit);
  const zbritja = req.body.zbritja ? Number(req.body.zbritja) : 0;

  const sql = `
    UPDATE OrderDetails
    SET order_id=?, product_id=?, sasia=?, cmimi_unit=?, zbritja=?
    WHERE id=?
  `;
  db.query(sql, [order_id, product_id, sasia, cmimi_unit, zbritja, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Updated' });
  });
});

// DELETE — Admin only
router.delete('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  db.query('DELETE FROM OrderDetails WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Deleted' });
  });
});

module.exports = router;