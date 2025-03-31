const express = require('express');
const router = express.Router();
const db = require('../services/db');
const app = express();


// Create a route for testing the db
app.get("/donations", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from donations';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});


router.get('/donations/view', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM donations');
    res.render('donations', { title: 'All Donations', donations: results });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching donations');
  }
});

// Search donations
router.get('/searchDonations/view', async (req, res) => {
  const query = req.query.itemName;
  const sql = `
    SELECT * FROM donations 
    WHERE donorName LIKE ? OR itemCategory LIKE ? OR itemColor LIKE ? OR itemCondition LIKE ?
  `;
  const searchParam = `%${query}%`;

  try {
    const [results] = await db.query(sql, [searchParam, searchParam, searchParam, searchParam]);
    res.render('searchResult', { query, results });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error rendering search results");
  }
});


module.exports = router;
