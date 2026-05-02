const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET ALL
router.get("/", (req, res) => {
  db.query("SELECT * FROM Categories", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// CREATE
router.post("/", (req, res) => {
  const { emertimi, pershkrimi } = req.body;

  db.query(
    "INSERT INTO Categories (emertimi, pershkrimi) VALUES (?, ?)",
    [emertimi, pershkrimi],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Category created" });
    }
  );
});

// UPDATE
router.put("/:id", (req, res) => {
  const { emertimi, pershkrimi } = req.body;

  db.query(
    "UPDATE Categories SET emertimi=?, pershkrimi=? WHERE id=?",
    [emertimi, pershkrimi, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Category updated" });
    }
  );
});

// DELETE
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM Categories WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Category deleted" });
  });
});

//UPDATE
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { emertimi, pershkrimi, kategoria_prind_id, ikona } = req.body;

  db.query(
    `UPDATE Categories 
     SET emertimi = ?, pershkrimi = ?, kategoria_prind_id = ?, ikona = ?
     WHERE id = ?`,
    [emertimi, pershkrimi, kategoria_prind_id, ikona, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Category updated" });
    }
  );
});



module.exports = router;