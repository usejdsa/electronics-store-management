const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
});

module.exports = db;