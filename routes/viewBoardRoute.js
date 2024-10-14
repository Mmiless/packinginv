const express = require('express');
const router = express.Router();
const viewBoardServices = require('../services/viewBoardServices');

// req.query.search, req.query.type
router.get('/', function(req, res, next) {
    try {
      res.json(viewBoardServices.getBoardData(req.query.board, req.query.search, req.query.searchType, req.query.status));
    } catch(err) {
      console.error(`Error while getting board data `, err.message);
      next(err);
    }
  });

  // Creating layup board
  router.post('/', function(req, res, next) {
    try {
      console.log(req.body);
      res.json(viewBoardServices.createLayup(req.body));
    } catch(err) {
      console.error(`Error while adding board `, err.message);
      next(err);
    }
  });

  module.exports = router;