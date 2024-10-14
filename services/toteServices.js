const db = require('./db');

function getTotes(searchType, searchTerm) {

    let query = `SELECT * FROM totes `;
    let params = [];
    if(searchType && searchTerm){ // allow for empty search
        query += `WHERE ${searchType} LIKE ? ORDER BY id DESC`;
        params.push(`%${searchTerm}%`);
    }
    const data = db.query(query, params);
    return {
      data
    }
}

function addTote(toteObject) {
    let {name, description} = toteObject;
    const nameResult = db.run(`INSERT INTO totes (name, description) VALUES (@name, @description)`, {name, description});
        

    let message = "Error adding board";
    if (nameResult.changes) {
        message = 'Board added successfully';
    }

    return {message};
}
    //libref, designator, description, comment, footprint, quantity, supplierpartnumber, supplier
    


module.exports = {
    getTotes,
    addTote
  }