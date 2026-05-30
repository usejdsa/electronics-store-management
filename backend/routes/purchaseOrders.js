const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/', verifyToken, checkRole(['Admin']), (req, res) => {
  const { supplier_id } = req.query;
  const where = supplier_id ? 'WHERE po.supplier_id = ?' : '';
  const params = supplier_id ? [supplier_id] : [];
  const sql = `
    SELECT po.*, s.emri_kompanise, p.emri AS produkt_emri
    FROM PurchaseOrders po
    LEFT JOIN Suppliers s ON po.supplier_id = s.id
    LEFT JOIN Products p ON po.product_id = p.id
    ${where}
    ORDER BY po.created_at DESC
  `;
  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(result);
  });
});

router.post('/', verifyToken, checkRole(['Admin']), (req, res) => {
  const { supplier_id, product_id, sasia, cmimi_blerjes, data_porosis, data_arritjes, shenime } = req.body;

  if (!supplier_id || !product_id || !sasia || !cmimi_blerjes) {
    return res.status(400).json({ message: 'supplier_id, product_id, sasia dhe cmimi_blerjes jane te detyrueshme.' });
  }

  const totali = sasia * cmimi_blerjes;

  db.query(
    'INSERT INTO PurchaseOrders (supplier_id, user_id, product_id, sasia, cmimi_blerjes, totali, data_porosis, data_arritjes, shenime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [supplier_id, req.user.id, product_id, sasia, cmimi_blerjes, totali, data_porosis || null, data_arritjes || null, shenime || null],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      res.status(201).json({ message: 'PurchaseOrder u shtua.', id: result.insertId, totali });
    }
  );
});

// PUT full update — only allowed if not yet received
router.put('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  const { supplier_id, product_id, sasia, cmimi_blerjes, shenime } = req.body;

  if (!supplier_id || !product_id || !sasia || !cmimi_blerjes) {
    return res.status(400).json({ message: 'supplier_id, product_id, sasia dhe cmimi_blerjes jane te detyrueshme.' });
  }

  // Don't allow editing a received order — stock has already been adjusted
  db.query('SELECT statusi FROM PurchaseOrders WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.length === 0) return res.status(404).json({ message: 'PurchaseOrder nuk u gjet.' });
    if (result[0].statusi === 'received') {
      return res.status(400).json({ message: 'Nuk mund të ndryshohet një porosi e marrë.' });
    }

    const totali = sasia * cmimi_blerjes;

    db.query(
      'UPDATE PurchaseOrders SET supplier_id = ?, product_id = ?, sasia = ?, cmimi_blerjes = ?, totali = ?, shenime = ? WHERE id = ?',
      [supplier_id, product_id, sasia, cmimi_blerjes, totali, shenime || null, req.params.id],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'DB error', error: err });
        res.json({ message: 'PurchaseOrder u përditësua.', totali });
      }
    );
  });
});

// PUT statusi — when received, auto-increment stock
router.put('/:id/status', verifyToken, checkRole(['Admin']), (req, res) => {
  const { statusi } = req.body;
  const validStatuses = ['draft', 'ordered', 'received', 'cancelled'];

  if (!validStatuses.includes(statusi)) {
    return res.status(400).json({ message: 'Status i pavlefshëm.' });
  }

  db.query('SELECT * FROM PurchaseOrders WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.length === 0) return res.status(404).json({ message: 'PurchaseOrder nuk u gjet.' });

    const po = result[0];

    db.query('UPDATE PurchaseOrders SET statusi = ? WHERE id = ?', [statusi, req.params.id], (err) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });

      if (statusi === 'received' && po.statusi !== 'received') {
        db.query(
          'UPDATE Products SET sasia_stokut = sasia_stokut + ? WHERE id = ?',
          [po.sasia, po.product_id]
        );
        db.query(
          'INSERT INTO Inventory (product_id, lloji, sasia, referenca_lloji, referenca_id, user_id) VALUES (?, "hyrje", ?, "PurchaseOrder", ?, ?)',
          [po.product_id, po.sasia, po.id, req.user.id]
        );
      }

      res.json({ message: 'Statusi u përditësua.' });
    });
  });
});

router.delete('/:id', verifyToken, checkRole(['Admin']), (req, res) => {
  db.query('DELETE FROM PurchaseOrders WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'PurchaseOrder nuk u gjet.' });
    res.json({ message: 'PurchaseOrder u fshi.' });
  });
});

module.exports = router;