const express = require('express');
const router = express.Router();
const deleteServices = require('../services/deleteItemServices');

/* Listens to deleteItem route */
router.post('/', function(req, res, next) {
  try {
    res.json(deleteServices.deleteItem(req.body));
  } catch(err) {
    console.error(`Error while deleting part `, err.message);
    next(err);
  }
});


module.exports = router;