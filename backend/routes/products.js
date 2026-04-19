const express = require('express');
const router = express.Router();
const db = require('../config/db');

//GET
router.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

//POST
router.post('/', (req, res) => {
  const { emri, cmimi } = req.body;

  db.query(
    'INSERT INTO products (emri, cmimi) VALUES (?, ?)',
    [emri, cmimi],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Product added' });
    }
  );
});

//DELETE
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query(
    'DELETE FROM products WHERE id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Product deleted' });
    }
  );
});

//UPDATE
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { emri, cmimi } = req.body;

  db.query(
    'UPDATE products SET emri = ?, cmimi = ? WHERE id = ?',
    [emri, cmimi, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Product updated' });
    }
  );
});

module.exports = router;