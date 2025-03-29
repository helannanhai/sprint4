const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Get all users
router.get("/Users", (req, res) => {
  const sql = 'SELECT * FROM Users';
  db.promise().query(sql)
    .then(([results]) => res.send(results))
    .catch(err => res.status(500).send('Error fetching users'));
});

// Get user profile by ID
router.get("/profile/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = `SELECT * FROM Users WHERE UserID = ?`;

  db.promise().query(sql, [userId])
    .then(([results]) => {
      if (results.length > 0) {
        res.render('profile', { user: results[0] });
      } else {
        res.status(404).send('User not found');
      }
    })
    .catch(err => res.status(500).send('Error fetching profile'));
});

module.exports = router;
