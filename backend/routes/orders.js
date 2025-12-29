const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access token required' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// This function will be called with the db connection from server.js
module.exports = (db) => {
  // Create a new order
  router.post('/', authenticateToken, async (req, res) => {
    try {
      const { items } = req.body;
      
      // Calculate total amount
      let totalAmount = 0;
      for (const item of items) {
        const [product] = await db.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
        totalAmount += product[0].price * item.quantity;
      }
      
      // Create order
      const [orderResult] = await db.query(
        'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
        [req.user.id, totalAmount, 'pending']
      );
      
      const orderId = orderResult.insertId;
      
      // Add order items
      for (const item of items) {
        const [product] = await db.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
        await db.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, product[0].price]
        );
        
        // Update product stock
        await db.query(
          'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
      
      // Clear cart
      await db.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
      
      res.status(201).json({ orderId, totalAmount, status: 'pending' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get user's orders
  router.get('/', authenticateToken, async (req, res) => {
    try {
      const [orders] = await db.query(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [req.user.id]
      );
      
      // Get order items for each order
      for (const order of orders) {
        const [items] = await db.query(
          `SELECT oi.quantity, oi.price, p.id, p.name, p.image_url 
           FROM order_items oi 
           JOIN products p ON oi.product_id = p.id 
           WHERE oi.order_id = ?`,
          [order.id]
        );
        order.items = items;
      }
      
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};