const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Middleware
app.use(bodyParser.json());

// Enable CORS for client-side
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Endpoint to execute SQL query
app.post('/execute-sql', (req, res) => {
    const sql = req.body.sql.trim().toUpperCase();

    // Reject if SQL is a write operation
    if (sql.startsWith('INSERT') || sql.startsWith('UPDATE') || sql.startsWith('DELETE')) {
      return res.status(400).json({ error: 'Write operations are not allowed.' });
    }

    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ rows });
    });
  });

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});