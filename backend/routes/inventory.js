const express = require("express");
const router = express.Router();
const db = require("../config/db");


// GET ALL
router.get("/", (req, res) => {
  db.query(
    `SELECT i.*, p.emri AS product_name
     FROM Inventory i
     JOIN Products p ON i.product_id = p.id`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});


// CREATE
router.post("/", (req, res) => {
  const {
    product_id,
    lloji,
    sasia,
    referenca_lloji,
    referenca_id,
    shenime,
    user_id
  } = req.body;

  console.log("INVENTORY:", req.body);

  const sql = `
    INSERT INTO Inventory 
    (product_id, lloji, sasia, referenca_lloji, referenca_id, shenime, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      product_id,
      lloji,
      sasia,
      referenca_lloji,
      referenca_id,
      shenime,
      user_id
    ],
    (err, result) => {
      if (err) {
        console.log("MYSQL ERROR:", err.sqlMessage);
        return res.status(500).json(err);
      }

      console.log("INSERT OK:", result.insertId);
      res.json({ message: "Inventory created" });
    }
  );
});

// UPDATE
router.put("/:id", (req, res) => {
  const {
    product_id,
    lloji,
    sasia,
    referenca_lloji,
    referenca_id,
    shenime,
    user_id
  } = req.body;

  console.log("INVENTORY UPDATE:", req.body);

  const sql = `
    UPDATE Inventory
    SET product_id = ?,
        lloji = ?,
        sasia = ?,
        referenca_lloji = ?,
        referenca_id = ?,
        shenime = ?,
        user_id = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      product_id,
      lloji,
      sasia,
      referenca_lloji,
      referenca_id,
      shenime,
      user_id,
      req.params.id
    ],
    (err, result) => {
      if (err) {
        console.log("MYSQL UPDATE ERROR:", err.sqlMessage);
        return res.status(500).json(err);
      }

      console.log("UPDATED:", result.affectedRows);
      res.json({ message: "Inventory updated" });
    }
  );
});

// DELETE
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM Inventory WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Deleted" });
  });
});

module.exports = router;