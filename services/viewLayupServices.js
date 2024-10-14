const db = require('./db');


function updateItem(itemObj) {
    let {boardname, designator, status} = itemObj;
    const data = db.run(`UPDATE '${boardname}' SET completion = ${status} WHERE designator = '${designator}'`, {});
    return {
      data
    } 

}

module.exports = {
    updateItem
  }