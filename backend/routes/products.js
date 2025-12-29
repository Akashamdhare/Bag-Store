const express = require('express');
const router = express.Router();

module.exports = (db) => {

  router.get('/', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM products');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/category/:category', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM products WHERE category = ?', [req.params.category]);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};