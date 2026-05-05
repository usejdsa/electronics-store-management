const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// ─────────────────────────────────────────
// POST /api/auth/register
// Vetëm Admin mund të regjistrojë staf
// ─────────────────────────────────────────
router.post('/register', verifyToken, checkRole(['Admin']), async (req, res) => {
  const { emri, mbiemri, email, password, role_id } = req.body;

  if (!emri || !mbiemri || !email || !password) {
    return res.status(400).json({ message: 'Emri, mbiemri, email dhe password jane te detyrueshme.' });
  }

  // Vetëm Admin (1) dhe Technician (2) mund të regjistrohen këtu
  const allowedRoles = [1, 2];
  if (role_id && !allowedRoles.includes(Number(role_id))) {
    return res.status(400).json({ message: 'Role i pavlefshëm. Lejohen vetëm Admin dhe Technician.' });
  }

  try {
    db.query('SELECT id FROM Users WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      if (result.length > 0) return res.status(409).json({ message: 'Email ekziston tashmë.' });

      const password_hash = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO Users (emri, mbiemri, email, password_hash) VALUES (?, ?, ?, ?)',
        [emri, mbiemri, email, password_hash],
        (err, userResult) => {
          if (err) return res.status(500).json({ message: 'DB error', error: err });

          const userId = userResult.insertId;
          const roleId = role_id || 2; // default: Technician

          db.query(
            'INSERT INTO UserRoles (user_id, role_id) VALUES (?, ?)',
            [userId, roleId],
            (err) => {
              if (err) return res.status(500).json({ message: 'DB error gjate caktimit te rolit.', error: err });
              res.status(201).json({
                message: 'Useri u regjistrua me sukses.',
                id: userId
              });
            }
          );
        }
      );
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/register/customer
// Publik — regjistrim për klientët
// ─────────────────────────────────────────
router.post('/register/customer', async (req, res) => {
  const { emri, mbiemri, email, password, telefoni, adresa, qyteti } = req.body;

  if (!emri || !mbiemri || !email || !password) {
    return res.status(400).json({ message: 'Emri, mbiemri, email dhe password jane te detyrueshme.' });
  }

  try {
    db.query('SELECT id FROM Users WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      if (result.length > 0) return res.status(409).json({ message: 'Email ekziston tashmë.' });

      const password_hash = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO Users (emri, mbiemri, email, password_hash) VALUES (?, ?, ?, ?)',
        [emri, mbiemri, email, password_hash],
        (err, userResult) => {
          if (err) return res.status(500).json({ message: 'DB error', error: err });

          const userId = userResult.insertId;

          // Gjithmonë Customer (id: 4) — nuk mund të ndryshohet
          db.query(
            'INSERT INTO UserRoles (user_id, role_id) VALUES (?, 4)',
            [userId],
            (err) => {
              if (err) return res.status(500).json({ message: 'DB error gjate caktimit te rolit.', error: err });

              db.query(
                'INSERT INTO Customers (user_id, emri, mbiemri, email, telefoni, adresa, qyteti) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userId, emri, mbiemri, email, telefoni || null, adresa || null, qyteti || null],
                (err, customerResult) => {
                  if (err) return res.status(500).json({ message: 'DB error gjate krijimit te klientit.', error: err });

                  res.status(201).json({
                    message: 'Regjistrimi u krye me sukses.',
                    userId,
                    customerId: customerResult.insertId
                  });
                }
              );
            }
          );
        }
      );
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dhe password jane te detyrueshme.' });
  }

  const sql = `
    SELECT u.id, u.emri, u.mbiemri, u.email, u.password_hash, u.is_active,
           GROUP_CONCAT(r.emertimi) AS roles
    FROM Users u
    LEFT JOIN UserRoles ur ON u.id = ur.user_id
    LEFT JOIN Roles r ON ur.role_id = r.id
    WHERE u.email = ?
    GROUP BY u.id
  `;

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.length === 0) return res.status(401).json({ message: 'Email ose password i gabuar.' });

    const user = result[0];

    if (!user.is_active) {
      return res.status(403).json({ message: 'Llogaria është çaktivizuar.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Email ose password i gabuar.' });

    const roles = user.roles ? user.roles.split(',') : [];

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, emri: user.emri, roles },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    db.query(
      'INSERT INTO RefreshTokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, refreshToken, expiresAt],
      (err) => {
        if (err) return res.status(500).json({ message: 'Error duke ruajtur refresh token.', error: err });

        res.json({
          message: 'Login i suksesshëm.',
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            emri: user.emri,
            mbiemri: user.mbiemri,
            email: user.email,
            roles
          }
        });
      }
    );
  });
});

// ─────────────────────────────────────────
// POST /api/auth/refresh
// ─────────────────────────────────────────
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token mungon.' });
  }

  db.query(
    'SELECT * FROM RefreshTokens WHERE token = ? AND revoked = 0',
    [refreshToken],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      if (result.length === 0) return res.status(403).json({ message: 'Refresh token invalid ose i revokuar.' });

      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        const sql = `
          SELECT GROUP_CONCAT(r.emertimi) AS roles
          FROM UserRoles ur
          JOIN Roles r ON ur.role_id = r.id
          WHERE ur.user_id = ?
        `;

        db.query(sql, [decoded.id], (err, roleResult) => {
          if (err) return res.status(500).json({ message: 'DB error', error: err });

          const roles = roleResult[0]?.roles ? roleResult[0].roles.split(',') : [];

          const newAccessToken = jwt.sign(
            { id: decoded.id, roles },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
          );

          res.json({ accessToken: newAccessToken });
        });
      } catch (err) {
        return res.status(403).json({ message: 'Refresh token i skaduar.' });
      }
    }
  );
});

// ─────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────
router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token mungon.' });
  }

  db.query(
    'UPDATE RefreshTokens SET revoked = 1 WHERE token = ?',
    [refreshToken],
    (err) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      res.json({ message: 'Logout i suksesshëm.' });
    }
  );
});

module.exports = router;