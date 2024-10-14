const express = require('express');
const router = express.Router();
const toteServices = require('../services/toteServices');


router.get('/', function(req, res, next) {
  try {
    const searchType = req.query.searchType;
    const searchTerm = req.query.searchTerm;
    res.json(toteServices.getTotes(searchType, searchTerm));
  } catch(err) {
    console.error(`Error while getting boards `, err.message);
    next(err);
  }
});

router.post('/', function(req, res, next) {
  try {
    console.log(req.body);
    res.json(toteServices.addTote(req.body));
  } catch(err) {
    console.error(`Error while adding board `, err.message);
    next(err);
  }
});

module.exports = router;