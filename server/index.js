// Dependencies
const http = require('http');
const app = require('../app');
const connectDB = require('../db/index');

// Init DB connection
connectDB();

// Init Port and create server and add listener for server start
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`> Server now listening on port ${PORT}`);
});
