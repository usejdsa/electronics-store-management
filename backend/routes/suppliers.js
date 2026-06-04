const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/', verifyToken, checkRole(['Admin']), (req, res) => {
  db.query('SELECT * FROM Suppliers ORDER BY emri_kompanise', (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(result);
  });
});

router.post('/', verifyToken, checkRole(['Admin']), (req, res) => {
  const { emri_kompanise, kontakti, email, telefoni, adresa, vendi } = req.body;
  if (!emri_kompanise) return res.status(400).json({ message: 'Emri i kompanisë është i detyrueshëm.' });

  db.query(
    'INSERT INTO Suppliers (emri_kompanise, kontakti, email, telefoni, adresa, vendi) VALUES (?, ?, ?, ?, ?, ?)',
    [emri_kompanise, kontakti || null, email || null, telefoni || null, adresa || null, vendi || null],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      res.status(201).json({ message: 'Furnizuesi u shtua.', id: result.insertId });
    }
  );
});

router.put('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  const { emri_kompanise, kontakti, email, telefoni, adresa, vendi } = req.body;
  if (!emri_kompanise) return res.status(400).json({ message: 'Emri i kompanisë është i detyrueshëm.' });

  db.query(
    'UPDATE Suppliers SET emri_kompanise = ?, kontakti = ?, email = ?, telefoni = ?, adresa = ?, vendi = ? WHERE id = ?',
    [emri_kompanise, kontakti || null, email || null, telefoni || null, adresa || null, vendi || null, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Furnizuesi nuk u gjet.' });
      res.json({ message: 'Furnizuesi u përditësua.' });
    }
  );
});

router.delete('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  db.query('DELETE FROM Suppliers WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Furnizuesi nuk u gjet.' });
    res.json({ message: 'Furnizuesi u fshi.' });
  });
});

module.exports = router;