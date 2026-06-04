const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/store');
const productRoutes = require('./routes/products');
const categoriesRoute = require('./routes/categories');
const customersRoute = require('./routes/customers');
const ordersRoute = require('./routes/orders');
const orderDetailsRoute = require('./routes/orderDetails');
const suppliersRoutes = require('./routes/suppliers');
const purchaseOrdersRoutes = require('./routes/purchaseOrders');
const inventoryRoute = require('./routes/inventory');
const customerPortalRoutes = require('./routes/customerPortal');
const dashboardRoute = require('./routes/dashboard');
const usersRoute = require('./routes/users');
const productReviewsRoute = require('./routes/productReviews');
const serviceRequestsRoute = require('./routes/serviceRequests');

const db = require('./config/db');

const path = require('path');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Serve uploaded product images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/store', storeRoutes);

// Protected routes
app.use('/api/orders', ordersRoute);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoriesRoute);
app.use('/api/customers', customersRoute);
app.use('/api/order-details', orderDetailsRoute);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/purchase-orders', purchaseOrdersRoutes);
app.use('/api/inventory', inventoryRoute);
app.use('/api/customer', customerPortalRoutes);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/users', usersRoute);
app.use('/api/product-reviews', productReviewsRoute);
app.use('/api/service-requests', serviceRequestsRoute);

db.query('SELECT 1', (err) => {
  if (err) console.log('DB connection failed:', err.message);
  else console.log('Connected to MySQL successfully');
});

app.get('/', (req, res) => res.send('Backend is running'));

app.get('/test-db', (req, res) => {
  db.query('SELECT 1', (err) => {
    if (err) return res.status(500).send('DB failed');
    res.send('DB working');
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));