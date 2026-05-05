const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// GET — Admin
router.get('/', verifyToken, checkRole(['Admin']), (req, res) => {
  db.query('SELECT * FROM Customers ORDER BY created_at DESC', (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(result);
  });
});

// GET single — Admin
router.get('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  db.query('SELECT * FROM Customers WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Klienti nuk u gjet.' });
    res.json(result[0]);
  });
});

// POST — Admin
router.post('/', verifyToken, checkRole(['Admin']), (req, res) => {
  const { emri, mbiemri, email, telefoni, adresa, qyteti } = req.body;
  if (!emri || !mbiemri) return res.status(400).json({ message: 'Emri dhe mbiemri jane te detyrueshme.' });

  db.query(
    'INSERT INTO Customers (emri, mbiemri, email, telefoni, adresa, qyteti) VALUES (?, ?, ?, ?, ?, ?)',
    [emri, mbiemri, email || null, telefoni || null, adresa || null, qyteti || null],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      res.status(201).json({ message: 'Klienti u shtua.', id: result.insertId });
    }
  );
});

// PUT — Admin
router.put('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  const { emri, mbiemri, email, telefoni, adresa, qyteti } = req.body;
  if (!emri || !mbiemri) return res.status(400).json({ message: 'Emri dhe mbiemri jane te detyrueshme.' });

  db.query(
    'UPDATE Customers SET emri = ?, mbiemri = ?, email = ?, telefoni = ?, adresa = ?, qyteti = ? WHERE id = ?',
    [emri, mbiemri, email || null, telefoni || null, adresa || null, qyteti || null, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Klienti nuk u gjet.' });
      res.json({ message: 'Klienti u përditësua.' });
    }
  );
});

// DELETE — vetëm Admin
router.delete('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  db.query('DELETE FROM Customers WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Klienti nuk u gjet.' });
    res.json({ message: 'Klienti u fshi.' });
  });
});

module.exports = router;