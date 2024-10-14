const db = require('./db');

function getMultiple(searchType, searchTerm, toteId) {
  let query = `SELECT name, description, lab_location, num, tote_id FROM items `;
  let params = [];
  const conditions = [];

  // Check for search type and term
  if (searchType && searchTerm) {
    conditions.push(`${searchType} LIKE ?`);
    params.push(`%${searchTerm}%`);
  }

  // Check for tote_id filtering
  if (toteId && toteId !== "ALL") {
    conditions.push(`tote_id = ?`);
    params.push(toteId);
  }

  // If there are conditions, add them to the query
  if (conditions.length > 0) {
    query += `WHERE ${conditions.join(' AND ')} `;
  }

  query += `ORDER BY id DESC`;

  const data = db.query(query, params);
 
  return {
    data
  }
}

async function getTotes(){
  const query = `SELECT id, name FROM totes`;
  const rows = await db.query(query); 
  let data = {};
  rows.forEach(row => {
    data[row.id] = row.name; 
  });
  return data;
}

function clearContents() {
  const data = db.run(`DELETE FROM change_log`, {});
  console.log("Contents cleared");
  return {
    data
  }
}

//clearContents();

function renameTable() {
  const data = db.run(`ALTER TABLE Parts RENAME TO items`, {});
  console.log("Table renamed");
  return {
    data
  }
}

//renameTable();

function deleteTable() {
  const data = db.run(`DROP TABLE 'boards'`, {});
  console.log("column Bitch was dropped");
  return {
    data
  }
}

//deleteTable();

function createLogTable() {
    const data = db.run(`CREATE TABLE change_log (
      libref varchar(255),
      changetype varchar(255),
      oldvalue int,
      newvalue int,
      date varchar(255),
      letter varchar(3),
      package varchar(64),
      value REAL,
      valueunits varchar(1),
      description varchar(64),
      comment varchar(64),
      shopquant INTEGER,
      reservequant INTEGER,
      orderquant INTEGER
    )`, {});
    console.log("New change log table created in database");
    return {
      data
    }
}

// Only run this function once if the database file is changed or needs a new change log table
// createLogTable();

function deleteLogTable() {
  const data = db.run(`DROP TABLE change_log`, {});
  console.log("column Bitch was dropped");
  return {
    data
  }
}

//Only run this function once to delete the current table within the database named change_log
// deleteLogTable();

function createBoardsTable() {
  const data = db.run(`CREATE TABLE boards (
    boardname varchar(64),
    date varchar(64),
    isLayup BIT
  )`, {})
  console.log("New board table created in database");
    return {
      data
    }
}
// Only run this function once to create table for boardnames
//createBoardsTable();


function dropBoard() {
  const data = db.run(`DROP TABLE sqlite_sequence`, {});
  console.log("table bitch was dropped");
  return data;
}

//dropBoard();

//libref, designator, description, comment, footprint, quantity, supplierpartnumber, supplier
 
// Post request functions
function validateCreate(part) {
  let messages = [];

  console.log(part);

  if (!part) {
    messages.push('No object is provided');
  }

  // Currently left out for simplicity and debugging
  // if (!part.comment) {
  //   messages.push('Comment is empty');
  // }

  if (!part.description) {
    messages.push('Description is empty');
  }

  if (!part.letter) {
    messages.push('Letter is empty');
  }

  if (!part.libref) {
    messages.push('Libref is empty');
  }

  // Is orderquant necessary
  // if (!part.orderQuant) {
  //   messages.push('Orderquant is empty');
  // }
  // Is package necessary?
  // if (!part.package) {
  //   messages.push('Package is empty');
  // }

  if (!part.reservequant) {
    messages.push('Reservequant is empty');
  }

  if (!part.shopquant) {
    messages.push('Shopquant is empty');
  }

  // Currently leaving these out for simplicity and debugging
  // if (!part.value) {
  //   messages.push('Value is empty');
  // }

  // if (!part.valueunits) {
  //   messages.push('Value Units is empty');
  // }
  
  if (messages.length) {
    let error = new Error(messages.join());
    error.statusCode = 400;

    throw error;
  }
}

function addItem(partObj) {
  //validateCreate(partObj);
  const {name, tote_id, description, lab_location, num} = partObj;
  console.log(partObj);
  const result = db.run('INSERT INTO items (name, tote_id, description, lab_location, num) \
  VALUES (@name, @tote_id, @description, @lab_location, @num)\
  ', {name, tote_id, description, lab_location, num});

  // TODO: reintegrate change log
  /*
  let oldvalue = 0;
  let newvalue = shopquant;
  let type = "Add";
  let dateObj = new Date();
  let dateString = dateObj.toString();
  let date = dateString.slice(0, 25)

  const logChange = db.run(`INSERT INTO change_log (libref, changetype, oldvalue, newvalue, date, letter, package, value, valueunits, description, comment, reservequant, orderquant) \
  VALUES (@libref, @type, @oldvalue, @newvalue, @date, @letter, @package, @value, @valueunits, @description, @comment, @reservequant, @orderquant)`, 
  {libref, type, oldvalue, newvalue, date, letter, package, value, valueunits, description, comment, reservequant, orderquant});  
  */
    
  let message = 'Error in adding part';
  if (result.changes) {
    message = 'Part added successfully';
  }

  return {message};
}

module.exports = {
  getMultiple,
  getTotes,
  addItem
}