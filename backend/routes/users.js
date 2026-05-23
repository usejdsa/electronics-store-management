const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// GET all users — Admin only
router.get('/', verifyToken, checkRole(['Admin']), (req, res) => {
  const sql = `
    SELECT u.id, u.emri, u.mbiemri, u.email, u.is_active, u.created_at,
           GROUP_CONCAT(r.emertimi ORDER BY r.emertimi SEPARATOR ',') AS roles
    FROM Users u
    LEFT JOIN UserRoles ur ON u.id = ur.user_id
    LEFT JOIN Roles r ON ur.role_id = r.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// PUT update roles — Admin only
router.put('/:id/roles', verifyToken, checkRole(['Admin']), (req, res) => {
  const userId = req.params.id;
  const { roles } = req.body; // array of role name strings e.g. ['Admin', 'Technician']

  if (!Array.isArray(roles)) {
    return res.status(400).json({ message: 'roles must be an array of role names.' });
  }

  // Resolve role names to IDs, then replace
  db.query('SELECT id, emertimi FROM Roles', (err, allRoles) => {
    if (err) return res.status(500).json(err);

    const roleIds = roles
      .map(name => allRoles.find(r => r.emertimi === name)?.id)
      .filter(Boolean);

    // Delete existing roles then insert new ones
    db.query('DELETE FROM UserRoles WHERE user_id = ?', [userId], (err) => {
      if (err) return res.status(500).json(err);

      if (roleIds.length === 0) {
        return res.json({ message: 'Roles cleared.' });
      }

      const values = roleIds.map(rid => [userId, rid]);
      db.query('INSERT INTO UserRoles (user_id, role_id) VALUES ?', [values], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Roles updated.' });
      });
    });
  });
});

// PUT toggle active status — Admin only
router.put('/:id/status', verifyToken, checkRole(['Admin']), (req, res) => {
  const { is_active } = req.body;
  db.query('UPDATE Users SET is_active = ? WHERE id = ?', [is_active, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Status updated.' });
  });
});

module.exports = router;