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
  // Get user's cart
  router.get('/', authenticateToken, async (req, res) => {
    try {
      const [rows] = await db.query(
        `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url 
         FROM cart c 
         JOIN products p ON c.product_id = p.id 
         WHERE c.user_id = ?`,
        [req.user.id]
      );
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Add item to cart
  router.post('/', authenticateToken, async (req, res) => {
    try {
      const { product_id, quantity } = req.body;
      
      // Check if product exists
      const [product] = await db.query('SELECT * FROM products WHERE id = ?', [product_id]);
      if (product.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Check if item already in cart
      const [existingItem] = await db.query(
        'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
        [req.user.id, product_id]
      );
      
      if (existingItem.length > 0) {
        // Update quantity
        await db.query(
          'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
          [quantity, req.user.id, product_id]
        );
      } else {
        // Add new item
        await db.query(
          'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
          [req.user.id, product_id, quantity]
        );
      }
      
      res.status(201).json({ message: 'Item added to cart' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update cart item quantity
  router.put('/:id', authenticateToken, async (req, res) => {
    try {
      const { quantity } = req.body;
      
      await db.query(
        'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
        [quantity, req.params.id, req.user.id]
      );
      
      res.json({ message: 'Cart item updated' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Remove item from cart
  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      await db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
      res.json({ message: 'Item removed from cart' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};