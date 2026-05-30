const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Të gjitha routes këtu kërkojnë token + rol Customer
router.use(verifyToken);
router.use(checkRole(['Customer']));

// ─────────────────────────────────────────
// GET /api/customer/profile
// Profili i klientit të loguar
// ─────────────────────────────────────────
router.get('/profile', (req, res) => {
  const sql = `
    SELECT 
      u.id, u.emri, u.mbiemri, u.email,
      c.id AS customer_id, c.telefoni, c.adresa, c.qyteti
    FROM Users u
    LEFT JOIN Customers c ON u.id = c.user_id
    WHERE u.id = ?
  `;

  db.query(sql, [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Profili nuk u gjet.' });
    res.json(result[0]);
  });
});

// ─────────────────────────────────────────
// PUT /api/customer/profile
// Përditëso profilin
// ─────────────────────────────────────────
router.put('/profile', (req, res) => {
  const { telefoni, adresa, qyteti } = req.body;

  const sql = `
    UPDATE Customers SET telefoni = ?, adresa = ?, qyteti = ?
    WHERE user_id = ?
  `;

  db.query(sql, [telefoni || null, adresa || null, qyteti || null, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Profili nuk u gjet.' });
    res.json({ message: 'Profili u përditësua me sukses.' });
  });
});

// ─────────────────────────────────────────
// GET /api/customer/orders
// Porositë e klientit të loguar
// ─────────────────────────────────────────
router.get('/orders', (req, res) => {
  // Merr customer_id nga user_id
  db.query('SELECT id FROM Customers WHERE user_id = ?', [req.user.id], (err, custResult) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (custResult.length === 0) return res.status(404).json({ message: 'Klienti nuk u gjet.' });

    const customerId = custResult[0].id;

    const sql = `
      SELECT 
        o.id, o.statusi, o.totali, o.created_at,
        COUNT(od.id) AS numri_produkteve
      FROM Orders o
      LEFT JOIN OrderDetails od ON o.id = od.order_id
      WHERE o.customer_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;

    db.query(sql, [customerId], (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      res.json(result);
    });
  });
});

// ─────────────────────────────────────────
// GET /api/customer/orders/:id
// Detajet e një porosie
// ─────────────────────────────────────────
router.get('/orders/:id', (req, res) => {
  db.query('SELECT id FROM Customers WHERE user_id = ?', [req.user.id], (err, custResult) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (custResult.length === 0) return res.status(404).json({ message: 'Klienti nuk u gjet.' });

    const customerId = custResult[0].id;

    // Verifiko që porosia i takon këtij klienti
    const sql = `
      SELECT 
        o.id, o.statusi, o.totali, o.shenime, o.created_at,
        od.id AS detail_id, od.sasia, od.cmimi_unit, od.zbritja,
        p.emri AS produkt_emri, p.marka, p.foto_kryesore
      FROM Orders o
      LEFT JOIN OrderDetails od ON o.id = od.order_id
      LEFT JOIN Products p ON od.product_id = p.id
      WHERE o.id = ? AND o.customer_id = ?
    `;

    db.query(sql, [req.params.id, customerId], (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      if (result.length === 0) return res.status(404).json({ message: 'Porosia nuk u gjet.' });
      res.json(result);
    });
  });
});

// ─────────────────────────────────────────
// POST /api/customer/orders
// Bëj porosi të re
// ─────────────────────────────────────────
router.post('/orders', (req, res) => {
  const { produktet, shenime } = req.body;
  // produktet = [{ product_id, sasia }, ...]

  if (!produktet || produktet.length === 0) {
    return res.status(400).json({ message: 'Porosia duhet të ketë të paktën një produkt.' });
  }

  db.query('SELECT id FROM Customers WHERE user_id = ?', [req.user.id], (err, custResult) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (custResult.length === 0) return res.status(404).json({ message: 'Klienti nuk u gjet.' });

    const customerId = custResult[0].id;

    // Merr çmimet e produkteve nga DB
    const productIds = produktet.map(p => p.product_id);

    db.query(
      'SELECT id, emri, cmimi, cmimi_zbritjes, sasia_stokut FROM Products WHERE id IN (?) AND 1=1',
      [productIds],
      (err, products) => {
        if (err) return res.status(500).json({ message: 'DB error', error: err });

        // Kontrollo nëse të gjitha produktet ekzistojnë
        if (products.length !== produktet.length) {
          return res.status(400).json({ message: 'Disa produkte nuk u gjetën.' });
        }

        // Kontrollo stokun dhe llogarit totalin
        let totali = 0;
        const detajet = [];

        for (const item of produktet) {
          const product = products.find(p => p.id === item.product_id);

          if (product.sasia_stokut < item.sasia) {
            return res.status(400).json({
              message: `Stoku i pamjaftueshëm për produktin: ${product.emri}`
            });
          }

          const cmimi = product.cmimi_zbritjes || product.cmimi;
          const zbritja = product.cmimi_zbritjes ? product.cmimi - product.cmimi_zbritjes : 0;

          totali += cmimi * item.sasia;
          detajet.push({
            product_id: item.product_id,
            sasia: item.sasia,
            cmimi_unit: cmimi,
            zbritja
          });
        }

        // Krijo porosinë
        db.query(
          'INSERT INTO Orders (customer_id, statusi, totali, shenime) VALUES (?, "pending", ?, ?)',
          [customerId, totali, shenime || null],
          (err, orderResult) => {
            if (err) return res.status(500).json({ message: 'DB error', error: err });

            const orderId = orderResult.insertId;

            // Shto OrderDetails
            const detailValues = detajet.map(d => [orderId, d.product_id, d.sasia, d.cmimi_unit, d.zbritja]);

            db.query(
              'INSERT INTO OrderDetails (order_id, product_id, sasia, cmimi_unit, zbritja) VALUES ?',
              [detailValues],
              (err) => {
                if (err) return res.status(500).json({ message: 'DB error gjate shtimit te detajeve.', error: err });

                // Ul stokun për çdo produkt
                for (const item of produktet) {
                  db.query(
                    'UPDATE Products SET sasia_stokut = sasia_stokut - ? WHERE id = ?',
                    [item.sasia, item.product_id]
                  );

                  // Regjistro lëvizjen në Inventory
                  db.query(
                    'INSERT INTO Inventory (product_id, lloji, sasia, referenca_lloji, referenca_id) VALUES (?, "dalje", ?, "Order", ?)',
                    [item.product_id, item.sasia, orderId]
                  );
                }

                res.status(201).json({
                  message: 'Porosia u krijua me sukses.',
                  orderId,
                  totali
                });
              }
            );
          }
        );
      }
    );
  });
});

// ─────────────────────────────────────────
// GET /api/customer/warranties
// Garancionet e klientit
// ─────────────────────────────────────────
router.get('/warranties', (req, res) => {
  db.query('SELECT id FROM Customers WHERE user_id = ?', [req.user.id], (err, custResult) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (custResult.length === 0) return res.status(404).json({ message: 'Klienti nuk u gjet.' });

    const sql = `
      SELECT 
        w.id, w.data_fillimit, w.data_skadimit, w.statusi,
        p.emri AS produkt_emri, p.marka, p.foto_kryesore,
        DATEDIFF(w.data_skadimit, CURDATE()) AS dite_mbetur
      FROM Warranties w
      JOIN Products p ON w.product_id = p.id
      WHERE w.customer_id = ?
      ORDER BY w.data_skadimit ASC
    `;

    db.query(sql, [custResult[0].id], (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      res.json(result);
    });
  });
});

module.exports = router;