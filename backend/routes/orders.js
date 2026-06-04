const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/', verifyToken, checkRole(['Admin', 'Cashier']), (req, res) => {
  const sql = `
    SELECT o.*, CONCAT(c.emri, ' ', c.mbiemri) AS customer_emri
    FROM Orders o
    LEFT JOIN Customers c ON o.customer_id = c.id
    ORDER BY o.created_at DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(result);
  });
});

router.get('/:id', verifyToken, checkRole(['Admin', 'Cashier']), (req, res) => {
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

router.post('/', verifyToken, checkRole(['Admin', 'Cashier']), (req, res) => {
  const { customer_id, statusi, totali, shenime, metoda_pageses, adresa_dorezimit } = req.body;
  if (!customer_id) return res.status(400).json({ message: 'customer_id eshte i detyrueshme.' });

  db.query(
    'INSERT INTO Orders (customer_id, statusi, totali, shenime, metoda_pageses, adresa_dorezimit) VALUES (?, ?, ?, ?, ?, ?)',
    [customer_id, statusi || 'pending', totali || 0, shenime || null, metoda_pageses || null, adresa_dorezimit || null],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      res.status(201).json({ message: 'Porosia u shtua.', id: result.insertId });
    }
  );
});

router.put('/:id', verifyToken, checkRole(['Admin', 'Cashier']), (req, res) => {
  const { customer_id, statusi, totali, shenime, metoda_pageses, adresa_dorezimit } = req.body;
  if (!customer_id) return res.status(400).json({ message: 'customer_id eshte i detyrueshme.' });

  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (statusi && !validStatuses.includes(statusi)) return res.status(400).json({ message: 'Status i pavlefshme.' });

  db.query(
    'UPDATE Orders SET customer_id = ?, statusi = ?, totali = ?, shenime = ?, metoda_pageses = ?, adresa_dorezimit = ? WHERE id = ?',
    [customer_id, statusi || 'pending', totali || 0, shenime || null, metoda_pageses || null, adresa_dorezimit || null, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Porosia nuk u gjet.' });
      res.json({ message: 'Porosia u perditesua.' });
    }
  );
});

router.put('/:id/status', verifyToken, checkRole(['Admin', 'Cashier']), (req, res) => {
  const { statusi } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(statusi)) return res.status(400).json({ message: 'Status i pavlefshme.' });

  db.query('UPDATE Orders SET statusi = ? WHERE id = ?', [statusi, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Porosia nuk u gjet.' });
    res.json({ message: 'Statusi u perditesua.' });
  });
});

router.delete('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  db.query('DELETE FROM Orders WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Porosia nuk u gjet.' });
    res.json({ message: 'Porosia u fshi.' });
  });
});

module.exports = router;