
// Requires the 'better-sqlite3' package to give access to the sqlite constructor
// NOTE: The sqlite constructor DOES NOT work with standard sqlite3, better-sqlite3 is needed
const sqlite = require('better-sqlite3');

// Path module is needed to make a path to the database file
const path = require('path');

// Creates database object that references database file
const db = new sqlite(path.resolve('packinginv_web.sqlite3'), {fileMustExist: true});

// Queries the database and returns all of the results from that query
function query(sql, params = []) {
  return db.prepare(sql).all(params); 
}

function run(sql, params = {}) {
  return db.prepare(sql).run(params);
}

function createTables() {
  // Create totes table
  run(`
    CREATE TABLE IF NOT EXISTS totes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT
    );
  `);

  // Create items table
  run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      num INTEGER,
      tote_id INTEGER,
      lab_location TEXT,
      FOREIGN KEY (tote_id) REFERENCES totes(id)
    );
  `);
  }

function addTestItem(){
  const insertTote = `INSERT INTO totes (name, description) VALUES (?, ?)`;
  const insertItem = `INSERT INTO items (name, description, lab_location, num, tote_id) VALUES (?, ?, ?, ?, ?)`;

  const insertToteStmt = db.prepare(insertTote);
  const insertItemStmt = db.prepare(insertItem);

  const info = insertToteStmt.run('A', 'This is tote A');

  const toteId = info.lastInsertRowid;
  insertItemStmt.run('Item1', 'This is an item called Item1 in tote A', 'Stink town', 2, toteId);
}

function addTestItem2(){
  const insertItem = `INSERT INTO items (name, description, lab_location, num, tote_id) VALUES (?, ?, ?, ?, ?)`;

  const insertItemStmt = db.prepare(insertItem);

  insertItemStmt.run('Item2', 'This is an item called Item2 in tote A', 'Fun zone', 5, 1);
}


//createTables();
//addTestItem();
//addTestItem2();

module.exports = {
  query,
  run
}