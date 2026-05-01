const express = require('express');
const cors = require('cors');
require('dotenv').config();
//Connect products route to server
const productRoutes = require('./routes/products');
const categoriesRoute = require("./routes/categories");
const customersRoute = require("./routes/customers")

const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use("/api/categories", categoriesRoute);
app.use("/api/customers", customersRoute);

// Test DB connection
db.query('SELECT 1', (err) => {
  if (err) {
    console.log('DB connection failed:', err.message);
  } else {
    console.log('Connected to MySQL successfully');
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Optional DB test route
app.get('/test-db', (req, res) => {
  db.query('SELECT 1', (err) => {
    if (err) {
      return res.status(500).send('DB failed');
    }
    res.send('DB working');
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});