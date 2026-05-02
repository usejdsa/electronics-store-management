const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all purchase orders
router.get("/", (req, res) => {
  const sql = `
    SELECT po.*, s.emri_kompanise, p.emri AS product_name
    FROM PurchaseOrders po
    JOIN Suppliers s ON po.supplier_id = s.id
    JOIN Products p ON po.product_id = p.id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// POST create purchase order
router.post("/", (req, res) => {
  const { supplier_id, user_id, product_id, sasia, cmimi_blerjes } = req.body;

  const totali = sasia * cmimi_blerjes;

  const sql = `
    INSERT INTO PurchaseOrders 
    (supplier_id, user_id, product_id, sasia, cmimi_blerjes, totali)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [supplier_id, user_id, product_id, sasia, cmimi_blerjes, totali],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Purchase Order created", id: result.insertId });
    }
  );
});

// DELETE
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM PurchaseOrders WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted" });
  });
});

// UPDATE
router.put("/:id", (req, res) => {
  let { supplier_id, product_id, sasia, cmimi_blerjes, statusi } = req.body;

  // FORCE values
  supplier_id = supplier_id ? Number(supplier_id) : null;
  product_id = product_id ? Number(product_id) : null;
  sasia = sasia ? Number(sasia) : 0;
  cmimi_blerjes = cmimi_blerjes ? Number(cmimi_blerjes) : 0;

  const totali = sasia * cmimi_blerjes;

  if (!statusi) statusi = "draft";

  const sql = `
    UPDATE PurchaseOrders
    SET supplier_id=?, product_id=?, sasia=?, cmimi_blerjes=?, totali=?, statusi=?
    WHERE id=?
  `;

  db.query(
    sql,
    [supplier_id, product_id, sasia, cmimi_blerjes, totali, statusi, req.params.id],
    (err, result) => {
      if (err) {
        console.log("❌ UPDATE ERROR:", err.sqlMessage);
        return res.status(500).json(err);
      }

      res.json({ message: "Updated" });
    }
  );
});

module.exports = router;