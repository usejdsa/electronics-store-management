const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Cookie options — httpOnly prevents JS access, secure only in production
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

// POST /api/auth/register — Admin only, creates staff accounts
router.post('/register', verifyToken, checkRole(['Admin']), async (req, res) => {
  const { emri, mbiemri, email, password, role_id } = req.body;
  if (!emri || !mbiemri || !email || !password) {
    return res.status(400).json({ message: 'Emri, mbiemri, email dhe password jane te detyrueshme.' });
  }
  const allowedRoles = [1, 2, 3];
  if (role_id && !allowedRoles.includes(Number(role_id))) {
    return res.status(400).json({ message: 'Role i pavlefshëm.' });
  }
  try {
    db.query('SELECT id FROM Users WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      if (result.length > 0) return res.status(409).json({ message: 'Email ekziston tashmë.' });
      const password_hash = await bcrypt.hash(password, 10);
      db.query('INSERT INTO Users (emri, mbiemri, email, password_hash) VALUES (?, ?, ?, ?)',
        [emri, mbiemri, email, password_hash], (err, userResult) => {
          if (err) return res.status(500).json({ message: 'DB error', error: err });
          const userId = userResult.insertId;
          const roleId = role_id || 2;
          db.query('INSERT INTO UserRoles (user_id, role_id) VALUES (?, ?)', [userId, roleId], (err) => {
            if (err) return res.status(500).json({ message: 'DB error gjate caktimit te rolit.', error: err });
            res.status(201).json({ message: 'Useri u regjistrua me sukses.', id: userId });
          });
        });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// POST /api/auth/register/customer — public registration
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
      db.query('INSERT INTO Users (emri, mbiemri, email, password_hash) VALUES (?, ?, ?, ?)',
        [emri, mbiemri, email, password_hash], (err, userResult) => {
          if (err) return res.status(500).json({ message: 'DB error', error: err });
          const userId = userResult.insertId;
          db.query('INSERT INTO UserRoles (user_id, role_id) VALUES (?, 4)', [userId], (err) => {
            if (err) return res.status(500).json({ message: 'DB error gjate caktimit te rolit.', error: err });
            db.query('INSERT INTO Customers (user_id, emri, mbiemri, email, telefoni, adresa, qyteti) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [userId, emri, mbiemri, email, telefoni || null, adresa || null, qyteti || null],
              (err, customerResult) => {
                if (err) return res.status(500).json({ message: 'DB error gjate krijimit te klientit.', error: err });
                res.status(201).json({ message: 'Regjistrimi u krye me sukses.', userId, customerId: customerResult.insertId });
              });
          });
        });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// POST /api/auth/login
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
    if (!user.is_active) return res.status(403).json({ message: 'Llogaria është çaktivizuar.' });
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
    db.query('INSERT INTO RefreshTokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, refreshToken, expiresAt], (err) => {
        if (err) return res.status(500).json({ message: 'Error duke ruajtur refresh token.', error: err });
        // Set both tokens as httpOnly cookies — JS cannot read them
        res.cookie('accessToken', accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
        res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 });
        // Only return user data — no tokens in the response body
        res.json({
          message: 'Login i suksesshëm.',
          user: { id: user.id, emri: user.emri, mbiemri: user.mbiemri, email: user.email, roles }
        });
      });
  });
});

// POST /api/auth/refresh — reads refresh token from httpOnly cookie
router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token mungon.' });
  db.query('SELECT * FROM RefreshTokens WHERE token = ? AND revoked = 0', [refreshToken], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.length === 0) return res.status(403).json({ message: 'Refresh token invalid ose i revokuar.' });
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const userSql = `
        SELECT u.email, u.emri, GROUP_CONCAT(r.emertimi) AS roles
        FROM Users u
        LEFT JOIN UserRoles ur ON u.id = ur.user_id
        LEFT JOIN Roles r ON ur.role_id = r.id
        WHERE u.id = ?
        GROUP BY u.id
      `;
      db.query(userSql, [decoded.id], (err, roleResult) => {
        if (err) return res.status(500).json({ message: 'DB error', error: err });
        const row = roleResult[0];
        const roles = row?.roles ? row.roles.split(',') : [];
        const newAccessToken = jwt.sign(
          { id: decoded.id, email: row?.email, emri: row?.emri, roles },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
        );
        // Rotate the access token cookie
        res.cookie('accessToken', newAccessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
        res.json({ message: 'Token u rifreskua.' });
      });
    } catch (err) {
      return res.status(403).json({ message: 'Refresh token i skaduar.' });
    }
  });
});

// POST /api/auth/logout — revokes DB token and clears cookies
router.post('/logout', (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    db.query('UPDATE RefreshTokens SET revoked = 1 WHERE token = ?', [refreshToken]);
  }
  res.clearCookie('accessToken', COOKIE_OPTS);
  res.clearCookie('refreshToken', COOKIE_OPTS);
  res.json({ message: 'Logout i suksesshëm.' });
});

// GET /api/auth/me — returns logged-in user data from the cookie token
router.get('/me', verifyToken, (req, res) => {
  const userSql = `
    SELECT u.id, u.emri, u.mbiemri, u.email, u.is_active,
           GROUP_CONCAT(r.emertimi ORDER BY r.emertimi SEPARATOR ',') AS roles
    FROM Users u
    LEFT JOIN UserRoles ur ON u.id = ur.user_id
    LEFT JOIN Roles r ON ur.role_id = r.id
    WHERE u.id = ?
    GROUP BY u.id
  `;
  db.query(userSql, [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (!result.length) return res.status(404).json({ message: 'User nuk u gjet.' });
    const u = result[0];
    res.json({
      id: u.id, emri: u.emri, mbiemri: u.mbiemri, email: u.email,
      roles: u.roles ? u.roles.split(',') : []
    });
  });
});

module.exports = router;