const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all
router.get("/", (req, res) => {
  db.query("SELECT * FROM OrderDetails", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// CREATE
router.post("/", (req, res) => {
  const { order_id, product_id, sasia, cmimi_unit, zbritja } = req.body;

  const sql = `
    INSERT INTO OrderDetails (order_id, product_id, sasia, cmimi_unit, zbritja)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [order_id, product_id, sasia, cmimi_unit, zbritja], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Created", insertId: result.insertId });
  });
});

// UPDATE
router.put("/:id", (req, res) => {
  const { id } = req.params;
  let { order_id, product_id, sasia, cmimi_unit, zbritja } = req.body;

  order_id = Number(order_id);
  product_id = Number(product_id);
  sasia = Number(sasia);
  cmimi_unit = Number(cmimi_unit);
  zbritja = zbritja ? Number(zbritja) : 0;

  const sql = `
    UPDATE OrderDetails
    SET order_id=?, product_id=?, sasia=?, cmimi_unit=?, zbritja=?
    WHERE id=?
  `;

  db.query(sql, [order_id, product_id, sasia, cmimi_unit, zbritja, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Updated" });
  });
});

// DELETE
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM OrderDetails WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted" });
  });
});

module.exports = router;