const express = require('express');
const cors = require('cors');
require('dotenv').config();

//Connect routes to server
const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/store');
const productRoutes = require('./routes/products');
const categoriesRoute = require("./routes/categories");
const customersRoute = require("./routes/customers")
const ordersRoute = require("./routes/orders");
const orderDetailsRoute = require("./routes/orderDetails");
const suppliersRoutes = require("./routes/suppliers");
const purchaseOrdersRoutes = require("./routes/purchaseOrders");
const inventoryRoute = require("./routes/inventory");
const customerPortalRoutes = require('./routes/customerPortal');

const db = require('./config/db');

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// ── Public routes (nuk kërkojnë token) ──
app.use('/api/auth', authRoutes);
app.use('/api/store', storeRoutes);
 
// ── Protected routes (kërkojnë token) ──
app.use("/api/orders", ordersRoute);
app.use('/api/products', productRoutes);
app.use("/api/categories", categoriesRoute);
app.use("/api/customers", customersRoute);
app.use("/api/order-details", orderDetailsRoute);
app.use("/api/suppliers", suppliersRoutes);
app.use("/api/purchase-orders", purchaseOrdersRoutes);
app.use("/api/inventory", inventoryRoute);
app.use('/api/customer', customerPortalRoutes);


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