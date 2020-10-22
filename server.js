// set up dependencies
const connection = require("./utils/connection");
const {homePage} = require('./utils/inquirer')

// start the connection
connection.connect(err => {
  if (err) throw err;
  console.log('ID ' + connection.threadId + ' currently connected.');
  homePage()
});