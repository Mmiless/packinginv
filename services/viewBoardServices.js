const db = require('./db');

function getBoardData(boardName, search, searchType, status) {
    let data;
    console.log(status);
    const boardString = `'${boardName}'`;
    const searchString = `'%${search}%'`;
    if (status != "Any") {
        data = db.query(`SELECT * FROM ${boardString} WHERE ${searchType} LIKE ${searchString} AND completion=${status}`);
    } else {
        data = db.query(`SELECT * FROM ${boardString} WHERE ${searchType} LIKE ${searchString}`);
    }
    // const data = db.query(`SELECT * FROM boardString WHERE boardname LIKE ${searchString}`);
    
    return {
      data
    }  
}


function createLayup(layupObj) {
    let {boardname, date, itemArray} = layupObj;
    let layupString = `${boardname}_layup`;
    const data = db.run(`INSERT INTO boards VALUES (@layupString, @date, 1)`, {layupString, date});
    db.run(`CREATE TABLE '${layupString}' (
        libref varchar(64),
        designator varchar(64),
        footprint varchar(64),
        description varchar(128),
        comment varchar(64),
        completion BIT
      )`, {});
    itemArray.forEach(item => {
    let libref = item[0];
    let designator = item[1];
    let footprint = item[2];
    let description = item[3];
    let comment = item[4];
    let completion = item[5];
    db.run(`INSERT INTO '${layupString}' (libref, designator, footprint, description, comment, completion) \
    VALUES (@libref, @designator, @footprint, @description, @comment, @completion)`, 
    {libref, designator, footprint, description, comment, completion});
    });
    return {
      data
    } 

}

module.exports = {
    getBoardData,
    createLayup
  }