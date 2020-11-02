// set up dependency
const mysql = require('mysql2');

// store sensitive data separately
require('dotenv').config();

// establish database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  });

module.exports = connection;