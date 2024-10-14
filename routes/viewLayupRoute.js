const express = require('express');
const router = express.Router();
const viewLayupServices = require('../services/viewLayupServices');

// req.query.search, req.query.type
// router.get('/', function(req, res, next) {
//     try {
//       res.json(viewBoardServices.getBoardData(req.query.board));
//     } catch(err) {
//       console.error(`Error while getting board data `, err.message);
//       next(err);
//     }
//   });

  // Creating layup board
  router.post('/', function(req, res, next) {
    try {
      console.log(req.body);
      res.json(viewLayupServices.updateItem(req.body));
    } catch(err) {
      console.error(`Error while adding board `, err.message);
      next(err);
    }
  });

  module.exports = router;