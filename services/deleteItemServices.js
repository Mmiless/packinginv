const db = require('./db');

function deleteItem(deleteObj) {
    const {date, type, name, description, lab_location, num, tote_id} = deleteObj;
    console.log(name);
    let message = 'Updated occurred';
    if (type == "Delete") {
        const invDelete = db.run(`DELETE FROM items WHERE name = '${name}'`, {});
        if (invDelete.changes) {
            message = 'Delete performed successfully';
        }
    }

    /*
    const logChange = db.run(`INSERT INTO change_log (libref, changetype, oldvalue, newvalue, date, letter, package, value, valueunits, description, comment, reservequant, orderquant) \
    VALUES (@libref, @type, @oldvalue, @newvalue, @date, @letter, @package, @value, @valueunits, @description, @comment, @reservequant, @orderquant)`, 
    {libref, type, oldvalue, newvalue, date, letter, package, value, valueunits, description, comment, reservequant, orderquant});
    */  
    
  return {message};
}


module.exports = {
    deleteItem
}
