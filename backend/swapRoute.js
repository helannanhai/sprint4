const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Raw swap items
router.get('/swapItems', (req, res) => {
  const sql = 'SELECT * FROM SwapItems';
  db.promise().query(sql)
    .then(([results]) => res.json(results))
    .catch(err => res.status(500).send('Error fetching SwapItems'));
});

// Rendered swap view
router.get('/SwapItems', (req, res) => {
  const sql = 'SELECT * FROM SwapItems';
  db.promise().query(sql)
    .then(([results]) => res.render('SwapItems', { SwapItems: results }))
    .catch(err => res.status(500).send('Error rendering SwapItems'));
});

module.exports = router;
