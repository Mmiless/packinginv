const db = require('./db');

function deleteBoard(deleteBoardObj) {
    const {totename} = deleteBoardObj;
    let message = 'Tote delete operation';

    const tote = db.query(`SELECT id FROM totes WHERE name = '${totename}'`, {});
    const tote_id = tote[0].id;
    db.run(`DELETE FROM items WHERE tote_id = '${tote_id}'`, {}); 

    const data = db.run(`DELETE FROM totes WHERE name = '${totename}'`, {});
        if (data.changes) {
            message = 'Delete performed successfully';
        }
    return {message};
} 
    
module.exports = {
    deleteBoard
}
