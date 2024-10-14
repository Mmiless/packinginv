const db = require('./db');

function updateVal(updateObj) {
    const {name, value} = updateObj;

    if (typeof value !== 'number' || isNaN(value)) {
        return { message: 'Invalid value provided for update' };
      }
    
    const result = db.run(`UPDATE items SET num = @value WHERE name = @name`, {name, value});  
    let message = 'Error in updating value';
    if (result.changes) {
        message = 'Value updated successfully';
    }

  return {message};
}



module.exports = {
    updateVal
}