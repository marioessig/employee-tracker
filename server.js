// set up dependencies
const connection = require('./utils/connection');
const {startPage} = require('./utils/inquirer')

// start the connection
// use this command in the terminal to activate mysql: mysql -u root -p
connection.connect(err => {
  if (err) throw err;
  console.log('ID ' + connection.threadId + ' currently connected.');
  startPage()
});