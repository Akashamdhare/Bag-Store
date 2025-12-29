const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// This function will be called with the db connection from server.js
module.exports = (db) => {
  // Register a new user
  router.post('/register', async (req, res) => {
    try {
      const { name, email, password, address } = req.body;
      
      // Check if user already exists
      const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user
      const [result] = await db.query(
        'INSERT INTO users (name, email, password, address) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, address]
      );
      
      // Create JWT token
      const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      res.status(201).json({ token, user: { id: result.insertId, name, email, address } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Login user
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check if user exists
      const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      const user = users[0];
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Create JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, address: user.address } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};