const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all customers
router.get("/", (req, res) => {
  db.query("SELECT * FROM Customers", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// POST create customer
router.post("/", (req, res) => {
    console.log("BODY RECEIVED:", req.body); 
  const { emri, mbiemri, email, telefoni, adresa, qyteti } = req.body;

  const sql = `
    INSERT INTO Customers (emri, mbiemri, email, telefoni, adresa, qyteti)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [emri, mbiemri, email, telefoni, adresa, qyteti], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Customer added" });
  });
});

// DELETE customer
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM Customers WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Customer deleted" });
  });
});

// UPDATE customer
router.put("/:id", (req, res) => {
  const { emri, mbiemri, email, telefoni, adresa, qyteti } = req.body;

  const sql = `
    UPDATE Customers
    SET emri=?, mbiemri=?, email=?, telefoni=?, adresa=?, qyteti=?
    WHERE id=?
  `;

  db.query(
    sql,
    [emri, mbiemri, email, telefoni, adresa, qyteti, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Customer updated" });
    }
  );
});

//UPDATE
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { emri, mbiemri, email, telefoni, adresa, qyteti } = req.body;

  db.query(
    `UPDATE Customers 
     SET emri = ?, mbiemri = ?, email = ?, telefoni = ?, adresa = ?, qyteti = ?
     WHERE id = ?`,
    [emri, mbiemri, email, telefoni, adresa, qyteti, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Customer updated" });
    }
  );
});

module.exports = router;