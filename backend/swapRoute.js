const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Raw swap items as JSON
router.get('/swapItems', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM SwapItems');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching SwapItems');
  }
});

// Rendered swap view
router.get('/SwapItems', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM SwapItems');
    res.render('SwapItems', { swapItems: results }); // ⚠️ Note: Use lowercase `swapItems` in Pug
  } catch (err) {
    console.error(err);
    res.status(500).send('Error rendering SwapItems');
  }
});

module.exports = router;
