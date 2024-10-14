const express = require('express');
const router = express.Router();
const boardServices = require('../services/editBoardsServices');


router.get('/', function(req, res, next) {
  try {
    res.json(boardServices.getTotes());
  } catch(err) {
    console.error(`Error while getting data `, err.message);
    next(err);
  }
});

router.post('/', function(req, res, next) {
  try {
    console.log(req.body);
    res.json(changeLogServices.undo(req.body));
  } catch(err) {
    console.error(`Error while performing undo `, err.message);
    next(err);
  }
});

module.exports = router;