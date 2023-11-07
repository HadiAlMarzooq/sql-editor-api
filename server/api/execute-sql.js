// /api/execute-sql.js
const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const cors = require('cors'); // Make sure you have CORS installed (`npm install cors`)

const app = express();

app.use(cors()); // This will enable CORS for all routes

// Add a separate OPTIONS handler
app.options('/execute-sql', cors()); // Enable pre-flight request for POST request


// Endpoint to execute SQL query
app.post('/execute-sql', (req, res) => {
  const sql = req.body.sql.trim();

  // Connect to SQLite database
  const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to connect to the database.' });
    }
  });

  // Validate that the SQL query is a read operation
  if (/^(INSERT|UPDATE|DELETE)/i.test(sql)) {
    return res.status(400).json({ error: 'Write operations are not allowed.' });
  }

  // Execute SQL query
  db.all(sql, [], (err, rows) => {
    db.close(); // Close the database connection

    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.json({ rows });
  });
});

module.exports = app;
