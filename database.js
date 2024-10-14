// Requires the package mysql
var mysql = require('mysql')

// Requires sqlie3 on the machine
const sqlite3 = require('sqlite3').verbose();
// Defines sqlite3 object by connecting to database file and enables reading and writing
let db = new sqlite3.Database('./packinginv_web.sqlite3',  sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the PackInv Database');
});

// Exports the database object to other files when imported
module.exports = db