// index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Import any other routes or middleware
app.use('/api', require('./api/execute-sql'));

// You might have other routes here
// ...

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app;
