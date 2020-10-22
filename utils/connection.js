// set up dependency
const mysql = require('mysql2');

// store sensitive data separately
require("dotenv").config();


// establish database connection
const connection = mysql.createConnection({
    host: process.env.host
    port: 3777
    user: process.env.username
    password: process.env.password,
    database: process.env.database
  });

module.exports = connection;