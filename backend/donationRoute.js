const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Fetch all donations
router.get('/donations', (req, res) => {
  const sql = 'SELECT * FROM donations';
  db.promise().query(sql)
    .then(([results]) => res.json(results))
    .catch(err => res.status(500).send('Error fetching donations'));
});

// Render donations page
router.get('/donations/view', (req, res) => {
  const sql = 'SELECT * FROM donations';
  db.promise().query(sql)
    .then(([results]) => res.render('donations', { donations: results }))
    .catch(err => res.status(500).send('Error fetching donations'));
});

// Search donations
router.get('/searchDonations', (req, res) => {
  const searchQuery = req.query.query;
  const sql = `
    SELECT * FROM donations 
    WHERE donorName LIKE ? OR itemCategory LIKE ? OR itemColor LIKE ? OR itemCondition LIKE ?
  `;
  const searchParam = `%${searchQuery}%`;

  db.promise().query(sql, [searchParam, searchParam, searchParam, searchParam])
    .then(([results]) => res.json(results))
    .catch(err => res.status(500).send("Error searching donations"));
});

module.exports = router;
