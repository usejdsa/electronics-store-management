const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// GET all service requests — Admin & Technician
router.get('/', verifyToken, checkRole(['Admin', 'Technician']), (req, res) => {
  const sql = `
    SELECT sr.*,
           CONCAT(c.emri, ' ', c.mbiemri) AS customer_emri,
           p.emri AS produkt_emri,
           CONCAT(u.emri, ' ', u.mbiemri) AS technician_emri
    FROM ServiceRequests sr
    LEFT JOIN Customers c ON sr.customer_id = c.id
    LEFT JOIN Products p ON sr.product_id = p.id
    LEFT JOIN Users u ON sr.technician_id = u.id
    ORDER BY sr.created_at DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(result);
  });
});

// POST — Admin or Technician creates a request
router.post('/', verifyToken, checkRole(['Admin', 'Technician']), (req, res) => {
  const { customer_id, product_id, warranty_id, technician_id, problemi, prioriteti } = req.body;
  if (!customer_id || !product_id || !problemi) {
    return res.status(400).json({ message: 'customer_id, product_id dhe problemi jane te detyrueshme.' });
  }
  db.query(
    'INSERT INTO ServiceRequests (customer_id, product_id, warranty_id, technician_id, problemi, prioriteti) VALUES (?, ?, ?, ?, ?, ?)',
    [customer_id, product_id, warranty_id || null, technician_id || null, problemi, prioriteti || 'normal'],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      res.status(201).json({ message: 'Kerkesa u shtua.', id: result.insertId });
    }
  );
});

// PUT — update status/diagnosis/technician
router.put('/:id', verifyToken, checkRole(['Admin', 'Technician']), (req, res) => {
  const { statusi, diagnoza, technician_id, cmimi_servisit, shenime, data_perfundim } = req.body;
  const validStatuses = ['hapur', 'ne_proces', 'zgjidhur', 'mbyllur', 'anuluar'];
  if (statusi && !validStatuses.includes(statusi)) {
    return res.status(400).json({ message: 'Status i pavlefshme.' });
  }
  db.query(
    `UPDATE ServiceRequests SET
      statusi = COALESCE(?, statusi),
      diagnoza = COALESCE(?, diagnoza),
      technician_id = COALESCE(?, technician_id),
      cmimi_servisit = COALESCE(?, cmimi_servisit),
      shenime = COALESCE(?, shenime),
      data_perfundim = COALESCE(?, data_perfundim)
    WHERE id = ?`,
    [statusi || null, diagnoza || null, technician_id || null, cmimi_servisit || null, shenime || null, data_perfundim || null, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Kerkesa nuk u gjet.' });
      res.json({ message: 'Kerkesa u perditesua.' });
    }
  );
});

// DELETE — Admin only
router.delete('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  db.query('DELETE FROM ServiceRequests WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Kerkesa nuk u gjet.' });
    res.json({ message: 'Kerkesa u fshi.' });
  });
});

module.exports = router;