const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Middleware to parse JSON data
router.use(express.json());

// User Registration Route
router.post('/register', async (req, res) => {
  const { fullname, email, username, password } = req.body;

  // Basic validation
  if (!fullname || !email || !username || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Check if email already exists
    const existingUser = await db.query('SELECT * FROM Users WHERE Email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    // Insert new user into database
    const insertQuery = `
      INSERT INTO Users (Username, Password, FullName, Role, Email, LastLogin, CreatedAt)
      VALUES (?, ?, ?, 'Customer', ?, NOW(), NOW())
    `;

    const result = await db.query(insertQuery, [username, password, fullname, email]);

    res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
