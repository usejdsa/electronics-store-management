const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// GET /api/dashboard — Stats kryesore
router.get('/', verifyToken, checkRole(['Admin', 'Technician', 'Cashier']), (req, res) => {

  const queries = {
    totalProducts:    'SELECT COUNT(*) AS total FROM Products',
    totalCustomers:   'SELECT COUNT(*) AS total FROM Customers',
    totalOrders:      'SELECT COUNT(*) AS total FROM Orders',
    totalSuppliers:   'SELECT COUNT(*) AS total FROM Suppliers',
    totalRevenue:     'SELECT COALESCE(SUM(totali), 0) AS total FROM Orders WHERE statusi != "anuluar"',
    lowStock:         'SELECT COUNT(*) AS total FROM Products WHERE sasia_stokut <= 5',
    activeWarranties: 'SELECT COUNT(*) AS total FROM Warranties WHERE statusi = "aktive"',
    openServices:     'SELECT COUNT(*) AS total FROM ServiceRequests WHERE statusi = "hapur"',

    recentOrders: `
      SELECT o.id, o.totali, o.statusi, o.created_at,
        CONCAT(c.emri, ' ', c.mbiemri) AS customer_emri
      FROM Orders o
      LEFT JOIN Customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `,

    ordersByStatus: `
      SELECT statusi, COUNT(*) AS total
      FROM Orders
      GROUP BY statusi
    `,

    topProducts: `
      SELECT p.emri, SUM(od.sasia) AS total_shitur
      FROM OrderDetails od
      JOIN Products p ON od.product_id = p.id
      GROUP BY p.id, p.emri
      ORDER BY total_shitur DESC
      LIMIT 5
    `,

    revenueByMonth: `
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') AS muaji,
        SUM(totali) AS revenue
      FROM Orders
      WHERE statusi != 'anuluar'
        AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY muaji
      ORDER BY muaji ASC
    `
  };

  const promises = Object.entries(queries).map(([key, sql]) =>
    new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) return reject({ key, err });
        resolve({ key, result });
      });
    })
  );

  Promise.all(promises)
    .then(results => {
      const data = {};
      results.forEach(({ key, result }) => {
        if (['totalProducts','totalCustomers','totalOrders','totalSuppliers',
             'totalRevenue','lowStock','activeWarranties','openServices'].includes(key)) {
          data[key] = result[0].total;
        } else {
          data[key] = result;
        }
      });
      res.json(data);
    })
    .catch(err => {
      res.status(500).json({ message: 'DB error', error: err });
    });
});

module.exports = router;