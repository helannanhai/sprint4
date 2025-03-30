const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Get all users
router.get("/Users", async (req, res) => {
  try {
    const results = await db.query('SELECT * FROM Users');
    res.send(results);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Error fetching users');
  }
});

// Get user profile by ID
router.get("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const results = await db.query('SELECT * FROM Users WHERE UserID = ?', [userId]);
    if (results.length > 0) {
      res.render('profile', { user: results[0] });
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).send('Error fetching profile');
  }
});

// Login Handler (POST)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM Users WHERE Email = ? AND Password = ?';

  try {
    const results = await db.query(sql, [username, password]);
    if (results.length > 0) {
      req.session.user = results[0];
      res.redirect('/home');
    } else {
      res.render('login', { title: 'Login', message: 'Invalid credentials, please try again.' });
    }
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).send(`Detailed error: ${err.message}`);
  }
});

module.exports = router;
