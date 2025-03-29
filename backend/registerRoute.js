const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DATABASE,
  port: process.env.DB_PORT || 3306
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware to parse JSON data
router.use(express.json());

// Handle user registration
router.post('/api/register', (req, res) => {
  const { fullname, email, username, password } = req.body;

  // Log the received data
  console.log('Received data:', { fullname, email, username, password });

  // Basic validation
  if (!fullname || !email || !username || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Check if email already exists
  db.query('SELECT * FROM Users WHERE Email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    // Insert new user into database
    const query = `
      INSERT INTO Users (Username, Password, FullName, Role, Email, LastLogin, CreatedAt)
      VALUES (?, ?, ?, 'Customer', ?, NOW(), NOW())
    `;

    db.query(query, [username, password, fullname, email], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({ message: 'User registered successfully!', userId: results.insertId });
    });
  });
});

module.exports = router;
