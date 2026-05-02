const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all suppliers
router.get("/", (req, res) => {
  db.query("SELECT * FROM Suppliers", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// POST create supplier
router.post("/", (req, res) => {
  const { emri_kompanise, kontakti, email, telefoni, adresa } = req.body;

  const sql = `
    INSERT INTO Suppliers (emri_kompanise, kontakti, email, telefoni, adresa)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [emri_kompanise, kontakti, email, telefoni, adresa], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Supplier added", id: result.insertId });
  });
});

// DELETE
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM Suppliers WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted" });
  });
});

// UPDATE
router.put("/:id", (req, res) => {
  const { emri_kompanise, kontakti, email, telefoni, adresa } = req.body;

  const sql = `
    UPDATE Suppliers
    SET emri_kompanise=?, kontakti=?, email=?, telefoni=?, adresa=?
    WHERE id=?
  `;

  db.query(sql, [emri_kompanise, kontakti, email, telefoni, adresa, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Updated" });
  });
});

module.exports = router;