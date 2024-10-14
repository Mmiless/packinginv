const express = require('express');
const router = express.Router();
const deleteBoardServices = require('../services/deleteToteServices');

/* Listens to deletePart route */
router.post('/', function(req, res, next) {
  try {
    console.log(req.body);
    res.json(deleteBoardServices.deleteBoard(req.body));
  } catch(err) {
    console.error(`Error while running function `, err.message);
    next(err);
  }
});


module.exports = router;