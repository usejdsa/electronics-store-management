const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// GET — Admin dhe Technician
router.get('/', verifyToken, checkRole(['Admin', 'Technician']), (req, res) => {
  db.query('SELECT * FROM Categories ORDER BY kategoria_prind_id, emertimi', (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(result);
  });
});

// POST — vetëm Admin
router.post('/', verifyToken, checkRole(['Admin']), (req, res) => {
  const { emertimi, pershkrimi, kategoria_prind_id, ikona } = req.body;
  if (!emertimi) return res.status(400).json({ message: 'Emertimi është i detyrueshëm.' });

  db.query(
    'INSERT INTO Categories (emertimi, pershkrimi, kategoria_prind_id, ikona) VALUES (?, ?, ?, ?)',
    [emertimi, pershkrimi || null, kategoria_prind_id || null, ikona || null],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      res.status(201).json({ message: 'Kategoria u shtua.', id: result.insertId });
    }
  );
});

// PUT — vetëm Admin
router.put('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  const { emertimi, pershkrimi, kategoria_prind_id, ikona } = req.body;
  if (!emertimi) return res.status(400).json({ message: 'Emertimi është i detyrueshëm.' });

  db.query(
    'UPDATE Categories SET emertimi = ?, pershkrimi = ?, kategoria_prind_id = ?, ikona = ? WHERE id = ?',
    [emertimi, pershkrimi || null, kategoria_prind_id || null, ikona || null, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Kategoria nuk u gjet.' });
      res.json({ message: 'Kategoria u përditësua.' });
    }
  );
});

// DELETE — vetëm Admin
router.delete('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  db.query('DELETE FROM Categories WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Kategoria nuk u gjet.' });
    res.json({ message: 'Kategoria u fshi.' });
  });
});

module.exports = router;