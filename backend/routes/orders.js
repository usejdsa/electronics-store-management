const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all orders
router.get("/", (req, res) => {
  db.query("SELECT * FROM Orders", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// CREATE order
router.post("/", (req, res) => {
  console.log("BODY:", req.body);

  let { customer_id, user_id, statusi, totali, shenime } = req.body;

  // SAFE TYPE HANDLING (IMPORTANT)
  customer_id = customer_id ? Number(customer_id) : null;
  user_id = user_id ? Number(user_id) : null;
  totali = totali ? Number(totali) : 0;

  const sql = `
    INSERT INTO Orders (customer_id, user_id, statusi, totali, shenime)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [customer_id, user_id, statusi, totali, shenime], (err, result) => {
    if (err) {
      console.log("❌ MYSQL ERROR:", err.sqlMessage || err);
      return res.status(500).json(err);
    }

    console.log("SUCCESS INSERT ID:", result.insertId);

    res.json({
      message: "Order created",
      insertId: result.insertId
    });
  });
});

//UPDATE order
router.put("/:id", (req, res) => {
  const { id } = req.params;
  let { customer_id, user_id, statusi, totali, shenime } = req.body;

  // safety conversion (important)
  customer_id = customer_id ? Number(customer_id) : null;
  user_id = user_id ? Number(user_id) : null;
  totali = totali ? Number(totali) : 0;

  const sql = `
    UPDATE Orders 
    SET customer_id = ?, user_id = ?, statusi = ?, totali = ?, shenime = ?
    WHERE id = ?
  `;

  db.query(sql, [customer_id, user_id, statusi, totali, shenime, id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Order updated",
      affectedRows: result.affectedRows
    });
  });
});

// DELETE order
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM Orders WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Order deleted" });
  });
});

module.exports = router;