// =======================
// app.js (Main Server File)
// =======================

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const db = require('./services/db');
dotenv.config();

const app = express();

// ===== View engine setup =====
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ===== Middleware =====
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'circular-fashion-secret',
  resave: false,
  saveUninitialized: true
}));

// ===== Import modular routes =====
const registerRoute = require('./backend/registerRoute');
const userRoute = require('./backend/userRoute');
const donationRoute = require('./backend/donationRoute');
const swapRoute = require('./backend/swapRoute');

app.use(registerRoute);
app.use(userRoute);
app.use(donationRoute);
app.use(swapRoute);

// ===== Login Page (GET) =====
app.get('/', (req, res) => {
  res.render('login', { title: 'Login', message: '' });
});

// ===== Login Handler (POST) =====
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM Users WHERE Username = ? AND Password = ?';
  db.promise().query(sql, [username, password])
    .then(([results]) => {
      if (results.length > 0) {
        req.session.user = results[0];
        res.redirect('/home');
      } else {
        res.render('login', { title: 'Login', message: 'Invalid credentials, please try again.' });
      }
    })
    .catch((err) => {
      console.error('Login failed:', err);
      res.status(500).send('Internal Server Error');
    });
});

// ===== Home Page (renders index.pug) =====
app.get('/home', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render('index', { user: req.session.user });
});

// ===== Error Handling =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});