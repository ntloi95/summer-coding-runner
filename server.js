// Dependencies
const path = require('path');
const http = require('http');
const express = require('express');
const app = express();

// Middlewares
app.use(express.static(path.resolve(__dirname, 'public')));

// Server
const PORT = process.env.PORT || 1337;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
