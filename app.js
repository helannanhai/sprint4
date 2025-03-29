const express = require('express');
const path = require('path');
require('dotenv').config();
const db = require('./services/db'); // Importing database connection

const app = express();

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); 

// Serve static files (CSS, images, JS)
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({ extended: true })); // For form POST

// ===== Login Page =====
app.get('/', (req, res) => {
  res.render('login', { title: 'login', message: 'Welcome to Loginpage!' });
});

// (You had a duplicate "/" route — keeping only login version)

// ===== Register Page =====
app.get('/register', (req, res) => {
  res.render('register'); // views/register.pug should exist
});

// ===== Register POST handler =====
app.post('/register', (req, res) => {
  const { fullname, email, username, password } = req.body;

  const sql = `
    INSERT INTO Users (Username, Password, FullName, Role, Email, LastLogin, CreatedAt)
    VALUES (?, ?, ?, 'Customer', ?, NOW(), NOW())
  `;

  db.promise().query(sql, [username, password, fullname, email])
    .then(() => {
      res.redirect('/'); // Redirect to login after successful registration
    })
    .catch((err) => {
      console.error('Registration failed:', err);
      res.status(500).send('Registration error');
    });
});

// ===== Users route =====
app.get("/Users", function(req, res) {
  const sql = 'SELECT * FROM Users';
  db.query(sql).then(results => {
      console.log(results);
      res.send(results);
  });
});

// Duplicate removed for Users route using db2 (inconsistent)

// ===== Donations (raw output) =====
app.get("/donations", function(req, res) {
  const sql = 'SELECT * FROM donations';
  db.query(sql).then(results => {
      console.log(results);
      res.send(results);
  });
});

// ===== Donations (rendered) =====
app.get("/donations", function (req, res) {
  const sql = 'SELECT * FROM donations';

  db.promise().query(sql)
    .then(([donations_results]) => {
      res.render('donations', { donations: donations_results });
    })
    .catch((err) => {
      console.log('Error fetching donations:', err);
      res.status(500).send('Error fetching donations');
    });
});

// ===== Search Donations =====
app.get("/searchDonations", (req, res) => {
  const searchQuery = req.query.query;

  const sql = `
      SELECT * FROM donations 
      WHERE donorName LIKE ? OR itemCategory LIKE ? OR itemColor LIKE ? OR itemCondition LIKE ?
  `;

  const searchParam = `%${searchQuery}%`;

  db.promise()
    .query(sql, [searchParam, searchParam, searchParam, searchParam])
    .then(([results]) => {
        res.json(results);
    })
    .catch((err) => {
        console.error("Error searching donations:", err);
        res.status(500).send("Error searching donations");
    });
});

// ===== User Profile by ID =====
app.get("/profile/:userId", function (req, res) {
  const userId = req.params.userId;

  const sql = `SELECT * FROM users WHERE userId = ?`;

  db.promise().query(sql, [userId])
    .then(([userResults]) => {
        if (userResults.length > 0) {
            res.render('profile', { user: userResults[0] });
        } else {
            res.status(404).send('User not found');
        }
    })
    .catch((err) => {
        console.log('Error fetching user profile:', err);
        res.status(500).send('Error fetching profile');
    });
});

// ===== Swap Items (raw output) =====
app.get("/swapItems", function(req, res) {
  const sql = 'SELECT * FROM SwapItems';
  db.query(sql).then(results => {
      console.log(results);
      res.send(results);
  });
});

// ===== Swap Items (rendered) =====
app.get("/SwapItems", function (req, res) {
  const sql = 'SELECT * FROM SwapItems';

  db.promise().query(sql)
    .then(([SwapItems_results]) => {
      res.render('SwapItems', { SwapItems: SwapItems_results });
    })
    .catch((err) => {
      console.log('Error fetching SwapItems:', err);
      res.status(500).send('Error fetching SwapItems');
    });
});

// ===== Error handling middleware =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// ===== Start server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
