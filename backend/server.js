const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes - passing db connection to each route
app.use('/api/products', require('./routes/products')(db));
app.use('/api/users', require('./routes/users')(db));
app.use('/api/cart', require('./routes/cart')(db));
app.use('/api/orders', require('./routes/orders')(db));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});