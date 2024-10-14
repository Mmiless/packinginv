const db = require('./db');


function getChanges(search, searchType, changetype) {
  //console.log("Services tried query");

  // ORDER BY DESC
  const searchString = `'%${search}%'`;
  const data = db.query(`SELECT * FROM change_log WHERE ${searchType} LIKE ${searchString} AND changetype LIKE '${changetype}' ORDER BY ROWID DESC`);
  return {
    data
  }
}


function undo(editObj) {
  let {libref, type, oldvalue, newvalue, date, letter, package, value, valueunits, description, comment, reservequant, orderquant} = editObj;
  //console.log(type);
  let result;
  // let logType;
  if (type == "Add") {
    console.log("Undoing delete?");
    //logType = "Add";
    fetch(`http://localhost:3003/pcbinv/pcbinvparts`, {
        method: "POST",
        body: JSON.stringify({
        libref: libref,
        letter: letter,
        package: package,
        value: value,
        valueunits: valueunits,
        description: description,
        comment: comment,
        shopquant: oldvalue,
        reservequant: reservequant,
        orderquant: orderquant
        }),
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
    // result = db.run('INSERT INTO pcbinv_part (libref, letter, package, value, valueunits, description, comment, shopquant, reservequant, orderquant) \
    // VALUES (@libref, @letter, @package, @value, @valueunits, @description, @comment, @oldvalue, @reservequant, @orderquant)', 
    // {libref, letter, package, value, valueunits, description, comment, oldvalue, reservequant, orderquant});
    let temp = oldvalue;
    oldvalue = newvalue;
    newvalue = temp;

  } else if (type == "Delete") {
    console.log("Bitch undoing add");
    //logType = "Delete";
    result = db.run(`DELETE FROM pcbinv_part WHERE libref = @libref`, {libref});
    let temp = oldvalue;
    oldvalue = newvalue;
    newvalue = temp;
  } else {
    //logType = "Update";
    result = db.run(`UPDATE pcbinv_part SET shopquant = @oldvalue WHERE libref = @libref`, {oldvalue, libref});
    let temp = oldvalue;
    oldvalue = newvalue;
    newvalue = temp;
  }

  let logChange = db.run(`INSERT INTO change_log (libref, changetype, oldvalue, newvalue, date, letter, package, value, valueunits, description, comment, reservequant, orderquant) \
  VALUES (@libref, @type, @oldvalue, @newvalue, @date, @letter, @package, @value, @valueunits, @description, @comment, @reservequant, @orderquant)`, 
  {libref, type, oldvalue, newvalue, date, letter, package, value, valueunits, description, comment, reservequant, orderquant});

  let message = 'Error in performing undo';
    if (logChange.changes) {
        message = 'Undo performed successfully';
    }

  return {
    message
  }
}

module.exports = {
  getChanges,
  undo
}